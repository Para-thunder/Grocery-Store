const validateStock = (items, priceMap) => {
    const outOfStockItems = items.filter(item => {
      return priceMap[item.product_id].stock < item.quantity;
    });
    
    if (outOfStockItems.length > 0) {
      const errors = outOfStockItems.map(item => ({
        product_id: item.product_id,
        requested: item.quantity,
        available: priceMap[item.product_id].stock
      }));
      throw new Error('Insufficient stock', { cause: errors });
    }
  };
  
  const calculateTotalPrice = (items, priceMap) => {
    return items.reduce((total, item) => {
      if (!priceMap[item.product_id]) {
        throw new Error(`Price not found for product_id: ${item.product_id}`);
      }
      return total + (priceMap[item.product_id].price * item.quantity);
    }, 0);
  };
  
  module.exports = {
    calculateTotalPrice,
    validateStock
  };