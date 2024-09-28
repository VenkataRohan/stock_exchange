import { useEffect, useState } from "react"
import { getCurrentPrice } from "../../../utils/httpClient"
import { SingnalManager } from "../../../utils/SingnalManager";
import { WS_TICKER } from "../../../types";

export const CurrentPrice = ({ symbol }: { symbol: string }) => {

    const [currentPrice, setCurrentPrice] = useState<string>('');
    const [prevPrice, setPrevPrice] = useState<string>('');
    useEffect(() => {
        const wsTickerCallBack = (data: any) => {
            setPrevPrice(currentPrice);
            setCurrentPrice(data.p);
        }
        SingnalManager.getInstance().registerCallback(`${WS_TICKER}@${symbol}`, wsTickerCallBack, `${WS_TICKER}-${symbol}-orderbook`)
        getCurrentPrice(symbol).then(res => setCurrentPrice(res.data.price))

        return () => {
            SingnalManager.getInstance().deregisterCallback(`${WS_TICKER}@${symbol}`, `${WS_TICKER}-${symbol}-orderbook`)
        }
    })

    const getPriceColor = () => {
        console.log(prevPrice);

        if (prevPrice === '' || currentPrice === '') return "";
        return currentPrice > prevPrice ? "text-green-500" : "text-red-500";
    };

    return <p className={`font-medium text-right w-[30%] text-xl ${getPriceColor()}`}>{currentPrice}</p>
}