// Importing the Router from Express to create modular route handlers
import { Router } from "express";

// Importing various controller functions and middlewares
import {
    addToCart, getCartItems, updateCart, removeFromCart, removeCartAfterOrder,
    // buyNow
} from "../controllers/cart.controller.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/add", isLoggedIn, addToCart);
router.get("/", isLoggedIn, getCartItems);
router.delete("/remove/order-confirm/:id", isLoggedIn, removeCartAfterOrder);
router.put("/update/:cartId/:itemId/:qnt/:price", isLoggedIn, updateCart);
router.post("/remove/:cartId/:itemId", isLoggedIn, removeFromCart);


export default router