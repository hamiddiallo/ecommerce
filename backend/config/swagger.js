const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce Guinée API',
            version: '1.0.0',
            description: 'API REST pour la plateforme e-commerce Mouctar DH Distribution',
            contact: {
                name: 'Support API',
                email: 'support@mdhdistribution.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Serveur de développement',
            },
            {
                url: 'https://api.mdhdistribution.com',
                description: 'Serveur de production',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT Supabase pour l\'authentification'
                },
            },
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        unit: { type: 'string' },
                        stock: { type: 'integer' },
                        category_id: { type: 'string', format: 'uuid' },
                        image_url: { type: 'string' },
                        images: { type: 'array', items: { type: 'string' } },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                CartItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        user_id: { type: 'string', format: 'uuid' },
                        product_id: { type: 'string', format: 'uuid' },
                        quantity: { type: 'integer' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        user_id: { type: 'string', format: 'uuid' },
                        status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
                        total_amount: { type: 'number' },
                        full_name: { type: 'string' },
                        phone: { type: 'string' },
                        shipping_address: { type: 'string' },
                        city: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
        tags: [
            { name: 'Products', description: 'Gestion des produits' },
            { name: 'Categories', description: 'Gestion des catégories' },
            { name: 'Cart', description: 'Gestion du panier' },
            { name: 'Orders', description: 'Gestion des commandes' },
            { name: 'Favorites', description: 'Gestion des favoris' },
            { name: 'Admin', description: 'Routes administrateur' },
            { name: 'Upload', description: 'Upload de fichiers' },
        ],
    },
    apis: ['./routes/*.js'], // Chemins vers les fichiers contenant les annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
