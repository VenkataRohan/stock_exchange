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
    'tradeId' : string
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
        snapshot.orderbooks.forEach(ele => {
            this.orderbooks[ele.baseAsset] = { ...ele }
        });

        this.balances = new Map(snapshot.balances);
    }

    getOrderbooks() {
        console.log(this.orderbooks);
        console.log(this.balances);

    }

    public createMarketOrder(order: order) {
        const orderbook = this.orderbooks[order.symbol]
        const fills : fills[] = []
        if (order.side === 'Bid') {
            var executedQty = 0, executedQuoteQty = 0, filledQty = 0;
            var remaningQuoteQty = order.quoteQuantity;
            var i = 0;
            do {
                if (((orderbook.asks[i].quantity - orderbook.asks[i].filled) * orderbook.asks[i].price) <= remaningQuoteQty) {
                    filledQty = (orderbook.asks[i].quantity - orderbook.asks[i].filled);
                } else {
                    filledQty = Math.floor(remaningQuoteQty / orderbook.asks[i].price)
                }

                const totalprice = filledQty * orderbook.asks[i].price
                executedQuoteQty += totalprice;
                remaningQuoteQty -= totalprice;
                orderbook.asks[i].filled = filledQty
                executedQty += filledQty;

                fills.push({
                    "orderType": order.orderType,
                    "symbol": order.symbol,
                    "price":  orderbook.asks[i].price,
                    "quantity": executedQty,
                    "quoteQuantity": executedQuoteQty,
                    "side": order.side, // Bid , Ask
                    "clientId": order.clientId,
                    "otherUserId":  orderbook.asks[i].userId,
                    "tradeId": "khj"
                })
                if (orderbook.asks[i].filled == orderbook.asks[i].quantity) {
                    orderbook.asks.splice(i, 1);
                    i--;
                }
                i++;
            } while (filledQty > 0 && i < orderbook.asks.length)
        }
    }

    public priceUpperBound(price: number, bids: orderType[]) {
        var low = 0, high = bids.length - 1, res = bids.length;

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

    public createOrder(order: order) {
        const orderbook = this.orderbooks[order.symbol]
        const fills : fills[] = []

        var executedQty = 0;

        for (var i = 0; i < orderbook.asks.length; i++) {
            if (order.price < orderbook.asks[i].price || order.quantity === executedQty) break;

            const filledQty = Math.min(order.quantity - executedQty, orderbook.asks[i].quantity - orderbook.asks[i].filled);
            executedQty += filledQty;
            orderbook.asks[i].filled += filledQty;
            
            fills.push({
                "orderType": order.orderType,
                "symbol": order.symbol,
                "price":  orderbook.asks[i].price,
                "quantity": filledQty,
                "quoteQuantity": 0,
                "side": order.side, // Bid , Ask
                "clientId": order.clientId,
                "otherUserId":  orderbook.asks[i].userId,
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
                "quantity": order.quantity - executedQty,
                "orderId": "",
                "filled": 0,
                "side": 'Bid',
                "userId": ""
            }
            var upperboundInd = this.priceUpperBound(order.price, orderbook.bids);

            console.log(fills);
            

            //@ts-ignore
            orderbook.bids.splice(upperboundInd, 0, bid);
        }

    }
}


const t = new Engine();
// t.getOrderbooks();
// t.createMarketOrder({
//     "orderType" : 'Market',
//     "symbol" : 'TATA',
//     "price" : 0,
//     "quantity" : 0,
//     "quoteQuantity": 50000,
//     "side" : 'Bid', 
//     "clientId" : 'String'
// });

t.createOrder({
    "orderType": 'Limit',
    "symbol": 'TATA',
    "price": 1007.7,
    "quantity": 28,
    "quoteQuantity": 0,
    "side": 'Bid',
    "clientId": 'String'
});

// t.createOrder({
//     "orderType" : 'Limit',
//     "symbol" : 'TATA',
//     "price" : 1008,
//     "quantity" : 100,
//     "quoteQuantity": 0,
//     "side" : 'Bid', 
//     "clientId" : 'String'
// });
