module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'Carts',
    timestamps: false
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'items'
    });
  };

  return Cart;
};