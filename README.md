README pour le projet Chatbotprofesseur
Prérequis
Node.js (version 14 ou supérieure)
npm ou yarn
Installation
Cloner le dépôt :

bash
Copier le code
git clone https://github.com/sly545/Chatbotprofesseur.git
cd Chatbotprofesseur
Installer les dépendances :
Utilisez npm ou yarn pour installer les dépendances du projet.

bash
Copier le code
npm install
# ou
yarn install
Configurer les variables d'environnement :
Créez un fichier .env à la racine du projet et ajoutez les clés API nécessaires. Voici comment le fichier .env doit être structuré :

env
Copier le code
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key
Comment obtenir les clés API :
Eleven Labs API Key :

Allez sur Eleven Labs et créez un compte.
Naviguez vers la section des clés API dans votre tableau de bord utilisateur.
Copiez votre clé API et collez-la dans le fichier .env comme indiqué ci-dessus.
Mistral API Key :

Allez sur Mistral et créez un compte.
Naviguez vers la section des clés API dans votre tableau de bord utilisateur.
Copiez votre clé API et collez-la dans le fichier .env comme indiqué ci-dessus.
Utilisation
Lancer l'application :

bash
Copier le code
npm run dev
# ou
yarn dev
Accéder à l'application :
Ouvrez votre navigateur et allez à l'adresse http://localhost:3000.

Fonctionnalités
Sélection d'un chatbot
Reconnaissance vocale
Synthèse vocale
Menu déroulant
Structure du projet
components/ : Contient les composants React du projet.
Chatbot.tsx
Tigrou.tsx
Foxy.tsx
SelectionCards.tsx
Menu.tsx
Carrouselle.tsx
Loader.tsx
Aide
Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur le dépôt GitHub.