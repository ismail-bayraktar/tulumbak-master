import productModel from '../models/ProductModel.js';

/**
 * Stock Check Middleware
 * Validates and updates product stock during order placement
 */
export const checkStockAvailability = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.json({ success: false, message: 'Items array is required' });
    }

    // Check stock for each item
    const stockCheckResults = await Promise.all(
      items.map(async (item) => {
        const product = await productModel.findById(item.id);

        if (!product) {
          return { available: false, message: `Product ${item.id} not found` };
        }

        const requestedQuantity = item.quantity || 1;
        const availableStock = product.stock || 0;

        if (availableStock < requestedQuantity) {
          return {
            available: false,
            message: `${product.name} - Yetersiz stok. Mevcut: ${availableStock}, İstenen: ${requestedQuantity}`,
          };
        }

        return { available: true, product };
      })
    );

    // Check if all items are available
    const unavailableItems = stockCheckResults.filter((result) => !result.available);

    if (unavailableItems.length > 0) {
      return res.json({
        success: false,
        message: 'Yetersiz stok',
        unavailableItems: unavailableItems.map((item) => item.message),
      });
    }

    // Attach stock info to request for use in next middleware/controller
    req.stockCheckResults = stockCheckResults;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Reduce stock after successful order placement
 * @param {Array} items - Order items
 */
export const reduceStock = async (items) => {
  try {
    const stockUpdates = items.map(async (item) => {
      const product = await productModel.findById(item.id);

      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      const newStock = (product.stock || 0) - (item.quantity || 1);

      if (newStock < 0) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      await productModel.findByIdAndUpdate(item.id, {
        stock: newStock,
      });

      return { productId: item.id, newStock };
    });

    await Promise.all(stockUpdates);
    console.log('Stock reduced successfully');
  } catch (error) {
    console.error('Error reducing stock:', error);
    throw error;
  }
};

/**
 * Check if stock is below threshold and send alert
 * @param {String} productId - Product ID
 */
export const checkLowStockAlert = async (productId) => {
  try {
    const product = await productModel.findById(productId);

    if (!product) return;

    const LOW_STOCK_THRESHOLD = 10; // Min stock level for alert

    if (product.stock <= LOW_STOCK_THRESHOLD) {
      console.warn(
        `⚠️ Low stock alert: ${product.name} (ID: ${productId}) - Stock: ${product.stock}`
      );
      // TODO: Send notification to admin
    }
  } catch (error) {
    console.error('Error checking low stock:', error);
  }
};

/**
 * Filter products with available stock
 * @param {Array} products - Product array
 * @returns {Array} - Products with stock > 0
 */
export const filterProductsInStock = (products) => {
  return products.filter((product) => (product.stock || 0) > 0);
};

export default {
  checkStockAvailability,
  reduceStock,
  checkLowStockAlert,
  filterProductsInStock,
};

