/* Utils */
const TextDecoder = require("text-encoding").TextDecoder;

/* Hashgraph SDK */
const {
    Client,
    AccountId,
    PrivateKey,
    TopicId,
    TopicMessageQuery,
} = require("@hashgraph/sdk");


// temporary solution for server-side hashgraph clients and subs
var serverClient;
if (!process.env.SERVER_CLIENT_ID || !process.env.SERVER_CLIENT_KEY) {
    console.warn('No info found for server-side hashgraph client!');
} else {
    serverClient = Client.forTestnet();
    serverClient.setOperator(process.env.SERVER_CLIENT_ID, process.env.SERVER_CLIENT_KEY);
    // use a specific mirror node if it's defined
    if (process.env.MIRROR_NODE_URL) {
        serverClient.setMirrorNetwork(process.env.MIRROR_NODE_URL);
    }
}

var userClients = {};
var subscriptions = {};

function initUserClient(accountInfo) {
    let accountId = AccountId.fromString(accountInfo.accountId);
    let privateKey = PrivateKey.fromString(accountInfo.privateKey);

    if (userClients[accountId]) {
        return {
            success: false,
            responseMessage: 'This account is already active'
        };
    }

    try {
        userClients[accountId] = Client.forTestnet();
        userClients[accountId].setOperator(accountId, privateKey);
        return {
            success: true,
            responseMessage: `Initialized client for ${accountId}`
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: `Failed to initialize client for ${accountId}`,
            errorMessage: error
        };
    }
}

function clearUserClient(accountId) {
    if (userClients[accountId]) {
        delete userClients[accountId];
    }
}

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
    initUserClient,
    clearUserClient,
    subscribeToTopic
};
