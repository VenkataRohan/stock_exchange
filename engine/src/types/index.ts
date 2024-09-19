export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"
export const GET_DEPTH = "GET_DEPTH"

export const ORDER_PALACED = "ORDER_PALACED"
export const ORDER_CANCLED = "ORDER_CANCLED"
export const DEPTH = "DEPTH"

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
        orderType: string,
        symbol: string,
        price: string,
        quantity: string
        side: 'Bid' | 'Ask'
        userId: string
    }
} | {
    type: typeof GET_DEPTH,
    data: {
        symbol: string
    }
}

export type messageToApi = {
    type: typeof ORDER_PALACED,
    data: {
        orderType: 'Market' | 'Limit',
        id: string,
        userId: string
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
        userId: string
        symbol: string,
        side: 'Bid' | 'Ask',
        quantity: string,
        executedQuantity: string,
    }
} | {
    type: typeof DEPTH,
    data : {
        bids : [string,string][],
        asks : [string,string][],
    }
}




export type order = {
    orderId: string,
    orderType: string,
    symbol: string,
    price: number,
    quantity: number,
    side: 'Bid' | 'Ask', // Bid , Ask
    userId: string
}

export type orderType = {
    price: number,
    quantity: number,
    orderId: string,
    filled: number,
    side: 'Ask' | 'Bid',
    userId: string
}

export type fills = order & {
    otherUserId: string,
    tradeId: string
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
                quantity_available: number,
                purchased_price: string,
                locked_quantity: number
            }
        }

    }
}

export type orderbook = {
    asks: orderType[];
    bids: orderType[];
    currentPrice: string
}