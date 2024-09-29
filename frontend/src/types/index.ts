export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"
export const GET_DEPTH = "GET_DEPTH"
export const GET_BALANCE = "GET_BALANCE"
export const ADD_BALANCE = "ADD_BALANCE"
export const GET_ORDER = "GET_ORDER"

export const ORDER_PALACED = "ORDER_PALACED"
export const ORDER_CANCLED = "ORDER_CANCLED"
export const DEPTH = "DEPTH"
export const ERROR = "ERROR"

export const WS_TICKER = "ticker"
export const WS_DEPTH = "depth"
export const WS_TRADE = "trade"

export type order = {
    orderId?: string,
    orderType: string,
    status?: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED',
    symbol: string,
    price: string,
    quantity: string,
    side: 'Bid' | 'Ask', // Bid , Ask
    userId: string,
    filled?: number
}


export type messageFromApi = {
    type: typeof ORDER_PALACED,
    data: {
        orderType: 'Market' | 'Limit',
        orderId: string,
        userId: string
        symbol: string,
        side: 'Bid' | 'Ask',
        quantity: string,
        status: 'NEW' | 'FILLED' | 'PARTIALLY_FILLED',
        executedQuantity: string,
    }
} | {
    type: typeof ORDER_CANCLED,
    data: {
        orderType: 'Market' | 'Limit',
        orderId: string,
        userId: string
        symbol: string,
        side: 'Bid' | 'Ask',
        quantity: string,
        status: 'CANCELED'
        executedQuantity: string,
    }
} | {
    type: typeof DEPTH,
    data: {
        bids: [string, string][],
        asks: [string, string][],
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
}


export type stockStats = {
    symbol: string,
    opening_price: string,
    closing_price: string,
    high_price: string,
    low_price: string,
    volume: string,
}

export type stockBalance = {
    symbol: string,
    available_quantity: string,
    avg_price: string,
    current_price: string
}