import { useEffect, useState } from "react"
import { SingnalManager } from "../utils/SingnalManager";
import {  placeOrder } from "../utils/httpClient";
import { order } from "../types";

export function PlaceOrder() {
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('1000.8');
  useEffect(() => {
    const msg = {
      "method": "SUBSCRIBE",
      "params": [
        "depth@TATA", "ticker@TATA", "trade@TATA"
      ]
    }
    SingnalManager.getInstance().sendMessages(msg)

    return () => {
      const msg = {
        "method": "UNSUBSCRIBE",
        "params": [
          "depth@TATA", "ticker@TATA", "trade@TATA"
        ]
      }
      SingnalManager.getInstance().sendMessages(msg)
    }
  }, [])
  const onSubmit = async () => {
    let data: order = {
      orderType: "Limit",
      symbol: "TATA",
      price: price,
      quantity: quantity,
      side: 'Bid',
      userId: "7sjkdzii9fpk9wlvimul3"
    };
    const res = await placeOrder(data);
    console.log(res);
  }

  return <>
    <div className="flex flex-col">
      <label htmlFor="qty">
        Quatity :  <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </label>

      <label htmlFor="price">
        Price : <input value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <div>
        <button className="bg-blue-500" onClick={onSubmit}>Place Order</button>
      </div>
    </div>
  </>
}