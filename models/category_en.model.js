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

const CategoryEn = mongoose.model('category_en', CategorySchema)
export default CategoryEn