const express = require('express');
const router = express();
const UserController = require('../controllers/userController');
const userController = new UserController();
const checkAuth = require('../middleware/checkAuth');

router.get('/getOne/:id', userController.getUser);

router.get('/getMe', checkAuth, userController.getUser);

router.get('/', userController.getUsers);

router.post('/create', userController.createUser);

router.post('/login', userController.loginUser)

router.put('/update', checkAuth, userController.updateUser);

router.delete('/delete/:id', userController.deleteUser)

module.exports = router;