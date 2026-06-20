const Order = require ('../models/Order');
const Cart = require ('../models/Cart');
const Product = require ('../models/Product');

// crear un pedido a partir del carrito actual
const createOrder = async (req , res ) => {
    try{
        const cart = await Cart.findOne({user: req.user._id})
        .populate('items.product');
        if (!cart || cart.items.length === 0){
            return res.status(400).json ({message: 'Cart is empty'});
        }
        let total = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for "${product.name}". Available: ${product.stock}`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                unitPrice: product.price
            });

            total += product.price * item.quantity;
            }
            //pedido en la base de datos
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            total,
            status: 'paid'
        });

        // $inc con número negativo resta la cantidad al stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error: error.message });
    }
};

// obtener los pedidos del usuario logueado
const getMyOrders = async (req, res) => {
    try {
        // sort -1 trae los pedidos más recientes primero
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error getting orders', error: error.message });
    }
};

// detalle de un pedido específico
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Un cliente solo puede ver sus propios pedidos
        const isOwner = order.user.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error getting order', error: error.message });
    }
};

// todos los pedidos (solo admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error getting orders', error: error.message });
    }
};

// cambiar estado de un pedido (solo admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status', error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
