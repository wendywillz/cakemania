import { Model, DataTypes } from "sequelize" //I did not install any package
import sequelize from "../database.config" 

//could change the path to the config file
// import Items from "./itemModel"
// import Users  from "./usermodel"
// import  Cakes  from "./cakemodel"



interface OrderAttributes {
    orderID: string;
    total: number;
    status: string;
    deliveryPhoneNo: number;
    deliveryAddress: string;
    deliveryState: string;
    deliveryLga: string;
    additionalInfo: string;
}

class Orders extends Model<OrderAttributes> implements OrderAttributes {
    public orderID!: string;
    public total!: number;
    public status!: string;
    public deliveryPhoneNo!: number;
    public deliveryAddress!: string;
    public deliveryState!: string;
    public deliveryLga!: string;
    public additionalInfo!: string;
}

Orders.init(
    {
        orderID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
        },
        total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliveryPhoneNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deliveryAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliveryState: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deliveryLga: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        additionalInfo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Orders",
    }
);


Orders.init({
    orderID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryPhoneNo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryState :{
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryLga: {
        type: DataTypes.STRING,
        allowNull: false
    },
    additionalInfo: {
        type: DataTypes.STRING,
        allowNull: true
    },

}, {
    sequelize,
    modelName: "Orders"
})

// Orders.hasMany(Items, {as: "items", foreignKey: "orderId"})
// Orders.hasMany(Cakes, {as: "cakes", foreignKey: "orderId"})
//I think we shoud consider putting all the association in one document

// Orders === sequelize.models.Orders

export default Orders