import { io } from "https://cdn.socket.io/4.6.1/socket.io.esm.min.js";

const socket = io("ws://localhost:8080");
socket.on("sda",(args)=>{
    console.log(args);
})
console.log(123123);
