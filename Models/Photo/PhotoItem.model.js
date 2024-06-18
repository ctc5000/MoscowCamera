const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define(
        'photos',
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
            url:
                {
                    type: DataTypes.STRING,
                },
            active:
                {
                    type: DataTypes.BOOLEAN,
                },
        },

        {
            freezeTableName: true,
            tableName: 'photos',
        }
    )
}