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
    origin: "http://localhost:5173", // your React app's origin
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "publc")));

// -------------------------------------------get Route----------------------------------------------
app.get("/getCurrentUser", async (req, res) => {
  // res.send('currentUserInfo')
  const token = req.cookies.token;
  if (token) {
    let data = jwt.verify(token, "secretkey");
    const userData= await userModel.findOne({_id:data.userId})
    console.log(userData)
     res.send(userData)
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
      const userId=newUser._id
      const token = jwt.sign({ userId }, "secretkey");
      res.cookie("token", token);
      res.send({
        noti: "",
        login: true,
        id: newUser._id,
        email: newUser.email,
      });
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  const userId=user._id
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      const token = jwt.sign({ userId }, "secretkey");
      // console.log(token)
      // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
      res.cookie("token", token);

      res.status(200).send({ result, id: user._id });
    });
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

// --------------------------------------------middleware------------------------------------------------




// -------------------------------------------Controllers---------------------------------------------

// -------------------------------------------Port----------------------------------------------
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
