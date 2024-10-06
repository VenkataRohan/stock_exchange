import { orderbook, fills, order } from "../types";
import { roundTwoDecimal, priceUpperBoundAsc, priceUpperBoundDsc, getRandomOrderId } from ".";

// export function matchMarketBid(orderbook: orderbook, order: order) {
//     const fills: fills[] = []
//     if (order.side === 'Bid') {
//         var executedQty = 0, executedQuoteQty = 0, filledQty = 0;
//         var remaningQuoteQty = order.quoteQuantity;
//         var i = 0;
//         while (i < orderbook.asks.length) {
//             if (((orderbook.asks[i].quantity - orderbook.asks[i].filled) * orderbook.asks[i].price) <= remaningQuoteQty) {
//                 filledQty = (orderbook.asks[i].quantity - orderbook.asks[i].filled);
//             } else {
//                 filledQty = Math.floor(remaningQuoteQty / orderbook.asks[i].price)
//             }

//             if (filledQty == 0) break;

//             const totalprice = filledQty * orderbook.asks[i].price
//             executedQuoteQty = roundTwoDecimal(executedQuoteQty + totalprice);
//             remaningQuoteQty = roundTwoDecimal(remaningQuoteQty - totalprice);
//             orderbook.asks[i].filled = filledQty
//             executedQty += filledQty;

//             fills.push({
//                 "orderId" : order.orderId,
//                 "orderType": order.orderType,
//                 "symbol": order.symbol,
//                 "price": orderbook.asks[i].price,
//                 "quantity": filledQty,
//                 "quoteQuantity": totalprice,
//                 "side": orderbook.asks[i].side, // Bid , Ask
//                 "userId": order.userId,
//                 "otherUserId": orderbook.asks[i].userId,
//                 "tradeId": "1"
//             })
//             if (orderbook.asks[i].filled == orderbook.asks[i].quantity) {
//                 orderbook.asks.splice(i, 1);
//                 i--;
//             }
//             i++;
//         }
//         return {
//             fills,
//             executedQuoteQty,
//             executedQty
//         }
//     }
// }

export function matchBids(orderbook: orderbook, order: order) {
    var executedQty = 0, excutedtotalprice = 0, last_traded_price = orderbook.currentPrice;
    const fills: fills[] = []
    const orderId = getRandomOrderId();

    for (var i = 0; i < orderbook.asks.length; i++) {
        if (order.price < orderbook.asks[i].price || order.quantity === executedQty) break;
        const filledQty = Math.min(order.quantity - executedQty, orderbook.asks[i].quantity - orderbook.asks[i].filled);
        const totalprice = roundTwoDecimal(filledQty * orderbook.asks[i].price)
        excutedtotalprice = roundTwoDecimal(excutedtotalprice + totalprice)
        executedQty += filledQty;
        orderbook.asks[i].filled += filledQty;
        if(orderbook.asks[i].filled != 0){
            orderbook.asks[i].status = orderbook.asks[i].filled === orderbook.asks[i].quantity ? 'FILLED' : 'PARTIALLY_FILLED'
        }
        last_traded_price = orderbook.asks[i].price.toString();
        fills.push({
            orderId: orderbook.asks[i].orderId,
            orderType: 'Limit',
            symbol: order.symbol,
            price: orderbook.asks[i].price,
            quantity: orderbook.asks[i].quantity,
            status : orderbook.asks[i].quantity === filledQty ? 'FILLED' : 'PARTIALLY_FILLED',
            side: orderbook.asks[i].side, // Bid , Ask
            filled: orderbook.asks[i].filled,
            userId: orderbook.asks[i].userId,
            otherUserId: order.userId,
            ts : new Date()
        })

        if (orderbook.asks[i].filled == orderbook.asks[i].quantity) {
            orderbook.asks.splice(i, 1);
            i--;
        }
    }

    if (order.quantity > executedQty) {
        const bid: order = {
            price: order.price,
            orderType: order.orderType,
            symbol: order.symbol,
            quantity: order.quantity,
            orderId: orderId,
            filled: executedQty,
            status : executedQty === 0 ? 'NEW' : 'PARTIALLY_FILLED',
            side: 'Bid',
            userId: order.userId
        }
        var upperboundInd = priceUpperBoundDsc(order.price, orderbook.bids);

        //@ts-ignore
        orderbook.bids.splice(upperboundInd, 0, bid);
    }

    orderbook.currentPrice = last_traded_price;
    console.log(fills);

    return {
        fills,
        excutedtotalprice,
        executedQty,
        orderId
    }
}


export function matchAsks(orderbook: orderbook, order : order, relavent_orders : order[]) {
    var executedQty = 0, excutedtotalprice = 0, last_traded_price = orderbook.currentPrice;
    const fills: fills[] = []
    const orderId = getRandomOrderId();

    relavent_orders.forEach(relavent_order => {
        
    });

    for (var i = 0; i < orderbook.bids.length; i++) {
        if (order.price > orderbook.bids[i].price || order.quantity === executedQty) break;

        const filledQty = Math.min(order.quantity - executedQty, orderbook.bids[i].quantity - orderbook.bids[i].filled);
        const totalprice = roundTwoDecimal(filledQty * orderbook.bids[i].price)
        excutedtotalprice = roundTwoDecimal(excutedtotalprice + totalprice)
        executedQty += filledQty;
        orderbook.bids[i].filled += filledQty;
        if(orderbook.bids[i].filled != 0){
            orderbook.bids[i].status = orderbook.bids[i].filled === orderbook.bids[i].quantity ? 'FILLED' : 'PARTIALLY_FILLED'
        }

        last_traded_price = orderbook.bids[i].price.toString();
        fills.push({
            orderId: orderbook.bids[i].orderId,
            orderType: 'Limit',
            symbol:  order.symbol,
            price: orderbook.bids[i].price,
            quantity: filledQty,
            side: orderbook.bids[i].side, // Bid , Ask
            filled: order.filled,
            status : orderbook.bids[i].quantity === filledQty ? 'FILLED' : 'PARTIALLY_FILLED',
            userId:  orderbook.bids[i].userId,
            otherUserId: order.userId,
            ts : new Date()
        })

        if (orderbook.bids[i].filled == orderbook.bids[i].quantity) {
            orderbook.bids.splice(i, 1);
            i--;
        }
    }

    if (order.quantity > executedQty) {
        const ask: order = {
            price: order.price,
            orderType: order.orderType,
            symbol: order.symbol,
            quantity: order.quantity,
            orderId: orderId,
            filled: executedQty,
            status : executedQty === 0 ? 'NEW' : 'PARTIALLY_FILLED',
            side: 'Ask',
            userId: order.userId
        }
        var upperboundInd = priceUpperBoundAsc(order.price, orderbook.asks);


        //@ts-ignore
        orderbook.asks.splice(upperboundInd, 0, ask);
    }
    orderbook.currentPrice = last_traded_price;
    return {
        orderId,
        fills,
        excutedtotalprice,
        executedQty
    }
}