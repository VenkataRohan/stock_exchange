import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { PlaceOrder } from './components/place_order';

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
  return (
    <>
    <h1 className="text-2xl font-bold underline">
      Hello world!
    </h1>
    <PlaceOrder/>
    {/* <MarketRow symbol="TATA" high="300" lastPrice = "200" volume = "30" priceChangePercent = "2.2"/> */}
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
