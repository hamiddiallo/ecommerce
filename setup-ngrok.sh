#!/bin/bash

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok n'est pas installé."
    echo "Veuillez l'installer avec : brew install --cask ngrok"
    echo "Puis authentifiez-vous : ngrok config add-authtoken <votre_token>"
    exit 1
fi

echo "🚀 Démarrage de ngrok pour le backend (port 5000)..."
# Start ngrok in the background
ngrok http 5000 > /dev/null &
NGROK_PID=$!

# Give it a moment to start
sleep 3

# Get the public URL
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PUBLIC_URL" ]; then
    echo "❌ Impossible de récupérer l'URL ngrok. Vérifiez que ngrok fonctionne."
    kill $NGROK_PID
    exit 1
fi

echo "✅ Backend accessible sur : $PUBLIC_URL"
echo ""
echo "⚠️  ACTION REQUISE :"
echo "1. Copiez cette URL : $PUBLIC_URL"
echo "2. Ouvrez le fichier 'frontend/.env.local'"
echo "3. Remplacez NEXT_PUBLIC_API_URL='http://localhost:5000' par NEXT_PUBLIC_API_URL='$PUBLIC_URL'"
echo "4. Redémarrez le frontend (npm run dev)"
echo ""
echo "Appuyez sur CTRL+C pour arrêter ngrok."

# Keep script running
wait $NGROK_PID
