import { useEffect , useState } from "react"
import { useNavigate } from 'react-router-dom';
import { getStockStats } from "../utils/httpClient";
import {  stockStats } from "../types";

const symbols = ['AERONOX','QUICKNET','SMARTINC','SUNCO','TECHLY','EASYBUY']

export const Markets = ()=>{

    const [data, setData] = useState<stockStats[]>();
    const navigate = useNavigate();

    useEffect(() => {
       
        getStockStats(symbols.join(',')).then(res => {
            setData(res)
        })

        return () => {
       
        }
    }, [])



    return (
        <div className="flex flex-col items-center justify-center bg-black h-[90%]">
        <div className=" overflow-x-auto w-[80%]">

            <table className="min-w-full border-collapse bg-gray-800 shadow-md rounded-lg mt-5">
                <thead>
                    <tr className="bg-blue-800 border-b">
                        <th className="text-left p-4 text-xl font-semibold  text-center  text-white">Symbol</th>
                        <th className="text-left p-4 text-xl font-semibold  text-center text-white">24H Open</th>
                        <th className="text-left p-4 text-xl font-semibold  text-center text-white">24H Close</th>
                        <th className="text-left p-4 text-xl font-semibold  text-center text-white">24H High</th>
                        <th className="text-left p-4 text-xl font-semibold  text-center text-white">24H Low</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((stock, index) => {
                        return (
                            <tr key={index} onClick={()=>{ 
                                navigate(`/market/${stock.symbol}`)}} className="border-b hover:bg-gray-500 transition-colors">
                                <td className="p-4 text-xl font-bold text-center cursor-pointer   text-white">{stock.symbol}</td>
                                <td className="p-4 text-xl font-bold text-center cursor-pointer  text-white">{stock.opening_price}</td>
                                <td className="p-4 text-xl font-bold text-center cursor-pointer  text-white">{stock.closing_price}</td>
                                {/* <td className={`p-4text-xl font-bold text-center `}></td> */}
                                <td className="p-4 text-xl font-bold text-center cursor-pointer  text-white">{stock.high_price}</td>
                                <td className="p-4 text-xl font-bold text-center cursor-pointer  text-white">{stock.low_price}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        </div>
    )
}