export const TRADE_ADDED = "TRADE_ADDED"
export const GET_TRADE = "GET_TRADE"
export const LOGIN = "LOGIN"
export const SIGNUP = "SIGNUP"
export const GET_TICKER = "GET_TICKER"
export const GET_DAILY_STOCK_STATS = "GET_DAILY_STOCK_STATS"
export const GET_DAILY_STOCKS_STATS = "GET_DAILY_STOCKS_STATS"

export type order = {
    orderId?: string,
    orderType: 'Limit' | 'Market',
    status: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED',
    symbol: string,
    price: number,
    quantity: number,
    side: 'Bid' | 'Ask', // Bid , Ask
    userId: string,
    filled: number
}


export type fills = order & {
    otherUserId: string,
    ts: Date
}

export type messageFromEngine = {
    type: typeof TRADE_ADDED,
    data: fills
}


export type messageFromApi = {
    type: typeof GET_TRADE,
    data: {
        symbol: string,
    }
} | {
    type: typeof LOGIN,
    data: {
        email: string,
        password: string
    }
} | {
    type: typeof SIGNUP,
    data: {
        name: string,
        email: string,
        password: string
    }
} | {
    type: typeof GET_TICKER,
    data: {
        symbol: string;
    }
} | {
    type: typeof GET_DAILY_STOCK_STATS,
    data: {
        symbols: string[];
    }
} | {
    type: typeof GET_DAILY_STOCK_STATS,
    data: {
        symbols: string[];
    }
}


export type ticker = {
    time: string,
    symbol: string,
    open: number,
    high: number,
    low: number,
    close: number,
}