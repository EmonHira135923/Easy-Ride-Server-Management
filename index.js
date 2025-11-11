const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@travel-easy.qxp6jxr.mongodb.net/?appName=Travel-Easy`;

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
    const bookingsCollection = database.collection("bookings");

    // Dynamic Vehicles
    app.get("/dynamic-vehicles", async (req, res) => {
      const cursor = vehiclecollections.find().sort({ createdAt: 1 }).limit(6);
      const allValues = await cursor.toArray();
      res.send(allValues);
    });

    // alldata
    app.get("/allvehicles", async (req, res) => {
      const cursor = vehiclecollections.find();
      const allValues = await cursor.toArray();
      res.send(allValues);
    });

    // Find One Value find in opreation
    app.get("/allvehicles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await vehiclecollections.findOne(query);
      res.send(result);
    });

    // Post Method
    app.post("/bookings", async (req, res) => {
      try {
        const bookingData = req.body;
        const result = await bookingsCollection.insertOne(bookingData);
        res.status(201).json({ success: true, booking: result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Booking failed" });
      }
    });

    // AddCar
    app.post("/allvehicles", async (req, res) => {
      try {
        const vehicleData = req.body;
        const result = await vehiclecollections.insertOne(vehicleData);
        res.status(201).json({ success: true, vehicle: result });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Failed to add vehicle" });
      }
    });

    // Delete vehicle by ID
    app.delete("/allvehicles/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await vehiclecollections.deleteOne(query);

        if (result.deletedCount > 0) {
          res.status(200).json({ success: true, message: "Vehicle deleted" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Vehicle not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete" });
      }
    });

    // Update vehicle by ID
    app.put("/allvehicles/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedVehicle = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = { $set: updatedVehicle };

        const result = await vehiclecollections.updateOne(query, updateDoc);
        res
          .status(200)
          .json({ success: true, message: "Vehicle updated", result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update" });
      }
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
