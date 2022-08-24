module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Items", [
            {
                name: "Pecel lele",
                category: "makanan",
                price: 25000,
                stock: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Nasi Goreng",
                category: "makanan",
                price: 10000,
                stock: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Es Teh",
                category: "minuman",
                price: 2000,
                stock: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "jus jeruk",
                category: "minuman",
                price: 5000,
                stock: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Items", null, {})
    }
}