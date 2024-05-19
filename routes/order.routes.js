// Importing the 'Router' class from the 'express' module
import { Router } from 'express';

// Importing various controller functions and middleware from respective files
import { allOrders, orderData, updateOrder, userOrders } from '../controllers/order.controller.js';

import { isLoggedIn, authorizedUser } from '../middlewares/auth.middleware.js';

// Creating a new instance of the Express Router
const router = Router();

router.post('/add', isLoggedIn, orderData);
router.get('/all', isLoggedIn, authorizedUser("ADMIN"), allOrders);
router.get('/my-orders', isLoggedIn, userOrders);
router.post('/:id', isLoggedIn, authorizedUser("ADMIN"), updateOrder)



// Exporting the router instance for use in other parts of the application
export default router;