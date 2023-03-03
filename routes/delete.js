require("dotenv").config({ path: "../config.env" });

const express = require("express");
const deleteRoute = express.Router();

const dbo = require("../db/conn");

const orderId = process.env.ORDER_ID;

deleteRoute.route("/delete/deleteNote").delete(async function (req, res) {
  const dbConnect = dbo.getDb();
  const note_id = req.query.note_id;

  try {
    dbConnect
      .collection("order")
      .updateOne(
        { _id: require("mongodb").ObjectID(orderId) },
        { $pull: { note_order: note_id } },
        (err, result) => {
          if (err) res.status(400).send("Error");
          else {
            dbConnect.collection("notes").deleteOne({ note_id }, (err, result) => {
              if (err) {
                res.status(400).send("Error");
                console.log(err);
              } else res.status(200).send("Success");
            });
          }
        }
      );
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

module.exports = deleteRoute;
