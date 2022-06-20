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
    stock: String,
    createdAt: Date
})

const ProductRu = mongoose.model('product_ru', ProductSchema)
export default ProductRu