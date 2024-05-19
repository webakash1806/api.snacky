import { model, Schema } from 'mongoose'


const productSchema = new Schema({

    name: {
        type: 'String',
        required: [true, 'Title is required'],
        minLength: [5, 'Title must be at least 5 characters'],
        maxLength: [59, 'Title should be less than 60 characters'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    stock: {
        type: String,
        required: [true, 'Stock status is required']
    },
    discount: {
        type: Number,
        required: [true, 'Discount is required']
    },
    comboDetail: {
        type: 'String',
        required: [true, 'Category is required']
    },
    thumbnail: {
        public_id: {
            type: 'String',
            // required: true
        },
        secure_url: {
            type: 'String',
            // required: true
        }
    },
})

const Product = model('Product', productSchema)

export default Product