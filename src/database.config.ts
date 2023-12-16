import { Sequelize } from "sequelize" 

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
    // logging: (log) => {
    //     // Customize the logging here, log is the SQL query string
    //     console.log(`Executing query: ${log}`);
    // },
})

export default sequelize