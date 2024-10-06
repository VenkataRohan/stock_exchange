
import * as fs from 'fs';

import { order, userBalances, orderbookType, fills, messageFromApi, GET_ALL_STOCK_BALANCE, GET_STOCK_BALANCE, CREATE_ORDER, GET_BALANCE, ADD_BALANCE, GET_DEPTH, messageToApi, DEPTH, ORDER_PALACED, ERROR, GET_ORDER, CANCEL_ORDER, ORDER_CANCLED, TRADE_ADDED, GET_CURRENTPRICE, sideType } from '../types'
import { combineArrayDepth, combineUpdatedArr, roundTwoDecimal } from '../utils';
import { matchBids, matchAsks } from '../utils/orderbook';
import { RabbitMqManager } from '../RabbitMqManager';
import { mm } from './mm';

export class Engine {
    orderbooks: orderbookType = {};
    balances: userBalances
    constructor() {
        // var snapshot = JSON.parse(fs.readFileSync('src/trades/snapshot.json', 'utf8').toString())
        var snapshot = JSON.parse(fs.readFileSync('src/trades/test.json', 'utf8').toString())
        this.orderbooks = snapshot.orderbooks
        this.balances = snapshot.balances;
        // mm(this)
    }

    getOrderbooks() {
        console.log(this.orderbooks);
        console.log(this.balances);
    }

    getOrders(userId: string): sideType[] {
        const res: sideType[] = [];
        Object.keys(this.orderbooks).forEach((mar) => {
            const market = this.orderbooks[mar]
            market.bids.forEach((bid) => {
                if (bid.userId === userId) {
                    res.push({ ...bid });
                }
            })

            market.asks.forEach((ask) => {
                if (ask.userId === userId) {
                    res.push({ ...ask });
                }
            })
        })
        return res;
    }

    getUserBalance(userId: string) {
        return this.balances[userId];
    }

    getCurrentPrice(symbol: string): messageToApi {
        return { type: GET_CURRENTPRICE, data: { price: this.orderbooks[symbol].currentPrice } };
    }

    addUserBalance(userId: string, amount: string) {
        this.balances[userId].balance.available = roundTwoDecimal(Number(this.balances[userId].balance.available) + Number(amount)).toString();
        return this.balances[userId];
    }

    getStockBalance(userId: string, symbol: string): messageToApi {
        return {
            type: GET_STOCK_BALANCE,
            data: {
                balance: this.balances[userId].balance.available,
                [symbol]: this.balances[userId].stocks[symbol].reduce((sum, ele) => sum + ele.quantity, 0).toString()
            }
        }
    }

    getAllStockBalance(userId: string): messageToApi {
        const sym_data: {
            symbol: string,
            available_quantity: string,
            avg_price: string,
            current_price: string
        }[] = []

        if (this.balances[userId]) {
            Object.keys(this.balances[userId].stocks).forEach((symbol) => {
                if(this.balances[userId].stocks[symbol].reduce((sum, ele) => sum + (Number(ele.quantity) + Number(ele.locked)),0)  === 0) return; 
                sym_data.push({
                    symbol: symbol,
                    available_quantity: this.balances[userId].stocks[symbol].reduce((sum, ele) => sum + ele.quantity, 0).toString(),
                    avg_price: roundTwoDecimal(this.balances[userId].stocks[symbol].reduce((sum, ele) => roundTwoDecimal(sum + (Number(ele.price) * (Number(ele.quantity) + Number(ele.locked)))), 0) / (this.balances[userId].stocks[symbol].reduce((sum, ele) => sum + (Number(ele.quantity) + Number(ele.locked)), 0))).toString(),
                    current_price: this.orderbooks[symbol].currentPrice
                })
            })
        }

        return {
            type: GET_ALL_STOCK_BALANCE,
            data: sym_data
        }
    }

    public async process(message: messageFromApi): Promise<messageToApi | undefined> {
        try {
            switch (message.type) {
                case CREATE_ORDER:
                    return await this.createOrder({ ...message.data, price: Math.round(Number(message.data.price)*100)/100, quantity: Number(message.data.quantity), filled: 0, status: 'NEW' });
                case CANCEL_ORDER:
                    //@ts-ignore
                    return await this.cancelOrder(message.data.orderId, message.data.symbol);
                case GET_ORDER:
                    return { type: GET_ORDER, data: this.getOrders(message.data.userId) };
                case GET_DEPTH:
                    return { type: DEPTH, data: this.getDepth(message.data.symbol) };
                case GET_BALANCE:
                    //@ts-ignore
                    return { type: GET_BALANCE, data: this.getUserBalance(message.data.userId) };
                case ADD_BALANCE:
                    return { type: ADD_BALANCE, data: this.addUserBalance(message.data.userId, message.data.amount) };
                case GET_STOCK_BALANCE:
                    return await this.getStockBalance(message.data.userId, message.data.symbol)
                case GET_ALL_STOCK_BALANCE:
                    return await this.getAllStockBalance(message.data.userId);
                case GET_CURRENTPRICE:
                    return await this.getCurrentPrice(message.data.symbol);
                default:
                    break;
            }
        } catch (error: any) {
            console.log(error);

            const messageToApi: messageToApi = {
                type: ERROR,
                data: {
                    msg: error.message
                }
            }
            return messageToApi;
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

    private checkBalanceAndLockstock(userId: string, quantity: string, symbol: string, price: number) {
        const stock = this.balances[userId].stocks[symbol];
        const relavent_orders: order[] = []
        var ind = 0, available_quantity = 0, len = stock.length;
        while (ind < len && available_quantity < Number(quantity)) {
            var val = Math.min(stock[ind].quantity, Number(quantity) - available_quantity)
            available_quantity = roundTwoDecimal(available_quantity + val)
            stock[ind].quantity = roundTwoDecimal(stock[ind].quantity - val)
            stock[ind].locked = roundTwoDecimal(stock[ind].locked + val)

            const ord: order = {
                orderType: 'Limit',
                status: 'NEW',
                symbol: symbol,
                price: Number(price),
                quantity: val,
                side: 'Ask',
                userId: userId,
                filled: 0
            }
            relavent_orders.push(ord);
            ind++;
        }

        if (ind === len && available_quantity < Number(quantity)) {
            throw new Error('Insufficient Quantity');
        }

        return relavent_orders;
    }

    public async createOrder(order: order) {
        if (order.side === 'Bid') {
            console.log("bid");
            this.checkBalanceAndLockfunds(order.userId, order.price.toString(), order.quantity.toString())

            const res = matchBids(this.orderbooks[order.symbol], order)
            // if (!res) return;
            await this.updateTradeDb(res.fills);
            await this.publishWsDepthUpdates(res.fills, 'Bid', order.symbol, order.price.toString());
            if (res.fills.length != 0) {
                await this.publishWsTickerUpdates(this.orderbooks[order.symbol].currentPrice, order.symbol);
            }
            await this.publishWsTradesUpdates(res.fills, order.symbol);
            // console.log(res);
            // console.log(order.userId);
            // console.log(JSON.stringify((this.balances[order.userId])));
            this.updateBalance(res.fills, 'Bids');
            // console.log("after update");
            // console.log(JSON.stringify((this.balances[order.userId])));
            // res.fills.forEach((ele) => {
            //     console.log(ele.userId);
            //     console.log(JSON.stringify(this.balances[ele.userId]));
            // })
            const resp: messageToApi = {
                type: ORDER_PALACED,
                data: {
                    orderType: 'Limit',
                    orderId: res.orderId,
                    userId: order.userId,
                    symbol: order.symbol,
                    side: order.side,
                    quantity: order.quantity.toString(),
                    status: res.executedQty === 0 ? 'NEW' : order.quantity === res.executedQty ? 'FILLED' : 'PARTIALLY_FILLED',
                    executedQuantity: res.executedQty.toString()
                }
            }
            return resp

        } else {
            const relavent_orders = this.checkBalanceAndLockstock(order.userId, order.quantity.toString(), order.symbol, order.price)
            console.log(order.price);
            console.log('order');
            
            const res = matchAsks(this.orderbooks[order.symbol], order, relavent_orders)
            if (!res) return;
            await this.updateTradeDb(res.fills);
            await this.publishWsDepthUpdates(res.fills, 'Ask', order.symbol, order.price.toString());
            if (res.fills.length != 0) {
                await this.publishWsTickerUpdates(this.orderbooks[order.symbol].currentPrice, order.symbol);
            }
            await this.publishWsTradesUpdates(res.fills, order.symbol);
            // console.log(res);
            // console.log(order.userId);
            // console.log(JSON.stringify((this.balances[order.userId])));
            this.updateBalance(res.fills, 'Asks');
            // console.log("after update");
            // console.log(JSON.stringify((this.balances[order.userId])));
            // res.fills.forEach((ele) => {
            //     console.log(ele.userId);
            //     console.log(JSON.stringify(this.balances[ele.userId]));
            // })

            const resp: messageToApi = {
                type: ORDER_PALACED,
                data: {
                    orderType: 'Limit',
                    orderId: res.orderId,
                    userId: order.userId,
                    symbol: order.symbol,
                    side: order.side,
                    quantity: order.quantity.toString(),
                    status: res.executedQty === 0 ? 'NEW' : order.quantity === res.executedQty ? 'FILLED' : 'PARTIALLY_FILLED',
                    executedQuantity: res.executedQty.toString()
                }
            }
            return resp
        }
    }

    public cancelOrder(orderId: string, symbol: string) {
        var orderInd = this.orderbooks[symbol].bids.findIndex(e => e.orderId === orderId)
        var order: order | undefined;
        if (orderInd === -1) {
            orderInd = this.orderbooks[symbol].asks.findIndex(e => e.orderId === orderId)

            if (orderInd === -1) throw new Error('No order with order id : ' + orderId);
            order = this.orderbooks[symbol].asks.splice(orderInd, 1)[0];
            // console.log(this.balances[order.userId].stocks[symbol]);
            var remainingQty = order.quantity - order.filled;
            const user_stock = this.balances[order.userId].stocks[symbol];
            for (var ind = 0; ind < user_stock.length && remainingQty > 0; ind++) {
                var val = Math.min(user_stock[ind].locked, remainingQty);
                user_stock[ind].locked = roundTwoDecimal(user_stock[ind].locked - val);
                user_stock[ind].quantity = roundTwoDecimal(user_stock[ind].quantity + val)
                remainingQty -= val;
            }
            // console.log(this.balances[order.userId].stocks[symbol]);
        } else {
            order = this.orderbooks[symbol].bids.splice(orderInd, 1)[0];
            // console.log(this.balances[order.userId].balance);
            const remainingPrice = (order.quantity - order.filled) * order.price;
            this.balances[order.userId].balance.locked = roundTwoDecimal(Number(this.balances[order.userId].balance.locked) - remainingPrice).toString();
            this.balances[order.userId].balance.available = roundTwoDecimal(Number(this.balances[order.userId].balance.available) + remainingPrice).toString();
            // console.log(this.balances[order.userId].balance);

        }
        //@ts-ignore
        const resp: messageToApi = {
            type: ORDER_CANCLED,
            data: {
                orderType: 'Limit',
                orderId: order.orderId,
                userId: order.userId,
                symbol: symbol,
                side: order.side,
                quantity: order.quantity.toString(),
                status: 'CANCELED',
                executedQuantity: order.filled.toString(),
            }
        }

        return resp;
    }

    private async updateTradeDb(fills: fills[]) {
        fills.forEach(async (fill) => {
            if(fill.userId === 'MMASK1' || fill.userId === 'MMBIDS1'){
                return;
            }
            await RabbitMqManager.getInstance().connect();
            await RabbitMqManager.getInstance().sendDbUpdates(TRADE_ADDED, JSON.stringify({ type: TRADE_ADDED, data: fill }));
        })
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
        await RabbitMqManager.getInstance().connect();
        await RabbitMqManager.getInstance().sendWsUpdates(`ticker@${symbol}`, JSON.stringify(data));
    }

    // public async publishWsOrderUpdates(fills : fills[]) {
    //     const data = {
    //         stream: `ticker@${symbol}`,
    //         data: {
    //             e: `ticker`,
    //             s: symbol,
    //             E: Date.now(),
    //             p: price
    //         }
    //     }
    //     await RabbitMqManager.getInstance().connect();
    //     await RabbitMqManager.getInstance().sendWsUpdates(`ticker@${symbol}`, JSON.stringify(data));
    // }

    private updateBalance(fills: fills[], side: 'Bids' | 'Asks') {
        if (side === "Bids") {
            fills.forEach((fill) => {
                const fillPrice = roundTwoDecimal(fill.price * fill.quantity);
                this.balances[fill.userId].balance.available = roundTwoDecimal(Number(this.balances[fill.userId].balance.available) + fillPrice).toString();
                const user_stock = this.balances[fill.userId].stocks[fill.symbol];
                var fill_quantity = fill.quantity;
                for (var ind = 0; ind < user_stock.length; ind++) {
                    if (user_stock[ind].locked > fill_quantity) {
                        user_stock[ind].locked = user_stock[ind].locked - fill_quantity;
                        break;
                    } else {
                        fill_quantity -= user_stock[ind].locked
                        user_stock[ind].locked = 0;
                        if (user_stock[ind].quantity === 0) {
                            user_stock.splice(ind, 1);
                            ind--;
                        }
                    }
                }

                this.balances[fill.otherUserId].balance.locked = roundTwoDecimal((Number(this.balances[fill.otherUserId].balance.locked) - fillPrice)).toString();
                this.balances[fill.otherUserId].stocks[fill.symbol].push({ id: fill.orderId as string, quantity: fill.quantity, locked: 0, price: fillPrice.toString(), ts: new Date().toISOString() })
            })
        } else {
            fills.forEach((fill) => {
                const fillPrice = roundTwoDecimal(fill.price * fill.quantity);
                this.balances[fill.userId].balance.locked = roundTwoDecimal(Number(this.balances[fill.userId].balance.locked) - fillPrice).toString();
                this.balances[fill.userId].stocks[fill.symbol].push({ id: fill.orderId as string, quantity: fill.quantity, locked: 0, price: fillPrice.toString(), ts: new Date().toISOString() })

                this.balances[fill.otherUserId].balance.available = roundTwoDecimal(Number(this.balances[fill.otherUserId].balance.available) + fillPrice).toString();
                const other_user_stock = this.balances[fill.otherUserId].stocks[fill.symbol];
                var fill_quantity = fill.quantity;
                for (var ind = 0; ind < other_user_stock.length; ind++) {
                    if (other_user_stock[ind].locked > fill_quantity) {
                        other_user_stock[ind].locked = other_user_stock[ind].locked - fill_quantity;
                        break;
                    } else {
                        fill_quantity -= other_user_stock[ind].locked
                        other_user_stock[ind].locked = 0;
                        if (other_user_stock[ind].quantity === 0) {
                            other_user_stock.splice(ind, 1);
                            ind--;
                        }
                    }
                }
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
                    q: ele.quantity,
                    //todo
                    i: ele.orderId,
                    u: ele.userId,
                    st: ele.status,
                    o: ele.otherUserId,
                }
            }
            await RabbitMqManager.getInstance().connect();
            await RabbitMqManager.getInstance().sendWsUpdates(`trade@${symbol}`, JSON.stringify(data));
        })
    }

    public async publishWsDepthUpdates(fills: fills[], side: 'Bid' | 'Ask', symbol: string, price: string) {
        const depth = this.getDepth(symbol);
        if (side == 'Bid') {
            const updatedasks = combineUpdatedArr(fills, depth.asks);
            const updatedbids = depth.bids.find(x => x[0] == price);
            const data = {
                stream: `depth@${symbol}`,
                data: {
                    e: 'depth',
                    s: symbol,
                    E: Date.now(),
                    a: updatedasks.map((ele: [string, string][]) => [Number(ele[0]), Number(ele[1])]),
                    b: updatedbids ? [[Number(updatedbids[0]), Number(updatedbids[1])]] : []
                    //todo
                    // i : orderId
                    //t : tradeId
                }
            }
            await RabbitMqManager.getInstance().connect();
            await RabbitMqManager.getInstance().sendWsUpdates(`depth@${symbol}`, JSON.stringify(data));
        }

        if (side == 'Ask') {
            const updatedbids = combineUpdatedArr(fills, depth.bids);
            const updatedasks = depth.asks.find(x => x[0] == price);
            const data = {
                stream: `depth@${symbol}`,
                data: {
                    a: updatedasks ? [[Number(updatedasks[0]), Number(updatedasks[1])]] : [],
                    b: updatedbids.map((ele: [string, string][]) => [Number(ele[0]), Number(ele[1])]),
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
//     "price": 1000.8,
//     "quantity": 5,
//     "side": 'Ask',
//     "status" : 'NEW',
//     "filled" : 0,
//     "userId": 'ebqfpy22srlau9oph6nl4l4'
// });

// t.createOrder({
//     "orderId": "1234566",
//     "orderType": 'Limit',
//     "symbol": 'TATA',
//     "price": 1000.9,
//     "quantity": 5,
//     "side": 'Bid',
//     "status" : 'NEW',
//     "filled" : 0,
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
