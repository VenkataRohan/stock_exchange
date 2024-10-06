import axios from 'axios';
import { messageFromApi, orderbookType, userBalances } from '../types';
import { getRandomOrderId, roundTwoDecimal } from '../utils';
import fs from 'fs'
const stocks: [string, number][] = [['AERONOX', 1000.8], ['QUICKNET', 500.12], ['SMARTINC', 825.79], ['SUNCO', 792.39], ['TECHLY', 999.81], ['EASYBUY', 672.46]];

const BASE_URL = 'http://localhost:3000/api/v1';

const orderbooks: orderbookType = {}

stocks.forEach((e) => {
    orderbooks[e[0]] = {
        asks: [],
        bids: [],
        currentPrice: e[1].toFixed(2)
    }
})

export const getBalances = async (): Promise<any> => {
    const res = await axios.get(`${BASE_URL}/engine/getBalances`, {
        headers: {
            //   'Authorization': 'Bearer ', 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    return res.data;
}
const main = async () => {
    const res = await getBalances();
    const balances: userBalances = {}
    res.forEach((ele: any) => {

        balances[ele.userId] = {
            balance: ele.data.balance,
            stocks: ele.data.stocks
        }
    })
    //@ts-ignore
    const mm = ['MMASK1', 'MMASK2', 'MMBIDS1', 'MMBIDS2']
   

    generateOrderBook(balances,mm);
    // console.log(JSON.stringify(balances));



}


const generateOrderBook = (balances: userBalances , mm : string[]) => {
    stocks.forEach((e) => {
        const symbol = e[0]
        Object.keys(balances).forEach((userId) => {
            if(mm.includes(userId)){
                return;
            }
            const bid_price = roundTwoDecimal(Number(orderbooks[symbol].currentPrice) - (Math.random() < 0.3 ? ((1 + Math.floor(Math.random() * 5)) * 0.06) : ((1 + Math.floor(Math.random() * 12)) * 0.1)))
            const qty = Number(balances[userId].balance.available) > 65000 ? (Math.floor(Math.random() * 70) + 1) : (Math.floor(Math.random() * 50) + 1)
            if (Number(balances[userId].balance.available) >= (bid_price * qty)) {
                balances[userId].balance.available = (Number(balances[userId].balance.available) - (bid_price * qty)).toFixed(2);
                balances[userId].balance.locked = (Number(balances[userId].balance.locked) + (bid_price * qty)).toFixed(2);
                orderbooks[symbol].bids.push({
                    price: bid_price,
                    quantity: qty,
                    orderId: getRandomOrderId(),
                    filled: 0,
                    side: "Bid",
                    userId: userId,
                    ts: getRandomTimeToday().toISOString(),
                    orderType: 'Limit',
                    symbol: symbol,
                    status: 'NEW'
                })
            }

            const ask_price = roundTwoDecimal(Number(orderbooks[symbol].currentPrice) + (Math.random() < 0.3 ? ((1 + Math.floor(Math.random() * 5)) * 0.06) : ((1 + Math.floor(Math.random() * 12)) * 0.1)))
            var available_stock = balances[userId].stocks[symbol].reduce((_, ele) => _ + ele.quantity, 0)

            if (available_stock > 0) {
                var sell_stocks = Math.floor(Math.random() * (available_stock/2 )) + 1;
                const qty = sell_stocks;
                var ind = 0;
                while (ind < balances[userId].stocks[symbol].length && sell_stocks > 0) {
                    var val = Math.min(balances[userId].stocks[symbol][ind].quantity, sell_stocks);
                    balances[userId].stocks[symbol][ind].quantity -= val;
                    balances[userId].stocks[symbol][ind].locked += val;
                    sell_stocks -= val;
                    ind++;
                }

                orderbooks[symbol].asks.push({
                    price: ask_price,
                    quantity: qty,
                    orderId: getRandomOrderId(),
                    filled: 0,
                    side: "Ask",
                    userId: userId,
                    ts: getRandomTimeToday().toISOString(),
                    orderType: 'Limit',
                    symbol: symbol,
                    status: 'NEW'
                })
            }

            orderbooks[symbol].asks.sort((a, b) => a.price === b.price ? (new Date(a.ts).getTime() - new Date(b.ts).getTime()) : a.price - b.price)
            orderbooks[symbol].bids.sort((a, b) => a.price === b.price ? (new Date(a.ts).getTime() - new Date(b.ts).getTime()) : b.price - a.price)

            // console.log(orderbooks[symbol].asks);
            // console.log(orderbooks[symbol].bids);
        })
    })

    fs.writeFileSync('./src/trades/test.json', JSON.stringify({ orderbooks, balances }, null, 2));
}

function getRandomTimeToday() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const ms = now.getTime() - startOfDay.getTime();

    const rs = Math.floor(Math.random() * ms);
    const randomTime = new Date(startOfDay.getTime() + rs);

    return randomTime;
}




main()