import { useState } from "react"

export const BalanceCard = ({ balance, onSubmit }: any) => {

  const [price, setPrice] = useState('')

  return <div className=" w-[60%] mx-auto bg-green-900 rounded-lg shadow-md overflow-hidden">
    <div className="p-4">
      <div className="flex justify-between mt-2 items-center">
        <h3 className="text-2xl font-semibold text-grey-400">FUNDS : {balance}</h3>
        <span className=" flex text-white font-bold"></span>
      </div>

      <div className="flex flex-col mt-2 gap-3">
        <div className="flex flex-col">
          <p className="text-lg font-normal">Amount</p>
          <div className="flex flex-col">
            <input placeholder="0" value={price} onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setPrice(e.target.value)}
              className="h-12 rounded-lg border-2 border-solid pr-3 text-right text-xl  ring-0 transition focus:border-accentBlue focus:ring-0"
              type="text" />
          </div>
        </div>
        
        <div className="flex flex-col justify-center align-center items-center">
          <button className="fonts-semibold w-[50%] focus:ring-red-500 focus:outline-none hover:opacity-80 disabled:opacity-80 disabled:hover:opacity-80 text-center text-white bg-blue-500 h-12 rounded-xl text-base px-4 py-1"
            onClick={() => onSubmit(price)}>Add Funds</button>
        </div>
      </div>
    </div>
  </div>
}