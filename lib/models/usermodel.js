"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config")); //could change the path to the config file
const cakemodel_1 = __importDefault(require("./cakemodel"));
const uuid_1 = require("uuid");
class Users extends sequelize_1.Model {
}
exports.Users = Users;
Users.init({
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    // passwordConfirm: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    phoneNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize: database_config_1.default,
    modelName: "Users"
});
Users.hasMany(cakemodel_1.default, { foreignKey: 'userID' });
// Users.hasMany(Orders, {as: "orders", foreignKey: "userId"})
//I think we shoud consider putting all the association in one document
// Users === sequelize.models.Users 
exports.default = Users;
// userAddress: {
//     type: DataTypes.STRING,
//     allowNull: false
// },
// userState :{
//     type: DataTypes.STRING,
//     allowNull: false
// },
// userLga: {
//     type: DataTypes.STRING,
//     allowNull: false
// },
/*

INNER JOIN:

SELECT employees.employee_id, employees.first_name, departments.department_name
FROM employees
INNER JOIN departments ON employees.department_id = departments.department_id;



LEFT JOIN:

A LEFT JOIN returns all records from the left table (table1) and the matched records from the right table (table2). If there is no match, NULL values are returned for columns from the right table.
SELECT employees.employee_id, employees.first_name, departments.department_name
FROM employees
LEFT JOIN departments ON employees.department_id = departments.department_id;



RIGHT JOIN (or RIGHT OUTER JOIN):
SELECT employees.employee_id, employees.first_name, departments.department_name
FROM employees
RIGHT JOIN departments ON employees.department_id = departments.department_id;


FULL JOIN (or FULL OUTER JOIN):
SELECT employees.employee_id, employees.first_name, departments.department_name
FROM employees
FULL JOIN departments ON employees.department_id = departments.department_id;


CROSS JOIN:
SELECT employees.employee_id, employees.first_name, departments.department_name
FROM employees
CROSS JOIN departments;


Aliases:
Aliases are used to rename a column or a table for the duration of a query.



RIGHT JOIN
SELECT *
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;

DATATYPES IN POSTGRESQL
integer
bigint

nueric(precision, scale)- Fixed-point or floating-point number
numeric(10, 2)
real
double precision

character types


                    ALTER TABLE
ALTER TABLE table_name
ADD CONSTRAINT fk_constraint_name
FOREIGN KEY (column_name) REFERENCES reference_table(reference_column);


ALTER TABLE orders
ADD CONSTRAINT fk_customer_id
FOREIGN KEY (customer_id) REFERENCES customers(customer_id);

ALTER TABLE table_name
ADD PRIMARY KEY (column1, column2);

ALTER TABLE table_name
RENAME COLUMN old_column_name TO new_column_name;


ALTER TABLE table_name
ADD COLUMN new_column_name data_type;
3

Relational databases are a type of database management system (DBMS) that organizes and stores data in tables with predefined relationships between them.

Relationships:
Tables in a relational database are related through keys. A primary key uniquely identifies each record in a table, and a foreign key establishes a link between tables by referencing the primary key of another table.

3. Normalization:
Normalization is the process of organizing data to reduce redundancy and dependency. It involves breaking down large tables into smaller ones and establishing relationships between them. This helps maintain data integrity and avoids anomalies.


. SQL (Structured Query Language):
SQL is the language used to interact with relational databases. It provides a set of commands for defining, querying, updating, and managing data in the database.

5. ACID Properties:
Relational databases adhere to the ACID (Atomicity, Consistency, Isolation, Durability) properties to ensure the reliability of transactions. These properties guarantee that database transactions are processed reliably in a consistent and predictable manner.

Examples of Popular Relational Database Management Systems (RDBMS):
MySQL: An open-source relational database management system.
PostgreSQL: An open-source object-relational database system.
Oracle Database: A commercial database management system by Oracle Corporation.
Microsoft SQL Server: A relational database management system developed by Microsoft.
Relational databases are widely used in various applications, ranging from small-scale projects to large enterprise systems, due to their flexibility, scalability, and well-defined structure.

*/ 
