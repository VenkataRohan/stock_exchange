import { useEffect, useState } from "react"
import { getDepth } from "../../utils/httpClient"
import { Asks } from "./Asks";
import { Bids } from "./Bids";
import { SingnalManager } from "../../utils/SingnalManager";
import { priceLowerBoundAsc,priceLowerBoundDsc,  } from "../../utils";

export const OrderBook = ({symbol}: {symbol :string})=>{
    const [bids,setBids] = useState([]);
    const [asks,setAsks] = useState([]);
    const wsCallBack = (data : any)=>{
        console.log(data);
        console.log('form ws callback');
        
        setAsks((prev)=>{
            const asks = [...prev];
            data.a.forEach((ele : any)=>{
                const ind = priceLowerBoundAsc(ele[0],asks)
                console.log(ind);
                if(asks[ind] && asks[ind][0] === ele[0]){
                    //@ts-ignore 
                    asks[ind][1] = ele[1];
                    if(ele[1] == 0){
                        asks.splice(ind,1);
                    }
                }else{
                    //@ts-ignore   
                    asks.splice(ind, 0, ele);
                }
            })
            
            return asks
        })

        setBids((prev)=>{
            const bids = [...prev];
            data.b.forEach((ele : any)=>{
                const ind = priceLowerBoundDsc(ele[0],bids)
                if(bids[ind] && bids[ind][0] === ele[0]){
                    //@ts-ignore 
                    bids[ind][1] = ele[1];
                    if(ele[1] == 0){
                        bids.splice(ind,1);
                    }
                }else{    
                //@ts-ignore
                    bids.splice(ind, 0, ele);
                }
            })
            
            return bids
        })
    }
    useEffect(()=>{

        SingnalManager.getInstance().registerCallback(`depth@${symbol}`,wsCallBack)
        getDepth(symbol).then((res)=>{
            setAsks(res.data.asks);
            setBids(res.data.bids);
            console.log(res);
        });
    },[])
    return(
    <>
        <Asks asks = {asks} />
        <Bids bids = {bids}/>
    </>
    )
}