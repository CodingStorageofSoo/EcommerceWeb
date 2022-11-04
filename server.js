const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));

var db;

MongoClient.connect(
  "mongodb+srv://admin:qwer1234@cluster0.edo77.mongodb.net/?retryWrites=true&w=majority",
  function (error, client) {
    if (error) {
      return console.log(error);
    }

    db = client.db("todoapp");

    db.collection("post").insertOne(
      { name: "John", _id: 100, age: 20 },
      function (error, result) {
        console.log("Finished storing");
      }
    );

    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  }
);

app.get("/pet", function (request, response) {
  response.send("펫 용품 쇼핑할 수 있는 페이지입니다. ");
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", function (req, res) {
  res.send("Submission Finished");
  console.log(req.body);
  console.log(req.body.data);
  console.log(req.body.title);
  db.collection("post").insertOne(
    { title: req.body.title, date: req.body.date },
    function (error, result) {
      console.log("Finished storing");
    }
  );
});

