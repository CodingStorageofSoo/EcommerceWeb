# RestAPIWithMongoDB

1. This is eBay Project

1) SignIn and Signup

2) Home page

3) Used Product

4) Detail of the product

5) Chat with each other

   with Socket.io

1. Library & Tool

1)

2)

### Page Description

1. Home

localhost:8080

2. /write

3. /list

EJS

1. embed JavaScript code in a template language that is then used to generate HTML.

app.set('view engine', 'ejs');

list.ejs

### From Javascript to HTML

#### CRUD Commend

1. Get

> Request the data from a server

2. Post

> Send the data to a server

3. Delete

1) Way1. Ajax

4. Put

1) Way2. method-overide

   npm install method-override

#### 22. Types of Authentication

1. Session-based Authentication

2. JSON Web Token
   -stateless

3. Open Autentication

#### 23. Authentication by Session

1. library : passport & passport-local & express-session

2. server.js

1) app.use(middleware)

   (1) passport.initialize()

   (2) passport.session()

   (3) session({
   secret : XXXX,
   resave : true,
   saveUninitialized : false
   })

2) app.get('/get', function(req, res){
   res.render('login.ejs')
   })

3) app.post('/login',
   passport.authenticate('local', {failureRedirect : '/fail'}), function(req, res){
   res.redirect('/')
   });
   })

4) passport.use(new LocalStrategy(

   {
   usernameField: 'id',
   passwordField: 'pw',
   session: true,
   passReqToCallback: false,
   },

   function (ID, PS, done) {
   db.collection('login').findOne({ id: ID },
   function (error, result) {
   if (error) return done(error)
   if (!result) return done(null, false, { message: 'There is no ID' })
   if (PS == result.pw) {
   return done(null, result)
   } else {
   return done(null, false, { message: 'Wrong Password' })
   }

   })
   }));

4. login.ejs
