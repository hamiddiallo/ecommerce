const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Middleware to verify Supabase JWT token
 * Adds user object to req.user if valid
 */
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token d\'authentification manquant' })
        }

        const token = authHeader.substring(7) // Remove 'Bearer ' prefix

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return res.status(401).json({ error: 'Token invalide ou expiré' })
        }

        // Add user to request object
        req.user = user
        next()
    } catch (error) {
        console.error('Auth error:', error)
        return res.status(401).json({ error: 'Erreur d\'authentification' })
    }
}

/**
 * Middleware to verify admin role
 * Must be used after verifyToken
 */
async function requireAdmin(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié' })
        }

        // Check if user is admin
        const { data: adminUser, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', req.user.id)
            .single()

        if (error || !adminUser) {
            return res.status(403).json({ error: 'Accès refusé - Droits administrateur requis' })
        }

        next()
    } catch (error) {
        console.error('Admin auth error:', error)
        return res.status(403).json({ error: 'Erreur de vérification des droits' })
    }
}

module.exports = { verifyToken, requireAdmin }
