const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path=require('path')
const parser = require('busboy-body-parser')
const app = express(); // creates express app
const server = http.Server(app) //creates http server using the app
const io = socketio(server) //adds a socket on above server
const saveFile = require('save-file')
app.use('/',express.static(path.join(__dirname , 'public_static')))
app.use(parser())

io.on('connection', (socket) => {
    console.log('socket connected ' + socket.id)
  socket.on('SEND', (data) => {
    console.log(data)
  })
})

app.post('/pitch_track', async (req,res,next) => {
  await saveFile(req.files.audio.data, req.files.audio.name)
  res.send(JSON.stringify('parsing data'))
})
server.listen(5000,()=>console.log('Server started on http://localhost:5000'))