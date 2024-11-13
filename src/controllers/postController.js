/* eslint-disable no-unused-vars */
const prisma = require('../config/prismaConfig');

class PostController {
    async getPosts(req, res) {
        try {
            const posts = await prisma.post.findMany();
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async getPostByUser(req, res) {
        try {
            const posts = await prisma.post.findMany({
                where: { authorId: parseInt(req.params.id) },
            });

            if (posts.length === 0) {
                return res.status(404).json({ message: 'Posts not found' });
            }

            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async createPost(req, res) {
        try {
            const newPost = await prisma.post.create({
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    authorId: req.user.id,
                    media: req.body.media
                },
            });
            res.status(201).json(newPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async updatePost(req, res) {
        try {
            const updatedPost = await prisma.post.update({
                where: { id: parseInt(req.params.id) },
                data: req.body,
            });
            if (!updatedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(updatedPost);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async deletePost(req, res) {
        try {

            const deletedPost = await prisma.post.delete({
                where: { id: parseInt(req.params.id) },
            });
            if (!deletedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(deletedPost)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = PostController;   