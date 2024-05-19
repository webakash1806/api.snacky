// Importing the 'Router' class from the 'express' module
import { Router } from 'express';

// Importing various controller functions and middleware from respective files
import {
    createProduct,
    deleteProduct,
    getProductList,
    updateProduct
} from '../controllers/product.controllers.js';

import { isLoggedIn, authorizedUser } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

// Creating a new instance of the Express Router
const router = Router();

// Route to get the list of courses (HTTP GET method)
router.route('/').get(getProductList);

// Route to create a new course (HTTP POST method)
router.post('/add', upload.single("thumbnail"), isLoggedIn, authorizedUser("ADMIN"), createProduct);

// Route to update an existing course (HTTP PUT method)
router.put('/update/:id', upload.single("thumbnail"), isLoggedIn, authorizedUser("ADMIN"), updateProduct);

// Route to delete an existing course (HTTP DELETE method)
router.delete('/remove/:id', isLoggedIn, authorizedUser("ADMIN"), deleteProduct);

// Exporting the router instance for use in other parts of the application
export default router;