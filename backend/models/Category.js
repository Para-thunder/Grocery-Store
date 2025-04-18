module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Category name cannot be empty'
          },
          len: {
            args: [2, 100],
            msg: 'Category name must be between 2 and 100 characters'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'category_id'
        }
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
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
      tableName: 'Categories',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['category_name']
        },
        {
          fields: ['parent_id']
        }
      ]
    });
  
    Category.associate = (models) => {
      // Self-referential relationship for parent/child categories
      Category.belongsTo(models.Category, {
        as: 'parent',
        foreignKey: 'parent_id'
      });
      Category.hasMany(models.Category, {
        as: 'children',
        foreignKey: 'parent_id'
      });
  
      // Relationship with products
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products'
      });
    };
  
    return Category;
  };