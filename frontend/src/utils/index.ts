export function priceLowerBoundAsc(price: number, arr: any) {
    var len = arr.length
    var low = 0, high = len - 1, res = len;

    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (arr[mid] >= price) {
            res = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return res;
}

export function priceLowerBoundDsc(price: number, arr: any) {
    var len = arr.length
    var low = 0, high = len - 1, res = len;
    console.log(price);
    
    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (Number(arr[mid][0]) > Number(price)) {
            low = mid + 1;
        } else {
            console.log(mid);
            
            res = mid;
            high = mid - 1;
        }
    }
    return res;
}