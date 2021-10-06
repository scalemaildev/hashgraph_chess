const hashgraph = require('./hashgraph');

export default function(socket, io) {
    return Object.freeze({
        async subscribeToTopic (context) {
            let response = await hashgraph.subscribeToTopic(io, context.topicId);
            io.emit('subscribeToTopic', response);
        }
    });
}
