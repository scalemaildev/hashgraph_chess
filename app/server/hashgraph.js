/* Utils */
const TextDecoder = require("text-encoding").TextDecoder;

/* Hashgraph SDK */
const {
    TopicId,
    TopicMessageQuery,
} = require("@hashgraph/sdk");

var subscriptions = {};

async function subscribeToTopic(io, topicIdString) {
    const topicId = TopicId.fromString(topicIdString);

    // when the page is refreshed, pre-existing subs still remain
    if (subscriptions[topicIdString]) {
        subscriptions[topicIdString].unsubscribe();
    }

    try {
        let sub = new TopicMessageQuery()
            .setTopicId(topicId)
            .setStartTime(0)
            .subscribe(HederaClient, res => {
                let contents = new TextDecoder("utf-8").decode(res.contents);
                io.emit('newHCSMessage', contents);
            });
        subscriptions[topicIdString] = sub;
        return {
            success: true,
            responseMessage: `Subscribed to topic ${topicId}`
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: `Failed to subscribe to topic ${topicId}`
        };
    }
}

module.exports = {
    subscribeToTopic,
};
