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
 
app.use(cors({
  origin: 'http://localhost:5173', // your React app's origin
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -------------------------------------------get Route----------------------------------------------
app.get('/getCookies',isLoggedIn,(req,res)=>{
    console.log('token exist')
})

app.get("/check", isLoggedIn, (req, res) => {
  res.send(true);
});

app.get("/data", (req, res) => {
  res.json({ msg: "This is CORS-enabled for a Single Route" });
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findOne({ _id: id });
  res.send(user);
});

app.get('/checkToken' ,(req,res)=>{
  try {
    let decoded = jwt.verify(token, 'secretkey');
    console.log(decoded)
  } catch(err) {
    console.log(err)
  }
})

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
      res.cookie('token', token);
      res.send({ noti: "", login: true, id: newUser._id ,email:newUser.email});
    }); 
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body; 
  let user = await userModel.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => { 
      const token = jwt.sign({ email }, "secretkey");
      // console.log(token)
      // res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
      res.cookie('token',token,);
       
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

// Middleware for checking token and authorization
function isLoggedIn(req, res, next) {
  // Extract token from request header (assuming 'Authorization' header)
  const token = req.headers.authorization?.split(' ')[1]; // Assuming format 'Bearer <token>'

  if (!token) {
    // No token present, unauthorized
    return res.status(401).send(false);
    console.log(false)
  }

  try {
    // Implement your token validation logic here (e.g., JWT decoding and signature verification)
    const decoded = jwt.verify(token, 'secretkey'); // Replace with your validation logic
    req.user = decoded; // Store decoded user data for further use (optional)
    next();
  } catch (err) {
    // Invalid token, unauthorized
    console.error('Invalid token:', err);
    res.status(401).send(false);
  }
}


// -------------------------------------------Controllers---------------------------------------------

// -------------------------------------------Port----------------------------------------------
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});