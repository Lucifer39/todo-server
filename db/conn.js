const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../config.env" });
const connectionString = process.env.ATLAS_URI;

const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    console.log("Connecting...");
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("todos");
      console.log("successfully connected to the MongoDB");

      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
