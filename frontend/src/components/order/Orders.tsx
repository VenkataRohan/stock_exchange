import { useEffect, useState } from "react"
import { cancelOrder, getOrders } from "../../utils/httpClient"
import { OrderCard } from "./OrderCard"
import { WS_TRADE, order } from "../../types"
import { SingnalManager } from "../../utils/SingnalManager"

export const Orders = ({ accessToken }: { accessToken: string }) => {
    const [data, setData] = useState<order[]>([])
    const wsCallBack = (tradeUpdates: any) => {
        setData((prev: order[]) => {
            const orderExists = prev.some((order) => order.orderId === tradeUpdates.i);
            if (!orderExists) {
                return prev
            }
            
            return prev.map((order: order) => {
                if (order.orderId === tradeUpdates.i) {
                    return { ...order, status: tradeUpdates.st }
                }
                return order;
            })
        })
    }
    useEffect(() => {
        getOrders(accessToken).then(res => {
            console.log(res);

            const symbols = res.data.map((ele: order) => `${WS_TRADE}@${ele.symbol}`);
            if (symbols.length != 0) {
                const msg = {
                    "method": "SUBSCRIBE",
                    "params": symbols,
                }
                SingnalManager.getInstance().sendMessages(msg);
                symbols.forEach((sym: string[]) => {
                    console.log(`${WS_TRADE}@${sym}`);

                    SingnalManager.getInstance().registerCallback(`${sym}`, wsCallBack, `${WS_TRADE}-${sym}-orderstatus`)
                })
            }

            setData(res.data)
        })

        return () => {
            const symbols = data.map((ele: order) => `${WS_TRADE}@${ele.symbol}`);
            if (symbols.length != 0) {
                const msg = {
                    "method": "UNSUBSCRIBE",
                    "params": symbols,
                }

                symbols.forEach((sym: any) => {
                    SingnalManager.getInstance().deregisterCallback(`${sym}`, `${WS_TRADE}-${sym}-orderstatus`);
                })
                SingnalManager.getInstance().sendMessages(msg);
            }
        }
    }, [])

    const onSubmit = (id: string, symbol: string) => {
        cancelOrder({ orderId: id, symbol: symbol }, accessToken).then((res) => {
            console.log(res);
            getOrders(accessToken).then(res => setData(res.data))
        })
    }

    return (
        <div className="bg-black">
            <div className="flex flex-col items-center text-4xl">
                Orders
            </div>
            <div className="grid grid-cols-5 gap-12 mt-10 px-5">
                {data.map((order: order) => <OrderCard symbol={order.symbol} side={order.side} price={order.price} quantity={order.quantity} status={order['status'] as string} onCancel={() => onSubmit(order.orderId as string, order.symbol)} />)}
            </div>
        </div>
    )
}