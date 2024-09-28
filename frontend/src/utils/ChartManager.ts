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
          color: '#334158',
          // visible: false,
        },
        vertLines: {
          color: '#334158',
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
    this.currentBar = initialData[0]; 
    this.candleSeries.setData(initialData);
  }
  public update(updatedPrice: number) {
    console.log('updae form chart manager');
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    if(this.currentBar && this.currentBar.time === formattedDate){
      this.currentBar.close = updatedPrice;
      this.currentBar.high = Math.max(this.currentBar.high as number, updatedPrice);
      this.currentBar.low = Math.min(this.currentBar.low as number, updatedPrice);
    }else{
      this.currentBar.open = updatedPrice;
      this.currentBar.close = updatedPrice;
      this.currentBar.high = updatedPrice;
      this.currentBar.low = updatedPrice
      this.currentBar.time = formattedDate;
    }

    //@ts-ignore
    this.candleSeries.update(this.currentBar);
  }
  public destroy() {
    this.chart.remove();
  }
}
