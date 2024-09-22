export const Bids = ({bids}: any)=>{
    return(
        <div>
            {bids.map((bid : any)=> <Bid bid = {bid}/>)}
        </div>
    )
}


const Bid = ({bid} : any)=>{
    return(
        <div>
            {bid[0]}  {bid[1]}
        </div>
    )
}