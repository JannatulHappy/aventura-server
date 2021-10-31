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
  console.log(`database connected`);
  // get all destinations

  app.get("/allDestinations", async (req, res) => {
    const result = await destinationCollection.find({}).toArray();
    res.send(result);
  });

  // get single destination

  app.get("/singleDestination/:id", (req, res) => {
    console.log(req.params.id);
    destinationCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, results) => {
        res.send(results[0]);
      });
  });
  // add booking

  app.post("/addBooking", async (req, res) => {
    const result = await bookingCollection.insertOne(req.body);
    res.send(result);
  });

  //get all my order by using email query

  app.get("/myBookings/:email", async (req, res) => {
    console.log(req.params);
    const result = await bookingCollection
      .find({
        userEmail: req.params.email,
      })
      .toArray();
    res.send(result);
  });

  // delete event

  app.delete("/deleteBooking/:id", async (req, res) => {
    const result = await bookingCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  // perform actions on the collection object
  //   client.close();
});

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});
// app.listen(process.env.PORT || port);
