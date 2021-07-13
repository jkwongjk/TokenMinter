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
        .setTokenName("cookie") // The publicly visible name of the token
        .setTokenSymbol("CRUNCH") // The publicly visible token symbol
        .setDecimals(0) // For tokens of type NON_FUNGIBLE_UNIQUE - value must be 0
        .setInitialSupply(10) // Max Suply of NFTs
        .setTreasuryAccountId(operatorID) // The account which will act as a treasury for the token. This account will receive the specified initial supply or the newly minted NFTs
        .setAdminKey(operatorKey) // The key which can perform update/delete operations on the token
        .setKycKey(operatorKey) // The key which can grant or revoke KYC of an account for the token's transactions. If empty, KYC is not required, and KYC grant or revoke operations are not possible
        .setFreezeKey(operatorKey) // The key which can sign to freeze or unfreeze an account for token transactions. If empty, freezing is not possible
        .setWipeKey(operatorKey) // The key which can wipe the token balance of an account. If empty, wipe is not possible
        .setSupplyKey(operatorKey) // The key which can change the supply of a token. The key is used to sign Token Mint/Burn operations
        .setFreezeDefault(False) // The default Freeze status (frozen or unfrozen) of Hedera accounts relative to this token. If true, an account must be unfrozen before it can receive the token
        .setExpiry() // The epoch second at which the token should expire; if an auto-renew account and period are specified, this is coerced to the current epoch second plus the autoRenewPeriod
        .setAutoRenewAccount(PublicAcount) // An account which will be automatically charged to renew the token's expiration, at autoRenewPeriod interval
        .setAutoRenewPeriod()  // The interval at which the auto-renew account will be charged to extend the token's expiry
        .setMemo("I am a new token") // The memo associated with the token (UTF-8 encoding max 100 bytes)
        .setTokenType(NON_FUNGIBLE_UNIQUE) // NON_FUNGIBLE_UNIQUE or FUNGIBLE_COMMON IWA compatible
        .setSupplyType(FINITE) //FINITE or INFINITE
        .setMaxSupply(110) //this cannot be changes
        .execute(client);

    var createReceipt = await createTokenTx.getReceipt(client);
    var newTokenId = createReceipt.tokenId;
    
    console.log('New Token ID: ', newTokenId.toString());
    
    var mintNFT = await new TokenMintTransaction()
        .setToken(newTokenId) // The Token for which to mint tokens. If token does not exist, transactions results in INVALID_TOKEN_ID
        .setAmount() // Applicaable to tokens of type FUNGIBLE_COMMON. The Amount to mint to the treasury Account. Amount must be a positive non-zero number represented in the lowesr denomination of the token. The new supply must be lower than 2^63.
        .setMetadata(); // Applicable to tokens of type NON_FUNGIBLE_UNIQUE. A list of metadata that are being created. Maximum allowed size of each metadata is 100 bytes
        // make and example of the meta-data
    var createNFTReceipt = await mintNFT.getReceipt(client);

}

main();
