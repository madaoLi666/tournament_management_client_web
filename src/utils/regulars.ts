const checkPhoneNumber = new RegExp(/^1[35789]\d{9}$/);
const checkCN = new RegExp(/[\u4e00-\u9fa5]*/);
const checkEmail = new RegExp(/^[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+$/);
const checkIDCard = new RegExp(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/);


export {
  checkPhoneNumber,
  checkCN,
  checkEmail,
  checkIDCard
};
