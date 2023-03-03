require("dotenv").config({ path: "../config.env" });

const express = require("express");
const postRoute = express.Router();

const dbo = require("../db/conn");
const gen = require("../idGenerator");

const orderId = process.env.ORDER_ID;

postRoute.route("/post/uploadNotes").post(async function (req, res) {
  const dbConnect = dbo.getDb();
  const noteId = gen.idGenerate();
  const note_content = req.body.note_content;
  const created_on = req.body.created_on;
  const checked = false;

  try {
    const noteUpload = await dbConnect
      .collection("notes")
      .insertOne({ note_id: noteId, note_content, created_on: new Date(created_on), checked });

    const noteOrder = await dbConnect
      .collection("order")
      .updateOne(
        { _id: require("mongodb").ObjectID(orderId) },
        { $push: { note_order: noteId } },
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

module.exports = postRoute;
