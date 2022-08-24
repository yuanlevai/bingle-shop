const {Item} = require('../models');

module.exports = {
    getListItem: async (filters) => {
        let options = {}
        if (typeof filters !== "undefined" || filters !== null) {
            options.where = filters
        }
        let items = []

        try{
            items = await Item.findAll(options)
        } catch (e) {
            console.log(e)
        }

        return items;
    },
    getItemById: async (id) => {
        let item = null
        try{
            item =  await Item.findOne({
                where: {id: id}
            })
        } catch (e) {
            console.log(e)
        }

        return item;
    },
    getItemByName: async (name) => {
        let item = null
        try{
            item =  await Item.findOne({
                where: {name: name}
            })
        } catch (e) {
            console.log(e)
        }

        return item;
    },
    createItem: async (item) => {
        let is_success = false;
        try {
            item = await Item.create(item);
            is_success = true;
        } catch (error) {
            console.log(error);
        }
        return {
            is_success: is_success,
            item: item
        }
    },
    updateItem: async (item, id) => {
        try {
            await Item.update(item, {
                where: {
                    id: id
                }
            })
        } catch (err) {
            console.log(err);
        }
    return item

    },
    deleteItem : async (id) => {
        try {
            await Item.destroy({
                where: {
                    id: id
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}
