const supabase = require('../config/supabase');

async function getCategories(req, res) {
    try {
        // Note: Assuming 'categories' table exists. If not, we might need to create it or stick to JSON if it's static.
        // Given the previous JSON had categories, we should try to fetch from DB or fallback/seed.
        // For now, let's assume we want to use the DB.
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createCategory(req, res) {
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCategories,
    createCategory
};
