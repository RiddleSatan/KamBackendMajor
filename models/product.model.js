import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'default.jpg', 
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  }
});


export default mongoose.model('product', productSchema);

