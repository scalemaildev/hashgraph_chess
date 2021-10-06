const hashgraph = require('./hashgraph');

export default function(socket, io) {
    return Object.freeze({
        async initUserClient (context) {
            let response = hashgraph.initUserClient(context.accountInfo);
            io.emit('initUserClient', response);
        },
        async clearUserClient (context) {
            hashgraph.clearUserClient(context.accountId);
        },
        async subscribeToTopic (context) {
            let response = await hashgraph.subscribeToTopic(io, context.subInfo);
            io.emit('subscribeToTopic', response);
        }
    });
}
