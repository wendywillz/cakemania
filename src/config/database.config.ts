import Sequelize from "sequelize" //I did not install any package.
const sequelize = new Sequelize({
    dialect: "sqlite",
    host: "localhost",
    storage: "./database.sqlite",
    logging: false,
})

export default sequelize