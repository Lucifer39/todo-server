require("dotenv").config({ path: "../config.env" });

const express = require("express");
const putRoute = express.Router();

const dbo = require("../db/conn");

const orderId = process.env.ORDER_ID;

putRoute.route("/put/note_order").put(async function (req, res) {
  const dbConnect = dbo.getDb();
  const note_order = req.body.note_order;

  try {
    const rec = await dbConnect
      .collection("order")
      .updateOne(
        { _id: require("mongodb").ObjectID(orderId) },
        { $set: { note_order } },
        (err, result) => {
          if (err) res.status(400).send("Error");
          else res.status(200).send("Successful");
        }
      );
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

putRoute.route("/put/updateNote").put(async function (req, res) {
  const dbConnect = dbo.getDb();

  const note_id = req.body.note_id;
  const note_content = req.body.note_content;
  const created_on = req.body.created_on;
  const checked = req.body.checked;

  try {
    dbConnect
      .collection("notes")
      .updateOne(
        { note_id },
        { $set: { note_content, created_on: new Date(created_on), checked } },
        (err, result) => {
          if (err) {
            res.status(400).send("Error");
            console.log(err);
          } else res.status(200).send("Successful");
        }
      );
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

module.exports = putRoute;
