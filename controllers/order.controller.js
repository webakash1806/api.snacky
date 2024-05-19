import Order from "../models/order.model.js";
import AppError from "../utils/error.utils.js";
import Cart from "../models/cart.models.js";
import Product from '../models/product.models.js'

const allOrders = async (req, res, next) => {
    try {
        const order = await Order.find()
        res.status(200).json({
            success: true,
            message: "Order loaded successfully",
            order
        })
    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const order = await Order.findById(id)

        order.status = await status
        await order.save()

    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

const userOrders = async (req, res, next) => {

    try {
        const { id } = req.user
        const order = await Order.find({ userId: id })
        res.status(200).json({
            success: true,
            message: "Order loaded successfully",
            order
        })
    } catch (err) {
        return next(new AppError(err.message, 500))
    }
}

const orderData = async (req, res, next) => {
    try {
        console.log(1)
        const { productId, productName, orderTime, orderDate, itemsTotal, quantity, userId, totalPrice, userName, number, alternate, address, status } = req.body
        console.log(req.body)

        if (!productId || !productName || !orderTime || !orderData || !userId || !itemsTotal || !quantity || !totalPrice || !userName || !number || !address || !status) {
            return next(new AppError("All fields are required", 400))
        }


        const order = await Order.create({
            productId,
            userId,
            userName,
            orderTime,
            orderDate,
            quantity,
            itemsTotal,
            productName,
            totalPrice,
            address,
            number,
            alternate,
            status
        })

        await order.save()
        res.status(201).json({
            success: true,
            message: 'Order added Successfully',
            order
        })
    } catch (err) {
        return next(new AppError(err.message, 500))


    }
}

export {
    allOrders,
    orderData,
    userOrders,
    updateOrder
}