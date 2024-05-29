    import mongoose from "mongoose";

    const cartSchema=mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        product:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'product'
            }
        ]
    })

    export default mongoose.model('cart',cartSchema)