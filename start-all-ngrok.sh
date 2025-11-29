#!/bin/bash

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok n'est pas installé."
    exit 1
fi

# Get the authtoken from the default config if possible, or ask user to ensure it's set
# We will assume the user has already run 'ngrok config add-authtoken' as per previous steps.
# We need to create a temporary config file that includes the user's default authtoken if we want to be robust,
# but ngrok merges configs. Let's try running with the local config file.

echo "🚀 Démarrage de ngrok pour Frontend (3000) et Backend (5000)..."

# Start ngrok with the configuration file
ngrok start --all --config=ngrok.yml > /dev/null &
NGROK_PID=$!

# Give it a moment to start
sleep 3

# Get the public URLs
FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https:[^"]*"' | head -1 | cut -d'"' -f4)
BACKEND_TCP=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"tcp:[^"]*"' | head -1 | cut -d'"' -f4)

# Convert tcp:// to http:// for the backend API URL
BACKEND_URL=$(echo $BACKEND_TCP | sed 's/tcp:\/\//http:\/\//')

if [ -z "$FRONTEND_URL" ] || [ -z "$BACKEND_URL" ]; then
    echo "❌ Impossible de récupérer les URLs. Vérifiez que ngrok fonctionne."
    kill $NGROK_PID
    exit 1
fi

echo "✅ Tunnels actifs !"
echo "---------------------------------------------------"
echo "🌍 Frontend (Public) : $FRONTEND_URL"
echo "⚙️  Backend (API)    : $BACKEND_URL"
echo "---------------------------------------------------"
echo ""
echo "⚠️  ACTION REQUISE :"
echo "1. Copiez l'URL Backend ($BACKEND_URL) et mettez-la dans 'frontend/.env.local' (NEXT_PUBLIC_API_URL)"
echo "2. Copiez l'URL Frontend ($FRONTEND_URL) et ajoutez-la dans Supabase > Auth > Redirect URLs"
echo "3. Redémarrez le frontend (npm run dev)"
echo ""
echo "Appuyez sur CTRL+C pour arrêter ngrok."

# Keep script running
wait $NGROK_PID
