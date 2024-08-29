export const CREATE_ORDER = "CREATE_ORDER"
export const CANCEL_ORDER = "CANCEL_ORDER"

export const ORDER_PALACED = "ORDER_PALACED"
export const ORDER_CANCLED = "ORDER_CANCLED"

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
        orderType: string,
        symbol: string,
        price: string,
        quantity: string
        side: 'Bid' | 'Ask'
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
}


export type order = {
    "orderType": string,
    "symbol": string,
    "price": number,
    "quantity": number,
    "quoteQuantity": number,
    "side": 'Bid' | 'Ask', // Bid , Ask
    "clientId": String
}

export type orderType = {
    "price": number,
    "quantity": number,
    "orderId": string,
    "filled": number,
    "side": 'Ask' | 'Bid',
    "userId": string
}

export type fills = order & {
    'otherUserId': string,
    'tradeId': string
}

export type orderbookType = {
    [key: string]: {
        asks: orderType[],
        bids: orderType[]
    }
}

export type userBalances = {
    [key: string]: {
        available: string,
        locked: string
    }
}

export type orderbook = {
    asks: orderType[];
    bids: orderType[];
}