import mongoose, { model, Schema } from 'mongoose'


const cartSchema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default: null,
        },

        cartItems: [
            {
                type: {
                    product: { type: mongoose.Types.ObjectId, ref: "Product" },
                    quantity: { type: Number, default: 1 },
                    subTotal: { type: Number, default: 0 },
                    status: {
                        type: String,
                        enum: ["purchased", "not purchased"],
                        default: "not purchased",
                    },
                },
                default: [],
            },
        ],
        status: {
            type: String,
            enum: ["purchased", "not purchased"],
            default: "not purchased",
        },
    },
    {
        timestamps: true,
    }
)

const Cart = model('cart', cartSchema)

export default Cart