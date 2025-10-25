const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
const Mongo_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
    .then(res => console.log("Connected To DataBase"))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect(Mongo_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"68fcd0d0cbee3a63c1cc61ae"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();