export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"
export const GET_DEPTH = "GET_DEPTH"
export const GET_BALANCE = "GET_BALANCE"
export const ADD_BALANCE = "ADD_BALANCE"
export const GET_ORDER = "GET_ORDER"
export const TRADE_ADDED = "TRADE_ADDED"
export const PRICE_UPDATED = "PRICE_UPDATED"
export const GET_STOCK_BALANCE = "GET_STOCK_BALANCE"
export const GET_CURRENTPRICE = "GET_CURRENTPRICE"
export const GET_ALL_STOCK_BALANCE = "GET_ALL_STOCK_BALANCE"

export const ORDER_PALACED = "ORDER_PALACED"
export const ORDER_CANCLED = "ORDER_CANCLED"
export const DEPTH = "DEPTH"
export const ERROR = "ERROR"

export type messageFromApi = {
    type: typeof CREATE_ORDER,
    data: {
        orderId: string,
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
    type: typeof GET_STOCK_BALANCE,
    data: {
        userId: string,
        symbol: string,
    }
} | {
    type: typeof GET_ALL_STOCK_BALANCE,
    data: {
        userId: string,
        symbols: string[],
    }
} | {
    type: typeof GET_ORDER,
    data: {
        userId: string
    }
} | {
    type: typeof GET_CURRENTPRICE,
    data: {
        symbol: string,
    }
}

export type messageToApi = {
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
} | {
    type: typeof GET_STOCK_BALANCE,
    data: {
        balance: string,
        [symbol: string]: string
    }
} | {
    type: typeof GET_ALL_STOCK_BALANCE,
    data: {
        symbol: string,
        available_quantity: string,
        avg_price: string,
        current_price: string
    }[]
} | {
    type: typeof GET_CURRENTPRICE,
    data: {
        price: string,
    }
}




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

export type orderbookType = {
    [key: string]: orderbook;
}

export type userBalances = {
    [key: string]: {
        balance: {
            available: string,
            locked: string
        },
        stocks: {
            [key: string]: {
                id: string,
                quantity: number,
                locked: number,
                price: string,
                ts: string
            }[]
        }

    }
}

export type sideType = order & {
    ts: string
}

export type orderbook = {
    asks: sideType[];
    bids: sideType[];
    currentPrice: string
}



export type messageToDb = {
    type: typeof TRADE_ADDED,
    data: fills
}