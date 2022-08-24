const {User} = require('../models');

module.exports = {

    // untuk mendapatkan username
    getUserByUsername: async (username) => {
        let user = null;
        try {
            user = await User.findOne({
                where: {
                    username: username
                }
            })
        } catch (error) {
            console.log(error);
        }
        return user;
    },

    // mencapatkan id user
    getUserById: async (id) => {
        let user = null;
        try {
            user = await User.findOne({
                where: {id: id}
            })
        } catch (error) {
            console.log(error);
        }
        return user;
    },

    // untuk membuat user baru/ resgister
    createUser: async (user) => {
        let is_success = false;
        try {
            user = await User.create(user);
            is_success = true;
        } catch (error) {
            console.log(error);
        }
        return {
            is_success: is_success,
            user: user
        }
    }
}