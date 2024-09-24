import { PlaceOrder } from "./PlaceOrder"
import { OrderBook } from "./orderBook/OrderBook"

export const Home = ()=>{
    
    return(
        <div className="flex flex-row justify-around">
                <PlaceOrder/>
                <OrderBook symbol="TATA"/>          
        </div>
    )
}

