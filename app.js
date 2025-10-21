const express = require("express"); //require express
const app  = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose"); //require Mongoose
const path = require("path"); //require path

const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");

const port = 8080;//define port Number
const Mongo_URL = 'mongodb://127.0.0.1:27017/wanderLust';//define the URL of MongoDB

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.use("/listings",listings);
app.use("/listings/:id/reviews",review);

//setup the connection between MongoDb and javascript
async function main(){
    await mongoose.connect(Mongo_URL);
};
main().then(res => console.log("Server is connected to Mongodb Database"))
    .catch(err => console.log(err));

app.get("/", wrapAsync(async (req, res) => {
    res.render("listings/home.ejs");
}));

app.use((req,res,next) => {
    next(new expressError(404,"This Page is Not found in Server"));
});
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something Went Wrong,We are Checking Constantly to remove this error"} = err;
    res.status(statusCode).render("listings/error.ejs" ,{ message , statusCode });
});
//setup the server 
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