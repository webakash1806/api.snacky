import Product from "../models/product.models.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const getProductList = async (req, res, next) => {
    try {
        const product = await Product.find({}).select()

        if (!product) {
            return next(new AppError('No product found', 400))
        }

        res.status(200).json({
            success: true,
            message: "Product List",
            product
        })
    }
    catch (e) {
        return next(new AppError({ message: "Something went wrong!" }))
    }
}

const createProduct = async (req, res, next) => {
    try {

        const { name, price, stock, comboDetail, discount, thumbnail } = req.body

        if (!name || !price || !stock || !comboDetail || !discount) {
            return next(new AppError('All Fields are required', 400))
        }

        const product = await Product.create({
            name,
            price,
            stock,
            comboDetail,
            discount,
            thumbnail: {
                public_id: '',
                secure_url: '',
            }
        })

        if (!product) {
            return next(new AppError('Product is not created', 500))
        }

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            })

            // Updating product thumbnail details
            if (result) {
                product.thumbnail.public_id = result.public_id
                product.thumbnail.secure_url = result.secure_url
            }
            // Removing temporary file
            fs.rm(`uploads/${req.file.filename}`)
        }

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product created successfully",
            product
        })
    }
    catch (e) {
        return next(new AppError(e.message, 500))
    }
}

const updateProduct = async (req, res, next) => {
    try {

        const { id } = req.params

        const product = await Product.findById(id)

        const { name, price, stock, comboDetail, discount, thumbnail } = req.body

        if (!product) {
            return next(new AppError('No product found', 400))
        }

        if (name) {
            product.name = await name
        }

        if (price) {
            product.price = await price
        }

        if (comboDetail) {
            product.comboDetail = await comboDetail
        }

        if (stock) {
            product.stock = await stock
        }

        if (discount) {
            product.discount = await discount
        }

        if (req.file) {

            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            })

            // Updating product thumbnail details
            if (result) {
                product.thumbnail.public_id = result.public_id
                product.thumbnail.secure_url = result.secure_url
            }

            // Removing temporary file
            fs.rm(`uploads/${req.file.filename}`)
        }


        await product.save()

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        })

    }
    catch (e) {
        return next(new AppError(e.message, 500))
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params

        const product = await Product.findById(id)

        if (!product) {
            return next(new AppError('No product found', 400))
        }

        await Product.findByIdAndDelete(id)

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    }
    catch (e) {
        return next(new AppError(e.message, 500))
    }
}


export {
    getProductList,
    createProduct,
    updateProduct,
    deleteProduct
}