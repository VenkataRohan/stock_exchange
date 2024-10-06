import { PlaceOrder } from "./trade/PlaceOrder"
import { Trade } from "./trade/Trade"
import { TradeView } from "./trade/TradeView"
import { OrderBook } from "./trade/orderBook/OrderBook"
import { DisplayPrice } from './trade/DisplayPrice';
import { useState } from "react"
import { OrderStatus } from "./trade/OrderStatus"
import { useParams } from 'react-router-dom';

export const MarketHome = ({ accessToken  }: {accessToken : string}) => {
    const [orderStatus, setOrderStatus] = useState();
    const [orderBook, setorderBook] = useState(true);
    const { symbol = "AERONOX" } = useParams();
    return (
        <>
            {orderStatus && <OrderStatus orderStatus={orderStatus} setOrderStatus={setOrderStatus} />}
            <div className="flex flex-row  bg-black h-[90%]">
                <div className="w-4/5 border-stone-500">
                    <DisplayPrice symbol={symbol} />
                    <div className="flex flex-row" >
                        <div className="w-3/4 border-b border-stone-500">
                            <TradeView symbol={symbol} />
                        </div>
                        <div className="w-1/4 border-l  border-b border-r border-stone-500">
                            <div className="flex flex-row gap-1 justify-between items-center border-b border-stone-500">
                                <button className={`font-semibold text-lime-500	 text-xl w-full focus:ring-red-500  focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center h-12 rounded-xl text-base px-4 py-1`}
                                    onClick={() => setorderBook(true)} >Book</button>
                                <button className={`font-semibold text-red-500 border-l border-stone-500 text-xl w-full  focus:ring-red-500 focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center  h-12  text-base px-4 py-1`}
                                    onClick={() => setorderBook(false)} >Trade</button>
                            </div>
                            {orderBook && <OrderBook symbol={symbol} />}
                            {!orderBook && <Trade symbol={symbol} />}
                        </div>
                    </div>
                </div>
                <div className="w-1/5">
                    <PlaceOrder accessToken ={accessToken} setOrderStatus={setOrderStatus} symbol={symbol}/>
                </div>
            </div>

        </>
    )
}

