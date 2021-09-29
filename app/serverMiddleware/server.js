const hashgraph = require('./hashgraph');

// Socket
console.log("Setting up socket.io server ...");
const io = require("socket.io")(3001, {
    cors: {
        origin: '*', // CORS can be set for prod if this app is put on AWS ECS
    }
});

// IO
io.engine.on("headers", (headers) => {
  headers["Access-Control-Allow-Private-Network"] = true;
});

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

    socket.on('createNewTopic', async () => {
        let response = await hashgraph.createNewTopic();
        io.emit('createNewTopic', response);
    });

    socket.on('sendHCSMessage', async (context) => {
        let response = await hashgraph.sendHCSMessage(context);
        io.emit('sendHCSMessage', response);
    });

    socket.on('subscribeToTopic', async (context) => {
        let response = await hashgraph.subscribeToTopic(io, context.topicId);
        io.emit('subscribeToTopic', response);
    });
    
});

// since this is serverMiddleware, we have to return a handler, even if it does nothing
export default function (req, res, next) {    
    next();
}
