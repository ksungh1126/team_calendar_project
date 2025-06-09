const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Friend = sequelize.define('Friend', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    }
  });

  return Friend;
}; 