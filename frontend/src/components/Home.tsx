import { Login } from "./Login"
import { PlaceOrder } from "./PlaceOrder"
import { Trade } from "./Trade"
import { OrderBook } from "./orderBook/OrderBook"

export const Home = () => {

    return (
        <div>
            <div className="flex flex-row justify-around"> 
                 <PlaceOrder />
                <OrderBook symbol="TATA" />
            </div>
        </div>
    )
}

