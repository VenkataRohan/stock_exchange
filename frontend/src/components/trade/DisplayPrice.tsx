import { useEffect, useState } from "react"
import { getStockStats } from "../../utils/httpClient";
import { CurrentPrice } from "./orderBook/CurrentPrice";
import { SingnalManager } from "../../utils/SingnalManager";
import { WS_TICKER, stockStats } from "../../types";

export const DisplayPrice = ({ symbol }: { symbol: string }) => {

    const [data, setData] = useState<stockStats>();

    const wsCallBack = (ws_data: any) => {
        if (data) {
            setData(prev => {
                const val = { ...prev }
                val.closing_price = ws_data.p;
                val.high_price = Math.max(Number(val.high_price), Number(ws_data.p)).toFixed(2);
                val.low_price = Math.min(Number(val.low_price), Number(ws_data.p)).toFixed(2);
                return val as stockStats;
            })

        }
    }

    useEffect(() => {
        SingnalManager.getInstance().registerCallback(`${WS_TICKER}@${symbol}`, wsCallBack, `${WS_TICKER}-${symbol}-DisplayPrice`);
        getStockStats(symbol).then(res => {
            setData(res[0])
        })

        return () => {
            SingnalManager.getInstance().deregisterCallback(`${WS_TICKER}@${symbol}`, `${WS_TICKER}-${symbol}-DisplayPrice`);
        }
    }, [])

    const getChange = () => {
        if (data) {
            const diff = Number(data.closing_price) - Number(data.opening_price)
            return (diff > 0 ? '+' : '') + diff.toFixed(2)
        }

        return '0.00'
    }

    return (
        <div className=" border-y border-solid">
            <div className="flex flex-row justify-start gap-10 mx-4">
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-lg text-zinc-400">Symbol</div>
                    <p className="font-semibold text-left text-lg ">{symbol}</p>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-lg text-zinc-400"> Current Price </div>
                    <p className="font-semibold text-left text-lg "><CurrentPrice symbol={symbol} /></p>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-lg text-zinc-400">24H Change</div>
                    <p className={`font-semibold text-left text-lg ${getChange() != '0.00' ? Number(getChange()) > 0 ? 'text-green-500' : 'text-pink-500' : ''} `}>{getChange()}</p>
                </div>

                <div className="flex flex-col justify-center">
                    <div className="font-normal text-lg text-zinc-400">24H High</div>
                    <p className="font-semibold text-left text-lg ">{data && data.high_price ? data.high_price : '0.00'}</p>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="font-normal text-lg text-zinc-400">24H Low</p>
                    <p className="font-semibold text-left text-lg ">{data && data.low_price ? data.low_price : '0.00'}</p>
                </div>
                {/* <div className="flex flex-col justify-center">
                    <p className="font-semibold text-lg">24H Volume</p>
                    <p className="font-semibold text-left text-lg ">{data && data.volume ? data.volume : '0'}</p>
                </div> */}
            </div>
        </div>
    )
}