import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    productID: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    }],
    fullname: {
      type: String,
      required: true,
    },
    profilepic: {
      type: String,
      default: 'default.jpg',
    },
  });

export default mongoose.model('user',userSchema)