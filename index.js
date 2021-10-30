const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kkrwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
client.connect((err) => {
  const destinationCollection = client
    .db("adventura")
    .collection("destinations");
  const bookingCollection = client.db("adventura").collection("booking");
  console.log("database connected");
  // get all events

  app.get("/allDestinations", async (req, res) => {
    const result = await destinationCollection.find({}).toArray();
    res.send(result);
  });
  // perform actions on the collection object
  //   client.close();
});

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});
// app.listen(process.env.PORT || port);
