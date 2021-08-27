/* Utils */
const TextDecoder = require("text-encoding").TextDecoder;

/* From SDK */
const {
  Client,
  AccountId,
  PrivateKey,
} = require("@hashgraph/sdk");

/* Inits */
var HederaClient = "";
var operatorAccountId = process.env.ACCOUNT_ID;

function initHashgraphClient() {
  if (!process.env.ACCOUNT_ID || !process.env.PRIVATE_KEY) {
    console.error("Did not find ACCOUNT_ID or PRIVATE_KEY in .env file!");
    return -1;
  } else {
    try {
      HederaClient = Client.forTestnet();
      let accountId = AccountId.fromString(process.env.ACCOUNT_ID);
      let privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
      HederaClient.setOperator(accountId, privateKey);
      operatorAccountId = accountId;
      return 'Hedera client initialized ...';
    } catch (error) {
      console.error(error);
      return -1;
    }
  }
}

module.exports = {
  operatorAccountId,
  initHashgraphClient,
};
