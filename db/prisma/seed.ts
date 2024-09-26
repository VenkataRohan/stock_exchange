import prisma from "../src/prisma";


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

const numberOfRecordsforEachDay = () => (Math.floor(Math.random() * 2) + 3);


const main = async()=>{
    const entries = []
    const date = new Date();
    for (var ind = 0; ind < 190; ind++) {
        const num_rec = numberOfRecordsforEachDay();
        
        date.setDate(date.getDate() - 1);
        // console.log(date);
        
        for (var rec = 0; rec < num_rec; rec++) {
            const randomHour = Math.floor(Math.random() * 20);
            const randomMinute = Math.floor(Math.random() * 60);
            const randomSecond = Math.floor(Math.random() * 60);
            date.setUTCHours(0,0,0,0)            
            date.setUTCHours(randomHour, randomMinute, randomSecond);
            entries.push({
                symbol: 'TATA',
                price: getRandomPrice(800, 1100),
                time: new Date(date),
            })
        }
    }
    console.log(entries.sort((a,b)=> a.time.getTime() - b.time.getTime()));
    const stockData = await prisma.stock.createMany({
        data: entries,
    });
    return stockData;
}


main().then((res)=>{
    console.log(res);
    console.log('data seeding successful');
}).catch((e)=>{
    console.log(e);
    
})


