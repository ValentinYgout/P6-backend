const Sauce = require('../models/sauce');
 const fs = require('fs');

 //add one sauce
exports.createSauce = (req ,res ) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });// dynamic URL depending on server path
  // save new sauce in database
  sauce.save()
    .then(sauce => {
      const message = 'the sauce was added';
      res.json({ message, data: sauce});
    })
    .catch(error => {
      const message = 'the sauce could not be added, please try again later' ;
      res.status(500).json({message, data:error });
    });
  }

// display all sauces
exports.getAllSauces = (req ,res ) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const message = "could not find all sauces, please try again later";
      res.status(500).json({message, data:error});
      })
};

//display one sauce according to its ID
exports.getOneSauce = (req ,res ) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const message = `this sauce could not be displayed, please try again`;
      res.status(500).json({ message, data: error });
    })
};

//modify one sauce
exports.updateSauce = (req, res, next) => {
    if (req.file) {
      // if modifying image, delete old one
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
           if (!sauce) {
          return res.status(404).json({ message: "sauce not found !"});
        }
              const filename = sauce.imageUrl.split('/images/')[1];
                // add new image and update data
                const sauceObject = {
                  ...JSON.parse(req.body.sauce),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  };
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => {
                  
                  fs.unlink(`images/${filename}`, (err=>{
                    if (err) console.log(err);
                    else {
                      console.log(`deleted images/${filename}`);
                    }
                  }));
                  res.status(200).json({ message: 'Sauce was modified!' });
                })
                .catch(error => res.status(400).json({ error }));
         })
        .catch(error => res.status(500).json({ error }));
    } else {
        // no image modification
        const sauceObject = { ...req.body };
        Sauce
        .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce was modified!' }))
        .catch(error => res.status(400).json({ error }));
    }
};

//deletion of a sauce
exports.deleteSauce = (req ,res ) => {
    Sauce.findOne({ _id: req.params.id })
      // find sauce image to delete it
      .then(sauce => {
          if (!sauce) {
            return res.status(404).json({ message: "Sauce non trouvée !"});
          }
          const filename = sauce.imageUrl.split('/images/')[1];// split URL to get filename
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(sauce => {
              const message = 'the sauce was succesfully deleted';
              res.json({ message, data: sauce});
            })
            .catch(error => res.status(400).json({ error }));
          });
       })
      .catch(error => {
        const message = `The sauce couldn't be deleted, please try again`
        res.status(500).json({ message, data: error });
      })
};

//rate a sauce
exports.rateSauce = (req, res, ) => {
  if (req.body.like == 0){
    Sauce.findOne({ _id: req.params.id })
      .then(sauces => {
        //if user already liked a sauce
        if(sauces.usersLiked.find(user => user ===req.body.userId)){
          //remove like and remove userId from usersLiked
        Sauce.updateOne ({_id: req.params.id},{$inc:{likes:-1},$pull:{usersLiked: req.body.userId}})
          .then(() => res.status(200).json({ message: 'rating updated'}))
          .catch(error => {
            const message = `Your rating couldn't be taken into account, please try again`;
            res.status(500).json({ message, data: error });
          })
        } 
        //if user already disliked sauce
        if(sauces.usersDisliked.find(user => user===req.body.userId)){
          //remove dislike and remove userId from usersLiked
        Sauce.updateOne ({_id: req.params.id}, {$inc:{dislikes:-1},$pull:{usersDisliked:req.body.userId}})
          .then(() => res.status(200).json({ message: 'rating was updated'}))
          .catch(error => {
            const message = `Your rating couldn't be taken into account, please try again`;
            res.status(500).json({ message, data: error });
          })
        }
      })
      .catch(error => {
        const message = `Your rating couldn't be taken into account, please try again`;
        res.status(500).json({ message, data: error });
      })
    };
  
  if (req.body.like == 1){
    Sauce.updateOne( {_id: req.params.id}, {$inc:{likes:1}, $push:{usersLiked: req.body.userId}})
    //add one Like and  push userId in usersLiked
    .then(() => res.status(200).json({ message: 'rating was taken into account'}))
    .catch(error => {
      const message = `Your rating couldn't be taken into account, please try again`;
      res.status(500).json({ message, data: error });
    })
  }
  
  if (req.body.like == -1){
    Sauce.updateOne( {_id: req.params.id}, {$inc:{dislikes:1}, $push:{usersDisliked: req.body.userId}})
    //add one Dislike and  push userId in usersLiked
    .then(() => res.status(200).json({ message: 'your rating was taken into account'}))
    .catch(error => {
      const message = `Your rating couldn't be taken into account, please try again`;
      res.status(500).json({ message, data: error });
    })
  }
};


