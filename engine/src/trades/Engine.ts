import * as fs from 'fs';

import { order, userBalances, orderbookType, fills } from '../types'
import { combineArrayDepth, combineUpdatedArr, roundTwoDecimal } from '../utils';
import { matchBids, matchMarketBid, matchAsks } from '../utils/orderbook';
import { KafkaManager } from '../KafkaManager'

class Engine {
    orderbooks: orderbookType = {};
    balances: userBalances

    constructor() {
        var snapshot = JSON.parse(fs.readFileSync('src/trades/snapshot.json', 'utf8').toString())
        //@ts-ignore
        this.orderbooks = snapshot.orderbooks

        this.balances = snapshot.balances;
    }

    getOrderbooks() {
        console.log(this.orderbooks);
        console.log(this.balances);
    }

    // public createMarketOrder(order: order) {

    //     const res = matchMarketBid(this.orderbooks[order.symbol], order)
    //     if (!res) return;
    //     console.log(res.fills);
    //     console.log(res.executedQty);
    //     console.log(res.executedQuoteQty);

    // }

    private checkBalanceAndLockfunds(userId: string, price: string, quantity: string) {
        const userBalance = this.balances[userId].balance;
        const reqBalance = roundTwoDecimal(Number(price) * Number(quantity));
        if (Number(userBalance.available) < reqBalance) {
            throw new Error('Insufficient Funds');
        }

        userBalance.available = roundTwoDecimal((Number(userBalance.available) - reqBalance)).toString();
        userBalance.locked = roundTwoDecimal((Number(userBalance.locked) + reqBalance)).toString();
    }

    private checkBalanceAndLockstock(userId: string, quantity: string, symbol: string) {
        const stock = this.balances[userId].stocks[symbol];

        if (stock['quantity_available'] < Number(quantity)) {
            throw new Error('Insufficient Quantity');
        }

        stock['quantity_available'] = stock['quantity_available'] - Number(quantity);
        stock['locked_quantity'] = stock['locked_quantity'] + Number(quantity);
    }

    public async createOrder(order: order) {
        if (order.side === 'Bid') {
            console.log("bid");
            this.checkBalanceAndLockfunds(order.userId, order.price.toString(), order.quantity.toString())

            const res = matchBids(this.orderbooks[order.symbol], order)
            // if (!res) return;
            // await this.publishWsDepthUpdates(res.fills, 'Bid', order.symbol, order.price.toString());
            // await this.publishWsTickerUpdates(this.orderbooks[order.symbol].currentPrice, order.symbol);
            // await this.publishWsTradesUpdates(res.fills, order.symbol);
            console.log(res);
            console.log(this.balances[order.userId]);
            this.updateBalance(res.fills, 'Bids');
            console.log(this.balances[order.userId]);


        } else {
            this.checkBalanceAndLockstock(order.userId, order.quantity.toString(), order.symbol)

            const res = matchAsks(this.orderbooks[order.symbol], order)
            if (!res) return;

            // await this.publishWsDepthUpdates(res.fills,'Ask',order.symbol,order.price.toString());
            // await this.publishWsTickerUpdates(this.orderbooks[order.symbol].currentprice,order.symbol);
            // await this.publishWsTradesUpdates(res.fills,order.symbol);
            console.log(res);
            console.log(order.userId);
            console.log(this.balances[order.userId]);
            this.updateBalance(res.fills, 'Asks');
            console.log("after update");
            console.log(this.balances[order.userId]);
            res.fills.forEach((ele) => {
                console.log(ele.otherUserId);
                console.log(this.balances[ele.otherUserId]);
            })
        }
    }

    public getDepth(symbol: string) {
        const depth = {
            asks: [],
            bids: []
        }

        const orderbook = this.orderbooks[symbol]

        depth.asks = combineArrayDepth(orderbook.asks);
        depth.bids = combineArrayDepth(orderbook.bids);
        // console.log(depth)
        return depth

    }

    public async publishWsTickerUpdates(price: string, symbol: string) {
        const data = {
            stream: `ticker.${symbol}`,
            data: {
                e: `ticker`,
                s: symbol,
                E: Date.now(),
                p: price
            }
        }
        console.log("ticker");
        console.log(data);
        // await KafkaManager.getInstance().sendWsUpdates(`ticker.${symbol}`,JSON.stringify(data));
    }

    private updateBalance(fills: fills[], side: 'Bids' | 'Asks') {
        if (side === "Bids") {
            fills.forEach((fill) => {
                const fillPrice = roundTwoDecimal(fill.price * fill.quantity);
                this.balances[fill.otherUserId].balance.available = (Number(this.balances[fill.otherUserId].balance.available) + fillPrice).toString();
                this.balances[fill.otherUserId].stocks[fill.symbol].locked_quantity -= fill.quantity;

                this.balances[fill.userId].balance.locked = (Number(this.balances[fill.userId].balance.locked) - fillPrice).toString();
                const avg_price = roundTwoDecimal(((this.balances[fill.userId].stocks[fill.symbol].quantity_available * Number(this.balances[fill.userId].stocks[fill.symbol].purchased_price)) + (fillPrice)) / (fill.quantity + this.balances[fill.userId].stocks[fill.symbol].quantity_available));
                this.balances[fill.userId].stocks[fill.symbol].quantity_available += fill.quantity;
                this.balances[fill.userId].stocks[fill.symbol].purchased_price = (avg_price).toString();

            })
        } else {
            fills.forEach((fill) => {
                const fillPrice = roundTwoDecimal(fill.price * fill.quantity);
                this.balances[fill.otherUserId].balance.locked = (Number(this.balances[fill.otherUserId].balance.locked) - fillPrice).toString();
                const avg_price = roundTwoDecimal(((this.balances[fill.otherUserId].stocks[fill.symbol].quantity_available * Number(this.balances[fill.otherUserId].stocks[fill.symbol].purchased_price)) + (fillPrice)) / (fill.quantity + this.balances[fill.otherUserId].stocks[fill.symbol].quantity_available));
                this.balances[fill.otherUserId].stocks[fill.symbol].quantity_available += fill.quantity;
                this.balances[fill.otherUserId].stocks[fill.symbol].purchased_price = (avg_price).toString();

                this.balances[fill.userId].balance.available = (Number(this.balances[fill.userId].balance.available) + fillPrice).toString();
                this.balances[fill.userId].stocks[fill.symbol].locked_quantity -= fill.quantity;

            })
        }
    }

    public async publishWsTradesUpdates(fills: fills[], symbol: string) {
        fills.forEach(async (ele) => {
            const data = {
                stream: `trade.${symbol}`,
                data: {
                    e: 'trade',
                    s: symbol,
                    E: Date.now(),
                    p: ele.price,
                    q: ele.quantity
                    //todo
                    // i : orderId
                    //t : tradeId
                }
            }
            console.log("trades");
            console.log(data);

            // await KafkaManager.getInstance().sendWsUpdates(`trade.${symbol}`,JSON.stringify(data))
        })
    }

    public async publishWsDepthUpdates(fills: fills[], side: 'Bid' | 'Ask', symbol: string, price: string) {
        const depth = this.getDepth(symbol);
        if (side == 'Bid') {
            // console.log(fills.map(f=>f.price).includes(1000.9));
            // const askfills = fills.map(f=>f.price)
            const updatedasks = combineUpdatedArr(fills, depth.asks);
            const updatedbids = depth.bids.find(x => x[0] == price)
            const data = {
                stream: `depth.${symbol}`,
                data: {
                    e: 'depth',
                    s: symbol,
                    E: Date.now(),
                    a: updatedasks,
                    b: updatedbids ? [updatedbids] : []
                    //todo
                    // i : orderId
                    //t : tradeId
                }
            }
            // console.log(updatedasks);
            // console.log(updatedbids);
            console.log("depth");
            console.log(data);
            // await KafkaManager.getInstance().sendWsUpdates(`depth.${symbol}`,JSON.stringify(data))
        }

        if (side == 'Ask') {
            const updatedbids = combineUpdatedArr(fills, depth.bids);
            const updatedasks = depth.asks.find(x => x[0] == price)
            const data = {
                stream: `depth.${symbol}`,
                data: {
                    a: updatedasks ? [updatedasks] : [],
                    b: updatedbids,
                    e: 'depth',
                    s: symbol,
                    E: Date.now()
                    //todo
                    // i : orderId
                    //t : tradeId
                }
            }
            KafkaManager.getInstance().sendWsUpdates(`depth.${symbol}`, JSON.stringify(data))
        }
    }

    public log() {
        // const orderbook = this.orderbooks['TATA']
        // orderbook.asks.sort((a,b)=> a.price - b.price);
        // orderbook.bids.sort((a,b)=> b.price - a.price);
        // fs.writeFileSync('src/trades/snapshot2.json', JSON.stringify(this.orderbooks, null, 2));

        const orderbook = this.orderbooks['TATA']
        const rev = [...orderbook.asks]
        rev.reverse()
        rev.forEach((ele) => {
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}    -u : ${ele.userId}     -o : ${ele.orderId}`);
        })
        console.log("break");

        orderbook.bids.forEach((ele: any) => {
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}     -u : ${ele.userId}     -o : ${ele.orderId}`);
        })
    }
}


const t = new Engine();
// t.getDepth('TATA')
t.log()
// t.getOrderbooks();
// t.createMarketOrder({
//     "orderType": 'Market',
//     "symbol": 'TATA',
//     "price": 0,
//     "quantity": 0,
//     "quoteQuantity": 8000,
//     "side": 'Bid',
//     "clientId": 'String'
// });

t.createOrder({
    "orderType": 'Limit',
    "symbol": 'TATA',
    "price": 1000.9,
    "quantity": 3,
    "quoteQuantity": 0,
    "side": 'Ask',
    "userId": '7sjkdzii9fpk9wlvimul3'
});

// t.createOrder({
//     "orderType": 'Limit',
//     "symbol": 'TATA',
//     "price": 1000.8,
//     "quantity": 2,
//     "quoteQuantity": 0,
//     "side": 'Ask',
//     "userId": 'ebqfpy22srlau9oph6nl4l4'
// });

// t.createOrder({
//     "orderType": 'Limit',
//     "symbol": 'TATA',
//     "price": 1002,
//     "quantity": 40,
//     "quoteQuantity": 0,
//     "side": 'Bid',
//     "clientId": 'String'
// });

t.log()



// t.createOrder({
//     "orderType": 'Limit',
//     "symbol": 'TATA',
//     "price": 1007.7,
//     "quantity": 28,
//     "quoteQuantity": 0,
//     "side": 'Bid',
//     "clientId": 'String'
// });

// t.createOrder({
//     "orderType" : 'Limit',
//     "symbol" : 'TATA',
//     "price" : 1008,
//     "quantity" : 100,
//     "quoteQuantity": 0,
//     "side" : 'Bid', 
//     "clientId" : 'String'
// });
