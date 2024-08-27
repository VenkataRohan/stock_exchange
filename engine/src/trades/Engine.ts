import fs from 'fs'

type order = {
    "orderType": string,
    "symbol": string,
    "price": number,
    "quantity": number,
    "quoteQuantity": number,
    "side": 'Bid' | 'Ask', // Bid , Ask
    "clientId": String
}

type orderType = {
    "price": number,
    "quantity": number,
    "orderId": string,
    "filled": number,
    "side": 'Ask' | 'Bid',
    "userId": string
}

type fills = order & {
    'otherUserId': string,
    'tradeId': string
}

type orderbookType = {
    [key: string]: {
        asks: orderType[],
        bids: orderType[]
    }
}

type userBalances = {
    [key: string]: {
        available: string,
        locked: string
    }
}

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
    public roundTwoDecimal(value: number) {
        return Math.round((value) * 100) / 100;
    }
    public createMarketOrder(order: order) {
        const orderbook = this.orderbooks[order.symbol]
        const fills: fills[] = []
        if (order.side === 'Bid') {
            var executedQty = 0, executedQuoteQty = 0, filledQty = 0;
            var remaningQuoteQty = order.quoteQuantity;
            var i = 0;
            while (i < orderbook.asks.length) {
                if (((orderbook.asks[i].quantity - orderbook.asks[i].filled) * orderbook.asks[i].price) <= remaningQuoteQty) {
                    filledQty = (orderbook.asks[i].quantity - orderbook.asks[i].filled);
                } else {
                    filledQty = Math.floor(remaningQuoteQty / orderbook.asks[i].price)
                }

                if (filledQty == 0) break;

                const totalprice = filledQty * orderbook.asks[i].price
                executedQuoteQty = this.roundTwoDecimal(executedQuoteQty + totalprice);
                remaningQuoteQty = this.roundTwoDecimal(remaningQuoteQty - totalprice);
                orderbook.asks[i].filled = filledQty
                executedQty += filledQty;

                fills.push({
                    "orderType": order.orderType,
                    "symbol": order.symbol,
                    "price": orderbook.asks[i].price,
                    "quantity": filledQty,
                    "quoteQuantity": executedQuoteQty,
                    "side": orderbook.asks[i].side, // Bid , Ask
                    "clientId": order.clientId,
                    "otherUserId": orderbook.asks[i].userId,
                    "tradeId": "khj"
                })
                if (orderbook.asks[i].filled == orderbook.asks[i].quantity) {
                    orderbook.asks.splice(i, 1);
                    i--;
                }
                i++;
            }

            console.log(fills);
            console.log(executedQty);
            console.log(executedQuoteQty);

        }
    }

    public priceUpperBoundAsc(price: number, bids: orderType[]) {
        var len = bids.length
        var low = 0, high = len - 1, res = len;

        while (low <= high) {
            var mid = Math.floor((high + low) / 2);
            console.log(mid);

            if (bids[mid].price > price) {
                res = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        return res;
    }

    public priceUpperBoundDsc(price: number, bids: orderType[]) {
        var len = bids.length
        var low = 0, high = len - 1, res = len;

        while (low <= high) {
            var mid = Math.floor((high + low) / 2);
            console.log(mid);

            if (bids[mid].price >= price) {
                low = mid + 1;
            } else {
                res = mid;
                high = mid - 1;
            }
        }

        return res;
    }

    public createOrder(order: order) {
        const orderbook = this.orderbooks[order.symbol]
        const fills: fills[] = []
        console.log(order.orderType);

        if (order.side === 'Bid') {
            console.log("bid");

            var executedQty = 0, excutedtotalprice = 0;

            for (var i = 0; i < orderbook.asks.length; i++) {
                if (order.price < orderbook.asks[i].price || order.quantity === executedQty) break;
                const filledQty = Math.min(order.quantity - executedQty, orderbook.asks[i].quantity - orderbook.asks[i].filled);
                const totalprice = filledQty * orderbook.asks[i].price
                excutedtotalprice = this.roundTwoDecimal(excutedtotalprice + totalprice)
                executedQty += filledQty;
                orderbook.asks[i].filled += filledQty;

                fills.push({
                    "orderType": order.orderType,
                    "symbol": order.symbol,
                    "price": orderbook.asks[i].price,
                    "quantity": filledQty,
                    "quoteQuantity": 0,
                    "side": orderbook.asks[i].side, // Bid , Ask
                    "clientId": order.clientId,
                    "otherUserId": orderbook.asks[i].userId,
                    "tradeId": "1"
                })

                if (orderbook.asks[i].filled == orderbook.asks[i].quantity) {
                    orderbook.asks.splice(i, 1);
                    i--;
                }
            }

            if (order.quantity > executedQty) {
                const bid = {
                    "price": order.price,
                    "quantity": order.quantity,
                    "orderId": "",
                    "filled": executedQty,
                    "side": 'Bid',
                    "userId": ""
                }
                var upperboundInd = this.priceUpperBoundDsc(order.price, orderbook.bids);

                //@ts-ignore
                orderbook.bids.splice(upperboundInd, 0, bid);
            }

            console.log(fills);
            console.log(executedQty);
            console.log(excutedtotalprice);

        } else {
            var executedQty = 0, excutedtotalprice = 0;

            for (var i = 0; i < orderbook.bids.length; i++) {
                if (order.price > orderbook.bids[i].price || order.quantity === executedQty) break;

                const filledQty = Math.min(order.quantity - executedQty, orderbook.bids[i].quantity - orderbook.bids[i].filled);
                const totalprice = filledQty * orderbook.bids[i].price
                excutedtotalprice = this.roundTwoDecimal(excutedtotalprice + totalprice)
                executedQty += filledQty;
                orderbook.bids[i].filled += filledQty;

                fills.push({
                    "orderType": order.orderType,
                    "symbol": order.symbol,
                    "price": orderbook.bids[i].price,
                    "quantity": filledQty,
                    "quoteQuantity": 0,
                    "side": orderbook.bids[i].side, // Bid , Ask
                    "clientId": order.clientId,
                    "otherUserId": orderbook.asks[i].userId,
                    "tradeId": "1"
                })

                if (orderbook.bids[i].filled == orderbook.bids[i].quantity) {
                    orderbook.bids.splice(i, 1);
                    i--;
                }
            }

            if (order.quantity > executedQty) {
                const ask = {
                    "price": order.price,
                    "quantity": order.quantity,
                    "orderId": "",
                    "filled": executedQty,
                    "side": 'Ask',
                    "userId": ""
                }
                var upperboundInd = this.priceUpperBoundAsc(order.price, orderbook.asks);



                //@ts-ignore
                orderbook.asks.splice(upperboundInd, 0, ask);
            }
            console.log(fills);
            console.log(executedQty);
            console.log(excutedtotalprice);
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
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}     -o : ${ele.orderId}`);
        })
        console.log("break");

        orderbook.bids.forEach((ele: any) => {
            console.log(` p : ${ele.price}    - q : ${ele.quantity}    - f : ${ele.filled}     -o : ${ele.orderId}`);
        })
    }
}


const t = new Engine();
t.log()
// t.getOrderbooks();
// t.createMarketOrder({
//     "orderType": 'Market',
//     "symbol": 'TATA',
//     "price": 0,
//     "quantity": 0,
//     "quoteQuantity": 6000,
//     "side": 'Bid',
//     "clientId": 'String'
// });

t.createOrder({
    "orderType": 'Limit',
    "symbol": 'TATA',
    "price": 1000.9,
    "quantity": 8,
    "quoteQuantity": 0,
    "side": 'Bid',
    "clientId": 'String'
});

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
