import { useEffect, useState } from "react"
import { getDepth } from "../../../utils/httpClient"
import { Asks } from "./Asks";
import { Bids } from "./Bids";
import { SingnalManager } from "../../../utils/SingnalManager";
import { priceLowerBoundAsc, priceLowerBoundDsc, } from "../../../utils";
import { WS_DEPTH } from "../../../types";
import { CurrentPrice } from "./CurrentPrice";

export const OrderBook = ({ symbol }: { symbol: string }) => {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const wsCallBack = (data: any) => {
        setAsks((prev) => {
            const asks = [...prev];
            data.a.forEach((ele: [number, number]) => {
                const ind = priceLowerBoundAsc(Number(ele[0]), asks)
                if (asks[ind] && Number(asks[ind][0]) === ele[0]) {
                    asks[ind][1] = ele[1].toFixed();
                    if (ele[1] == 0) {
                        asks.splice(ind, 1);
                    }
                } else {
                    //@ts-ignore   
                    asks.splice(ind, 0, ele);
                }
            })
            return asks
        })

        setBids((prev) => {
            const bids = [...prev];
            data.b.forEach((ele: [number, number]) => {
                const ind = priceLowerBoundDsc(ele[0], bids)
                if (bids[ind] && Number(bids[ind][0]) === ele[0]) {
                    bids[ind][1] = ele[1].toFixed();
                    if (ele[1] == 0) {
                        bids.splice(ind, 1);
                    }
                } else {
                    //@ts-ignore
                    bids.splice(ind, 0, ele);
                }
            })
            return bids
        })
    }


    useEffect(() => {

        SingnalManager.getInstance().registerCallback(`${WS_DEPTH}@${symbol}`, wsCallBack, `${WS_DEPTH}-${symbol}-orderbook`)
        getDepth(symbol).then((res) => {
            setAsks(res.data.asks);
            setBids(res.data.bids);
        });

        return () => {
            SingnalManager.getInstance().deregisterCallback(`${WS_DEPTH}@${symbol}`, `${WS_DEPTH}-${symbol}-orderbook`);
        }
    }, [])
    return (
        <>
            <div className="flex flex-col h-full pr-1">
                <div className="items-center flex-row flex px-1 py-1">
                    <p className="font-medium text-right w-[30%] text-2xl">Price</p>
                    <p className="font-medium w-[30%] text-right text-2xl">Size </p>
                    <p className="font-medium w-[40%] text-right text-2xl">Total</p>
                </div>
                <div className="items-center flex-row flex px-1">
                    <Asks asks={asks} />
                </div>
                <div className="items-center flex-row flex px-1">
                    <CurrentPrice symbol={symbol} />
                </div>
                <div className="items-center flex-row flex px-1">
                    <Bids bids={bids} />
                </div>
            </div>
        </>
    )
}