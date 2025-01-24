const CryptoJS = require("crypto-js");

function encrypt(data) {
  const encryptData = CryptoJS.AES.encrypt(
    data,
    process.env.CRYPTOKEY
  ).toString();

  return encryptData;
}

function dycrypt(encryptValue) {
  var bytes = CryptoJS.AES.decrypt(encryptValue, process.env.CRYPTOKEY);
  var originalData = bytes.toString(CryptoJS.enc.Utf8);
  return originalData;
}

module.exports = { encrypt, dycrypt };
