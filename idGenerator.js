const cryto = require("crypto");

module.exports = {
  idGenerate: () => {
    return cryto.randomBytes(12).toString("hex");
  },
};
