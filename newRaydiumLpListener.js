const { Connection, PublicKey } = require('@solana/web3.js');
const { processRaydiumLpTransaction } = require('./newRaydiumLpService');
const SniperManager = require('./SniperManager'); // Import the SniperManager

// Solana WebSocket URL
const WS_URL = 'https://api.mainnet-beta.solana.com/';
const connection = new Connection(WS_URL, 'confirmed');
const RAYDIUM_AMM_PROGRAM_ID = new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8');

// Subscribe to transactions
async function subscribeRaydium() {
    console.log("Listening for new Raydium LP transactions...");
    connection.onLogs(RAYDIUM_AMM_PROGRAM_ID, async (log) => {
        try {
            if (log.logs.some(line => line.includes('InitializeInstruction2') || line.includes('CreatePool'))) {
                console.log("New AMM LP transaction found!");
                const signature = log.signature;
                const tokenData = await processRaydiumLpTransaction(connection, signature); // Call the service to process the transaction

                if (tokenData) {
                    // Define sniper configuration
                    const sniperConfig = {
                        baseToken: 'Base_Token_Address', // e.g., USDC address
                        targetToken: tokenData.coinMint, // Use the coinMint from the detected LP
                        buyAmount: 1, // Amount to buy (adjust as needed)
                        sellTargetPrice: 2, // Target price to sell (adjust as needed)
                        tokenData: tokenData
                    };

                    // Add sniper to the SniperManager
                    SniperManager.addSniper(sniperConfig);
                }
            }
        } catch (error) {
            console.error("Error processing log:", error.message);
        }
    }, 'confirmed');
}

module.exports = { subscribeRaydium };