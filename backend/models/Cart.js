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
      defaultValue: sequelize.literal('GETDATE()'), // Use SQL Server's GETDATE() function
      allowNull: false,
    },
  }, {
    tableName: 'Cart', // Match the SQL table name
    timestamps: false, // Disable Sequelize's automatic timestamps
    uniqueKeys: {
      unique_cart: {
        fields: ['user_id', 'product_id'], // Match the unique constraint
      },
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Customer, {
      foreignKey: 'user_id',
      as: 'customer',
    });
    Cart.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  };

  return Cart;
};

