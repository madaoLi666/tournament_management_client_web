export function throttle(func: Function, delay: number) {
  let timeout: any;
  return function() {
    if (!timeout) {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        func.call(this, arguments);
      }, delay)
    }
  }
}