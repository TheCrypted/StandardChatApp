const express = require('express')
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const cors = require('cors')
const {urlencoded} = require("express");
const PORT = 3030;

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
        socket.broadcast.emit("receiveMessage", payload)
        console.log(payload.message)
    })
})
server.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: " + PORT)
})