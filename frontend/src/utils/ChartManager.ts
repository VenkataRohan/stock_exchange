import {
  ColorType,
  createChart as createLightWeightChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

export class ChartManager {
  private candleSeries: ISeriesApi<"Candlestick">;
  private chart: any;
  private currentBar: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
    time : string | null
  } = {
      open: null,
      high: null,
      low: null,
      close: null,
      time : null
    };

  constructor(
    ref: any,
    initialData: any[],
    layout: { background: string; color: string }
  ) {
    const chart = createLightWeightChart(ref, {
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
      },
      grid: {
        horzLines: {
          color: '#0F1A25',
          // visible: false,
        },
        vertLines: {
          color: '#0F1A25',
          // visible: false,
        },
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: layout.background,
        },
        textColor: "white",
      },
    });
    this.chart = chart;
    this.candleSeries = chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });
    this.currentBar = initialData[initialData.length -1]; 
    console.log('this');
    console.log(this.currentBar);
    
    this.candleSeries.setData(initialData);
  }
  public update(updatedPrice: number) {
    console.log('updae form chart manager');
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    console.log(formattedDate);
    console.log(this.currentBar.time);
    //@ts-ignore

    
    //@ts-ignore
    // if(this.currentBar && (this.currentBar.time === formattedDate || `${this.currentBar.time.year}-${this.currentBar.time.month}-${'0'+this.currentBar.time.day}` === formattedDate )){
      // console.log("in side if");
      
      this.currentBar.close = updatedPrice;
      this.currentBar.high = Math.max(this.currentBar.high as number, updatedPrice);
      this.currentBar.low = Math.min(this.currentBar.low as number, updatedPrice);
      // this.currentBar.time = this.currentBar.time?.toString() as string
    // }else{
    //   console.log("in side else");
    //   // console.log(`${this.currentBar.time.year}-${this.currentBar.time.month}-${this.currentBar.time.day.toFixed(2)}`);
    //   this.currentBar.open = updatedPrice;
    //   this.currentBar.close = updatedPrice;
    //   this.currentBar.high = updatedPrice;
    //   this.currentBar.low = updatedPrice
    //   this.currentBar.time = formattedDate;
    // }

    //@ts-ignore
    this.candleSeries.update(this.currentBar);
  }
  public destroy() {
    this.chart.remove();
  }
}
