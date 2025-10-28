import orderModel from "../models/OrderModel.js";
import productModel from "../models/ProductModel.js";
import userModel from "../models/UserModel.js";

/**
 * Daily sales report
 */
const dailySales = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const orders = await orderModel.find({
      date: { $gte: startOfDay.getTime(), $lte: endOfDay.getTime() }
    });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate by payment method
    const paymentMethodStats = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'UNKNOWN';
      paymentMethodStats[method] = (paymentMethodStats[method] || 0) + 1;
    });
    
    res.json({
      success: true,
      report: {
        date: targetDate.toISOString().split('T')[0],
        totalRevenue,
        totalOrders,
        averageOrderValue,
        paymentMethodStats,
        ordersCount: orders.length
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Weekly sales report
 */
const weeklySales = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    const orders = await orderModel.find({
      date: { $gte: weekAgo.getTime(), $lte: today.getTime() }
    });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const dailyBreakdown = {};
    
    orders.forEach(order => {
      const orderDate = new Date(order.date).toISOString().split('T')[0];
      if (!dailyBreakdown[orderDate]) {
        dailyBreakdown[orderDate] = { revenue: 0, orders: 0 };
      }
      dailyBreakdown[orderDate].revenue += order.amount;
      dailyBreakdown[orderDate].orders += 1;
    });
    
    res.json({
      success: true,
      report: {
        period: 'week',
        totalRevenue,
        totalOrders: orders.length,
        dailyBreakdown
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Monthly sales report
 */
const monthlySales = async (req, res) => {
  try {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    
    const orders = await orderModel.find({
      date: { $gte: monthAgo.getTime(), $lte: today.getTime() }
    });
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    
    res.json({
      success: true,
      report: {
        period: 'month',
        totalRevenue,
        totalOrders: orders.length,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Product analytics
 */
const productAnalytics = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const query = {};
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom).getTime();
      if (dateTo) query.date.$lte = new Date(dateTo).getTime();
    }
    
    const orders = await orderModel.find(query);
    
    // Calculate product sales
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.id || item.productId;
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.name,
            totalSold: 0,
            revenue: 0,
            orders: 0
          };
        }
        productSales[productId].totalSold += item.quantity || 1;
        productSales[productId].revenue += (item.price || 0) * (item.quantity || 1);
        productSales[productId].orders += 1;
      });
    });
    
    // Get product details
    const productDetails = await productModel.find({});
    const productMap = {};
    productDetails.forEach(product => {
      productMap[product._id.toString()] = product;
    });
    
    // Add product details to sales data
    const enrichedSales = Object.entries(productSales).map(([productId, sales]) => ({
      productId,
      ...sales,
      product: productMap[productId] || null
    }));
    
    // Sort by revenue
    enrichedSales.sort((a, b) => b.revenue - a.revenue);
    
    res.json({
      success: true,
      analytics: {
        totalProducts: enrichedSales.length,
        topProducts: enrichedSales.slice(0, 10),
        allProducts: enrichedSales
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * User behavior analytics
 */
const userBehavior = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const query = {};
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom).getTime();
      if (dateTo) query.date.$lte = new Date(dateTo).getTime();
    }
    
    const orders = await orderModel.find(query);
    const users = await userModel.find({});
    
    // User orders count
    const userOrderCount = {};
    orders.forEach(order => {
      const userId = order.userId;
      userOrderCount[userId] = (userOrderCount[userId] || 0) + 1;
    });
    
    // Find top customers
    const topCustomers = Object.entries(userOrderCount)
      .map(([userId, orderCount]) => ({
        userId,
        orderCount,
        user: users.find(u => u._id.toString() === userId) || null
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 10);
    
    // Calculate repeat customer rate
    const totalUsers = users.length;
    const usersWithOrders = Object.keys(userOrderCount).length;
    const repeatCustomerRate = totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;
    
    res.json({
      success: true,
      behavior: {
        totalUsers,
        usersWithOrders,
        repeatCustomerRate: repeatCustomerRate.toFixed(2),
        topCustomers,
        averageOrdersPerUser: usersWithOrders > 0 ? orders.length / usersWithOrders : 0
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Delivery status report
 */
const deliveryStatus = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    
    // Group by status
    const statusCount = {};
    orders.forEach(order => {
      const status = order.status || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // Group by courier status
    const courierStatusCount = {};
    orders.forEach(order => {
      const courierStatus = order.courierStatus || 'Unknown';
      courierStatusCount[courierStatus] = (courierStatusCount[courierStatus] || 0) + 1;
    });
    
    // Calculate delivery time
    const completedOrders = orders.filter(order => order.status === 'Teslim Edildi');
    const totalDeliveryTime = completedOrders.reduce((sum, order) => {
      // Calculate delivery time (mock)
      return sum + (24 * 60 * 60 * 1000); // 24 hours average
    }, 0);
    
    const averageDeliveryTime = completedOrders.length > 0 
      ? totalDeliveryTime / completedOrders.length 
      : 0;
    
    res.json({
      success: true,
      delivery: {
        totalOrders: orders.length,
        statusCount,
        courierStatusCount,
        averageDeliveryTime: averageDeliveryTime / (60 * 60 * 1000) // Convert to hours
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * Overall statistics dashboard
 */
const dashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // This month stats
    const thisMonthOrders = await orderModel.find({
      date: { $gte: thisMonth.getTime() }
    });
    
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.amount, 0);
    const thisMonthOrderCount = thisMonthOrders.length;
    
    // Last month stats
    const lastMonthOrders = await orderModel.find({
      date: { $gte: lastMonth.getTime(), $lt: thisMonth.getTime() }
    });
    
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.amount, 0);
    const lastMonthOrderCount = lastMonthOrders.length;
    
    // Calculate growth
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)
      : '0';
    
    // Pending orders
    const pendingOrders = await orderModel.find({ status: { $ne: 'Teslim Edildi' } });
    
    // Low stock products
    const products = await productModel.find({});
    const lowStockProducts = products.filter(p => (p.stock || 0) <= 10);
    
    res.json({
      success: true,
      dashboard: {
        thisMonth: {
          revenue: thisMonthRevenue,
          orders: thisMonthOrderCount
        },
        lastMonth: {
          revenue: lastMonthRevenue,
          orders: lastMonthOrderCount
        },
        growth: {
          revenue: revenueGrowth + '%',
          orders: lastMonthOrderCount > 0 
            ? ((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount * 100).toFixed(2) + '%'
            : '0%'
        },
        pendingOrders: pendingOrders.length,
        lowStockProducts: lowStockProducts.length,
        totalProducts: products.length,
        totalUsers: await userModel.countDocuments({})
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  dailySales,
  weeklySales,
  monthlySales,
  productAnalytics,
  userBehavior,
  deliveryStatus,
  dashboardStats
};

