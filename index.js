import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import path from 'path';

const __dirname = path.resolve();

const app = express(); 
const server = createServer(app); 
const socketio = new Server(server);


import { Atcher } from "./modules/atcher/index.js"

let atcher = new Atcher()

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});


