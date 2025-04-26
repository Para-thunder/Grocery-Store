/* const { Product } = require('../models');


const getProductPrices = async (productIds) => {
  try {
    const products = await Product.findAll({
        where: { product_id: productIds },
        attributes: ['product_id', 'price'], // Fetch only product_id and price
      });
      
      console.log("Products fetched:", products);
      
      const productPrices = {};
      products.forEach(product => {
        productPrices[product.product_id] = product.price;
      });
      
      return productPrices;
  } catch (err) {
    console.error("Error fetching product prices:", err);
    throw new Error("Failed to fetch product prices");
  }
};

module.exports = {
  getProductPrices,
}; */

const { Product } = require('../models');

const getProductPrices = async (productIds) => {
  const products = await Product.findAll({
    where: { product_id: productIds },
    attributes: ['product_id', 'price', 'stock_quantity']
  });
  
  const priceMap = {};
  products.forEach(product => {
    priceMap[product.product_id] = {
      price: product.price,
      stock: product.stock_quantity
    };
  });
  
  return priceMap;
};

module.exports = {
  getProductPrices
};