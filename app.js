import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import connect from "./db/index.js";
import userModel from "./models/user.model.js";
import productModel from "./models/product.model.js";
import cartModel from "./models/cart.model.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

connect();

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your React app's origin
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "publc")));

// -------------------------------------------get Route----------------------------------------------

app.get("/", (req, res) => {
  res.send("This is home route");
});

app.get("/getCurrentUser", async (req, res) => {
  // res.send('currentUserInfo')
  const token = req.cookies.token;
  if (token) {
    let data = jwt.verify(token, "secretkey");
    const userData = await userModel.findOne({ _id: data.userId });
    // console.log(userData);
    res.send(userData);
  }
});

app.get("/data", (req, res) => {
  res.json({ msg: "This is CORS-enabled for a Single Route" });
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findOne({ _id: id });
  res.send(user);
});

// -------------------------------------------post Route----------------------------------------------
app.post("/signup", async (req, res) => {
  const { email, password, fullname, username } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    res.status(400).send({ noti: "email already registered" });
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await userModel.create({
        email,
        password: hash,
        fullname,
        username,
      });

      const userId = newUser._id;
      const response = await cartModel.create({ userId });
      newUser.cartId = response._id;
      await newUser.save();
      const token = jwt.sign({ userId }, "secretkey");
      res.cookie("token", token);
      res.send({
        noti: "",
        login: true,
        id: newUser._id,
        email: newUser.email,
      });
      // console.log(newUser);
    });
  }
});

app.post("/getCart", async (req, res) => {
  const { id } = req.body;

  const user = await userModel.findOne({ _id: id });

  const cart = await cartModel
    .findOne({ _id: user.cartId })
    .populate("product");
  // console.log(cart.product);
  res.status(200).send(cart.product);
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Received login request for email:", email);
    
    let user = await userModel.findOne({ email });
    
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).send({ success: false, msg: "wrong email/password" });
    }

    const userId = user._id;
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send({ success: false, msg: "Internal server error" });
      }
      
      if (!result) {
        console.log("Password mismatch for email:", email);
        return res.status(400).send({ success: false, msg: "wrong email/password" });
      }
      
      const token = jwt.sign({ userId }, "secretkey");
      console.log("Generated token for user ID:", userId);

      res.cookie("token", token);
      res.status(200).send({ success: true, id: userId });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, msg: "Server error, please try again later" });
  }
});

app.post("/logout", (req, res) => {
  if (req.cookies.token) {
    res.clearCookie("token");
    res.send(true);
  } else {
    res.send(true);
  }
});

app.post("/removeFromCart", async (req, res) => {
  const { productId, userId } = req.body;
  const user = await userModel.findOne({ _id: userId });
  const cart = await cartModel.findOne({ _id: user.cartId });
  console.log(productId);
  if (user && cart) {
    cart.product = cart.product.filter((id) => id != productId);
    await cart.save();
    res.status(200).send("removed");
    console.log(cart.product);
  } else {
    console.log("something went wrong");
  }
});

app.post("/addToCart", async (req, res) => {
  const { data, id } = req.body;
  const { name, title, description, price, category, image } = data;
  //  console.log(id)

  const user = await userModel.findOne({ _id: id });

  const newProduct = await productModel.create({
    name,
    title,
    description,
    price,
    category,
    image,
  });
  console.log(user);
  const cart = await cartModel.findOne({ _id: user.cartId });
  if (user && cart) {
    const cart = await cartModel.findOne({ _id: user.cartId });
    cart.product.push(newProduct._id);
    await cart.save();
    console.log(cart);

    res.status(200).send(cart._id);
  } else {
    console.log("something went wrong");
  }
});

// --------------------------------------------middleware------------------------------------------------

// -------------------------------------------Controllers---------------------------------------------

// -------------------------------------------Port----------------------------------------------
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
