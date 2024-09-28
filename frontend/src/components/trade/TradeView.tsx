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
      console.log(data);
      
      chartManagerRef.current.update(Number(data.p))
    }
  }

  useEffect(() => {
    const init = async () => {
      let klineData: any
      try {
        klineData = await getTicker('TATA')
      } catch (e) { }

      if (chartRef) {
        if (chartManagerRef.current) {
          chartManagerRef.current.destroy();
        }
        console.log(klineData)
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
      <div ref={chartRef} style={{ height: "550px", width: "100%", marginTop: 4 }}></div>
    </>
  );
}