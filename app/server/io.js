const hashgraph = require('./hashgraph');

export default function(socket, io) { 
    return Object.freeze({
        initHashgraphClient (context) {
            let response = hashgraph.initHashgraphClient(context.accountId, context.privateKey);
            io.emit('initHashgraphClient', response);
        },
        unsetClient () {
            let response = hashgraph.unsetClient();
            io.emit('unsetClient', response);
        },
        async createNewTopic () {
            let response = await hashgraph.createNewTopic();
            io.emit('createNewTopic', response);
        },
        async sendHCSMessage (context) {
            let response = await hashgraph.sendHCSMessage(context);
            io.emit('sendHCSMessage', response);
        },
        async subscribeToTopic (context) {
            let response = await hashgraph.subscribeToTopic(io, context.topicId);
            io.emit('subscribeToTopic', response);
        }
    });
}
