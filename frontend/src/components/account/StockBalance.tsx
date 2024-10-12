import { useState, useEffect } from "react";
import { WS_TICKER, stockBalance } from "../../types";
import { getAllStockBalance } from "../../utils/httpClient";
import { SingnalManager } from "../../utils/SingnalManager";

export const StockBalance = ({ accessToken }: { accessToken: string }) => {

    const [data, setData] = useState<stockBalance[]>([])

    const wsCallBack = (ticker_data: any) => {
        setData((prev) => {
            const val = [...prev]
            val.forEach((ele) => {
                if (ele.symbol === ticker_data.s) {
                    ele.current_price = ticker_data.p
                }
            })
            return val
        })
    }

    useEffect(() => {

        getAllStockBalance(accessToken).then((res) => {
            const symbols = res.data.map((ele: stockBalance) => `${WS_TICKER}@${ele.symbol}`)
            if (symbols.length != 0) {
                const msg = {
                    "method": "SUBSCRIBE",
                    "params": symbols,
                }
                SingnalManager.getInstance().sendMessages(msg);
                symbols.forEach((sym: string[]) => {
                    SingnalManager.getInstance().registerCallback(`${sym}`, wsCallBack, `${WS_TICKER}-${sym}-orderstatus`)
                })
            }
            setData(res.data)
        });

        return () => {
            const symbols = data.map((ele: stockBalance) => `${WS_TICKER}@${ele.symbol}`)
            if (symbols.length != 0) {
                const msg = {
                    "method": "UNSUBSCRIBE",
                    "params": symbols,
                }
                SingnalManager.getInstance().sendMessages(msg);
                symbols.forEach((sym: any) => {
                    SingnalManager.getInstance().registerCallback(`${sym}`, wsCallBack, `${WS_TICKER}-${sym}-orderstatus`)
                })
            }
        }
    }, [])

    const getPL = (avg: string, price: string) => {
        return Math.round(((Number(price) - Number(avg)) * 100)) / 100;
    }

    function percentageChange(avg: string, price: string) {
        if (avg === '0') {
            return Number(price) > 0 ? 100 : -100;
        }
        return ((Number(price) - Number(avg)) / Number(avg)) * 100;
    }

    const total_investment = (Math.round(data.reduce((sum, ele) => (sum + (Number(ele.avg_price) * Number(ele.available_quantity))), 0) * 100) / 100).toFixed(2);

    const total_pl = (Math.round(data.reduce((sum, ele) => (sum + (Number(ele.current_price) * Number(ele.available_quantity))), 0) * 100) / 100).toFixed(2);

    const diff_pl = Number(total_pl) - Number(total_investment)

    return (
     <div className="overflow-x-auto w-[90%] mt-10 p-5 bg-gray-900 rounded-lg shadow-lg">
    <table className="min-w-full border-collapse border bg-gray-800 shadow-md rounded-lg mt-5">
        <caption className="caption-top mb-2">
            <div className="flex flex-row justify-start gap-10">
                <div className="font-bold text-2xl text-gray-100">
                    <div>Total Investment</div>
                    <div className="flex flex-col items-center">{total_investment}</div>
                </div>
                <div className="font-bold text-2xl text-gray-100">
                    <div>Current Value</div>
                    <div className={`flex flex-col items-center `} style={{color : `${diff_pl > 0 ? "rgba(62, 201, 149, 0.9)" : "rgba(239, 83, 85, 0.9)"}`}}>{total_pl}</div>
                </div>
                <div className="font-bold text-2xl text-gray-100">
                    <div>Profit & Loss</div>
                    <div className="flex flex-row">
                        <div className={`flex flex-col items-center `} style={{color : `${diff_pl > 0 ? "rgba(62, 201, 149, 0.9)" : "rgba(239, 83, 85, 0.9)"}`}}>
                            {diff_pl.toFixed(2)}
                        </div>
                        <div className={`flex flex-col justify-end text-sm `} style={{color : `${diff_pl > 0 ? "rgba(62, 201, 149, 0.9)" : "rgba(239, 83, 85, 0.9)"}`}}>
                            ({diff_pl > 0 ? '+' : ''}{percentageChange(total_investment, total_pl).toFixed(3)}%)
                        </div>
                    </div>
                </div>
            </div>
        </caption>
        <thead>
            <tr className="bg-blue-700 border-b border-gray-700">
                <th className="text-left p-4 text-xl font-semibold text-center text-gray-100">Symbol</th>
                <th className="text-left p-4 text-xl font-semibold text-center text-gray-100">Quantity</th>
                <th className="text-left p-4 text-xl font-semibold text-center text-gray-100">P&L</th>
                <th className="text-left p-4 text-xl font-semibold text-center text-gray-100">Current Price</th>
                <th className="text-left p-4 text-xl font-semibold text-center text-gray-100">Avg Price</th>
            </tr>
        </thead>
        <tbody>
            {data && data.map((stock, index) => {
                const pl = getPL(stock.avg_price, stock.current_price);
                return (
                    <tr key={index} className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${index % 2 ? 'bg-gray-800' : 'bg-gray-900'}`}>
                        <td className="p-4 text-xl font-bold text-center text-gray-100">{stock.symbol}</td>
                        <td className="p-4 text-xl font-bold text-center text-gray-100">{stock.available_quantity}</td>
                        <td className={`p-4 text-xl font-bold text-center`} style={{color : ` ${pl > 0 ? "rgba(62, 201, 149, 0.9)" : "rgba(239, 83, 85, 0.9)"}`}}>
                            {(pl > 0 ? '+' : '')}{pl}
                            <div className="text-sm">({percentageChange(stock.avg_price, stock.current_price).toFixed(3)}%)</div>
                        </td>
                        <td className="p-4 text-xl font-bold text-center text-gray-100">{stock.current_price}</td>
                        <td className="p-4 text-xl font-bold text-center text-gray-100">{stock.avg_price}</td>
                    </tr>
                )
            })}
        </tbody>
    </table>
</div>

    );
}