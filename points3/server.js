const express = require("express")
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res)=>{
    res.sendFile()
})

http.listen(3000, ()=>{
    console.log("Сервер старт")
})
