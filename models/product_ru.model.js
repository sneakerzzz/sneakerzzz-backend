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

const ProductRu = mongoose.model('product_ru', ProductSchema)
export default ProductRu