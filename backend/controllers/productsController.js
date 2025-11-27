const supabase = require('../config/supabase');

async function getProducts(req, res) {
    try {
        const { search, page = 1, limit = 12 } = req.query;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('products')
            .select('*', { count: 'exact' });

        // Add search filter if search term provided
        if (search) {
            // Use ilike for case-insensitive search on name
            query = query.ilike('name', `%${search}%`);
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.json({
            data,
            meta: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getProductById(req, res) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Produit non trouvé' });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createProduct(req, res) {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateProduct(req, res) {
    try {
        const { data, error } = await supabase
            .from('products')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteProduct(req, res) {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
