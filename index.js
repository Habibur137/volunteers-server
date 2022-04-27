const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
//middleware
const varefytoken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unathorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send("Forbiden");
    }
    req.decoded = decoded;
  });

  next();
};

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
    const bookingCollection = client
      .db("volunteersServices")
      .collection("booking");

    // auth json web token generate for login user ------=======-------=======--------
    app.post("/login", (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

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
    // post booking data -------========-------========--------========---------
    app.post("/volunteersbooking", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result);
    });
    // get booking data--------=======----------==========------------=============--------
    app.get("/volunteersbooking", varefytoken, async (req, res) => {
      // const authHeader = req.headers.authorization;
      // console.log(authHeader);
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (decodedEmail === email) {
        const query = { email };
        const cursor = bookingCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } else {
        res.status(403).send("forbidden access");
      }
    });
  } finally {
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello heroku");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
