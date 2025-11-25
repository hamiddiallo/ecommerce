const supabase = require('../config/supabase');

async function getCart(req, res) {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const { data, error } = await supabase
            .from('cart')
            .select('*, products(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addToCart(req, res) {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Missing required fields' });

    try {
        // Check if item exists
        const { data: existingItem } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existingItem) {
            const { error } = await supabase
                .from('cart')
                .update({ quantity: existingItem.quantity + (quantity || 1), updated_at: new Date().toISOString() })
                .eq('id', existingItem.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('cart')
                .insert({ user_id: userId, product_id: productId, quantity: quantity || 1 });
            if (error) throw error;
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCartItem(req, res) {
    const { id } = req.params;
    const { quantity, userId } = req.body;

    try {
        if (quantity <= 0) {
            await supabase.from('cart').delete().eq('id', id).eq('user_id', userId);
        } else {
            const { error } = await supabase
                .from('cart')
                .update({ quantity, updated_at: new Date().toISOString() })
                .eq('id', id)
                .eq('user_id', userId);
            if (error) throw error;
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function removeFromCart(req, res) {
    const { id } = req.params;
    const { userId } = req.query; // or body

    try {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
};
