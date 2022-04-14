/* HEDERA */
const { PrivateKey,
        AccountId,
        TransactionId,
        Transaction } = require("@hashgraph/sdk");

/* UTILS */
async function signAndMakeBytes(tx, signingAcctId) { 
    const privateKey = PrivateKey.fromString(process.env.SERVER_PRIVATE_KEY); //TODO this is an ACTUAL hedera private key
    const publicKey = privateKey.publicKey;
    
    let newId = TransactionId.generate(signingAcctId);
    tx.setTransactionId(newId);
    tx.setNodeAccountIds([new AccountId(3)]);

    tx = await tx.freeze();
    let txBytes = tx.toBytes();

    let sig = privateKey.signTransaction(Transaction.fromBytes(txBytes));
    let out = tx.addSignature(publicKey, sig);
    let outBytes = out.toBytes();

    return outBytes;
}

module.exports = {
    signAndMakeBytes,
};
