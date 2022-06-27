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

const CollectionRu = mongoose.model('collection_ru', CollectionSchema)
export default CollectionRu