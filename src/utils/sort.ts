// 快速排序
export function qSort(arr: Array<any>, l: number = 0, h: number = arr.length-1, keyName?: string) {
  if(l < h) {
    let mid = partition(arr,l,h,keyName);
    qSort(arr,l,mid-1,keyName);
    qSort(arr,mid+1,h,keyName);
  }
}

function partition(arr: Array<any>, l: number, h:number, keyName:string) {
  let temp = -1;
  if(keyName === undefined || keyName === "") {
    let p = arr[l];
    while(l<h) {
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
  }else{
    let p = arr[l][keyName];
    while(l<h) {
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

// 折半查找
// 仅使用于可以进行正常大小比较的查找
// arr 是已经 ！！！升序 排序好的数组
export function hSearch(arr: Array<any>, key: string, value: number|string) {
  let len:number = arr.length - 1;
  let index:number = -1;
  let temp = -1;
  if(len !== 0) {
    for(let j:number = Math.ceil(len/2), l: number = 0, h: number= len; j > 0 && j < len && l < h; ) {
      console.log(`w---${j}`);
      if(value === arr[j][key]) {
        index = j;
        break;
      } else if(value < arr[j][key]) {
        temp = j;
        j = Math.ceil((l+h)/2) - 1;
        h = temp;
      } else if(value > arr[j][key]) {
        temp = j;
        j = Math.floor((l+h)/2) + 1;
        l = j;
      }
    }
  }
  return index;
}
