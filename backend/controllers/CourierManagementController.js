import courierModel from '../models/CourierModel.js';
import orderModel from '../models/OrderModel.js';

/**
 * Create a new courier
 */
const createCourier = async (req, res) => {
    try {
        const { name, phone, email, vehicleType, vehiclePlate, workSchedule } = req.body;

        // Validation
        if (!name || !phone) {
            return res.json({ success: false, message: 'Name and phone are required' });
        }

        // Check if phone already exists
        const existingCourier = await courierModel.findOne({ phone });
        if (existingCourier) {
            return res.json({ success: false, message: 'Phone number already registered' });
        }

        const newCourier = new courierModel({
            name,
            phone,
            email: email || '',
            vehicleType: vehicleType || 'motor',
            vehiclePlate: vehiclePlate || '',
            status: 'active',
            workSchedule: workSchedule || {
                startTime: '09:00',
                endTime: '18:00',
                days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            }
        });

        await newCourier.save();

        res.json({ 
            success: true, 
            message: 'Courier created successfully',
            courier: newCourier
        });
    } catch (error) {
        console.error('Error creating courier:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Get all couriers
 */
const getAllCouriers = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        }

        const couriers = await courierModel.find(query).sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            couriers,
            count: couriers.length
        });
    } catch (error) {
        console.error('Error fetching couriers:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Get courier by ID
 */
const getCourierById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const courier = await courierModel.findById(id);
        
        if (!courier) {
            return res.json({ success: false, message: 'Courier not found' });
        }

        res.json({ success: true, courier });
    } catch (error) {
        console.error('Error fetching courier:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Update courier
 */
const updateCourier = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const courier = await courierModel.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!courier) {
            return res.json({ success: false, message: 'Courier not found' });
        }

        res.json({ 
            success: true, 
            message: 'Courier updated successfully',
            courier
        });
    } catch (error) {
        console.error('Error updating courier:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Delete courier
 */
const deleteCourier = async (req, res) => {
    try {
        const { id } = req.params;

        const courier = await courierModel.findByIdAndDelete(id);

        if (!courier) {
            return res.json({ success: false, message: 'Courier not found' });
        }

        // Remove courier from any active orders
        await orderModel.updateMany(
            { courierTrackingId: { $exists: true } },
            { $set: { courierStatus: 'iptal' } }
        );

        res.json({ success: true, message: 'Courier deleted successfully' });
    } catch (error) {
        console.error('Error deleting courier:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Assign order to courier
 */
const assignOrderToCourier = async (req, res) => {
    try {
        const { courierId, orderId } = req.body;

        if (!courierId || !orderId) {
            return res.json({ success: false, message: 'Courier ID and Order ID are required' });
        }

        // Find courier and order
        const courier = await courierModel.findById(courierId);
        const order = await orderModel.findById(orderId);

        if (!courier || !order) {
            return res.json({ success: false, message: 'Courier or order not found' });
        }

        // Check if courier is available
        if (courier.status !== 'active') {
            return res.json({ success: false, message: 'Courier is not available' });
        }

        // Update order
        order.courierTrackingId = `CR-${courierId.slice(-6)}`;
        order.courierStatus = 'yolda';
        await order.save();

        // Update courier
        if (!courier.activeOrders.includes(orderId)) {
            courier.activeOrders.push(orderId);
        }
        if (courier.status === 'active') {
            courier.status = 'busy';
        }
        courier.performance.totalDeliveries += 1;
        await courier.save();

        // Add status history
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
            status: 'Kurye Ata',
            timestamp: Date.now(),
            location: '',
            note: `Assigned to courier: ${courier.name}`,
            updatedBy: 'admin'
        });
        await order.save();

        res.json({ 
            success: true, 
            message: 'Order assigned to courier successfully',
            order,
            courier
        });
    } catch (error) {
        console.error('Error assigning order:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Get courier performance
 */
const getCourierPerformance = async (req, res) => {
    try {
        const { id } = req.params;

        const courier = await courierModel.findById(id);
        
        if (!courier) {
            return res.json({ success: false, message: 'Courier not found' });
        }

        // Get active orders
        const activeOrders = await orderModel.find({
            _id: { $in: courier.activeOrders }
        });

        res.json({ 
            success: true, 
            performance: courier.performance,
            activeOrders: activeOrders.length,
            activeOrdersList: activeOrders
        });
    } catch (error) {
        console.error('Error fetching courier performance:', error);
        res.json({ success: false, message: error.message });
    }
};

/**
 * Update courier status
 */
const updateCourierStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive', 'busy', 'offline'].includes(status)) {
            return res.json({ success: false, message: 'Invalid status' });
        }

        const courier = await courierModel.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!courier) {
            return res.json({ success: false, message: 'Courier not found' });
        }

        res.json({ 
            success: true, 
            message: 'Courier status updated',
            courier
        });
    } catch (error) {
        console.error('Error updating courier status:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createCourier,
    getAllCouriers,
    getCourierById,
    updateCourier,
    deleteCourier,
    assignOrderToCourier,
    getCourierPerformance,
    updateCourierStatus
};

