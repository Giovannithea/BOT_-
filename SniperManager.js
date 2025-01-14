const Sniper = require('./sniper');

class SniperManager {
    constructor() {
        this.snipers = [];
    }

    addSniper(config) {
        const sniper = new Sniper(config);
        this.snipers.push(sniper);
        console.log('Sniper added:', config);

        // Start watching the price and buying token
        sniper.watchPrice().then(async () => {
            await sniper.buyToken();
            console.log('Token bought. Now watching for sell target price.');
        }).catch(err => {
            console.error('Error watching price:', err);
        });
    }

    setBuyAmount(index, amount) {
        if (this.snipers[index]) {
            this.snipers[index].setBuyAmount(amount);
            console.log(`Buy amount set to ${amount} for sniper at index ${index}`);
        } else {
            console.error('Sniper not found at index:', index);
        }
    }

    setSellTargetPrice(index, price) {
        if (this.snipers[index]) {
            this.snipers[index].setSellTargetPrice(price);
            console.log(`Sell target price set to ${price} for sniper at index ${index}`);
        } else {
            console.error('Sniper not found at index:', index);
        }
    }

    async init() {
        console.log('Sniper Manager initialized');
        // You can add any additional initialization logic here if needed
    }
}

module.exports = new SniperManager();
