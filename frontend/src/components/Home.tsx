import { Login } from "./Login"
import { Navbar } from "./Navbar"
import { PlaceOrder } from "./trade/PlaceOrder"
import { Trade } from "./trade/Trade"
import { TradeView } from "./trade/TradeView"
import { OrderBook } from "./trade/orderBook/OrderBook"
import { DisplayPrice } from './trade/DisplayPrice';
import { useState } from "react"
import { OrderStatus } from "./trade/OrderStatus"
export const Home = ({ userId }: any) => {
    const [orderStatus, setOrderStatus] = useState();
    const [orderBook, setorderBook] = useState(true);
    return (
        <>
            {orderStatus && <OrderStatus orderStatus={orderStatus} setOrderStatus={setOrderStatus} />}
            <div className="flex flex-row  ">
                <div className="w-4/5 border-r border-b border-stone-500">
                    <DisplayPrice symbol="TATA" />
                    <div className="flex flex-row" >
                        <div className="w-3/4">
                            <TradeView symbol="TATA" />
                        </div>
                        <div className="w-1/4 border-l border-yellow-800">
                            <div className="flex flex-row gap-1 justify-between items-center border-b border-stone-500">
                                <button className={`font-semibold text-lime-500	 text-xl w-full focus:ring-red-500  focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center h-12 rounded-xl text-base px-4 py-1`}
                                    onClick={() => setorderBook(true)} >Book</button>
                                <button className={`font-semibold text-red-500 border-l border-stone-500 text-xl w-full  focus:ring-red-500 focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center  h-12  text-base px-4 py-1`}
                                    onClick={() => setorderBook(false)} >Trade</button>
                            </div>
                            {orderBook && <OrderBook symbol="TATA" />}
                            {!orderBook && <Trade symbol="TATA" />}
                        </div>
                    </div>
                </div>
                <div className="w-1/5">
                    <PlaceOrder userId={userId} setOrderStatus={setOrderStatus} />
                </div>
            </div>

        </>
    )
}

