const hashgraph = require('./hashgraph');

export default function(socket, io) {
    socket.on('disconnect', () => {
        hashgraph.clearUserClient(socket.id);
    });
    
    return Object.freeze({
        async initUserClient (context) {
            let messagePayload = context.accountInfo;
            messagePayload['socketId'] = socket.id;
            
            let response = hashgraph.initUserClient(messagePayload);
            io.emit('initUserClient', response);
        },
        async subscribeToTopic (context) {
            let response = await hashgraph.subscribeToTopic(io, context.subInfo);
            io.emit('subscribeToTopic', response);
        }
    });
}
