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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900">
    <div className="w-4/5 overflow-x-auto">
        <table className="min-w-full border-collapse rounded-xl mt-6 bg-gray-800 shadow-lg border border-gray-700">
            <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <th className="p-6 text-xl font-semibold text-center border border-gray-700 rounded-tl-xl">Symbol</th>
                    <th className="p-6 text-xl font-semibold text-center border border-gray-700">24H Open</th>
                    <th className="p-6 text-xl font-semibold text-center border border-gray-700">24H Close</th>
                    <th className="p-6 text-xl font-semibold text-center border border-gray-700">24H High</th>
                    <th className="p-6 text-xl font-semibold text-center border border-gray-700 rounded-tr-xl">24H Low</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((stock, index) => (
                    <tr
                        key={index}
                        onClick={() => navigate(`/market/${stock.symbol}`)}
                        className="border border-gray-700 transition-all cursor-pointer hover:bg-gray-600 hover:scale-105 hover:shadow-xl rounded-xl"
                    >
                        <td className="p-6 text-xl font-bold text-center text-blue-300 border border-gray-700">{stock.symbol}</td>
                        <td className="p-6 text-xl font-bold text-center text-blue-300 border border-gray-700">{stock.opening_price}</td>
                        <td className="p-6 text-xl font-bold text-center text-blue-300 border border-gray-700">{stock.closing_price}</td>
                        <td className="p-6 text-xl font-bold text-center text-blue-300 border border-gray-700">{stock.high_price}</td>
                        <td className="p-6 text-xl font-bold text-center text-blue-300 border border-gray-700">{stock.low_price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

    
    )
}