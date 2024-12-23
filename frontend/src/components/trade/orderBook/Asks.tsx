
export const Asks = ({ asks }: { asks: [string, string][] }) => {
    const asks_volume: any = [];
    var total_volume = 0;
    asks.forEach((ask: [string, string]) => {
        total_volume += Number(ask[1]);
        if(ask[0] === '0'){
            asks_volume.push([ask[0], ask[1], 0])
        }else{
            asks_volume.push([ask[0], ask[1], total_volume])
        }
    })

    return (
        <div className="flex justify-end h-full w-full flex-col-reverse">
            {asks_volume.map((ask: [string, string, number], index : number ) => <Ask key ={index} ask={ask} total_volume={total_volume} />)}
        </div>
    )
}

const Ask = ({ ask, total_volume }: { ask: [string, string, number], total_volume: number }) => {
    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '1px',
                    bottom: '1px',
                    right: '0px',
                    width: `${(100 * ask[2]) / total_volume}%`,
                    background: 'rgba(253, 75, 78, 0.32)',
                    transition: 'width 0.4s ease-in-out',

                }}
            ></div>
             <div
                style={{
                    position: 'absolute',
                    top: '1px',
                    bottom: '1px',
                    right: '0px',
                    width: `${Number(ask[1])/20}%`,
                    background: 'rgba(255, 100, 103, 0.32)',
                    transition: 'width 0.4s ease-in-out',

                }}
            ></div>
            <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 hover:border-t hover:border-dashed">
                <p className="z-10 w-[30%] text-right text-2xl  font-normal tabular-nums"
                style={{ color: 'rgba(239, 83, 85, 0.9)' }}>
                
                    {Number(ask[0]).toFixed(2)}
                </p>
                <p className="z-10 w-[30%] text-right text-2xl font-normal tabular-nums">
                    {ask[1]}
                </p>
                <p className="z-10 w-[40%] text-right text-2xl font-normal tabular-nums">
                    {ask[2]}
                </p>
            </div>
        </div>
    )
}