import { useEffect, useState, useRef } from "react"
import { getDepth } from "../../../utils/httpClient"
import { Asks } from "./Asks";
import { Bids } from "./Bids";
import { SingnalManager } from "../../../utils/SingnalManager";
import { priceLowerBoundAsc, priceLowerBoundDsc, } from "../../../utils";
import { WS_DEPTH } from "../../../types";
import { CurrentPrice } from "./CurrentPrice";

export const OrderBook = ({ symbol }: { symbol: string }) => {
    const [bids, setBids] = useState<[string, string][]>(Array(10).fill(['0', '0']));
    const [asks, setAsks] = useState<[string, string][]>(Array(10).fill(['0', '0']));
    const askRef = useRef(null);
    const wsCallBack = (data: any) => {
        setAsks((prev) => {
            const asks = [...prev];
            data.a.forEach((ele: [number, number]) => {
                const ind = priceLowerBoundAsc(Number(ele[0]), asks)
                if (asks[ind] && Number(asks[ind][0]) === ele[0]) {
                    asks[ind][1] = ele[1].toFixed();
                } else {
                    asks.splice(ind, 0, [ele[0].toString(), ele[1].toString()]);
                }
            })
            const resAsk = asks.filter((e) => e[1] !== '0')//.slice(0,10) 
            return resAsk.length < 10 ? [...resAsk, ...Array(10 - resAsk.length).fill(['0', '0'])] : resAsk;
        })

        setBids((prev) => {
            const bids = [...prev];
            data.b.forEach((ele: [number, number]) => {
                const ind = priceLowerBoundDsc(ele[0], bids)
                if (bids[ind] && Number(bids[ind][0]) === ele[0]) {
                    bids[ind][1] = ele[1].toFixed();
                } else {
                    bids.splice(ind, 0, [ele[0].toString(), ele[1].toString()]);
                }
            })
            const resBids = bids.filter((e) => e[1] !== '0')//.slice(0,10); 
            return resBids.length < 10 ? [...resBids, ...Array(10 - resBids.length).fill(['0', '0'])] : resBids;

        })
    }

    useEffect(() => {
        // Scroll to the bottom whenever the 'asks' data changes
        if (askRef.current) {
            //@ts-ignore
            askRef.current.scrollTop = askRef.current.scrollHeight;
        }
    }, [asks]); 
    useEffect(() => {

        SingnalManager.getInstance().registerCallback(`${WS_DEPTH}@${symbol}`, wsCallBack, `${WS_DEPTH}-${symbol}-orderbook`)
        getDepth(symbol).then((res) => {
            const resAsks = res.data.asks//.slice(0,10);
            const resBids = res.data.bids//.slice(0,10);

            setAsks(resAsks.length < 10 ? [...resAsks, ...Array(10 - resAsks.length).fill(['0', '0'])] : resAsks);
            setBids(resBids.length < 10 ? [...resBids, ...Array(10 - resBids.length).fill(['0', '0'])] : resBids);
        });

        return () => {
            SingnalManager.getInstance().deregisterCallback(`${WS_DEPTH}@${symbol}`, `${WS_DEPTH}-${symbol}-orderbook`);
        }
    }, [])
    return (
        <>
            <div className="flex flex-col h-full pr-1 ">
                <div className="items-center flex-row flex px-1 py-1">
                    <p className="font-medium text-right w-[30%] text-2xl">Price</p>
                    <p className="font-medium w-[30%] text-right text-2xl">Size </p>
                    <p className="font-medium w-[40%] text-right text-2xl">Total</p>
                </div>
                <div className=" h-[640px]">
                    <div ref = {askRef} className="overflow-y-auto scrollbar-hide h-[310px]">
                        <div className="items-center flex-row flex px-1 ">
                            <Asks asks={asks} />
                        </div>
                    </div>
                    <div className="items-center flex-row flex px-1">
                        <CurrentPrice symbol={symbol} />
                    </div>
                    <div className="overflow-y-auto scrollbar-hide h-[310px]">
                        <div className="items-center flex-row flex px-1">
                            <Bids bids={bids} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}