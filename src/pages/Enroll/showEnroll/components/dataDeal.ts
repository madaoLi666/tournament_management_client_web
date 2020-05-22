// 个人数组处理
export function getArray(your_array: Array<any>): string{
  if(your_array === undefined || your_array.length === 0){return ''};
  let return_string = '';
  for(let i = 0;i < your_array.length; i++) {
    return_string += (your_array[i].name + '  ');
  }
  return return_string;
}
// 团队数组处理
export function getArray1(your_array: Array<any>): string{
  if(your_array === undefined || your_array.length === 0){return ''};
  let return_string = '';
  for(let i = 0;i < your_array.length; i++) {
    return_string += (your_array[i].athlete.name + '  ');
  }
  return return_string;
}
export function getManNumber(all_member: Array<any>): number{
  if(all_member === undefined || all_member.length === 0 ){return 0};
  all_member = all_member.filter((v:any) => (v.athlete.sex === '男'));
  return all_member.length;
}
