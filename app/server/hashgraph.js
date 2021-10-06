/* Utils */
const TextDecoder = require("text-encoding").TextDecoder;

/* Hashgraph SDK */
const {
    Client,
    TopicId,
    TopicMessageQuery,
} = require("@hashgraph/sdk");

var serverClient;

if (!process.env.SERVER_CLIENT_ID || !process.env.SERVER_CLIENT_KEY) {
    console.warn('No info found for server-side hashgraph client!');
} else {
    // Testnet only as for right now. Can add Mainnet in prod
    serverClient = Client.forTestnet();
    serverClient.setOperator(process.env.SERVER_CLIENT_ID, process.env.SERVER_CLIENT_KEY);
    
    // use a specific mirror node if it's defined
    if (process.env.MIRROR_NODE_URL) {
        serverClient.setMirrorNetwork(process.env.MIRROR_NODE_URL);
    }

    console.log('Created server-side client...');
}

var subscriptions = {};

async function subscribeToTopic(io, topicIdString) {
    const topicId = TopicId.fromString(topicIdString);

    // when the page is refreshed, pre-existing subs still remain
    if (!!subscriptions[topicIdString]) {
        return {
            success: true,
            responseMessage: `Already subbed to topic ${topicId}`
        };
    }

    try {
        let sub = new TopicMessageQuery()
            .setTopicId(topicId)
            .setStartTime(0)
            .subscribe(serverClient, res => {
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
