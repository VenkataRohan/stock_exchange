export const Asks = ({asks}: any)=>{
    
    return(
        <div>
            {asks.map((ask : any)=> <Ask ask = {ask}/>)}
        </div>
    )
}


const Ask = ({ask} : any)=>{    
    return(
        <div>
            {ask[0]} : { ask[1]}
        </div>
    )
}