/* HEDERA */
const { Client,
        PrivateKey,
        AccountId,
        TransactionId,
        Transaction } = require("@hashgraph/sdk");

const HederaClient = Client.forMainnet(); //TODO testnet for now
HederaClient.setOperator(AccountId.fromString(process.env.SERVER_ACCOUNT_ID),
                         PrivateKey.fromString(process.env.SERVER_PRIVATE_KEY));

/* UTILS */
async function signAndMakeBytes(tx, signingAcctId) { 
    const privateKey = PrivateKey.fromString(process.env.SERVER_PRIVATE_KEY);
    const publicKey = privateKey.publicKey;
    
    let transId = TransactionId.generate(signingAcctId);
    tx.setTransactionId(transId);

    tx = await tx.freezeWith(HederaClient);
    let txBytes = tx.toBytes();

    let sig = privateKey.signTransaction(Transaction.fromBytes(txBytes));
    let out = tx.addSignature(publicKey, sig);
    let outBytes = out.toBytes();

    return outBytes;
}

module.exports = {
    signAndMakeBytes,
};
