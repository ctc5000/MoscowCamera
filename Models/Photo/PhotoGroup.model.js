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
            rejected:
                {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false
                },
        },

        {
            freezeTableName: true,
            tableName: 'photogroups',
        }
    )
}