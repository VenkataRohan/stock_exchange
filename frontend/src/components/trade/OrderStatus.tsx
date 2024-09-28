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
      <div className="bg-gray-600 flex flex-col gap-4 items-center justify-between w-[200px] h-[200px] p-2 rounded-lg shadow-lg border border-gray-300 relative">
        <div className="p-8">
          <p className="text-white p-1 mt-2 h-3/4">{orderStatus}</p>
          <div className="flex flex-col items-center">
            <button
              className="bg-blue-500 w-[50%] p-1 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
              onClick={() => setOrderStatus()}>
              OK
            </button>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}