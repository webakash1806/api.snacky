import Cart from "../models/cart.models.js";
import Order from "../models/order.model.js";
import AppError from "../utils/error.utils.js";

const addToCart = async (req, res) => {
    try {
        const { productId, qnt, price } = req.body;
        const quantity = Number(qnt)
        const { user } = req;
        if (!user) {
            let { cartId } = req.cookies;
            if (!cartId) {
                const newCart = await Cart.create({
                    cartItems: [
                        { product: productId, quantity, subTotal: quantity * price },
                    ],
                    totalToPay: quantity * price,
                    isGuestCart: true,
                });
                cartId = newCart.id;
                return res
                    .cookie("cartId", cartId.toString(), {
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                    })
                    .json({
                        message: "product added to cart",
                        cart: newCart,
                        numberOfCartItems: newCart?.cartItems?.length,
                    });
            }
            let cart = await Cart.findOne({ id: cartId });
            if (!cart) {
                res.cookie("cartId", "productDelivery", {
                    maxAge: -1,
                });
                const newCart = await Cart.create({
                    cartItems: [
                        { product: productId, quantity, subTotal: quantity * price },
                    ],
                    totalToPay: quantity * price,
                    isGuestCart: true,
                });
                cartId = newCart.id;
                return res
                    .cookie("cartId", cartId.toString(), {
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                    })
                    .json({
                        message: "product added to cart",
                        cart: newCart,
                        numberOfCartItems: newCart?.cartItems?.length,
                    });
            }
            const isItemExist = cart.cartItems.find(
                (item) => item.product.toString() === productId
            );
            if (isItemExist) {
                cart.cartItems = cart.cartItems.map((item) => {
                    if (item.product.toString() === productId) {
                        item.quantity += quantity;
                        item.subTotal += quantity * price;
                    }
                    return item;
                });
                cart.totalToPay += quantity * price;
                await cart.save();
                return res.json({
                    message: "product added to cart",
                    cart,
                    numberOfCartItems: cart?.cartItems?.length,
                });
            } else {
                cart.cartItems.push({
                    product: productId,
                    quantity,
                    subTotal: quantity * price,
                });
                cart.totalToPay += quantity * price;
                await cart.save();
                return res.json({
                    message: "product added to cart",
                    cart,
                    numberOfCartItems: cart?.cartItems?.length,
                });
            }
        } else {
            const cart = await Cart.findOne({
                user: user?.id,
                status: "not purchased",
            });
            if (!cart) {
                const newCart = await Cart.create({
                    user: user.id,
                    cartItems: [
                        { product: productId, quantity, subTotal: quantity * price },
                    ]
                });
                return res.status(200).json({
                    success: true,
                    message: "product added to cart",
                    cart: newCart,
                    numberOfCartItems: newCart?.cartItems?.length,
                });
            }
            const isItemExist = cart.cartItems.find(
                (item) => item.product.toString() === productId
            );
            if (isItemExist) {
                cart.cartItems = cart.cartItems.map((item) => {
                    if (item.product.toString() === productId) {
                        item.quantity += quantity;
                        item.subTotal += quantity * price;
                    }
                    return item;
                });
                await cart.save();
                req.user = null;

                return res.status(200).json({
                    success: true,
                    message: "product added to cart",
                    cart,
                    numberOfCartItems: cart?.cartItems?.length,
                });
            } else {
                cart.cartItems.push({
                    product: await productId,
                    quantity,
                    subTotal: await quantity * price,
                });
                await cart.save();
                req.user = null;
                return res.status(200).json({
                    success: true,
                    message: "product added to cart",
                    cart,
                    numberOfCartItems: cart?.cartItems?.length,
                });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getCartItems = async (req, res) => {
    try {
        const { user } = req;
        await Cart.findOne({
            user: user.id,
        })

        if (user) {
            const cart = await Cart.findOne({
                user: user.id,
                status: "not purchased",
            })
                .populate({
                    path: "cartItems.product",
                })
            if (!cart) {
                return res.status(200).json({ message: "Nothing in cart" });
            }
            return res.json(cart);
        }
        let { cartId } = req.cookies;
        if (!cartId) {
            return res.status(200).json({ message: "Nothing in cart" });
        }
        const cart = await Cart.findOne({ id: cartId })
            .populate({
                path: "cartItems.product",
            })
        if (!cart) {
            return res.status(400).json({ message: "Nothing in cart" });
        }
        return res.json(cart);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

const updateCart = async (req, res, next) => {
    try {
        const { cartId, itemId, qnt, price } = req.params;
        const quantity = Number(qnt)
        let cart = await Cart.findById(cartId)

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.cartItems.findIndex(
            (item) => item._id.toString() === itemId.toString()
        )


        if (itemIndex === -1) {
            return next(new AppError('No items found', 400))
        }

        if (quantity) {
            cart.cartItems[itemIndex].quantity = await quantity
            cart.cartItems[itemIndex].subTotal = await quantity * price
        }

        await cart.save()

        res.status(200).json({
            success: true,
            message: "Cart Updated successfully",
            cart
        })

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const removeFromCart = async (req, res, next) => {
    try {
        const { cartId, itemId } = req.params;
        let cart = await Cart.findById(cartId)

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.cartItems.findIndex(
            (item) => item._id.toString() === itemId.toString()
        )

        if (itemIndex === -1) {
            return next(new AppError('No items found', 400))
        }

        cart.cartItems.splice(itemIndex, 1)

        await cart.save();
        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const removeCartAfterOrder = async (req, res, next) => {
    try {

        const id = req.params

        console.log(id.id)

        const cart = await Cart.findByIdAndDelete(id.id)
        console.log(cart)

        await cart.save()
    } catch (err) {
        console.log(err.message)
    }
}

export {
    addToCart,
    getCartItems,
    updateCart,
    removeFromCart,
    removeCartAfterOrder,
}

