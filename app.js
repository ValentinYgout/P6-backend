
const express = require('express');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')
require ('dotenv').config();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/user');
const sauceRoutes = require("./routes/sauce");
const path = require('path');

const user= process.env.DBUSER
const password= process.env.DBPASSWORD

mongoose.connect(`mongodb+srv://${user}:${password}@vycluster.hpqa3.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));





const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    
    next();
});
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());

app.use(mongoSanitize());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)




app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use("/api/sauces", sauceRoutes);




module.exports = app;