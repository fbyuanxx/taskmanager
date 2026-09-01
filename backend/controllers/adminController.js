const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ name: 1 });

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to retrieve registered users',
        });
    }
};

const updateUserStatus = async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({
            message: 'isActive must be a boolean value',
        });
    }

    if (req.params.id === req.user.id.toString()) {
        return res.status(400).json({
            message: 'You cannot disable your own administrator account',
        });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        user.isActive = isActive;
        const updatedUser = await user.save();

        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            university: updatedUser.university,
            address: updatedUser.address,
            isAdmin: updatedUser.isAdmin,
            isActive: updatedUser.isActive,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update user account status',
        });
    }
};

module.exports = {
    getUsers,
    updateUserStatus,
};