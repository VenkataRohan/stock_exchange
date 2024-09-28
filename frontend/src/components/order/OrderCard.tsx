export const OrderCard = ({ symbol, price, quantity, status, side, onCancel }: {
    symbol: string, price: string, quantity: string, status: string, side: string, onCancel : any
}) => {
    return (
        <div className="w-[65%] mx-auto bg-blue-900 rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
                <h3 className="text-2xl font-semibold text-white">{symbol} ({price})</h3>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Price:</span>
                    <span className=" flex text-black text-2xl font-bold">{price}</span>
                </div>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Quantity:</span>
                    <span className="flex text-black font-bold text-2xl mt-0.5">{quantity}</span>
                </div>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Status:</span>
                    <span className={`flex font-bold text-2xl mt-0.5 ${status === 'FILLED' ? 'text-green-500' : status === 'PARTIALLY_FILLED' ? 'text-yellow-500 text-sm' : status === 'NEW' ? 'text-white' : 'text-pink-500'}`}>
                        {status}
                    </span>
                </div>

                <div className="flex justify-between mt-2 items-center">
                    <span className="text-gray-400 text-xl">Side :</span>
                    <span className={`flex font-bold text-2xl mt-0.5 ${side === 'Bid' ? 'text-green-500' : 'text-pink-500'
                        }`}>
                        {side === 'Bid' ? 'BUY' : 'SELL'}
                    </span>
                </div>
                <div className="flex flex-col items-center">
                    <button
                        className="mt-4 w-50% text-center bg-red-400 text-white font-semibold rounded-lg p-2  hover:bg-red-600 transition-all duration-200 ease-in-out"
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


