/* eslint-disable no-unused-vars */
const prisma = require('../config/prismaConfig');
const bcrypt = require('bcrypt');
const getTokens = require('../services/tokenService');
class UserController {

    async getUser(req, res) {
        try{
            let id;

            if(req.params.id) {
                try {
                    id = parseInt(req.params.id);

                    if (isNaN(id)) {
                        throw new Error('Bad ID');
                    }

                } catch (error) {
                    res.status(404).json({message: 'Not found'});
                    return;
                }
            } else {
                id = req.user.id;
            }

            const user = await prisma.user.findUnique({
                where: {id: id}
            });

            if(!user){
                res.status(404).json(({message: 'User not found'}));
                return;
            }
            res.json(user);
        }catch(e){
            console.log(e);
            res.json({message: 'User was not found'});
        }
    }

    async getUsers(req, res) {
        
        try{
            const users = await prisma.user.findMany();
            console.log(users);
            if(users.length === 0){
                res.json({message: 'Users not found'});
                return;
            }

            res.json(users);
        }catch(e){
            console.log(e)
            res.json({message: 'Users was not found'});
        }
    }

    async createUser(req, res) {
        
        try{
            const isExistUser = await prisma.user.findUnique({where: {email: req.body.email}});
            
            if(isExistUser){
                res.status(409).json({ message: 'User already exists' });
                return;
            }
            
            const hashedPassword = await bcrypt.hash(req.body.password,7);

            await prisma.user.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    avatar: req.body.avatar,
                    description: req.body.description
                }
            })
            
            res.status(201).json({ message: 'User successfully created' });
        }catch(e){
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUser(req, res) {
        try{
            const updateData = {
                name: req.body.name,
                description: req.body.description,
                avatar: req.body.avatar,
            }

            console.log(updateData)

            if (req.body.password) {
                updateData.password = await bcrypt.hash(req.body.password,7);
            }

            const updated = await prisma.user.update({
                where: { id: req.user.id },
                data: updateData,
            });

            res.json(updated);
    }catch(e){
        console.log(e);
        res.json({message: 'User was not updated'});
    }
    }
    
    async deleteUser(req, res) {
        try{
            console.log(req.params);
            await prisma.user.delete({
                where: {id: parseInt(req.params.id)}
            });

            res.json({message: 'User was successfully deleted'});
        }catch(e){
            console.log(e);
            res.json({message: 'User was not deleted'});
        }
    }

    async loginUser(req, res) {

        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            res.json({user: null, message: 'User not found'});
            return;
        }

        const isPasswordSame = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordSame) {
            res.json({message: 'User not found'});
            return;
        }

        const {accessToken, refreshToken} = getTokens(user);

        res
            .cookie('refreshToken', refreshToken)
            .header('authorization', accessToken)
            .json({user: user});
    }
}

module.exports = UserController;

