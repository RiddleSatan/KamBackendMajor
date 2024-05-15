import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import connect from "./db/index.js";
import userModel from "./models/user.model.js";
import productModel from "./models/product.model.js";
import cors from "cors";

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
app.get("/data", (req, res) => {
  res.json({ msg: "This is CORS-enabled for a Single Route" });
});




// -------------------------------------------post Route----------------------------------------------
app.post("/signup", async (req, res) => {
  const { email, password, fullname, username } = req.body;
  const user = await userModel.create({ email, password, fullname, username });
  console.log(user);
});



// --------------------------------------------middleware------------------------------------------------





// -------------------------------------------Controllers---------------------------------------------








// -------------------------------------------Port----------------------------------------------
app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
