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
    TopicMessageSubmitTransaction
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
	    context: 'Hedera Hashgraph client initialized!'
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    context: 'ERROR - hashgraph client failed to initialize',
	    error: error
	};
    }
}

function unsetClient() {
    HederaClient = "";
    return "Hashgraph client has been unset!";
}

async function createNewTopic() {
    try {
	const tx = await new TopicCreateTransaction().execute(HederaClient);
	const topicReceipt = await tx.getReceipt(HederaClient);
	const newTopicId = receipt.topicId.toString();
	return {
	    result: 'SUCCESS',
	    context: topicReceipt,
	    newTopicId: newTopicId
	};
    } catch (error) {
	console.log(error);
	return {
	    result: 'FAILURE',
	    context: 'ERROR - failed to create a topic',
	    error: error
	};
    }
}

async function sendHCSMessage(data) {
    let messagePayload = JSON.stringify(data);
    
    try {
	let response = await new TopicMessageSubmitTransaction({
	    topicId: data.topicId,
	    message: messagePayload})
	    .execute(HederaClient);
	return {
	    result: 'SUCCESS',
	    context: response
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    error: error
	};
    }
}

async function subscribeToTopic(io, topicId) {
    try {
	new TopicMessageQuery()
	    .setTopicId(topicId)
	    .setStartTime(0)
	    .subscribe(HederaClient, res => {
		let contents = new TextDecoder("utf-8").decode(res.contents);
		io.emit('processMessage', {
		    'contents': contents
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
