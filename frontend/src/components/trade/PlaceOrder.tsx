import { useEffect, useState } from "react"
import { SingnalManager } from "../../utils/SingnalManager";
import { getStockBalance, placeOrder } from "../../utils/httpClient";
import { order } from "../../types";

export function PlaceOrder({ userId, setOrderStatus }: any) {
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('1000.8');
  const [balance, setBalance] = useState();
  const [stock, setStock] = useState();
  const [side, setSide] = useState<'Bid' | 'Ask'>('Bid');
  useEffect(() => {
    const msg = {
      "method": "SUBSCRIBE",
      "params": [
        "depth@TATA", "ticker@TATA", "trade@TATA"
      ]
    }
    SingnalManager.getInstance().sendMessages(msg)

    getStockBalance(userId, 'TATA').then(res => {
      console.log(res);

      setBalance(res.data.balance);
      setStock(res.data['TATA'])
    })

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
      side: side,
      userId: userId
    };

    try {
      const res: any = await placeOrder(data);
      console.log(res);
      if (res.type === 'ORDER_PALACED') {
        setOrderStatus('ORDER_PLACED')
      }
      getStockBalance(userId, 'TATA').then(res => {
        console.log(res);

        setBalance(res.data.balance);
        setStock(res.data['TATA'])
      })
    } catch (error: any) {
      console.log(error.response.data.msg);
      setOrderStatus(error.response.data.msg)
    }

  }

  return <>
    <div className="flex flex-col gap-4 px-6 ">
      <div className="border-y border-solid">
        <div className="flex flex-row gap-1 justify-between items-center">
          <button className={`font-semibold text-lime-500	 text-xl w-full focus:ring-red-500 ${side === 'Bid' ? 'bg-green-900' : ''} focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center h-12 rounded-xl text-base px-4 py-1`}
            onClick={() => setSide('Bid')} >Buy</button>
          <button className={`font-semibold text-red-500  text-xl w-full ${side === 'Ask' ? 'bg-pink-900' : ''} focus:ring-red-500 focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center  h-12 rounded-xl text-base px-4 py-1`}
            onClick={() => setSide('Ask')} >Sell</button>
        </div>
      </div>
      <div className="flex flex-row gap-1 justify-between items-center">
        {side === 'Bid' && <>  <p className="text-s font-normal">Available Balance </p>
          <p className="text-2xl font-bold">{balance} </p></>}
        {side === 'Ask' && <>  <p className="text-s font-normal">Available Balance </p>
          <p className="text-2xl font-bold">{stock} </p></>}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-normal">Price</p>
        <div className="flex flex-col relative">
          <input placeholder="0" value={price} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setPrice(e.target.value)}
            className="h-14 rounded-lg border-4 border-solid py-2 pr-3 text-right text-3xl  ring-0 transition focus:border-violet-400 focus:ring-5"
            type="text" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-normal">Quatity</p>
        <div className="flex flex-col relative">
          <input placeholder="0" value={quantity} onChange={(e) => /^\d*$/.test(e.target.value) && setQuantity(e.target.value)}
            className="h-14 rounded-lg border-4 border-solid py-2 pr-3 text-right text-3xl  ring-0 transition focus:border-violet-400 focus:ring-5"
            type="text" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-normal">Order Value</p>
        <div className="flex flex-col relative">
          <input disabled placeholder="0" value={Number(quantity) * Number(price)}
            className="h-14 rounded-lg border-4 border-solid pr-3 text-right text-3xl ring-0 transition focus:border-accentBlue focus:ring-0 disabled:bg-black disabled:text-white disabled:border-gray-300"
            type="text" />
        </div>
      </div>
      <div className="flex flex-col">
        <button className="font-semibold text-xl focus:ring-red-500 focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center text-white bg-blue-500 h-12 rounded-xl text-base px-4 py-1"
          onClick={onSubmit}>{side === 'Bid' ? 'BUY' : 'SELL'}</button>
      </div>
    </div>
  </>
}