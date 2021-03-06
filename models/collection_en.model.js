import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
    name: String,
    description: String,
    images: [String],
    code: String
},
    {
        timestamps: true
    }
)

const CollectionEn = mongoose.model('collection_en', CollectionSchema)
export default CollectionEn