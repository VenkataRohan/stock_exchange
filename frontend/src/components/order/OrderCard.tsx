export const OrderCard = ({ symbol, price, quantity, status, side, onCancel }: {
    symbol: string, price: string, quantity: string, status: string, side: string, onCancel: any
}) => {
    return (
        <div className="w-full mx-auto  rounded-lg shadow-md overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">{symbol}</h3>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Price:</span>
                    <span className=" flex text-slate-400 text-2xl font-bold">{price}</span>
                </div>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Quantity:</span>
                    <span className="flex text-slate-400 font-bold text-2xl mt-0.5">{quantity}</span>
                </div>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Status:</span>
                    <span className={`flex font-bold text-2xl mt-0.5 ${status === 'FILLED' ? 'rgba(12, 151, 98, 0.16)' : status === 'PARTIALLY_FILLED' ? 'text-yellow-500 text-sm' : status === 'NEW' ? 'text-slate-400' : 'rgba(239, 83, 85, 0.9 text-md'}`}>
                        {status}
                    </span>
                </div>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Side :</span>
                    <span className={`flex font-bold text-2xl mt-0.5`}
                     style={{  color : `${side === 'Bid'?'rgba(62, 201, 149, 0.9)' : 'rgba(239, 83, 85, 0.9'}`}}
                    >
                        {side === 'Bid' ? 'BUY' : 'SELL'}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <button
                        className="mt-4 w-50% text-center  text-slate-400 font-semibold rounded-lg p-2  hover:scale-110 transition-all duration-200 ease-in-out"
                        style={{  backgroundColor :  'rgba(189, 63, 65, 0.9)'}}
                        onClick={onCancel}
                        disabled={status === 'Completed'}
                    >
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
};