const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");

app.use("/public", express.static("public"));

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
  db.collection("counter").findOne(
    { name: "the number of posts" },
    function (error, result) {
      var totalPosts = result.totalPost;
      db.collection("post").insertOne(
        { _id: totalPosts + 1, title: req.body.title, date: req.body.date },
        function (error, result) {
          console.log("Finished storing");
          db.collection("counter").updateOne(
            { name: "the number of posts" },
            { $inc: { totalPost: 1 } },
            function (error, result) {
              if (error) {
                return console.log(error);
              }
            }
          );
        }
      );
    }
  );
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render("list.ejs", { posts: result });
    });
});

app.delete("/delete", function (req, res) {
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, function (error, result) {
    if (error) {
      return console.log(error);
    }
    console.log("Finish deleting");
    res.status(200).send({ message: "Success to delete" });
  });
});

app.get("/detail/:id", function (req, res) {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    function (error, result) {
      console.log(result);
      res.render("detail.ejs", { data: result });
    }
  );
});
