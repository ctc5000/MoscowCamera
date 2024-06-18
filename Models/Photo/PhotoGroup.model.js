const {DataTypes} = require('sequelize');
module.exports = (sequelize) => {
    sequelize.define(
        'photogroup',
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
            active:
                {
                    type: DataTypes.BOOLEAN,
                },
            moderating:
                {
                    type: DataTypes.BOOLEAN,
                },
        },

        {
            freezeTableName: true,
            tableName: 'photogroups',
        }
    )
}