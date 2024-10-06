import { PrismaClient, Prisma } from '@prisma/client';
import prisma from "../src/prisma";

const stocks: [string, number][] = [['AERONOX', 1000.8], ['QUICKNET', 500.12], ['SMARTINC', 825.79], ['SUNCO', 792.39], ['TECHLY', 999.81], ['EASYBUY', 672.46]];

type userBalances = {
    [key: string]: {
        balance: {
            available: string,
            locked: string
        },
        stocks: {
            [key: string]: {
                id: string,
                quantity: number,
                locked: number,
                price: string,
                ts: string
            }[]
        }
    }
}


const main = async () => {

        console.log('Generating Users and Balances ........');

       const { users, balance } = await createUsersWithBalances();

       console.log('Generating KlineData ........');

       const stockEntries : {
           symbol: string;
           price: string;
           time: Date;
       }[] = []
       stocks.forEach((e) => {
           const arr = generateKlineData(e[0] ,e[1])
           stockEntries.push(...arr);
       })

       console.log('Saving users ........');

       const stockUsers = await prisma.user.createMany({
           data: users,
       });


       console.log('Saving balance ........');

       const stockbalance = await prisma.userBalance.createMany({
           data : balance
       })

       console.log('Saving KlineData ........');

       const stockData = await prisma.stock.createMany({
           data: stockEntries,
       });

    console.log('Saving Market Maker ........');

    createMarketMakerWithBalance()
}


const getRandomDateInMonth = (monthOffset: number) => {
    const today = new Date();
    const date = new Date(today.setMonth(today.getMonth() - monthOffset));
    const day = Math.floor(Math.random() * 28) + 1;
    date.setDate(day);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    return date;
}

const getRandomPrice = (startPrice: number, endPrice: number): string => {
    if (startPrice > endPrice) return getRandomPrice(endPrice, startPrice);

    return ((Math.random() * (endPrice - startPrice) + startPrice).toFixed(2));
}

const getNextKlineData = (prev: number) => {
    return prev + (Math.random() > 0.5 ? -(Math.random() * 10) : (Math.random() * 10));
}

const numberOfRecordsforEachDay = () => (Math.floor(Math.random() * 2) + 3);

const generateKlineData = (symbol: string, currPrise: number) => {
    const entries = []
    const date = new Date();
    var prev = currPrise, cur = 0
    date.setDate(date.getDate() - 1);
    date.setUTCHours(23, 59, 59, 59)
    entries.push({
        symbol: symbol,
        price: prev.toFixed(2),
        time: new Date(date),
    })
    date.setDate(date.getDate() + 1);
    for (var ind = 0; ind < 190; ind++) {
        const num_rec = numberOfRecordsforEachDay();
        date.setDate(date.getDate() - 1);
        for (var rec = 0; rec < num_rec; rec++) {
            const randomHour = Math.floor(Math.random() * 20);
            const randomMinute = Math.floor(Math.random() * 60);
            const randomSecond = Math.floor(Math.random() * 60);
            date.setUTCHours(0, 0, 0, 0)
            date.setUTCHours(randomHour, randomMinute, randomSecond);
            cur = getNextKlineData(prev);
            entries.push({
                symbol: symbol,
                price: cur.toFixed(2),
                time: new Date(date),
            })
            prev = cur;
        }
    }
    entries.sort((a, b) => a.time.getTime() - b.time.getTime());

    return entries;
}

function getRandomOrderId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


const createUsersWithBalances = () => {
    const balances: userBalances = {}

    for (var i = 0; i < 30; i++) {
        const userId = getRandomOrderId();
        balances[userId] = {
            balance: {
                available: getRandomPrice(500000, 1000000),
                locked: "0"
            },
            stocks: {}
        }

        stocks.forEach((e) => {
            const itr = Math.floor(Math.random() * 5); balances[userId]['stocks'][e[0]] = []
            for (var j = 0; j < itr; j++) {
                balances[userId]['stocks'][e[0]].push({
                    id: getRandomOrderId(),
                    quantity: Math.floor(Math.random() * 100) + 1,
                    locked: 0,
                    price: (Number(e[1]) + (Math.random() < 0.5 ? -(Math.random() * 100) : (Math.random() * 100))).toFixed(2),
                    ts: getRandomDateInMonth(Math.floor(Math.random() * 12) + 1).toISOString()
                })
            }
            balances[userId]['stocks'][e[0]] = balances[userId]['stocks'][e[0]].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
        })
    }
    const users: Prisma.UserCreateInput[] = []
    Object.keys(balances).forEach((userId, index) => {
        users.push({
            id: userId,
            name: `test${index}`,
            email: `test${index}@gmail.com`,
            password: "$2b$10$YCuedC6iwbIzPzWDEMJiM.3HX9RxuI8iHBpnmJ.FL9uWhYplz5d8a" // 123
        })
    })

    const balance: any[] = []

    Object.keys(balances).forEach((userId: string) => {
        balance.push({
            userId: userId,
            data: balances[userId]
        })
    })

    return { users, balance };
}

const createMarketMakerWithBalance = async () => {
    const users: Prisma.UserCreateInput[] = ['MMASK1', 'MMASK2', 'MMBIDS1', 'MMBIDS2'].map((e) => ({
        id: `${e}`,
        name: `${e}`,
        email: `${e}@gmail.com`,
        password: "$2b$10$YCuedC6iwbIzPzWDEMJiM.3HX9RxuI8iHBpnmJ.FL9uWhYplz5d8a"
    }))

    const balance = ['MMASK1', 'MMASK2', 'MMBIDS1', 'MMBIDS2'].map((e) => ({
        userId: e,
        data: mmbalance
    }))

    const stockUsers = await prisma.user.createMany({
        data: users,
    });

    const stockbalance = await prisma.userBalance.createMany({
        data: balance
    })
}

const mmbalance = {
    "balance": {
        "locked": "0",
        "available": (1.23e+100).toFixed(2)
    },
    "stocks": {
        "SUNCO": [
            {
                "id": "2eonx2qjcf7h6uxls0y2aj1",
                "ts": "2024-01-01T07:46:19.678Z",
                "price": "717.00",
                "locked": 0,
                "quantity": 1.23e+50
            }
        ],
        "TECHLY": [
            {
                "id": "f447103q14eztacvfhzd1",
                "ts": "2024-01-21T16:28:21.678Z",
                "price": "1077.23",
                "locked": 0,
                "quantity": 1.23e+50
            }
        ],
        "AERONOX": [
            {
                "id": "w4iqm08aragkhwwnnqyno1",
                "ts": "2024-06-24T16:02:24.677Z",
                "price": "986.21",
                "locked": 0,
                "quantity": 1.23e+50
            }
        ],
        "EASYBUY": [
            {
                "id": "lb65td8mhfiexnpdikztea1",
                "ts": "2023-11-14T05:27:50.678Z",
                "price": "707.02",
                "locked": 0,
                "quantity": 1.23e+50
            }
        ],
        "QUICKNET": [
            {
                "id": "po9hqfy5wgoozri2uke5yl1",
                "ts": "2024-09-15T10:28:48.678Z",
                "price": "585.22",
                "locked": 0,
                "quantity": 1.23e+50
            }
        ],
        "SMARTINC": [
            {
                "id": "dz9ruyp1p1bh20rb0yxef41",
                "ts": "2023-10-24T07:40:42.678Z",
                "price": "858.06",
                "locked": 0,
                "quantity": 1.23e+50
            }
        ]
    }
}



main().then((res) => {
    console.log('data seeding successful');
}).catch((e) => {
    console.log(e);
})