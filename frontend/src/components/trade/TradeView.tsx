import { useEffect, useRef } from "react";
import { ChartManager } from "../../utils/ChartManager";
import { getTicker } from '../../utils/httpClient';
import { SingnalManager } from "../../utils/SingnalManager";
import { WS_TICKER } from "../../types";


export function TradeView({
  symbol,
}: {
  symbol: string;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);
  
  const wsCallBack =(data : any)=>{
    if(chartManagerRef.current){
      console.log();
      
      chartManagerRef.current.update(Number(data.p))
    }
  }

  useEffect(() => {
    const init = async () => {
      let klineData: any
      try {
        klineData = await getTicker(symbol)
        klineData = klineData.map((e: any)=> ({...e , time : new Date(e.time).toLocaleDateString().split('/').reverse().join('-') }))
        klineData.sort((a :any,b : any)=> new Date(a.time).getTime() - new Date(b.time).getTime());
        
      } catch (e) { }

      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        const chartManager = new ChartManager(
          chartRef.current,
          klineData,
          {
            background: "#0e0f14",
            color: "white",
          }
        );
        //@ts-ignore
        chartManagerRef.current = chartManager;
      }
    };
    init();
  }, [symbol, chartRef]);

  useEffect(()=>{
      SingnalManager.getInstance().registerCallback(`${WS_TICKER}@${symbol}`,wsCallBack,`${WS_TICKER}-${symbol}-tradeView`)

      return ()=>{
        SingnalManager.getInstance().deregisterCallback(`${WS_TICKER}@${symbol}`,`${WS_TICKER}-${symbol}-tradeView`)
      }
  })

  return (
    <>
      <div className="h-[750px] w-full" ref={chartRef}></div>
      {/* <div className="h-[550px] w-full mt-4" ref={chartRef} style={{ height: "550px", width: "100%", marginTop: 4 }}></div> */}
    </>
  );
}