import { useEffect, useState } from "react";
export const OrderStatus = ({ orderStatus, setOrderStatus }: any) => {

  const [progress, setProgress] = useState(100);



  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev > 0 ? prev - (10 / 4) : 0));
    }, 100);
    setTimeout(() => {
      setOrderStatus(false);
      clearInterval(interval);
    }, 4000);
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-black flex flex-col items-center justify-between w-[220px] h-[140px] p-2 rounded-2xl shadow-2xl border border-gray-500 relative">
    <div className="p-3 text-center">
      <p className="text-white text-xl font-semibold tracking-wide h-3/4">{orderStatus === 'ORDER_PLACED' ? 'Order Placed': 'Please try again'}</p>
      <div className="flex flex-col items-center mt-2">
        <button
          className="bg-gradient-to-r from-blue-400 to-blue-600 w-[40%] text-white font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-300"
          onClick={() => setOrderStatus()}>
          OK
        </button>
      </div>
    </div>
    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
</div>

  )
}