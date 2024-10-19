export function priceLowerBoundAsc(price: number, arr: [string, string][]) {
    var len = arr.length
    var low = 0, high = len - 1, res = len;

    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (Number(arr[mid][0]) >= price) {
            res = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return res;
}

export function priceLowerBoundDsc(price: number, arr: [string, string][]) {
    var len = arr.length
    var low = 0, high = len - 1, res = len;
    while (low <= high) {
        var mid = Math.floor((high + low) / 2);
        if (Number(arr[mid][0]) > price) {
            low = mid + 1;
        } else {
            res = mid;
            high = mid - 1;
        }
    }
    return res;
}