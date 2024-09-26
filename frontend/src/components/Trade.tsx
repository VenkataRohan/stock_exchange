import { useEffect, useState } from "react"
import { getTrade } from "../utils/httpClient"

export const Trade = ({ symbol }: any) => {

    const [trade, setTrade] = useState('');
    useEffect(() => {
        getTrade(symbol).then(res => setTrade(JSON.stringify(res)))
    }, [])

    return (
        <div>
            {trade}
        </div>
    )
}

