export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"
export const GET_DEPTH = "GET_DEPTH"
export const GET_BALANCE = "GET_BALANCE"
export const GET_ORDER = "GET_ORDER"
export const GET_TRADE = "GET_TRADE"
export const ADD_BALANCE = "ADD_BALANCE"
export const LOGIN = "LOGIN"
export const SIGNUP = "SIGNUP"
export const GET_TICKER = "GET_TICKER"
export const GET_CURRENTPRICE = "GET_CURRENTPRICE"
export const GET_STOCK_BALANCE = "GET_STOCK_BALANCE"
export const GET_DAILY_STOCK_STATS = "GET_DAILY_STOCK_STATS"
export const GET_DAILY_STOCKS_STATS = "GET_DAILY_STOCKS_STATS"


export const ORDER_PALACED = "ORDER_PALACED"
export const ORDER_CANCLED = "ORDER_CANCLED"
export const ERROR = "ERROR"

export type messageToEngine = {
    type: typeof CREATE_ORDER,
    data: {
        orderType: 'Market' | 'Limit',
        symbol: string,
        price: string,
        quantity: string
        side: 'Bid' | 'Ask'
        userId: string
    }
} | {
    type: typeof CANCEL_ORDER,
    data: {
        orderId: string,
        symbol: string,
    }
} | {
    type: typeof GET_DEPTH,
    data: {
        symbol: string
    }
} | {
    type: typeof GET_BALANCE,
    data: {
        userId: string
    }
} | {
    type: typeof ADD_BALANCE,
    data: {
        userId: string,
        amount: string,
    }
} | {
} | {
    type: typeof GET_STOCK_BALANCE,
    data: {
        userId: string,
        symbol: string,
    }
} | {
    type: typeof GET_ORDER,
    data: {
        userId: string
    }
}


export type messageFromEngine = {
    type: typeof ORDER_PALACED,
    data: {
        orderType: 'Market' | 'Limit',
        id: string,
        clientId: 0
        symbol: string,
        side: 'Bid' | 'Ask',
        quantity: string,
        executedQuantity: string,
    }
} | {
    type: typeof ORDER_CANCLED,
    data: {
        orderType: 'Market' | 'Limit',
        id: string,
        clientId: 0
        symbol: string,
        side: 'Bid' | 'Ask',
        quantity: string,
        executedQuantity: string,
    }
} | {
    type: typeof ERROR,
    data: {
        msg: string
    }
} | {
    type: typeof GET_BALANCE,
    data: any
} | {
    type: typeof ADD_BALANCE,
    data: any
} | {
    type: typeof GET_ORDER,
    data: order[]
} | {
    type: typeof GET_CURRENTPRICE,
    data: {
        symbol: string,
    }
}


export type order = {
    orderId: string,
    orderType: 'Limit' | 'Market',
    status: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED',
    symbol: string,
    price: number,
    quantity: number,
    side: 'Bid' | 'Ask', // Bid , Ask
    userId: string,
    filled: number
}


export type messageToDb = {
    type: typeof GET_TRADE,
    data: {
        symbol: string
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
        symbol: string,
    }
} | {
    type: typeof GET_DAILY_STOCK_STATS,
    data: {
        symbols: string[];
    }
} | {
    type: typeof GET_DAILY_STOCKS_STATS,
    data: {
        symbols: string[];
    }
}