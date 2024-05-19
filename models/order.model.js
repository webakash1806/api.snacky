import { model, Schema } from 'mongoose'

const orderSchema = new Schema({
    productId: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    itemsTotal: {
        type: Array,
        required: true
    },
    orderDate: {
        type: String,
    },
    orderTime: {
        type: String
    },
    productName: {
        type: Array,
        required: true
    },
    quantity: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    alternate: {
        type: Number
    },
    status: {
        type: String,
        required: true,
        enum: ["Packing", "Out For Delivery", "Delivered"],
        default: "Packing"
    }
}, {
    timestamps: true  // Automatically add timestamps (createdAt, updatedAt) to documents
})

// Creating a Mongoose model named Order using the defined schema

const Order = model('Order', orderSchema)

export default Order