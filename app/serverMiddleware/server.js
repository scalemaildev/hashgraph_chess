const dotenv = require('dotenv').config();
const hashgraph = require('./hashgraph');

// Socket
console.log("Setting up socket.io server ...");
const io = require("socket.io")(3001, {
    cors: {
        origin: '*', // CORS can be set for prod if this app is put on AWS ECS
    }
});

// IO
io.on('connection', socket => {
    console.log('New socket connection ...');

    socket.on('initHashgraphClient', () => {
	let response = hashgraph.initHashgraphClient();
	io.emit('initHashgraphClient', response);
    });
});

// Since we are a serverMiddleware, we have to return a handler, even if this it does nothing
export default function (req, res, next) {    
    next();
}