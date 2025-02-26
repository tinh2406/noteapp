const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose");
const socket = require("socket.io");
const axios = require("axios");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (client) => {
  const phone = client.handshake.auth.phone;
  client.join(phone);

  client.on("disconnect", () => {
    client.leave(phone);
  });
});

const userSchema = new mongoose.Schema({
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const textSchema = new mongoose.Schema({
  text: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
const Text = mongoose.model("Text", textSchema);

app.use(bodyParser.json());
const port = process.env.NodeServer_PORT || 3000;
const pyPort = process.env.PythonServer_PORT || 5000;

app.get("/", async (req, res) => {
  const phone = req.headers.phone;
  if (!phone) {
    res.status(400).send("Phone number is required");
    return;
  }
  const users = await User.findOne({ phone });
  if (!users) {
    res.status(404).send("User not found");
    return;
  }

  let take, page;
  try {
    take = parseInt(req.query.take);
    take = take > 100 || take < 1 ? 10 : take;
    page = parseInt(req.query.page);
    page = page < 1 ? 1 : page;
  } catch (error) {
    take = 6;
    page = 1;
  }
  const [texts, count] = await Promise.all([
    Text.find({ userId: users._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * take)
      .limit(take),
    Text.countDocuments({ userId: users._id }),
  ]);
  const meta = {
    page,
    take,
    hasNextPage: count > page * take,
  };
  res.json({
    data: texts,
    meta,
  });
});

app.post("/", async (req, res) => {
  const phone = req.body.phone;
  // check phone number with regex
  if (!/^\d{10}$/.test(phone)) {
    res.status(400).send("Phone number is invalid");
    return;
  }

  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone });
    await user.save();
  }
  res.json({ message: true });
});

app.post("/save", async (req, res) => {
  const phone = req.headers.phone;

  const message = req.body.message;
  if (!phone) {
    res.status(400).send("Phone number is required");
    return;
  }
  if (!message) {
    res.status(400).send("Message is required");
    return;
  }
  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  const text = new Text({ text: message, userId: user._id, status: "pending" });
  const savedText = await text.save();
  io.to(phone).emit("new-text", savedText);

  res.send({ message: true });
});

app.delete("/:id", async (req, res) => {
  const phone = req.headers.phone;
  const id = req.params.id;
  if (!phone) {
    res.status(400).send("Phone number is required");
    return;
  }
  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  const text = await Text.findOne({ _id: id, userId: user._id });
  if (!text) {
    res.status(404).send("Text not found");
    return;
  }
  await Text.deleteOne({ _id: id });
  
  io.to(phone).emit("del-text",id);
  res.send({ message: true });
});

app.post("/translate", async (req, res) => {
  const text = req.body.text;
  const result = await axios.post(`http://127.0.0.1:${pyPort}/`, {
    text: text,
  });
  return res.json({ message: result.data });
});

app.post("/:id/complete", async (req, res) => {
  const phone = req.headers.phone;
  const id = req.params.id;
  if (!phone) {
    res.status(400).send("Phone number is required");
    return;
  }
  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  const text = await Text.findOne({ _id: id, userId: user._id });
  if (!text) {
    res.status(404).send("Text not found");
    return;
  }
  text.status = "deleted";
  await text.save();
  io.to(phone).emit("complete-text", id);
  res.send({ message: true });
});

app.post("/:id/restore", async (req, res) => {
  const phone = req.headers.phone;
  const id = req.params.id;
  if (!phone) {
    res.status(400).send("Phone number is required");
    return;
  }
  const user = await User.findOne({ phone });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  const text = await Text.findOne({ _id: id, userId: user._id });
  if (!text) {
    res.status(404).send("Text not found");
    return;
  }
  text.status = "pending";
  await text.save();
  io.to(phone).emit("restore-text", id);
  res.send({ message: true });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connect to MongoDB failed", error);
  });

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
