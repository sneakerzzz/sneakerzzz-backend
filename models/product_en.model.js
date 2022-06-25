import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    colorway: Array,
    price: Object,
    category: Object,
    size: Array,
    images: Array,
    brand: String,
    stock: String,
    gender: String,
    subCategory: Object,
    collectionName: String
},
    {
        timestamps: true
    }
)

const ProductEn = mongoose.model('product_en', ProductSchema)
export default ProductEn