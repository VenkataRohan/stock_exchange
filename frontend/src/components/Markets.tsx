import { useEffect , useState} from "react"
import { getStockStats } from "../utils/httpClient";
import {  stockStats } from "../types";

export const Markets = ()=>{

    const [data, setData] = useState<stockStats[]>();


    useEffect(() => {
       
        getStockStats('TATA').then(res => {
            setData(res)
        })

        return () => {
       
        }
    }, [])

    useEffect(()=>{

    },[])

    return (
        <div className="flex flex-col items-center">
        <div className=" overflow-x-auto w-[80%] mt-10 p-5">

            <table className="min-w-full border-collapse bg-gray-500 shadow-md rounded-lg mt-5">
                <thead>
                    <tr className="bg-blue-500 border-b">
                        <th className="text-left p-4 text-xl font-semibold text-center  text-white">Symbol</th>
                        <th className="text-left p-4 text-xl font-semibold text-center text-white">24H Open</th>
                        <th className="text-left p-4 text-xl font-semibold text-center text-white">24H Close</th>
                        <th className="text-left p-4 text-xl font-semibold text-center text-white">24H High</th>
                        <th className="text-left p-4 text-xl font-semibold text-center text-white">24H Low</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((stock, index) => {
                        return (
                            <tr key={index} className="border-b hover:bg-gray-800 transition-colors">
                                <td className="p-4 text-xl font-bold text-center  text-white">{stock.symbol}</td>
                                <td className="p-4 text-xl font-bold text-center text-white">{stock.opening_price}</td>
                                <td className="p-4 text-xl font-bold text-center text-white">{stock.closing_price}</td>
                                {/* <td className={`p-4text-xl font-bold text-center `}></td> */}
                                <td className="p-4 text-xl font-bold text-center text-white">{stock.high_price}</td>
                                <td className="p-4 text-xl font-bold text-center text-white">{stock.low_price}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </div>
    )
}