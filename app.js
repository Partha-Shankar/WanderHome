if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
} 

const express = require("express"); 
const app  = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose"); 
const path = require("path"); 
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstratergy = require("passport-local");
const User = require("./models/user.js");

const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

const listingsRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
// const { deserialize } = require("v8");

const port = 8080;
// const Mongo_URL = 'mongodb://127.0.0.1:27017/wanderLust';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


async function main(){
    await mongoose.connect(process.env.ATLAS_URL, {
    serverSelectionTimeoutMS: 5000,
});
};
main().then(res => console.log("Server is connected to Mongodb Database"))
    .catch(err => console.log(err));

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_URL,
  crypto: {
    secret: process.env.MONGO_SECRET_KEY,
  },
  touchAfter: 24 * 3600 // 24 hours
});
store.on("error", (e) => {
    console.log("Error in Mongo sessin store",e);
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 
  }
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings",listingsRoutes);
app.use("/listings/:id/reviews",reviewRoutes);
app.use("/",userRoutes);

// app.get("/", wrapAsync(async (req, res) => {
//     res.render("listings/home.ejs");
// }));

app.use((req,res,next) => {
    next(new expressError(404,"This Page is Not found in Server"));
});
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something Went Wrong,We are Checking Constantly to remove this error"} = err;
    res.status(statusCode).render("listings/error.ejs" ,{ message , statusCode });
});

app.listen(port, () => {
    console.log(`Server is listening to port: ${8080}`);
});



// //testing Route
// app.get("/testlisting", async(req, res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "Buy this Property",
//         // image : "https://images.unsplash.com/photo-1657282122933-4c592bdf143b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price : 100000000, //10 crores,
//         location : "Goa",
//         country : 'India',
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successfull testing");
// });