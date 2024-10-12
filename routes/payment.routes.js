import { Router } from "express";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { checkout, paymentVerification, razorpayApiKey } from "../controllers/payment.controller.js";

const router = Router()

router.get('/key',  razorpayApiKey)

router.post('/checkout',  checkout)

router.post('/status',  paymentVerification)


export default router
