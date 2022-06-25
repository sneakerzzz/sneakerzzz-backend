import mongoose from "mongoose";

const CollectionSchema = mongoose.Schema({
    title: String,
    description: String,
    images: Array
})

const CollectionRu = mongoose.model(' collection_ru', CollectionSchema)
export default CollectionRu