import { useEffect, useState } from "react"
import { cancelOrder, getOrders } from "../../utils/httpClient"
import { OrderCard } from "./OrderCard"
import { order } from "../../types"

export const Orders = ({ userId }: { userId: string }) => {
    const [data, setData] = useState<order[]>([])

    useEffect(() => {
        getOrders(userId).then(res => setData(res.data))
    }, [])

    const onSubmit = (id: string, symbol: string) => {
        cancelOrder({ orderId: id, symbol: symbol }).then((res) => {
            console.log(res);
            getOrders(userId).then(res => setData(res.data))
        })
    }

    return (
        <div>
            <div className="flex flex-col items-center text-4xl">
                Orders
            </div>
            <div className="grid grid-cols-4 gap-12 mt-2">
                {data.map((order: order) => <OrderCard symbol='TATA' side={order.side} price={order.price} quantity={order.quantity} status={order['status'] as string} onCancel={() => onSubmit(order.orderId as string, order.symbol)} />)}
            </div>
        </div>
    )
}