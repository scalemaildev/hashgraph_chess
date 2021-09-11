/* Utils */
const TextDecoder = require("text-encoding").TextDecoder;

/* From SDK */
const {
    Client,
    AccountId,
    PrivateKey,
    TopicId,
    TopicCreateTransaction,
    TopicMessageQuery,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

var HederaClient = "";

// Testnet only as for right now. Can add Mainnet later
function initHashgraphClient(incAccountId, incPrivateKey) {
    try {
	HederaClient = Client.forTestnet();
	let accountId = AccountId.fromString(incAccountId);
	let privateKey = PrivateKey.fromString(incPrivateKey);
	HederaClient.setOperator(accountId, privateKey);
	return {
	    result: 'SUCCESS',
	    responseMessage: 'Hedera Hashgraph client initialized'
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    responseMessage: 'Hedera Hashgraph client failed to initialize'
	};
    }
}

function unsetClient() {
    HederaClient = "";
    return "Hashgraph client has been unset";
}

async function createNewTopic() {
    try {
	const tx = await new TopicCreateTransaction().execute(HederaClient);
	const topicReceipt = await tx.getReceipt(HederaClient);
	const newTopicId = topicReceipt.topicId.toString();
	return {
	    result: 'SUCCESS',
	    responseMessage: 'Created new topic ' + newTopicId,
	    newTopicId: newTopicId,
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    responseMessage: 'Failed to create a new topic',
	    errorMessage: error
	};
    }
}

async function sendHCSMessage(data) {
    let messagePayload = JSON.stringify(data.context);
    
    try {
	let response = await new TopicMessageSubmitTransaction({
	    topicId: TopicId.fromString(data.context.topicId),
	    message: messagePayload})
	    .execute(HederaClient);

	// need to see if that response actually comes back
	
	return {
	    result: 'SUCCESS',
	    responseMessage: 'Sent message to HCS',
	    response: response
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    responseMessage: 'Failed to send message to HCS'
	};
    }
}

async function subscribeToTopic(io, topicIdString) {
    const topicId = TopicId.fromString(topicIdString);
    
    try {
	new TopicMessageQuery()
	    .setTopicId(topicId)
	    .setStartTime(0)
	    .subscribe(HederaClient, res => {
		let contents = new TextDecoder("utf-8").decode(res.contents);
		io.emit('newHCSMessage', {
		    contents: contents
		});
	    });
    } catch (error) {
	// we never return values from this method
	console.error(error);
    }
}

module.exports = {
    initHashgraphClient,
    unsetClient,
    createNewTopic,
    sendHCSMessage,
    subscribeToTopic,
};
