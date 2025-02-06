Course: COMP3133, Full Stack Development II
Student Name: Nigar Ahmadova
Student ID: 101431281

# Chat App with Real-Time Messaging
This is a real-time chat application that allows users to register, log in, join different chat rooms, send public and private messages, and see active users. The app uses Socket.io for real-time communication and MongoDB for message storage.



## Features
 - User Authentication: Signup and login functionality with secure password hashing.
 - Real-time Messaging: Users can join chat rooms and send messages in real-time.
 - Private Messaging: Users can send direct messages to other users.
 - Typing Indicator: Shows when a user is typing in the chat.
 - Chat History: Messages are stored in MongoDB and retrieved when a user joins a room.
 - User List: Displays active users in a chat room.
 - Leave Room Functionality: Users can leave a chat room and join another.

## Installation

## Prerequisites
 - Node.js (Latest LTS version recommended)
 - MongoDB (Local or Atlas cloud instance)

## Steps to Run Locally
 - Clone the repository: https://github.com/Nigar0826/101431281_lab_test1_chat_app
 - Install dependencies: npm install
 - Set up environment variables: 
    > Start MongoDB and add mongodb connection string inside the .env file
    > Add PORT=5500 inside the .env file
    > Start the server: node server.js or nodemon server.js
    > Open the application: http://localhost:5500

## Project Structure
chat-app
│── models
│   ├── Message.js       # Message schema for MongoDB
│   ├── User.js          # User schema with unique usernames
│
│── routes
│   ├── auth.js          # User authentication routes (signup, login)
│
│── views
│   ├── chat.html        # Chat UI with real-time messaging
│   ├── login.html       # User login page
│   ├── signup.html      # User registration page
│
│── server.js            # Main server file (Socket.io logic)
│── .env                 # Environment variables (MongoDB URI, etc.)
│── package.json         # Project dependencies & scripts
│── README.md            # Documentation (this file)

## API Endpoints
Method	Endpoint	        Description
POST	/api/auth/signup	Registers a new user
POST	/api/auth/login	    Authenticates user and logs in

## Technologies Used
 - Frontend: HTML, CSS, JavaScript, Bootstrap
 - Backend: Node.js, Express.js, Socket.io
 - Database: MongoDB (Mongoose ODM)
 - Security: Bcrypt.js (password hashing)
 - Real-time Communication: WebSockets (Socket.io)

## How to Use the Chat App
## User Registration
1. Go to /signup.html: http://localhost:5500/signup.html
2. Fill in username, first name, last name, password
3. Click "Sign Up"

## User Login
1. Go to /login.html: http://localhost:5500/login.html
2. Enter username and password
3. Click "Login" and join a Chat Room (http://localhost:5500/chat.html)

## Join a Chat Room
1. Select a room when logging in.
2. Send messages in the chat.

## Private Messaging
1. Select a user from the dropdown.
2. Type a message and click "Send Private Message".

## Typing Indicator
 - Shows when a user is typing.

## Leaving the Room
 - Click "Leave Room" to exit and select a different room.
