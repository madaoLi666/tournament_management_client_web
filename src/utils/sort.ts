// 快速排序
export function qSort(
  arr: Array<any>,
  l: number = 0,
  h: number = arr.length - 1,
  keyName?: string,
) {
  if (l < h) {
    let mid = partition(arr, l, h, keyName);
    qSort(arr, l, mid - 1, keyName);
    qSort(arr, mid + 1, h, keyName);
  }
}

function partition(arr: Array<any>, l: number, h: number, keyName: string | undefined) {
  let temp = -1;
  if (keyName === undefined || keyName === '') {
    let p = arr[l];
    while (l < h) {
      while (l < h && arr[h] >= p) {
        h--;
      }
      temp = arr[l];
      arr[l] = arr[h];
      arr[h] = temp;
      while (l < h && arr[l] <= p) {
        l++;
      }
      temp = arr[l];
      arr[l] = arr[h];
      arr[h] = temp;
    }
    return l;
  } else {
    let p = arr[l][keyName];
    while (l < h) {
      while (l < h && arr[h][keyName] >= p) {
        h--;
      }
      temp = arr[l];
      arr[l] = arr[h];
      arr[h] = temp;
      while (l < h && arr[l][keyName] <= p) {
        l++;
      }
      temp = arr[l];
      arr[l] = arr[h];
      arr[h] = temp;
    }
    return l;
  }
}

/* 折半查找，仅适用于可以进行正常大小比较的查找
 * arr是升序的已经排序好的数组
 */
export function hSearch(arr: Array<any>, key: string, value: number | string) {
  let high: number = arr.length - 1,
    low = 0,
    mid = -1;
  if (high !== -1) {
    while (low <= high) {
      // Math.ceil() 返回大于或等于一个给定数字的最小整数
      mid = Math.ceil((low + high) / 2);
      if (arr[mid][key] === value) {
        return mid;
      } else if (value > arr[mid][key]) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }
  return undefined;
}
