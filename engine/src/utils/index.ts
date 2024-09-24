import { fills , order} from "../types";

export function priceUpperBoundAsc(price: number, arr: order[]) {
    var len = arr.length
    var low = 0, high = len - 1, res = len;

    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (arr[mid].price > price) {
            res = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return res;
}

export function priceUpperBoundDsc(price: number, arr: order[]) {
    var len = arr.length
    var low = 0, high = len - 1, res = len;

    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (arr[mid].price >= price) {
            low = mid + 1;
        } else {
            res = mid;
            high = mid - 1;
        }
    }

    return res;
}

export function combineArrayDepth(arr: order[]) {
    const res: any = []
    arr.forEach((ele) => {
        const [price, quantity,filled] = [ele.price, ele.quantity,ele.filled];
        if (res.length > 0 && res[res.length - 1][0] == price) {
            res[res.length - 1][1] = (Number(res[res.length - 1][1]) + Number((quantity-filled))).toString()
        } else {
            res.push([price, (quantity-filled).toString()])
        }
    })

    return res;
}

export function combineUpdatedArr(fills: fills[],arr : any) {
    const updatedarr : any = []
    var i = 0 , j = 0, n = fills.length , m = arr.length;
    while(i < n && j < m){
        if(fills[i].price < arr[j][0]){
            updatedarr.push([fills[i].price,'0']);
            i++;
        }else if(fills[i].price === arr[j][0]){
            updatedarr.push([fills[i].price,arr[j][1]])
            i++;
            j++;
        }else{
            break;
        }
    }

    while(i < n){
        updatedarr.push([fills[i].price,'0']);
        i++;
    }
    return updatedarr
}

export function roundTwoDecimal(value: number) {
    return Math.round((value) * 100) / 100;
}

export function getRandomOrderId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}