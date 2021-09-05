/* Utils */
//const TextDecoder = require("text-encoding").TextDecoder;

/* From SDK */
const {
    Client,
    AccountId,
    PrivateKey,
} = require("@hashgraph/sdk");

/* Inits */

// Testnet only as for right now. Can add Mainnet later
function initHashgraphClient(incAccountId, incPrivateKey) {
    try {
	HederaClient = Client.forTestnet();
	let accountId = AccountId.fromString(incAccountId);
	let privateKey = PrivateKey.fromString(incPrivateKey);
	HederaClient.setOperator(accountId, privateKey);
	return {
	    result: 'SUCCESS',
	    context: HederaClient
	};
    } catch (error) {
	return {
	    result: 'FAILURE',
	    context: 'ERROR - hashgraph client failed to initialize'
	};
    }
}

module.exports = {
    initHashgraphClient,
};
