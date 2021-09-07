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

    socket.on('initHashgraphClient', (context) => {
	let response = hashgraph.initHashgraphClient(context.accountId, context.privateKey);
	io.emit('initHashgraphClient', response);
    });

    socket.on('unsetClient', () => {
	let response = hashgraph.unsetClient();
	io.emit('unsetClient', response);
    });

    socket.on('createNewTopic', async (context) => {
	let response = await hashgraph.createNewTopic();
	io.emit('createNewTopic', response);
    });

    socket.on('sendHCSMessage', async (context) => {
	let response = await hashgraph.sendHCSMessage(context);
	io.emit('sendHCSMessage', response);
    });

    socket.on('subscribeToTopic', async (data) => {
	let response = await hashgraph.subscribeToTopic(io, data.topicId);
	// this return only happens on an error /w the mirror subscription
	// new messages go directly to vuex
	io.emit('subscribeToTopic', response);
    });
    
});

// Since we are a serverMiddleware, we have to return a handler, even if this it does nothing
export default function (req, res, next) {    
    next();
}
