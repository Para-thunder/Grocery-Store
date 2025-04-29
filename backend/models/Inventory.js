module.exports = (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
      inventory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Products',
          key: 'product_id',
        },
      },
      available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0, // Ensure quantity is non-negative
        },
      },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'Inventory',
      timestamps: false,
    });
  
    Inventory.associate = (models) => {
      Inventory.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    };
  
    return Inventory;
  };