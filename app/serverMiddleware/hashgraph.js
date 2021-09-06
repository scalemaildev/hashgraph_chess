/* Utils */
//const TextDecoder = require("text-encoding").TextDecoder;

/* From SDK */
const {
    Client,
    AccountId,
    PrivateKey,
    TopicId,
    TopicCreateTransaction,
} = require("@hashgraph/sdk");

var tempClient = "";

// Testnet only as for right now. Can add Mainnet later
function initHashgraphClient(incAccountId, incPrivateKey) {
    try {
	const HederaClient = Client.forTestnet();
	let accountId = AccountId.fromString(incAccountId);
	let privateKey = PrivateKey.fromString(incPrivateKey);
	HederaClient.setOperator(accountId, privateKey);
	tempClient = HederaClient;
	return {
	    result: 'SUCCESS',
	    context: HederaClient
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    context: 'ERROR - hashgraph client failed to initialize',
	    error: error
	};
    }
}

async function createNewTopic(client) {
    try {
	const tx = await new TopicCreateTransaction().execute(tempClient);
	console.log(tx);
	const receipt = await tx.getReceipt(tempClient);
	console.log(receipt);
	const newTopicId = receipt.topicId + ''; // BUG: TopicId.fromString() complains about 'text.split' unless empty string is appended
	console.log(newTopicId);
	return {
	    result: 'SUCCESS',
	    context: newTopicId
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

module.exports = {
    initHashgraphClient,
    createNewTopic,
};
