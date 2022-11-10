require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;

const { ObjectId } = require("mongodb");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.use("/public", express.static("public"));

var db;

MongoClient.connect(process.env.DB_URL, function (error, client) {
  if (error) {
    return console.log(error);
  }

  db = client.db("todoapp");

  app.listen(process.env.PORT, function () {
    console.log("listening");
  });
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/write", function (req, res) {
  res.render("write.ejs");
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render("list.ejs", { posts: result });
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

app.get("/edit/:id", function (req, res) {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    function (error, result) {
      if (error) {
        return console.log(error);
      }
      res.render("edit.ejs", { post: result });
    }
  );
});

app.put("/edit", function (req, res) {
  db.collection("post").updateOne(
    { _id: parseInt(req.body.id) },
    { $set: { title: req.body.title, date: req.body.date } },
    function (error, result) {
      if (error) {
        return console.log(error);
      }
      console.log("complete!");
      res.redirect("/list");
    }
  );
});

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/mypage", Login, function (req, res) {
  console.log(req.user);
  res.render("mypage.ejs");
});

function Login(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("You do not Login");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "id",
      passwordField: "pw",
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디, 입력한비번, done) {
      //console.log(입력한아이디, 입력한비번);
      db.collection("login").findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);

          if (!결과)
            return done(null, false, { message: "존재하지않는 아이디요" });
          if (입력한비번 == 결과.pw) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: "비번틀렸어요" });
          }
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (아이디, done) {
  db.collection("login").findOne({ id: 아이디 }, function (에러, 결과) {
    done(null, 결과);
  });
});

app.post("/register", function (req, res) {
  db.collection("login").insertOne(
    { id: req.body.id, pw: req.body.pw },
    function (error, result) {
      res.redirect("/");
    }
  );
});

app.post("/add", function (req, res) {
  req.user._id;
  res.send("Submission Finished");
  db.collection("counter").findOne(
    { name: "the number of posts" },
    function (error, result) {
      var totalPosts = result.totalPost;
      var data = {
        _id: totalPosts + 1,
        title: req.body.title,
        date: req.body.date,
        writer: req.user._id,
      };
      db.collection("post").insertOne(data, function (error, result) {
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
      });
    }
  );
});

app.delete("/delete", function (req, res) {
  req.body._id = parseInt(req.body._id);

  var data = { _id: req.body._id, 작성자: req.user._id };

  db.collection("post").deleteOne(data, function (error, result) {
    if (error) {
      return console.log(error);
    }
    console.log("Finish deleting");
    res.status(200).send({ message: "Success to delete" });
  });
});

app.get("/search", (req, res) => {
  var condition = [
    {
      $search: {
        index: "titleSearch",
        text: {
          query: req.query.value,
          path: "title",
        },
      },
    },
    // For sorting the list (DESC)
    { $sort: { _id: -1 } },
  ];
  db.collection("post")
    .aggregate(condition)
    .toArray((error, result) => {
      res.render("search.ejs", { posts: result });
    });
});

app.get("/shop/shirts", function (요청, 응답) {
  응답.send("셔츠 파는 페이지입니다.");
});

app.get("/shop/pants", function (요청, 응답) {
  응답.send("바지 파는 페이지입니다.");
});

app.post("/chatroom", function (req, res) {
  var 저장할거 = {
    title: "무슨 무슨 채팅방",
    memeber: [ObjectId(req.body.당한사람), req.user._id],
    data: new Date(),
  };
  db.collection("chatroom")
    .insertOne()
    .then((result) => {});
});

app.get("/chat", function (req, res) {
  db.collection("chatroom")
    .find({ member: req.user._id })
    .toArray()
    .then((result) => {
      res.render("chat.ejs", { data: result });
    });
});

app.post('/message', 로그인했니, function(요청, 응답){
  var 저장할거 = {
    parent : 요청.body.parent,
    userid : 요청.user._id,
    content : 요청.body.content,
    date : new Date(),
  }
  db.collection('message').insertOne(저장할거)
  .then((결과)=>{
    응답.send(결과);
  })
}); 