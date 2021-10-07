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

// temporary workaround for server-side hedera clients;
var userClients = {};

function initUserClient(context) {
    let accountId = AccountId.fromString(context.accountId);
    let privateKey = PrivateKey.fromString(context.privateKey);
    let socketId = context.socketId;

    try {
        userClients[socketId] = Client.forTestnet();
        userClients[socketId].setOperator(accountId, privateKey);
        
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

function clearUserClient(socketId) {
    if (userClients[socketId]) {
        delete userClients[socketId];
    }
}

async function subscribeToTopic(io, subInfo) {    
    let socketId = subInfo.socketId;
    let topicId = TopicId.fromString(subInfo.topicId);

    try {
        new TopicMessageQuery()
            .setTopicId(topicId)
            .setStartTime(0)
            .subscribe(userClients[socketId], res => {
                let contents = new TextDecoder("utf-8").decode(res.contents);
                io.emit('newHCSMessage', contents);
            });
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
