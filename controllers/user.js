const bcrypt =require('bcrypt')
const User =require('../models/User')
const jwt = require('jsonwebtoken');
require ('dotenv').config();

hashkey=process.env.HASHKEY

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'User created' }))
          .catch(error =>res.status(400).send(error.message))
      })
      .catch(error => res.status(500));
};



exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
            
          return res.status(401).json({ message: 'User not found' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              
              return res.status(401).json({error:{ message: 'Incorrect password' }});
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                hashkey,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };