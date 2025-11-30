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

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: 'Le nom et le slug sont requis' });
        }

        const { data, error } = await supabase
            .from('categories')
            .update({ name, slug, description })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Échec de la modification de la catégorie' });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category has products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id')
            .eq('category_id', id)
            .limit(1);

        if (productsError) throw productsError;

        if (products && products.length > 0) {
            return res.status(400).json({
                error: 'Impossible de supprimer une catégorie contenant des produits. Veuillez réassigner ou supprimer les produits d\'abord.'
            });
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Échec de la suppression de la catégorie' });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
