import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config"//could change the path to the config file

interface itemAtrributes{
    itemName: string;
    size: string;
    quantity: number;
    price: number,
}

export class Items extends Model <itemAtrributes> {}

Items.init({
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size : {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
        
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        
    }
}, {
    sequelize,
    modelName: "Items"
})

// Items === sequelize.models.Items 

export default Items
