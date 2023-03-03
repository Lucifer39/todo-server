const express = require("express");
const getRoute = express.Router();

const dbo = require("../db/conn");

getRoute.route("/get/visualData").get(async function (req, res) {
  const dbConnect = dbo.getDb();

  try {
    dbConnect
      .collection("notes")
      .aggregate([
        {
          $group: {
            _id: {
              year: { $year: { $toDate: "$created_on" } },
              month: { $month: { $toDate: "$created_on" } },
              day: { $dayOfMonth: { $toDate: "$created_on" } },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $toDate: {
                    $concat: [
                      { $toString: "$_id.year" },
                      "-",
                      { $toString: "$_id.month" },
                      "-",
                      { $toString: "$_id.day" },
                    ],
                  },
                },
              },
            },
            count: { $toInt: "$count" },
          },
        },
      ])
      .toArray(function (err, result) {
        if (err) res.status(400).send("Error fetching data");
        else if (result.length == 0) res.status(204).send("No data found");
        else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    res.status(500).send("Internal Server Error!");
  }
});

getRoute.route("/get/todoList").get(async function (req, res) {
  const dbConnect = dbo.getDb();
  const filter = req.query.filter;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  try {
    var pipeline = [
      {
        $lookup: {
          from: "order",
          localField: "note_id",
          foreignField: "note_order",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $project: {
          note_id: 1,
          note_content: 1,
          created_on: 1,
          checked: 1,
          order_index: { $indexOfArray: ["$order.note_order", "$note_id"] },
        },
      },
    ];

    if (filter) {
      pipeline.push({
        $match: {
          created_on: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      });
    }

    pipeline.push({
      $sort: {
        order_index: 1,
      },
    });

    dbConnect
      .collection("notes")
      .aggregate(pipeline)
      .toArray(function (err, result) {
        if (err) res.status(400).send("Error fetching data");
        else if (result.length == 0) res.status(204).send([]);
        else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

getRoute.route("/get/order").get(async function (req, res) {
  const dbConnect = dbo.getDb();
  try {
    dbConnect
      .collection("order")
      .find({})
      .toArray(function (err, result) {
        if (err) res.status(400).send("Error fetching post!");
        else if (result.length == 0) res.status(204).send("No post found");
        else res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).send("Error fetching post!");
  }
});

module.exports = getRoute;
