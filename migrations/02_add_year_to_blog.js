const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 2022,
        min: 1991,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'admin');
    await queryInterface.removeColumn('users', 'disabled');
  },
};
