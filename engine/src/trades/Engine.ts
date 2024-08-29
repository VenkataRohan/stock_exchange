import fs from 'fs'

import { order, userBalances, orderbookType } from '../types'
import { combineArrayDepth } from '../utils';
import { matchBids, matchMarketBid, matchAsks } from '../utils/orderbook';

class Engine {
    orderbooks: orderbookType = {};
    balances: Map<string, userBalances> = new Map();

    constructor() {
        var snapshot = JSON.parse(fs.readFileSync('src/trades/snapshot.json', 'utf8').toString())
        //@ts-ignore
        this.orderbooks = snapshot.orderbooks
        this.balances = new Map(snapshot.balances);
    }

    getOrderbooks() {
        console.log(this.orderbooks);
        console.log(this.balances);

    }

    public createMarketOrder(order: order) {

        const res = matchMarketBid(this.orderbooks[order.symbol], order)
        if (!res) return;
        console.log(res.fills);
        console.log(res.executedQty);
        console.log(res.executedQuoteQty);

    }

    public createOrder(order: order) {
        if (order.side === 'Bid') {
            console.log("bid");
            const res = matchBids(this.orderbooks[order.symbol], order)
            if (!res) return;
            console.log(res);
        } else {
            const res = matchAsks(this.orderbooks[order.symbol], order)
            if (!res) return;
            console.log(res);
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

        console.log(depth)
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
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}     -o : ${ele.orderId}`);
        })
        console.log("break");

        orderbook.bids.forEach((ele: any) => {
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}     -o : ${ele.orderId}`);
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

// t.createOrder({
//     "orderType": 'Limit',
//     "symbol": 'TATA',
//     "price": 1000.9,
//     "quantity": 8,
//     "quoteQuantity": 0,
//     "side": 'Ask',
//     "clientId": 'String'
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
