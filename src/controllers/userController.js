import models from '../models/index.js';

const { User } = models;
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll();
        res.status(200).json({ success: true, data: allUsers });
    } catch (error) {
        console.error('error by fetching all users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('User data:', name, email, password);
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error('error by creating a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const searchedUser = await User.findByPk(id);
        if (!searchedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        } else {
            console.log('User data:', searchedUser.name, searchedUser.email, searchedUser.password);
            res.status(200).json({ success: true, data: searchedUser });
        }
    } catch (error) {
        console.error('error by getting a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('User id:', id);
        const { name, email, password } = req.body;
        const updatedUser = await User.findByPk(id);
        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        } else {
            await updatedUser.update({ name, email, password });
            res.status(200).json({ success: true, data: updatedUser });
        }
    } catch (error) {
        console.error('error by updating a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('User id:', id);
        const findUser = await User.findByPk(id);

        if (!findUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        await findUser.destroy({ where: { id } });
        console.log('The User was succsessfully deleted!');
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: findUser,
        });
    } catch (error) {
        console.error('error by deleting a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
