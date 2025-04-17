module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      order_id: {
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
      order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    }, {
      tableName: 'Orders',
      timestamps: false
    });
  
    Order.associate = (models) => {
      Order.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'items'
      });
    };
  
    return Order;
  };