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
	const receipt = await tx.getReceipt(HederaClient);
	const newTopicId = receipt.topicId + ''; // BUG: TopicId.fromString() complains about 'text.split' unless empty string is appended
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
    unsetClient,
    createNewTopic,
};
