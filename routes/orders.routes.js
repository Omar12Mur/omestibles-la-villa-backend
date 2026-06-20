const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orders.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas de pedidos requieren estar logueado
router.use(verifyToken);

// Rutas de cliente
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

// Rutas de administrador
router.get('/admin/all', isAdmin, getAllOrders);
router.put('/:id/status', isAdmin, updateOrderStatus);

module.exports = router;