import mongoose from "mongoose";

const CollectionSchema = mongoose.Schema({
    title: String,
    description: String,
    images: Array
})

const CollectionEn = mongoose.model(' collection_en', CollectionSchema)
export default CollectionEn