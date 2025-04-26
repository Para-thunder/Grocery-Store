/* module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id',
      },
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
  }, {
    tableName: 'Orders',
    timestamps: false,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items',
    });
  };

  return Order;
}; */

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id',
      },
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'Total amount must be at least 0.01'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    shipping_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Shipping address is required'
        },
        notEmpty: {
          msg: 'Shipping address cannot be empty'
        },
        len: {
          args: [10, 255],
          msg: 'Shipping address must be between 10 and 255 characters'
        }
      }
    },
    payment_method: {
      type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'cash_on_delivery'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Payment method is required'
        },
        notEmpty: {
          msg: 'Payment method cannot be empty'
        }
      }
    }
  }, {
    tableName: 'Orders',
    timestamps: false,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items',
    });
  };

  return Order;
};