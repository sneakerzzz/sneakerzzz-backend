import mongoose from 'mongoose'

const ProductSchema = mongoose.Schema({
    title: String,
    description: String,
    colorway: Array,
    price: Object,
    category: String,
    size: Array,
    images: Array,
    brand: String,
    stock: String
})

const ProductEn = mongoose.model('product_en', ProductSchema)
export default ProductEn