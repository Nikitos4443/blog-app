/* eslint-disable no-unused-vars */
const prisma = require('../config/prismaConfig');

class LikeController {

    async getLikes(req, res) {
        try {
            const likes = await prisma.like.findMany();

            res.json(likes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async createLike(req, res) {
        try {
            const like = await prisma.like.create({
                data: {
                    authorId: req.user.id,
                    postId: req.body.postId,
                },
            });
            res.json(like);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }

    async deleteLike(req, res) {
        try {
            const like = await prisma.like.deleteMany({
                where: {
                    postId: parseInt(req.query.postId),
                    authorId: req.user.id
                },
            });
            if (!like) {
                return res.status(404).json({ message: 'Like not found' });
            }
            res.json(like);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = LikeController;