const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const cors = require('cors')
const {urlencoded} = require("express");
const PORT = 3030;
let users = []

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: true}));

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})
io.on("connection", (socket)=>{
    console.log("user connected: " + socket.id)
    socket.on("sendMessage", (payload)=>{
        if(!users.includes(payload.user)){
            users.push(payload.user)
            io.emit("userOnline", {users})
        }
        socket.broadcast.emit("receiveMessage", payload)
        // socket.emit("userOnline", {users})
    })
    socket.on("userTyping", (payload)=>{
        socket.broadcast.emit("otherUserTyping", payload)
    })
    socket.on("userDoneTyping", (payload)=>{
        socket.broadcast.emit("otherUserDoneTyping", payload)
    })
    socket.on("userDisconnected", (payload)=>{
        let newUsers = users.filter(user => user !== payload.user)
        users = newUsers
        console.log(payload.user)
        socket.broadcast.emit("userOtherDisconnected", {users})
        // io.emit("userDisconnected", {users})
    })
})
server.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: " + PORT)
})