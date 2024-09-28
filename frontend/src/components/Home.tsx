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
    return (
        <>
            {orderStatus && <OrderStatus orderStatus={orderStatus} setOrderStatus={setOrderStatus} />}
            <div className="flex flex-row">
                <div className="w-4/5">
                    <DisplayPrice symbol="TATA" />
                    <div className="flex flex-row" >
                        <TradeView symbol="TATA" />
                        <OrderBook symbol="TATA" />
                    </div>
                </div>
                <div className="w-1/5">
                    <PlaceOrder userId={userId} setOrderStatus={setOrderStatus} />
                    </div>
            </div>

        </>
    )
}

