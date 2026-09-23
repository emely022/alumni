const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.getHome);
router.get('/about', homeController.getAbout);
router.get('/hello', homeController.getHello);
router.get('/hello/:name', homeController.getHelloWithName);
router.get('/sum/:number1/:number2', homeController.getSum);

module.exports = router;
