const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vjag1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    client.connect();
    const volunteersCollection = client
      .db("volunteersServices")
      .collection("services");

    // get all data -----======-------=======-------=======-------======-------
    app.get("/volunteers", async (req, res) => {
      const query = {};
      const cursor = volunteersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single data -------========--------=========--------========----------
    app.get("/volunteers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteersCollection.findOne(query);
      res.send(result);
    });
    // post data --------=========---------=========---------========---------
    app.post("/volunteers", async (req, res) => {
      const data = req.body;
      const result = await volunteersCollection.insertOne(data);
      res.send(result);
    });
    // delete data ---------==========---------===========----------=============----------
    app.delete("/volunteers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await volunteersCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
};
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
