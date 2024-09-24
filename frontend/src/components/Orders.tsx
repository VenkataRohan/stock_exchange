import { useEffect, useState } from "react"

import { cancelOrder, getOrders } from "../utils/httpClient"

export const Orders = ({ userId }: { userId: string }) => {
    const [data, setData] = useState<any>(JSON.stringify({data : []}))

    useEffect(() => {
        getOrders(userId).then(res => {
            setData(JSON.stringify(res))
        })
    }, [])

    const onSubmit = (id : string)=>{
        cancelOrder({orderId : id ,symbol : 'TATA'}).then((res)=>{
            console.log(res);
            getOrders(userId).then(res => {
                setData(JSON.stringify(res))
            })
        })
    }

    return (
        <div>
        <div>Orders</div>
        {/* {data} */}
        <div className="flex flex-row justify-around">

            
            
            {JSON.parse(data).data.map((order: any)=> {
                console.log(order);
                
                return <Order order={order} onSubmit= {onSubmit}/>
            }) 
        }

        </div>
        </div>
    )
}




const Order = ({ order, onSubmit }: { order: any , onSubmit: any}) => {

    return (
        <div>
            <div>"price" : {order.price}</div>
            <div>"quantity" : {order.quantity}</div>
            <div>"id" : {order.orderId}</div>
            <div>"status" : {order.status}</div>
            <div>
                <button className="bg-red-500" onClick={()=>onSubmit(order.orderId)}>Cancel Order</button>
            </div>
        </div>
    )
}

