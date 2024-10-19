import { useEffect, useState } from "react"
import { addBalance, getBalance } from "../../utils/httpClient"
import { BalanceCard } from "./BalanceCard"
import { StockBalance } from "./StockBalance"

export const Account = ({ accessToken }: { accessToken: string }) => {
    const [data, setData] = useState<any>()

    const onSubmit = (amount: string) => {
        addBalance(accessToken, amount).then(() => {
            getBalance(accessToken).then(res => setData(res))
        })
    }

    useEffect(() => {
        getBalance(accessToken).then(res => setData(res))
    }, [])

    return (
        <>
        <div className="flex flex-row justify-around h-[90%]  bg-gradient-to-br from-black via-gray-900 to-blue-900">
        <div className="flex flex-col items-center w-2/3 mt-16">
                <StockBalance accessToken={accessToken} />
            </div>
            <div className="flex flex-col justify-center w-1/3 mb-16">
                <BalanceCard balance={data && data.data && data.data.balance ? data.data.balance.available : 0} onSubmit={onSubmit} />
            </div>
            
            </div>
        </>
    )
}

