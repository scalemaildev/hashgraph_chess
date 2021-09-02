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
    console.log(incAccountId, incPrivateKey);
    try {
	HederaClient = Client.forTestnet();
	let accountId = AccountId.fromString(incAccountId);
	let privateKey = PrivateKey.fromString(incPrivateKey);
	HederaClient.setOperator(accountId, privateKey);
	return {
	    result: 'SUCCESS',
	    context: 'Hashgraph client intialized!'
	};
    } catch (error) { 
	return {
	    result: 'FAILURE',
	    context: error
	};
    }
}

module.exports = {
    initHashgraphClient,
};
