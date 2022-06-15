
const express = require('express');
require ('dotenv').config();
// const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const sauceRoutes = require("./routes/sauce");
const path = require('path');

user= process.env.USER
password= process.env.PASSWORD

mongoose.connect(`mongodb+srv://${user}:${password}@vycluster.hpqa3.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));





const app = express();
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use("/api/sauces", sauceRoutes);




module.exports = app;