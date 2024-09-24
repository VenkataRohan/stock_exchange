import { useEffect, useState } from "react"
import { addBalance, getBalance } from "../utils/httpClient"

export const Account = ({ userId }: { userId: string }) => {
    const [data, setData] = useState<any>()
    const [amount, setAmount] = useState<any>()

    const onSubmit = () => {
        addBalance({userId: userId , amount : amount}).then(()=>{
            getBalance(userId).then(res => {
                setData(JSON.stringify(res))
            })
        })


    }

    useEffect(() => {
        getBalance(userId).then(res => {
            setData(JSON.stringify(res))
        })
    }, [])
    return (
        <div className="flex flex-col justify-around">

            <div>User Details</div> 
            {data}
            <br/>
            <br/>
            <div className="flex flex-row">
                <label htmlFor="qty">
                    Amount :  <input value={amount} onChange={(e) => setAmount(e.target.value)} /> 
                </label>
                <div>
                    <button className="bg-blue-500" onClick={onSubmit}>Add Funds</button>
                </div>
            </div>
        </div>
    )
}

