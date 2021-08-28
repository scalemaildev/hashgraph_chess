/* Utils */
//const TextDecoder = require("text-encoding").TextDecoder;

/* From SDK */
const {
    Client,
    AccountId,
    PrivateKey,
} = require("@hashgraph/sdk");

/* Inits */
var HederaClient = "";
var operatorAccountId = process.env.ACCOUNT_ID;

// Testnet only as for right now. Can add Mainnet later
function initHashgraphClient(incAccountId, incPrivateKey) {
    try {
	HederaClient = Client.forTestnet();
	let accountId = AccountId.fromString(incAccountId);
	let privateKey = PrivateKey.fromString(incPrivateKey);
	HederaClient.setOperator(accountId, privateKey);
	operatorAccountId = accountId;
	return 'Hedera client initialized ...';
    } catch (error) {
	console.error(error);
    }
}

module.exports = {
    operatorAccountId,
    initHashgraphClient,
};
