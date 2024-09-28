import { useEffect, useState } from "react"
import { addBalance, getBalance } from "../../utils/httpClient"
import { BalanceCard } from "./BalanceCard"

export const Account = ({ userId }: { userId: string }) => {
    const [data, setData] = useState<any>()

    const onSubmit = (amount: string) => {
        addBalance(userId, amount).then(() => {
            getBalance(userId).then(res => setData(res))
        })
    }

    useEffect(() => {
        getBalance(userId).then(res => setData(res))
    }, [])

    return (
        <div className="flex flex-col justify-around">
            <BalanceCard balance={data && data.data && data.data.balance ? data.data.balance.available : 0} onSubmit={onSubmit} />
        </div>
    )
}

