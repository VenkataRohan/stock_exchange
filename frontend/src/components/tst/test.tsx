// import { useEffect, useRef } from 'react';
// import { createChart, CrosshairMode } from 'lightweight-charts';
// import { priceData } from '../tst/prices';
// // import { areaData } from './areaData';
// // import { volumeData } from './tst/volume';
// import '../../index.css';
// import { getTicker } from '../../utils/httpClient';

// export function TradeView({symbol}:any) {
//   const chartContainerRef = useRef<HTMLDivElement>(null);
//   const chart = useRef<any>(null); // Use a more specific type if known
//   const resizeObserver = useRef<ResizeObserver>(null);

//   useEffect(() => {
//     getTicker('TATA').then(res => {
//       if (chartContainerRef.current) {
//         console.log(chartContainerRef.current);
        
//         chart.current = createChart(chartContainerRef.current, {
//           autoSize : true,
//           width: chartContainerRef.current.clientWidth,
//           height: chartContainerRef.current.clientHeight,
//           layout: {
//             //@ts-ignore
//             background: '#253248',
//             textColor: 'rgba(255, 255, 255, 0.9)',
//           },
//           grid: {
//             vertLines: {
//               color: '#334158',
//             },
//             horzLines: {
//               color: '#334158',
//             },
//           },
//           crosshair: {
//             mode: CrosshairMode.Normal,
//           },
//           priceScale: {
//             borderColor: '#485c7b',
//           },
//           timeScale: {
//             borderColor: '#485c7b',
//           },
//         });
  
//         console.log(chart.current);
  
//         const candleSeries = chart.current.addCandlestickSeries({
//           upColor: '#4bffb5',
//           downColor: '#ff4976',
//           borderDownColor: '#ff4976',
//           borderUpColor: '#4bffb5',
//           wickDownColor: '#838ca1',
//           wickUpColor: '#838ca1',
//         });
//         console.log(res);
        
//         candleSeries.setData(res);
//       }
//     })
   
//   }, []);

//   // // Resize chart on container resizes.
//   // useEffect(() => {
//   //   if (chartContainerRef.current) {
//   //     //@ts-ignore
      
      
//   //     resizeObserver.current = new ResizeObserver((entries) => {
//   //       const { width, height } = entries[0].contentRect;
//   //       console.log(width);
//   //       console.log('outerWidth');
//   //       console.log(window.innerWidth);
//   //       chart.current.applyOptions({ width : width - 10, height });
//   //       setTimeout(() => {
//   //         chart.current.timeScale().fitContent();
//   //       }, 0);
//   //     });

//   //     resizeObserver.current.observe(chartContainerRef.current);

//   //     return () => resizeObserver.current?.disconnect();
//   //   }
//   // }, []);

//   return (
    
//     <div className='flex flex-col flex-1  w-[100%] h-[550px] border-stone-900'>
//       <div ref={chartContainerRef} style={{ flex: '1' }} />
//     </div>
//   );
// }