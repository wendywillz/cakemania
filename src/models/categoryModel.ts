import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config" //could change the path to the config file
import Cakes from "./cakemodel"



interface categoryAtrributes{
    categoryName: string,
    categoryID: number|null,
    categoryImage: string
}

export class Categories extends Model <categoryAtrributes> {}

Categories.init({
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    categoryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true

    },
    categoryImage: {
        type: DataTypes.STRING, 
        allowNull: false,
      },
}, {
    sequelize,
    modelName: 'Categories'
})



export default Categories