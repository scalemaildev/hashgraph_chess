/* Utils */
const TextDecoder = require("text-encoding").TextDecoder;

/* Hashgraph SDK */
const {
    Client,
    AccountId,
    PrivateKey,
    TopicId,
    TopicCreateTransaction,
    TopicMessageQuery,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

var HederaClient;
var subscriptions = {};

function initHashgraphClient(newAccountId, newPrivateKey) {
    try {
        // Testnet only as for right now. Can add Mainnet in prod
        HederaClient = Client.forTestnet();
        let accountId = AccountId.fromString(newAccountId);
        let privateKey = PrivateKey.fromString(newPrivateKey);
        HederaClient.setOperator(accountId, privateKey);
        return {
            success: true,
            responseMessage: 'Hedera Hashgraph client initialized'
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: 'Hedera Hashgraph client failed to initialize'
        };
    }
}

function unsetClient() {
    try {
        HederaClient = null;
        return {
            success: true,
            responseMessage: 'Hedera Hashgraph client has been unset'
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: 'Failed to unset the Hedera Hashgraph client somehow'
        };
    }
}

async function createNewTopic() {
    try {
        const tx = await new TopicCreateTransaction().execute(HederaClient);
        const topicReceipt = await tx.getReceipt(HederaClient);
        const newTopicId = topicReceipt.topicId.toString();
        return {
            success: true,
            responseMessage: 'Created new topic ' + newTopicId,
            newTopicId: newTopicId,
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: 'Failed to create a new topic',
            errorMessage: error
        };
    }
}

async function sendHCSMessage(data) {
    let messageObject = data.context;
    messageObject['operator'] = data.operator;
    let messagePayload = JSON.stringify(messageObject);
    
    try {
        await new TopicMessageSubmitTransaction({
            topicId: TopicId.fromString(data.context.topicId),
            message: messagePayload})
            .execute(HederaClient);
        
        return {
            success: true,
            responseMessage: 'Sent message to HCS'
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: 'Failed to send message to HCS'
        };
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
            .subscribe(HederaClient, res => {
                let contents = new TextDecoder("utf-8").decode(res.contents);
                io.emit('newHCSMessage', contents);
            });
        subscriptions[topicIdString] = sub;
        return {
            success: true,
            responseMessage: 'Subscribed to topic'
        };
    } catch (error) {
        return {
            success: false,
            responseMessage: 'Failed to subscribe'
        };
    }
}

module.exports = {
    initHashgraphClient,
    unsetClient,
    createNewTopic,
    sendHCSMessage,
    subscribeToTopic,
};
