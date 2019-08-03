const checkPhoneNumber = new RegExp(/1[3578]\d{9}/);
const checkCN = new RegExp(/[\u4e00-\u9fa5]*/);
const checkEmail = new RegExp(/^[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)+$/);

export {
  checkPhoneNumber,
  checkCN,
  checkEmail
};
