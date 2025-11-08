const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://emonhossainhira231_db_user:YfXZMsmXsecVDw0X@travel-easy.qxp6jxr.mongodb.net/?appName=Travel-Easy";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // Database Create

    const database = client.db("traveldb");
    const vehiclecollections = database.collection("vehicles");

    // Get Method
    app.get("/vehicles", async (req, res) => {
      const cursor = vehiclecollections.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    });

    // Find One Value find in opreation
    app.get("/vehicles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await vehiclecollections.findOne(query);
      res.send(result);
    });

    // Delete One Value in Database
    app.delete("/vehicles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await vehiclecollections.deleteOne(query);
      res.send(result);
    });

    // Patch One value in Database
    app.patch("/vehicles/:id", async (req, res) => {
      const id = req.params.id;
      const updatedata = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: updatedata,
      };
      const option = {};
      const result = await vehiclecollections.updateOne(query, update, option);
      res.send(result);
    });

    // POST Method
    app.post("/vehicles", async (req, res) => {
      const data = req.body;
      const result = await vehiclecollections.insertOne(data);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
