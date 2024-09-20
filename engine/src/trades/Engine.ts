import * as fs from 'fs';

import { order, userBalances, orderbookType, fills, orderType, messageFromApi, CREATE_ORDER, GET_DEPTH, messageToApi, DEPTH, ORDER_PALACED } from '../types'
import { combineArrayDepth, combineUpdatedArr, roundTwoDecimal } from '../utils';
import { matchBids, matchAsks } from '../utils/orderbook';
import { RabbitMqManager } from '../RabbitMqManager';

export class Engine {
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

    public async process(message: messageFromApi): Promise<messageToApi | undefined> {

        switch (message.type) {
            case CREATE_ORDER:
                return await this.createOrder({ ...message.data, price: Number(message.data.price), quantity: Number(message.data.quantity) });
                break;
            case GET_DEPTH:
                console.log("inside depth");

                return { type: DEPTH, data: this.getDepth(message.data.symbol) };
                break;
            default:
                break;
        }
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
            await this.publishWsDepthUpdates(res.fills, 'Bid', order.symbol, order.price.toString());
            await this.publishWsTickerUpdates(this.orderbooks[order.symbol].currentPrice, order.symbol);
            await this.publishWsTradesUpdates(res.fills, order.symbol);
            console.log(res);
            console.log(this.balances[order.userId]);
            this.updateBalance(res.fills, 'Bids');
            console.log(this.balances[order.userId]);
            const resp: messageToApi = {
                type: ORDER_PALACED,
                data: {
                    orderType: 'Limit',
                    id: "8769",
                    userId: order.userId,
                    symbol: order.symbol,
                    side: order.side,
                    quantity: order.quantity.toString(),
                    executedQuantity: res.executedQty.toString()
                }
            }
            return resp

        } else {
            this.checkBalanceAndLockstock(order.userId, order.quantity.toString(), order.symbol)

            const res = matchAsks(this.orderbooks[order.symbol], order)
            if (!res) return;

            await this.publishWsDepthUpdates(res.fills, 'Ask', order.symbol, order.price.toString());
            await this.publishWsTickerUpdates(this.orderbooks[order.symbol].currentPrice, order.symbol);
            await this.publishWsTradesUpdates(res.fills, order.symbol);
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

    public cancelOrder(orderId: string, symbol: string) {
        var orderInd = this.orderbooks[symbol].bids.findIndex(e => e.orderId === orderId)
        var order: orderType | undefined;
        if (orderInd === -1) {
            orderInd = this.orderbooks[symbol].asks.findIndex(e => e.orderId === orderId)

            if (orderInd === -1) throw new Error('No order with order id : ' + orderId);
            order = this.orderbooks[symbol].asks.splice(orderInd, 1)[0];
            console.log(this.balances[order.userId].stocks[symbol]);
            const remainingQty = order.quantity - order.filled;
            this.balances[order.userId].stocks[symbol].locked_quantity -= remainingQty;
            this.balances[order.userId].stocks[symbol].quantity_available += remainingQty;
            console.log(this.balances[order.userId].stocks[symbol]);
        } else {
            order = this.orderbooks[symbol].bids.splice(orderInd, 1)[0];
            console.log(this.balances[order.userId].balance);
            const remainingPrice = (order.quantity - order.filled) * order.price;
            this.balances[order.userId].balance.locked = (Number(this.balances[order.userId].balance.locked) - remainingPrice).toString();
            this.balances[order.userId].balance.available = (Number(this.balances[order.userId].balance.available) + remainingPrice).toString();
            console.log(this.balances[order.userId].balance);

        }
        console.log(order);
    }

    public getDepth(symbol: string) {
        const depth = {
            bids: [] as [string, string][],
            asks: [] as [string, string][]
        }
        const orderbook = this.orderbooks[symbol]
        depth.asks = combineArrayDepth(orderbook.asks);
        depth.bids = combineArrayDepth(orderbook.bids);

        return depth
    }

    public getTicker(symbol: string) {
        const orderbook = this.orderbooks[symbol]
        return { price: orderbook.currentPrice }
    }

    public async publishWsTickerUpdates(price: string, symbol: string) {
        const data = {
            stream: `ticker@${symbol}`,
            data: {
                e: `ticker`,
                s: symbol,
                E: Date.now(),
                p: price
            }
        }
        console.log("ticker dfjkgs; gdsfgjk dfg9480t5 w4t dfghds rfw098rt dfjh ");
        console.log(data);
        await RabbitMqManager.getInstance().connect();
        await RabbitMqManager.getInstance().sendWsUpdates(`ticker@${symbol}`, JSON.stringify(data));
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
                stream: `trade@${symbol}`,
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
            await RabbitMqManager.getInstance().connect();
            await RabbitMqManager.getInstance().sendWsUpdates(`trade@${symbol}`, JSON.stringify(data));
        })
    }

    public async publishWsDepthUpdates(fills: fills[], side: 'Bid' | 'Ask', symbol: string, price: string) {
        const depth = this.getDepth(symbol);
        if (side == 'Bid') {
            const updatedasks = combineUpdatedArr(fills, depth.asks);
            const updatedbids = depth.bids.find(x => x[0] == price)
            const data = {
                stream: `depth@${symbol}`,
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
            console.log("depth");
            console.log(data);
            await RabbitMqManager.getInstance().connect();
            await RabbitMqManager.getInstance().sendWsUpdates(`depth@${symbol}`, JSON.stringify(data));
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
            await RabbitMqManager.getInstance().connect();
            await RabbitMqManager.getInstance().sendWsUpdates(`depth@${symbol}`, JSON.stringify(data));
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
        console.log("current price : " + orderbook.currentPrice);

        orderbook.bids.forEach((ele: any) => {
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}     -u : ${ele.userId}     -o : ${ele.orderId}`);
        })
    }
}


// const t = new Engine();
// t.getDepth('TATA')
// t.log()
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

// t.cancelOrder(
//     'goyvw4onku7u0e2c0y9gmo',
//     'TATA',
// )

// t.createOrder({
//     "orderId": "1234566",
//     "orderType": 'Limit',
//     "symbol": 'TATA',
//     "price": 1000.9,
//     "quantity": 5,
//     "side": 'Bid',
//     "userId": '7sjkdzii9fpk9wlvimul3'
// });

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

// t.log()



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
