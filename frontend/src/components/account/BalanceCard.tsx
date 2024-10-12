import { useState } from "react"

export const BalanceCard = ({ balance, onSubmit }: any) => {

  const [price, setPrice] = useState('')

  return <div className="w-[60%] mx-auto bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-lg overflow-hidden">
  <div className="p-6">
      <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-200">FUNDS:</h3>
          <span className="flex text-white font-bold text-2xl">{balance}</span>
      </div>

      <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-col">
              <p className="text-lg font-normal text-gray-300">Amount</p>
              <div className="flex flex-col w-[95%]">
                  <input 
                      placeholder="0" 
                      value={price} 
                      onChange={(e) => /^\d*\.?\d{0,2}$/.test(e.target.value) && setPrice(e.target.value)}
                      className="h-12 rounded-lg border-2 border-gray-400 pr-3 text-right text-xl bg-gray-800 text-white placeholder-gray-500 transition focus:border-blue-400 focus:ring-0" 
                      type="text" 
                  />
              </div>
          </div>

          <div className="flex justify-center">
              <button 
                  className="font-semibold w-[50%] focus:ring-red-500 focus:outline-none hover:opacity-90 disabled:opacity-70 disabled:hover:opacity-70 text-center text-white bg-blue-600 h-12 rounded-xl text-base px-4 py-1 transition duration-200" 
                  onClick={() => onSubmit(price)}
              >
                  Add Funds
              </button>
          </div>
      </div>
  </div>
</div>

}