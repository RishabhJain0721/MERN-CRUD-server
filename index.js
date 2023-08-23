const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON in request bodies

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD;

const schemaData = new mongoose.Schema(
  {
    name: String,
    email: String,
    mobile: String,
  },
  {
    timestamps: true,
  }
);

const userModal = mongoose.model("user", schemaData);

app.get("/", async (req, res) => {
  const data = await userModal.find({});
  res.json({ success: true, data: data });
});

app.post("/add", async (req, res) => {
  console.log("Received POST request:", req.body);
  const data = new userModal(req.body);
  try {
    await data.save();
    console.log("Data saved:", data);
    res.json({ success: true, data: data });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ success: false, error: "An error occurred" });
  }
});

app.put("/update/:id", async (req, res) => {
  console.log("Received PUT request:", req.body);
  const { id, ...rest } = req.body;
  try {
    await userModal.updateOne({ _id: id }, rest);
    console.log("Data updated:", rest);
    res.json({ success: true, data: rest });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ success: false, error: "An error occurred" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  console.log("Received DELETE request:", req.params);
  try {
    await userModal.deleteOne({ _id: req.params.id });
    console.log("Data deleted:", req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ success: false, error: "An error occurred" });
  }
});

mongoose
  .connect(`mongodb+srv://rishujain0721:${PASSWORD}@cluster0.e3z8zpu.mongodb.net/MyDB`)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
  })
  .catch((err) => console.log(err));
