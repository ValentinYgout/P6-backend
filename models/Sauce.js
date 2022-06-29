const mongoose = require("mongoose")



const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: [true, "please type a name"] },
    manufacturer: { type: String, required: [true, "please fill in the manufacturer's name"] },
    description: { type: String, required: [true, "please fill the description"] },
    mainPepper: { type: String, required: [true, "please indicate the main ingredient"] },
    imageUrl: { type: String, required: [true, "please upload a picture"] },
    heat: { type: Number, required: [true, "please indicate the heat level "] },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
})

module.exports = mongoose.model("Sauce", sauceSchema)