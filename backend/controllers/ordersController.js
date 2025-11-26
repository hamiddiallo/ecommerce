const supabase = require('../config/supabase');

async function createOrder(req, res) {
    const { userId, checkoutData } = req.body;

    if (!userId || !checkoutData) return res.status(400).json({ error: 'Missing data' });

    try {
        // Get cart items
        const { data: cartItems, error: cartError } = await supabase
            .from('cart')
            .select('*, products(*)')
            .eq('user_id', userId);

        if (cartError || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Panier vide' });
        }

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);

        // Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total,
                status: 'pending',
                full_name: checkoutData.fullName,
                phone: checkoutData.phone,
                shipping_address: checkoutData.shippingAddress,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.products.name,
            quantity: item.quantity,
            unit_price: item.products.price,
            total_price: item.products.price * item.quantity,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

        if (itemsError) {
            // Rollback
            await supabase.from('orders').delete().eq('id', order.id);
            throw itemsError;
        }

        // Clear cart
        await supabase.from('cart').delete().eq('user_id', userId);

        res.json({ success: true, orderId: order.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getOrders(req, res) {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(name, image_url))')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status required' });

    try {
        // Check if order is locked
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('is_locked')
            .eq('id', id)
            .single();

        if (fetchError || !order) return res.status(404).json({ error: 'Order not found' });
        if (order.is_locked) return res.status(403).json({ error: 'Order is locked by client' });

        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function cancelOrder(req, res) {
    const { id } = req.params;
    const { userId } = req.body; // Passed from frontend for verification

    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        // Verify ownership and status
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('status, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !order) return res.status(404).json({ error: 'Order not found' });
        if (order.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({ error: 'Cannot cancel order in current status' });
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'cancelled', is_locked: true })
            .eq('id', id);

        if (updateError) throw updateError;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function unlockOrder(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        // Verify ownership
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('user_id, is_locked')
            .eq('id', id)
            .single();

        if (fetchError || !order) return res.status(404).json({ error: 'Order not found' });
        if (order.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });
        if (!order.is_locked) return res.status(400).json({ error: 'Order is not locked' });

        const { error: updateError } = await supabase
            .from('orders')
            .update({ is_locked: false })
            .eq('id', id);

        if (updateError) throw updateError;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus,
    cancelOrder,
    unlockOrder
};
