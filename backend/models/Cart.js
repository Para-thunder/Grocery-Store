module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'product_id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  }, {
    tableName: 'Cart',
    timestamps: false,
    uniqueKeys: {
      UC_Cart: {
        fields: ['user_id', 'product_id'],
      },
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Customer, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Cart.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  };

  return Cart;
};