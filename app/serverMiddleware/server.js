const dotenv = require('dotenv').config();
// import hashgraph
// import other utils

if (!process.env.ACCOUNT_ID) {
  throw 'NO ACCOUNT ID FOUND IN .ENV!';
}

// Socket
console.log("Setting up socket.io server ...");
const io = require("socket.io")(3001, {
    cors: {
        origin: '*',
    }
});

// IO
io.on('connection', socket => {
  console.log('socket connected!');
});

// Since we are a serverMiddleware, we have to return a handler, even if this it does nothing
export default function (req, res, next) {
  next();
}
