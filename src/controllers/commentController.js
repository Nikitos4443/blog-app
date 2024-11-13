/* eslint-disable no-unused-vars */
const prisma = require('../config/prismaConfig');

class CommentController {

    async getComments(req, res) {
        try {
            const comments = await prisma.comments.findMany();
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async getComment(req, res) {
        try {
            const comment = await prisma.comments.findUnique({
                where: { id: parseInt(req.params.id) },
            });
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async createComment(req, res) {
        try {
            const newComment = await prisma.comments.create({
                data: {
                    text: req.body.text,
                    postId: parseInt(req.body.postId),
                    authorId: req.user.id,
                },
            });
            res.status(201).json(newComment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async updateComment(req, res) {
        try {
            const updatedComment = await prisma.comments.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    text: req.body.text,
                },
            });
            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json(updatedComment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async deleteComment(req, res) {
        try {
            const deletedComment = await prisma.comments.delete({
                where: {
                    id: parseInt(req.params.id),
                },
            });
            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            res.json(deletedComment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = CommentController;