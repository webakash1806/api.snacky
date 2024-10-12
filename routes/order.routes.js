// Importing the 'Router' class from the 'express' module
import { Router } from 'express';

// Importing various controller functions and middleware from respective files
import { allOrders, orderData, updateOrder, userOrders } from '../controllers/order.controller.js';

import {  authorizedUser } from '../middlewares/auth.middleware.js';

// Creating a new instance of the Express Router
const router = Router();

router.post('/add',  orderData);
router.get('/all',  authorizedUser("ADMIN"), allOrders);
router.get('/my-orders',  userOrders);
router.post('/:id',  authorizedUser("ADMIN"), updateOrder)



// Exporting the router instance for use in other parts of the application
export default router;
