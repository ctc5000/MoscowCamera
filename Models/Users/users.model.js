const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define(
        'users',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name:
                {
                    type: DataTypes.STRING,
                },
            login:
                {
                    type: DataTypes.STRING,
                },
            password:
                {
                    type: DataTypes.STRING,
                },
        },

        {
            freezeTableName: true,
            tableName: 'users',
        }
    )
}