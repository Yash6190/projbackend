const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../utils/authMiddleware');

router.post('/register', userController.register);
router.put('/activate', userController.activate);
router.post('/login', userController.login);
router.get('/getallusers', verifyToken, verifyAdmin, userController.getAllUsers);
router.delete('/deluser/:uid', verifyToken, verifyAdmin, userController.deleteUser);
router.put('/changepassword', userController.changePassword);
router.get('/searchuser', verifyToken, verifyAdmin, userController.searchUser);

module.exports = router;
