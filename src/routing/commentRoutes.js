const express = require('express');
const router = express();
const CommentController = require('../controllers/commentController');
const commentController = new CommentController();
const checkAuth = require('../middleware/checkAuth');

router.get('/', commentController.getComments);

router.get('/:id', commentController.getComment)

router.post('/create',checkAuth, commentController.createComment);

router.put('/update/:id', commentController.updateComment);

router.delete('/delete/:id', commentController.deleteComment)


module.exports = router;