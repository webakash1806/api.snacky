// Importing the Router from Express to create modular route handlers
import { Router } from "express";

// Importing various controller functions and middlewares
import {
    addToCart, getCartItems, updateCart, removeFromCart, removeCartAfterOrder,
    // buyNow
} from "../controllers/cart.controller.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/add",  addToCart);
router.get("/",  getCartItems);
router.delete("/remove/order-confirm/:id",  removeCartAfterOrder);
router.put("/update/:cartId/:itemId/:qnt/:price",  updateCart);
router.post("/remove/:cartId/:itemId",  removeFromCart);


export default router
