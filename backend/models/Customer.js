module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Name must be between 2 and 255 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        },
        notEmpty: {
          msg: 'Email cannot be empty'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address cannot be empty'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('customer', 'admin'),
      defaultValue: 'customer',
      validate: {
        isIn: {
          args: [['customer', 'admin']],
          msg: 'Role must be either customer or admin'
        }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Customers',
    timestamps: false,
    hooks: {
      beforeCreate: (customer) => {
        if (customer.email) {
          customer.email = customer.email.toLowerCase();
        }
      }
    },
    // Add these class methods for authentication
    classMethods: {
      findByEmail: function(email) {
        return this.findOne({ where: { email: email.toLowerCase() } });
      },
      findById: function(id) {
        return this.findByPk(id);
      }
    }
  });

  Customer.associate = (models) => {
    Customer.hasMany(models.Cart, {
      foreignKey: 'customer_id',
      as: 'carts'
    });
    Customer.hasMany(models.Order, {
      foreignKey: 'customer_id',
      as: 'orders'
    });
  };

  // Instance method to generate JWT token
  Customer.prototype.generateAuthToken = function() {
    const token = jwt.sign(
      { 
        customerId: this.customer_id, 
        email: this.email,
        role: this.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  };

  Customer.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  };

  return Customer;
};