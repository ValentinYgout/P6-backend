const mongoose = require("mongoose")



const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: [true, "Veuillez fournir un nom"] },
    manufacturer: { type: String, required: [true, "Veuillez fournir un fabriquant"] },
    description: { type: String, required: [true, "Veuillez fournir une description"] },
    mainPepper: { type: String, required: [true, "Veuillez fournir l'ingrédient principal"] },
    imageUrl: { type: String, required: [true, "Veuillez fournir une image"] },
    heat: { type: Number, required: [true, "Veuillez fournir un indice de chaleur"] },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
})

module.exports = mongoose.model("Sauce", sauceSchema)