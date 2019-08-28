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
