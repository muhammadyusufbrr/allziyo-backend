const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createOrUpdateUser);
router.post('/phone', userController.updatePhone);
router.get('/:telegramId', userController.getUser);
router.post('/card', userController.saveCardNumber);
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUser); 

module.exports = router;