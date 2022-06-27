import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: String,
    code: String,
    subCategories: [
        {
            name: String,
            code: String
        }
    ]
},
    {
        timestamps: true
    }
)

const CategoryRu = mongoose.model('category_ru', CategorySchema)
export default CategoryRu