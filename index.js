const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT;


const users = [{}];


app.use(cors());

app.get("/",(req,res)=>{
    res.send("HELLO my name is saurabh");
})

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(user + " has joined");
        socket.broadcast.emit('userJoined',{user:"Admin ",message: users[socket.id] + " has joined"});
        socket.emit('welcome',{user:"Admin ",message:'Welcome to the chat Mr/Ms.' + users[socket.id]})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

   socket.on('disconnnect',()=>{
    socket.broadcast.emit('leave',{user:"Admin",message : users[socket.id] + " Has Left"});
    console.log("User Left");
   })

});

server.listen(port,()=>{
    console.log("server is running on http://localhost:4500");
})