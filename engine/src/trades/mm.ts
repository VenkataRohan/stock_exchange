import { CREATE_ORDER, orderbook, orderbookType } from "../types";
import { Engine } from "./Engine";
const stocks: [string, number][] = [['AERONOX', 1000.8], ['QUICKNET', 500.12], ['SMARTINC', 825.79], ['SUNCO', 792.39], ['TECHLY', 999.81], ['EASYBUY', 672.46]];

export const mm = (engine: Engine) => {
    setInterval(() => {
        stocks.forEach((e) => {
            const price = (Math.round((engine.orderbooks[e[0]].bids[0].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100
            engine.createOrder({
                orderType: 'Limit',
                symbol: e[0],
                status: 'NEW',
                price: price,
                quantity: Math.floor(Math.random() * 30) + 1,
                side: 'Ask',
                userId: 'MMASK1',
                filled: 0
            })
        })

    }, 1000)

    setInterval(() => {
        stocks.forEach((e) => {
             const price = (Math.round((engine.orderbooks[e[0]].asks[Math.floor(Math.random() * 7)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
            engine.createOrder({
                orderType: 'Limit',
                symbol: e[0],
                status: 'NEW',
                price: price,
                quantity: Math.floor(Math.random() * 50) + 1,
                side: 'Ask',
                userId: 'MMASK2',
                filled: 0
            })
        })
    }, 3000)


    setInterval(() => {
        stocks.forEach((e) => {
            const price = (Math.round((engine.orderbooks[e[0]].asks[0].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100
            engine.createOrder({
                orderType: 'Limit',
                symbol: e[0],
                status: 'NEW',
                price: price,
                quantity: Math.floor(Math.random() * 30) + 1,
                side: 'Bid',
                userId: 'MMBIDS1',
                filled: 0
            })
        })

    }, 1000)


    setInterval(() => {
        stocks.forEach((e) => {
            const price = (Math.round((engine.orderbooks[e[0]].bids[Math.floor(Math.random() * 7)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
        engine.createOrder({
            orderType: 'Limit',
            symbol: e[0],
            status: 'NEW',
            price: price,
            quantity: Math.floor(Math.random() * 50) + 1,
            side: 'Bid',
            userId: 'MMBIDS2',
            filled: 0
        })
        })
        
    }, 3000)

    setInterval(() => {
        stocks.forEach((e) => {
            if (engine.orderbooks[e[0]].bids.length <= engine.orderbooks[e[0]].asks.length) {
                const price = (Math.round((engine.orderbooks[e[0]].bids[Math.floor(Math.random() * engine.orderbooks[e[0]].bids.length)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
                engine.createOrder({
                    orderType: 'Limit',
                    symbol: e[0],
                    status: 'NEW',
                    price: price,
                    quantity: Math.floor(Math.random() * 100) + 1,
                    side: 'Bid',
                    userId: 'MMBIDS2',
                    filled: 0
                })
            } else {
                const price = (Math.round((engine.orderbooks[e[0]].asks[Math.floor(Math.random() * engine.orderbooks[e[0]].asks.length)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
                engine.createOrder({
                    orderType: 'Limit',
                    symbol: e[0],
                    status: 'NEW',
                    price: price,
                    quantity: Math.floor(Math.random() * 100) + 1,
                    side: 'Ask',
                    userId: 'MMASK2',
                    filled: 0
                })
            }
        })
        

    }, 10000)

}