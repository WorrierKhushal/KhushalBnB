require('dotenv').config();

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session =  require("express-session");
const MongoStore = require("connect-mongo");
const flash =  require("connect-flash");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User =  require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl=process.env.ATLAS_DB_URL;

main()
  .then(() => console.log("Connected To DB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: "sessions",
  touchAfter: 24 * 3600
});


store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};



// app.get("/", (req, res) => {
//   res.send("Hi, the root is starting!");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// to stores the user Related information in sessions.
// to  Unstores the Users Related Info from sessions.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) => {
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser" , async(req,res) =>{
//   let fakerUser = new User({
//     email:"student@gmail.com",
//     username:"delta-student",
//   });

//   let registeredUser =  await User.register(fakerUser , "helloworld");
//   console.log(registeredUser);

// });


// Express Routing separation of files of diffrent routes
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);



// 404
app.use((req, res) => {
  res.status(404).render("error.ejs", { message: "Page Not Found" });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  return res.status(statusCode).render("error.ejs", { message });
});



app.listen(8080, () => {
  console.log("App listening on port 8080");
});










