const express = require('express');
const router = express();
const LikeController = require('../controllers/likeController');
const likeController = new LikeController();
const checkAuth = require('../middleware/checkAuth');

router.get('/', likeController.getLikes)

router.post('/create', checkAuth, likeController.createLike);

router.delete('/delete',checkAuth, likeController.deleteLike)


module.exports = router;