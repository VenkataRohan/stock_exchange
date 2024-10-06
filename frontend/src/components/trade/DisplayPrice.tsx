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
        <div className=" border-y border-slate-200 h-16">
            <div className="flex flex-row justify-start gap-10 mx-4">
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-xl text-zinc-400">Symbol</div>
                    <div className="font-semibold text-left text-2xl ">{symbol}</div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-xl text-zinc-400"> Current Price </div>
                    <div className="font-semibold text-left text-2xl "><CurrentPrice symbol={symbol} /></div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-lx text-zinc-400">24H Change</div>
                    <div className={`font-semibold text-left text-2xl ${getChange() != '0.00' ? Number(getChange()) > 0 ? 'text-green-500' : 'text-pink-500' : ''} `}>{getChange()}</div>
                </div>

                <div className="flex flex-col justify-center">
                    <div className="font-normal text-xl text-zinc-400">24H High</div>
                    <div className="font-semibold text-left text-2xl ">{data && data.high_price ? data.high_price : '0.00'}</div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="font-normal text-xl text-zinc-400">24H Low</div>
                    <div className="font-semibold text-left text-2xl ">{data && data.low_price ? data.low_price : '0.00'}</div>
                </div>
                {/* <div className="flex flex-col justify-center">
                    <p className="font-semibold text-lg">24H Volume</p>
                    <p className="font-semibold text-left text-lg ">{data && data.volume ? data.volume : '0'}</p>
                </div> */}
            </div>
        </div>
    )
}