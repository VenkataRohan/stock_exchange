import { useEffect, useState } from 'react';
import {  Link , useLocation } from 'react-router-dom';


export const Navbar = ({accessToken} : {accessToken : string}) => {
    const location = useLocation();

    const currentPath = location.pathname;
    const pathSegment = currentPath.split('/')[1] || 'markets';

    return (

        <div className="flex flex-row justify-between h-24 bg-stone-900">
            <div className="flex flex-row">
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'markets' ? 'ring-4 ring-grey-200 outline-none': ''} hover:opacity-70 hover:shadow-md hover:shadow-stone-50 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out `}  to="/markets">MARKETS</Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'market' ? 'ring-4 ring-grey-200 outline-none': ''} hover:opacity-70 hover:shadow-md hover:shadow-stone-50 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out `} to="/market/AERONOX">TRADE</Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                { accessToken !== '' && <Link className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'get_order' ? 'ring-4 ring-grey-200 outline-none': ''} hover:opacity-70 hover:shadow-md hover:shadow-stone-50 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out `}  to="/get_order">GET ORDERS</Link>}
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                { accessToken !== '' && <Link className={`text-center text-lg font-semibold rounded-lg ${pathSegment === 'balance' ? 'ring-4 ring-grey-200 outline-none': ''} hover:opacity-70 hover:shadow-md hover:shadow-stone-50 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-white h-16 text-md p-4 transition-all duration-200 ease-in-out `}  to="/balance">BALANCE</Link>}
            </div>
            </div>
            { accessToken === '' && <div className="flex flex-row">
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className="text-center text-lg font-semibold rounded-lg bg-lime-900 focus:ring-4 focus:ring-grey-200 focus:outline-none hover:opacity-70 hover:shadow-md hover:shadow-grey-500 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-green-500 h-10 text-md p-4 transition-all duration-200 ease-in-out" to="/login">LOGIN</Link>
            </div>
            <div className="mx-4 flex flex-row items-center justify-center">
                <Link className="text-center text-lg font-semibold rounded-lg bg-blue-700 focus:ring-4 focus:ring-grey-200 focus:outline-none hover:opacity-70 hover:shadow-md hover:shadow-grey-500 disabled:opacity-80 disabled:hover:opacity-80 flex flex-col justify-center bg-transparent text-blue-300 h-10 text-md p-4 transition-all duration-200 ease-in-out" to="/signup">SIGNUP</Link>
            </div>
            </div>}
        </div>



    )
}