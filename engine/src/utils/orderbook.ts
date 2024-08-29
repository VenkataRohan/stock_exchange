import { orderbook, fills, order } from "../types";
import { roundTwoDecimal, priceUpperBoundAsc, priceUpperBoundDsc } from ".";

export function matchMarketBid(orderbook: orderbook, order: order) {
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
            executedQuoteQty = roundTwoDecimal(executedQuoteQty + totalprice);
            remaningQuoteQty = roundTwoDecimal(remaningQuoteQty - totalprice);
            orderbook.asks[i].filled = filledQty
            executedQty += filledQty;

            fills.push({
                "orderType": order.orderType,
                "symbol": order.symbol,
                "price": orderbook.asks[i].price,
                "quantity": filledQty,
                "quoteQuantity": totalprice,
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
        return {
            fills,
            executedQuoteQty,
            executedQty
        }
    }
}

export function matchBids(orderbook: orderbook, order: order) {
    var executedQty = 0, excutedtotalprice = 0;
    const fills: fills[] = []

    for (var i = 0; i < orderbook.asks.length; i++) {
        if (order.price < orderbook.asks[i].price || order.quantity === executedQty) break;
        const filledQty = Math.min(order.quantity - executedQty, orderbook.asks[i].quantity - orderbook.asks[i].filled);
        const totalprice = filledQty * orderbook.asks[i].price
        excutedtotalprice = roundTwoDecimal(excutedtotalprice + totalprice)
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
        var upperboundInd = priceUpperBoundDsc(order.price, orderbook.bids);

        //@ts-ignore
        orderbook.bids.splice(upperboundInd, 0, bid);
    }
    return {
        fills,
        excutedtotalprice,
        executedQty
    }
}


export function matchAsks(orderbook: orderbook, order: order) {
    var executedQty = 0, excutedtotalprice = 0;
    const fills: fills[] = []

    for (var i = 0; i < orderbook.bids.length; i++) {
        if (order.price > orderbook.bids[i].price || order.quantity === executedQty) break;

        const filledQty = Math.min(order.quantity - executedQty, orderbook.bids[i].quantity - orderbook.bids[i].filled);
        const totalprice = filledQty * orderbook.bids[i].price
        excutedtotalprice = roundTwoDecimal(excutedtotalprice + totalprice)
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
        var upperboundInd = priceUpperBoundAsc(order.price, orderbook.asks);



        //@ts-ignore
        orderbook.asks.splice(upperboundInd, 0, ask);
    }
    return {
        fills,
        excutedtotalprice,
        executedQty
    }
}