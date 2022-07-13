import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    colorway: [
        {
            name: String,
            code: String,
            primary: Boolean
        }
    ],
    price: {
        value: Number,
        currency: String
    },
    category: {
        name: String,
        code: String
    },
    size: [
        {
            value: String,
            availability: Boolean
        }
    ],
    images: [String],
    brand: [String],
    stock: Boolean,
    collections: {
        name: String,
        code: String,
        description: String
    },
    views: Number
},
    {
        timestamps: true
    }
)

const ProductEn = mongoose.model('product_en', ProductSchema)
export default ProductEn