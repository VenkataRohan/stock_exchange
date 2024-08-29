import { orderType } from "../types";

export function priceUpperBoundAsc(price: number, bids: orderType[]) {
    var len = bids.length
    var low = 0, high = len - 1, res = len;

    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (bids[mid].price > price) {
            res = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return res;
}

export function priceUpperBoundDsc(price: number, bids: orderType[]) {
    var len = bids.length
    var low = 0, high = len - 1, res = len;

    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (bids[mid].price >= price) {
            low = mid + 1;
        } else {
            res = mid;
            high = mid - 1;
        }
    }

    return res;
}

export function combineArrayDepth(arr: orderType[]) {
    const res: any = []
    arr.forEach((ele) => {
        const [price, quantity] = [ele.price, ele.quantity];
        if (res.length > 0 && res[res.length - 1][0] == price) {
            res[res.length - 1][1] = (Number(res[res.length - 1][1]) + Number(quantity)).toString()
        } else {
            res.push([price, quantity.toString()])
        }
    })

    return res;
}

export function roundTwoDecimal(value: number) {
    return Math.round((value) * 100) / 100;
}