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