const express = require('express');
const router = express();
const PostController = require('../controllers/postController');
const postController = new PostController();
const checkAuth = require('../middleware/checkAuth');

router.get('/', postController.getPosts);

router.get('/getByUser/:id', checkAuth, postController.getPostByUser)

router.post('/create', checkAuth, postController.createPost);

router.put('/update/:id', postController.updatePost);

router.delete('/delete/:id', postController.deletePost)


module.exports = router;