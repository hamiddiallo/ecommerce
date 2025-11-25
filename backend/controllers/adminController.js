const supabase = require('../config/supabase');

async function getStats(req, res) {
    try {
        // Products count
        const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        // Orders count
        const { count: ordersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

        // Pending orders count
        const { count: pendingOrdersCount } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        res.json({
            productsCount: productsCount || 0,
            ordersCount: ordersCount || 0,
            pendingOrdersCount: pendingOrdersCount || 0,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getOrderItems(req, res) {
    try {
        const { data, error } = await supabase
            .from('order_items')
            .select('product_name, quantity');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getStats,
    getOrderItems,
};
