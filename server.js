require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require("./models/Message");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use(express.static('views'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Store connected users
let users = {};
let typingUsers = {}; 

// 🔹 SOCKET.IO CONNECTION
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Register user for private messaging
    socket.on('registerUser', ({ username }) => {
        users[socket.id] = { username, socketId: socket.id };
        console.log(`Registered User: ${username} (Socket ID: ${socket.id})`);
        
        // Send updated user list for private messaging
        io.emit("updateUserList", Object.values(users).map(user => user.username));
    });

    // 🔹 Handle user joining a room
    socket.on('joinRoom', async ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };
        console.log(`🔹 ${username} joined room: ${room}`);

        // Retrieve past messages from MongoDB
        try {
            const pastMessages = await Message.find({ room }).sort({ date_sent: 1 });
            socket.emit("loadMessages", pastMessages);
        } catch (error) {
            console.error("Error fetching messages from database:", error);
        }

        // Notify room that a new user joined
        io.to(room).emit('message', {
            from_user: "System",
            message: `${username} has joined the chat`,
            date_sent: new Date().toLocaleTimeString()
        });

        // Send updated room users list
        io.to(room).emit('roomUsers', {
            room: room,
            users: Object.values(users).filter(user => user.room === room)
        });
    });

    // 🔹 Handle user sending a message (Save to MongoDB)
    socket.on("chatMessage", async ({ username, room, message }) => {
        console.log(`Message in room ${room} from ${username}: ${message}`);

        // Save message to MongoDB
        try {
            const newMessage = new Message({ from_user: username, room, message });
            await newMessage.save();
        } catch (error) {
            console.error("Error saving message to database:", error);
        }

        // Stop showing typing indicator if the user sends a message
        delete typingUsers[socket.id];
        io.to(room).emit("hideTyping");

        // Send the message to other users in the room
        io.to(room).emit("message", {
            from_user: username,
            message,
            date_sent: new Date().toLocaleTimeString()
        });
    });

    // 🔹 Handle Private Messaging (DMs)
    socket.on("privateMessage", ({ sender, recipient, message }) => {
        console.log(`Private message from ${sender} to ${recipient}: ${message}`);

        const recipientSocket = Object.values(users).find(user => user.username === recipient);

        if (recipientSocket) {
            io.to(recipientSocket.socketId).emit("privateMessage", { sender, message });
        }
    });

    // 🔹 Handle user leaving a room
    socket.on("leaveRoom", ({ username, room }) => {
        socket.leave(room);
        console.log(`${username} left room: ${room}`);

        // Notify others in the room that the user left
        io.to(room).emit("message", {
            from_user: "System",
            message: `${username} has left the chat`,
            date_sent: new Date().toLocaleTimeString()
        });

        // Remove user from tracking
        delete users[socket.id];

        // Send updated user list
        io.to(room).emit("roomUsers", {
            room: room,
            users: Object.values(users).filter(user => user.room === room)
        });
    });

    // 🔹 Handle user typing event
    socket.on("typing", ({ username, room }) => {
        console.log(`✍️ "${username}" is typing in room: "${room}"`);
        typingUsers[socket.id] = username;
        io.to(room).emit("displayTyping", username);
    });

    // 🔹 Handle user stopping typing event
    socket.on("stopTyping", ({ username, room }) => {
        console.log(`"${username}" stopped typing in room: "${room}"`);
        delete typingUsers[socket.id];
        io.to(room).emit("hideTyping");
    });

    // 🔹 Handle user disconnecting
    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            console.log(`${user.username} disconnected from room: ${user.room}`);

            io.to(user.room).emit('message', {
                from_user: "System",
                message: `${user.username} has left the chat`,
                date_sent: new Date().toLocaleTimeString()
            });

            // Remove user from tracking
            delete users[socket.id];

            // Send updated user list
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: Object.values(users).filter(u => u.room === user.room)
            });

            // Remove typing status if the user was typing before disconnecting
            delete typingUsers[socket.id];
            io.to(user.room).emit("hideTyping");
        }
    });
});

// 🔹 Default Route to Login Page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/login.html");
});

// 🔹 Start Server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
