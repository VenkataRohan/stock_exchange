import { useEffect, useState } from "react"
import { getTrade } from "../../utils/httpClient"

export const Trade = ({ symbol }: any) => {

    const [trade, setTrade] = useState<any>();
    useEffect(() => {
        getTrade(symbol).then(res => {
            console.log(res);
            setTrade(res)
        })
    }, [])

    return (
        <>
            <div className="flex flex-col pr-1">
                <div className="items-center flex-row flex px-1 py-1">
                    <p className="font-medium text-right w-[30%] text-2xl">Price</p>
                    <p className="font-medium w-[30%] text-right text-2xl">Size </p>
                    <p className="font-medium w-[40%] text-right text-2xl">Total</p>
                </div>
                <div className="flex-col flex w-full overflow-y-auto scrollbar-hide h-[650px]">
                    {trade && trade.map((ele: any) =>
                        <div key={ele.id} className="flex flex-row items-center">
                            <div className={`flex justify-end text-2xl ${ele.side === 'Bid' ? 'text-green-500' : 'text-pink-500'}  w-[32%]`}>
                                {Number(ele.price).toFixed(2)}
                            </div>
                            <div className=" flex justify-end text-2xl w-[28%]">
                                {ele.filled}
                            </div>
                            <div className="flex justify-end font-mono w-[40%] px-1">
                                {new Date(ele.time).toLocaleTimeString()}
                            </div>
                        </div>
                    )}
                </div >
            </div >
        </>
    )
}

