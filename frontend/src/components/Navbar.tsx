import {  Link , useLocation } from 'react-router-dom';
import { Logout } from './Logout';

export const Navbar = ({accessToken , setAccessToken} : {accessToken : string, setAccessToken: any}) => {
    const location = useLocation();    
    const currentPath = location.pathname;
    const pathSegment = currentPath.split('/')[1] || 'markets';

    return (

        <div className="flex flex-row justify-between h-24 bg-gradient-to-br from-stone-800 via-stone-900 to-black">
        <div className="flex flex-row">
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link
                    className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'markets' ? 'ring-4 ring-gray-400 outline-none' : ''} hover:opacity-80 hover:shadow-md hover:shadow-stone-50 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out`}
                    to="/markets"
                >
                    MARKETS
                </Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link
                    className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'market' ? 'ring-4 ring-gray-400 outline-none' : ''} hover:opacity-80 hover:shadow-md hover:shadow-stone-50 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out`}
                    to="/market/AERONOX"
                >
                    TRADE
                </Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                {accessToken && (
                    <Link
                        className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'get_order' ? 'ring-4 ring-gray-400 outline-none' : ''} hover:opacity-80 hover:shadow-md hover:shadow-stone-50 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out`}
                        to="/get_order"
                    >
                        GET ORDERS
                    </Link>
                )}
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                {accessToken && (
                    <Link
                        className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'balance' ? 'ring-4 ring-gray-400 outline-none' : ''} hover:opacity-80 hover:shadow-md hover:shadow-stone-50 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out`}
                        to="/balance"
                    >
                        BALANCE
                    </Link>
                )}
            </div>
        </div>
    
        {/* Conditional Rendering for Login & Signup */}
        {!accessToken && (
            <div className="flex flex-row">
                <div className="mx-4 flex flex-row items-center justify-center">
                    <Link
                        className="text-center text-lg font-semibold rounded-lg bg-lime-900 focus:ring-4 focus:ring-gray-400 hover:opacity-80 hover:shadow-md hover:shadow-gray-500 flex flex-col justify-center text-green-500 h-10 text-md p-4 transition-all duration-200 ease-in-out"
                        to="/login"
                        state={{ from: location }}
                    >
                        LOGIN
                    </Link>
                </div>
                <div className="mx-4 flex flex-row items-center justify-center">
                    <Link
                        className="text-center text-lg font-semibold rounded-lg bg-blue-700 focus:ring-4 focus:ring-gray-400 hover:opacity-80 hover:shadow-md hover:shadow-gray-500 flex flex-col justify-center text-blue-300 h-10 text-md p-4 transition-all duration-200 ease-in-out"
                        to="/signup"
                    >
                        SIGNUP
                    </Link>
                </div>
            </div>
        )}
    
        {accessToken && (
            <div className="flex flex-row">
                <div className="mx-4 flex flex-row items-center justify-center">
                    <Link
                        className="text-center text-lg font-semibold rounded-lg bg-blue-700 focus:ring-4 focus:ring-gray-400 hover:opacity-80 hover:shadow-md hover:shadow-gray-500 flex flex-col justify-center text-blue-300 h-10 text-md p-4 transition-all duration-200 ease-in-out"
                        to="/login"
                    >
                        <Logout setAccessToken={setAccessToken} />
                    </Link>
                </div>
            </div>
        )}
    </div>
    



    )
}