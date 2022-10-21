const fs = require("fs");

const privateKey = fs.readFileSync("./configs/key/private.pem");
const publicKey = fs.readFileSync("./configs/key/publickey.crt");

module.exports = { privateKey, publicKey };
