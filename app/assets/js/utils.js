/* HEDERA */
const { AccountId,
        TransactionId } = require("@hashgraph/sdk");

/* UTILS */
async function makeBytes(tx, signingAcctId) { 
    
    let transId = TransactionId.generate(signingAcctId);
    tx.setTransactionId(transId);
    tx.setNodeAccountIds([new AccountId(3)]);

    tx = await tx.freeze();
    let txBytes = tx.toBytes();

    return txBytes;
}

module.exports = {
    makeBytes
};
