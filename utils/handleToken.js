const jwt = require("jsonwebtoken");
const { privateKey, publicKey } = require("../utils/keyJwt");

module.exports = {
  getToken: (headers) => {
    if (headers && headers.authorization != "") {
      if (headers.authorization) {
        const parted = headers.authorization.split(" ");
        if (parted.length === 2) {
          return parted[1];
        }
      }
    }
    return null;
  },

  generateToken: async (data, options = "") => {
    let token = await jwt.sign(data, privateKey, {
      ...options,
      algorithm: "RS256",
    });

    if (token) {
      return token;
    } else {
      return null;
    }
  },

  verifyToken: async (token, options = "") => {
    let data = await jwt.verify(token, publicKey, {
      ...options,
      algorithms: ["RS256"],
    });

    if (data) {
      return data;
    } else {
      return null;
    }
  },
};
