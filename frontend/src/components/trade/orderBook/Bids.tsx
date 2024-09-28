export const Bids = ({ bids }: { bids: [string, string][] }) => {
    const bids_volume: any = [];
    var total_volume = 0;
    bids.forEach((bid: [string, string]) => {
        total_volume += Number(bid[1]);
        bids_volume.push([bid[0], bid[1], total_volume])
    })

    return (
        <div className="flex justify-end h-full w-full flex-col">
            {bids_volume.map((bid: [string, string, number]) => <Bid bid={bid} total_volume={total_volume} />)}
        </div>
    )
}


const Bid = ({ bid, total_volume }: { bid: [string, string, number], total_volume: number }) => {
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
                    width: `${(50 * bid[2]) / total_volume}%`,
                    background: 'rgba(12, 151, 98, 0.16)',
                    transition: 'width 0.4s ease-in-out',

                }}
            ></div>
            <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 hover:border-t hover:border-dashed">
                <p className="z-10 w-[30%] text-right text-lime-500 text-2xl font-normal tabular-nums">
                    {Number(bid[0]).toFixed(2)}
                </p>
                <p className="z-10 w-[30%] text-right text-2xl font-normal tabular-nums">
                    {bid[1]}
                </p>
                <p className="z-10 w-[40%] text-right text-2xl font-normal tabular-nums">
                    {bid[2]}
                </p>
            </div>
        </div>
    )
}