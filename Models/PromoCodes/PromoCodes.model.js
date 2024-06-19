const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define(
        'promocode',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            value:
                {
                    type: DataTypes.STRING,
                },
            activated:
                {
                    type: DataTypes.BOOLEAN,
                    defaultValue:false
                },
        },

        {
            freezeTableName: true,
            tableName: 'promocodes',
        }
    )
}