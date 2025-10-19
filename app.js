const express = require("express"); //require express
const app  = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose"); //require Mongoose
const Listing = require("./models/listing.js");//require listing Schema Model

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const port = 8080;//define port Number
const Mongo_URL = 'mongodb://127.0.0.1:27017/wanderLust';//define the URL of MongoDB
const path = require("path") //require path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const listingSchema = require("./schema.js");

const Review = require("./models/review.js");

//setup the connection between MongoDb and javascript
async function main(){
    await mongoose.connect(Mongo_URL);
};
main().then(res => console.log("Server is connected to Mongodb Database"))
    .catch(err => console.log(err));

const validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}


app.get("/", wrapAsync(async (req, res) => {
    res.render("listings/home.ejs");
}));

app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
}));
//new Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});
//Read or Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));
app.post("/listings",validatelisting, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
//EditRoute
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));
//update Route
app.put("/listings/:id", validatelisting, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
app.delete("/listings/:id",wrapAsync(async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Reviews
app.post("/listings/:id/reviews", async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
})

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
// })