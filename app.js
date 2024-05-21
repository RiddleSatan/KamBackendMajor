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
import { mongo } from "mongoose";
import "dotenv/config";

connect();

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -------------------------------------------get Route----------------------------------------------
app.get("/check", isLoggedIn, (req, res) => {
  res.send(true) ;
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
    res.send({ noti: "email already registered" });
  } else {
    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = await userModel.create({
        email,
        password: hash,
        fullname,
        username, 
      });
      console.log(newUser);
      const token = jwt.sign({ email }, "secretkey");
      res.cookie("token", token);
      res.send({ noti: "", login: true, id: newUser._id });
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      res.send({ result, id: user._id });
    });
  }
});

app.post("/logout", (req, res) => {
  if (req.cookies.token) {
    res.clearCookie('token');
    res.send(true);
  }
  else{
    res.send(true)
  }
});

// --------------------------------------------middleware------------------------------------------------

function isLoggedIn(req,res,next) {
  if (req.cookies.token) {
    next();
  } else {
    res.status(401).send(false);
  }
}

// -------------------------------------------Controllers---------------------------------------------

// -------------------------------------------Port----------------------------------------------
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
