import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SingnalManager } from './utils/SingnalManager';
import { Home } from './components/Home';
import { Account } from './components/Account';
import { Orders } from './components/Orders';
import { TradeView } from "./components/TradeView"

function App() {
  const [count, setCount] = useState(0)
  function MarketRow( market :any) {
    //const router = useRouter();
    console.log(market);
    
    return (
      <tr className="cursor-pointer border-t border-baseBorderLight hover:bg-white/7 w-full" >
        <td className="px-1 py-3">
          <div className="flex shrink">
            <div className="flex items-center undefined">
              <div
                className="relative flex-none overflow-hidden rounded-full border border-baseBorderMed"
                style={{ width: "40px", height: "40px" }}
              >
                <div className="relative">
                  <img
                    alt={market.symbol}
                    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s"}
                    loading="lazy"
                    width="40"
                    height="40"
                    decoding="async"
                    data-nimg="1"
                    className=""
                  />
                </div>
              </div>
              <div className="ml-4 flex flex-col">
                <p className="whitespace-nowrap text-base font-medium text-baseTextHighEmphasis">
                  {market.symbol}
                </p>
                <div className="flex items-center justify-start flex-row gap-2">
                  <p className="flex-medium text-left text-xs leading-5 text-baseTextMedEmphasis">
                    {market.symbol}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </td>
        <td className="px-1 py-3">
          <p className="text-base font-medium tabular-nums">{market.lastPrice}</p>
        </td>
        <td className="px-1 py-3">
          <p className="text-base font-medium tabular-nums">{market.high}</p>
        </td>
        <td className="px-1 py-3">
          <p className="text-base font-medium tabular-nums">{market.volume}</p>
        </td>
        <td className="px-1 py-3">
          <p className="text-base font-medium tabular-nums text-greenText">
            {Number(market.priceChangePercent)?.toFixed(3)} %
          </p>
        </td> 
      </tr>
    );
  }
  useEffect(()=>{
    SingnalManager.getInstance();

    return ()=>{
      SingnalManager.getInstance().close();
    }
  },[]);

  return (
    <Router>
    <nav className='flex flex-row justify-around'>

          <Link className="bg-blue-500" to="/">Home</Link>
          <Link  className="bg-blue-500" to="/get_order">Get Orders</Link>
          <Link className="bg-blue-500" to="/balance">Balance</Link>
          <Link className="bg-blue-500" to="/trade_view">trade_view</Link>
    </nav>

    <Routes>

      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Home/>} />
      <Route path="/get_order" element={<Orders userId='7sjkdzii9fpk9wlvimul3' />} />
      <Route path="/trade_view" element={<TradeView/>} />
      <Route path="/balance" element={<Account userId='7sjkdzii9fpk9wlvimul3'/>} />
    </Routes>
  </Router>
 
  )
}

export default App
