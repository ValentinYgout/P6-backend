const express = require('express');
const router = express.Router();

// protection par authentification
const auth = require('../middlewares/auth');

// gestion des fichiers images
const multer = require('../middlewares/multer-config')

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.noteSauce);

module.exports = router;