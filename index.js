const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Cors = require("cors");
const dotenv = require("dotenv");
const GetAllocation = require("./controllers/SITAPIs");
const GetAllocationForUAT = require("./controllers/UATAPIs")
require("events").EventEmitter.defaultMaxListeners = 15;

dotenv.config();
mongoose.set("strictQuery", true);
app.use(express.json());
app.use(
  Cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

if(process.env.NODE_ENV == 'production'){
  app.use(express.static("Client/build"))
  const path = require("path")
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Client','build','index.html'))
  })
}

// mongoose.connect(process.env.Mongo_DB_URL)
// // {
// //     dbName: "Helium_DB",
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// // })
//   .then(() => console.log("Congrulations your are connected to database..."))
//   .catch((err) => console.log(err));

app.use("/smplcnsvrftn", GetAllocation, GetAllocationForUAT);

app.listen(process.env.PORT || 4500, () => {
  console.log("You are live now....");
});
