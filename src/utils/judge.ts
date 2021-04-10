/*
 * 判断某个value是否是空值或者其内部是否包含空值
 *
 * type - 0
 *   判断value值为基本数据类型，是否为undefined、null、或为""值
 * type - 1  输入value为obj
 *   1）传入单个key即只判断 value[key]
 *   2）传入多个key即判断多个
 *   3) 输入 1 即判断此对象中全部属性
 *   判断value对象中是否存在key值 - 即判断value.key 是否为undefined、null
 * type - 2  输入value为数组
 *   1）判断数组是否为长度是否为0
 *   2）判断数组中是否有undefined、null、或为""值
 * */

export function isIllegal(type: number, value: any, key?: string | Array<string> | 1): boolean {
  let flag: boolean = true;
  switch (type) {
    case 0:
      // 基本类型
      if (Object.prototype.toString.call(value) === '[object Array]') {
        if (value.length === 0) {
          flag = false;
          break;
        }
      }
      flag = !!value && value !== '';
      break;
    case 1:
      // 对象

      // 判断是否为一个对象
      if (Object.prototype.toString.call(value) === '[object Object]') {
        if (key !== undefined && key === 1) {
          // 判断对象下所有值
          let keyArr = Object.keys(value);
          if (keyArr.length !== 0) {
            for (let i: number = keyArr.length - 1; i >= 0; i--) {
              flag = isIllegal(0, value[keyArr[i]]);
              if (!flag) break;
            }
          } else {
            flag = false;
          }
        } else if (key !== undefined && Object.prototype.toString.call(key) === '[object Array]') {
          // 判断key数组中的键值
          for (let i: number = key.length - 1; i >= 0; i--) {
            flag = isIllegal(0, value[key[i]]);
            if (!flag) break;
          }
        } else if (
          key !== undefined &&
          !Array.isArray(key) &&
          Object.prototype.toString.call(key) === '[object String]'
        ) {
          // 判断value中的key值
          flag = isIllegal(0, value[key]);
        } else {
          flag = false;
        }
      } else {
        // 不是对象
        console.warn('expect Object');
        flag = false;
      }
      break;
    case 2:
      // 数组

      // 判断是否为数组
      if (Object.prototype.toString.call(value) === '[object Array]') {
        // 判断是否为空
        if (value.length !== 0) {
          for (let i: number = value.length - 1; i >= 0; i--) {
            flag = isIllegal(0, value[i]);
            if (!flag) break;
          }
        } else {
          console.warn("array's length is 0");
          flag = false;
        }
      } else {
        console.warn('expect Array');
        flag = false;
      }
      break;
    default:
      flag = false;
      break;
  }
  return flag;
}
