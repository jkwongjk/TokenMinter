require("dotenv").config();

const{ Client, AccountId, PrivateKey, TokenCreateTransaction } = require("@hashgraph/sdk");

async function main() {
    // configure client
    const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
    const operatorID = AccountId.fromString(process.env.ACCOUNT_ID);

    let client = Client.forTestnet();
    client.setOperator(operatorID, operatorKey);

    // New tokens
    var createTokenTx = await new TokenCreateTransaction()
        .setTokenName("cookie")
        .setTokenSymbol("CRUNCH")
        .setDecimals(0)
        .setInitialSupply(1)
        .setTreasuryAccountId(operatorID)
        .execute(client);

    var createReceipt = await createTokenTx.getReceipt(client);
    var newTokenId = createReceipt.tokenId;

    console.log('New Token ID: ', newTokenId.toString());

}

main();