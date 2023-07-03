const express = require('express')
const fs = require('fs')
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const cors = require('cors')
const {urlencoded} = require("express");
const {transporter, options} = require("./services/emailer.cjs");
const routes = require("./Routes/routes.cjs")
const PORT = 3030;
let users = {
    Room1: []
}

const emailTemplate = fs.readFileSync("./services/emailTemplate.html", "utf-8")
const emailHTML = emailTemplate.replace("{{user}}", "Arnav")
options.html = emailHTML
transporter.sendMail(options, (err, info) => {
    if(err){
        console.log(err);
    } else {
        console.log(`Email sent: ${info}`)
    }
})

app.use(cors());
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use("/api/v1", routes)
// app.use(express.static("dist"));

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})
io.on("connection", (socket)=>{
    console.log("user connected: " + socket.id)
    let room = "Room1"
    socket.join(room)
    socket.on("changeRoom", (payload)=>{
        //Leave current room and update all existing room users of disconnection
        let newUsers = users[room].filter(user => user !== payload.user)
        users[room] = newUsers
        console.log(`User ${payload.user} changed rooms`)
        socket.broadcast.to(room).emit("userOtherDisconnected", {users: users[room], disconnectedUser: payload.user})
        socket.leave(room)
        //Join new room and update all existing room users of new Joinee
        room = payload.room
        if(!users[room]){
            users[room] = []
        }
        users[room].push(payload.user)
        socket.join(payload.room)
        socket.broadcast.to(room).emit("userOnline", {users: users[room], user: payload.user})
        socket.emit("userOnline", {users: users[room]})
    })
    socket.on("sendMessage", (payload)=>{
        if(!users[room].includes(payload.user)){
            users[room].push(payload.user)
            io.to(room).emit("userOnline", {users: users[room]})
        }
        socket.broadcast.to(room).emit("receiveMessage", payload)
    })
    socket.on("userTyping", (payload)=>{
        socket.broadcast.to(room).emit("otherUserTyping", payload)
    })
    socket.on("userDoneTyping", (payload)=>{
        socket.broadcast.to(room).emit("otherUserDoneTyping", payload)
    })
    socket.on("userDisconnected", (payload)=>{
        let newUsers = users[room].filter(user => user !== payload.user)
        users[room] = newUsers
        console.log("User disconnected")
        socket.broadcast.to(room).emit("userOtherDisconnected", {users: users[room], disconnectedUser: payload.user})
    })
})
server.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: " + PORT)
})