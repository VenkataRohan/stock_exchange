import { CREATE_ORDER, orderbook, orderbookType } from "../types";
import { Engine } from "./Engine";
const stocks: [string, number][] = [['AERONOX', 1000.8], ['QUICKNET', 500.12], ['SMARTINC', 825.79], ['SUNCO', 792.39], ['TECHLY', 999.81], ['EASYBUY', 672.46]];

export const mm = (engine: Engine) => {
    setInterval(() => {
        const price = (Math.round((engine.orderbooks['AERONOX'].bids[0].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100
        engine.createOrder({
            orderType: 'Limit',
            symbol: 'AERONOX',
            status: 'NEW',
            price: price,
            quantity: Math.floor(Math.random() * 30) + 1,
            side: 'Ask',
            userId: 'MMASK1',
            filled: 0
        })
    }, 1000)

    setInterval(() => {
        const price = (Math.round((engine.orderbooks['AERONOX'].asks[Math.floor(Math.random() * 7)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
        engine.createOrder({
            orderType: 'Limit',
            symbol: 'AERONOX',
            status: 'NEW',
            price: price,
            quantity: Math.floor(Math.random() * 50) + 1,
            side: 'Ask',
            userId: 'MMASK2',
            filled: 0
        })
    }, 3000)


    setInterval(() => {
        console.log("form mm");
        const price = (Math.round((engine.orderbooks['AERONOX'].asks[0].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100
        engine.createOrder({
            orderType: 'Limit',
            symbol: 'AERONOX',
            status: 'NEW',
            price: price,
            quantity: Math.floor(Math.random() * 30) + 1,
            side: 'Bid',
            userId: 'MMBIDS1',
            filled: 0
        })

    }, 1000)


    setInterval(() => {
        const price = (Math.round((engine.orderbooks['AERONOX'].bids[Math.floor(Math.random() * 7)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
        engine.createOrder({
            orderType: 'Limit',
            symbol: 'AERONOX',
            status: 'NEW',
            price: price,
            quantity: Math.floor(Math.random() * 50) + 1,
            side: 'Bid',
            userId: 'MMBIDS2',
            filled: 0
        })
    }, 3000)

    setInterval(() => {

        if (engine.orderbooks['AERONOX'].bids.length <= engine.orderbooks['AERONOX'].asks.length) {
            const price = (Math.round((engine.orderbooks['AERONOX'].bids[Math.floor(Math.random() * engine.orderbooks['AERONOX'].bids.length)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
            engine.createOrder({
                orderType: 'Limit',
                symbol: 'AERONOX',
                status: 'NEW',
                price: price,
                quantity: Math.floor(Math.random() * 100) + 1,
                side: 'Bid',
                userId: 'MMBIDS2',
                filled: 0
            })
        }else{
            const price = (Math.round((engine.orderbooks['AERONOX'].asks[Math.floor(Math.random() * engine.orderbooks['AERONOX'].asks.length)].price + (Math.random() < 0.5 ? ((Math.random() * 10)) * 0.01 : -((Math.random() * 10)) * 0.01)) * 100)) / 100;
            engine.createOrder({
                orderType: 'Limit',
                symbol: 'AERONOX',
                status: 'NEW',
                price: price,
                quantity: Math.floor(Math.random() * 100) + 1,
                side: 'Ask',
                userId: 'MMASK2',
                filled: 0
            })
        }

    }, 10000)

}