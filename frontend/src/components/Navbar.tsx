import {  Link } from 'react-router-dom';

export const Navbar = () => {
    return (

        <div className="flex flex-row justify-start h-24">
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className="text-center text-lg font-semibold rounded-lg focus:ring-4 focus:ring-grey-200 focus:outline-none hover:opacity-70 hover:shadow-md disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out" to="/">HOME</Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className="text-center text-lg font-semibold rounded-lg focus:ring-4 focus:ring-grey-200 focus:outline-none hover:opacity-70 hover:shadow-md disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out" to="/get_order">GET ORDERS</Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className="text-center text-lg font-semibold rounded-lg focus:ring-4 focus:ring-grey-200 focus:outline-none hover:opacity-70 hover:shadow-md disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out" to="/balance">BALANCE</Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className="text-center text-lg font-semibold rounded-lg focus:ring-4 focus:ring-grey-200 focus:outline-none hover:opacity-70 hover:shadow-md disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out" to="/trade_view">TRADEVIEW</Link>
            </div>
        </div>



    )
}