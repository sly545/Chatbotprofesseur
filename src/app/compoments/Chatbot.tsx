"use client"; // Indique que ce fichier doit être traité comme un composant côté client
import React, { useState } from 'react'; // Importation des fonctionnalités de React
import axios from 'axios'; // Importation du module Axios pour effectuer des requêtes HTTP
import styles from '../compoments/Chatbot.module.css'; // Importation des styles CSS du composant

// Définition de l'interface IMessage pour représenter un message dans le chatbot
interface IMessage {
  author: 'user' | 'bot'; // L'auteur peut être l'utilisateur ou le chatbot
  content: string; // Contenu textuel du message
  audioUrl?: string; // URL du blob audio pour le message (optionnel)
}

// Définition du composant Chatbot
const Chatbot: React.FC = () => {
  // État local pour stocker le message de l'utilisateur et les messages échangés
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Fonction pour récupérer et jouer l'audio depuis ElevenLabs
  const fetchAudioFromElevenLabs = async (text: string, index: number) => {
    const currentMessage = messages[index]; // Récupère le message actuel par son index
    if (currentMessage.audioUrl) { // Vérifie si une URL audio est déjà disponible
      const audio = new Audio(currentMessage.audioUrl); // Crée un nouvel élément audio
      audio.play(); // Joue l'audio
      return; // Sort de la fonction
    }

    try {
      // Configuration de la requête vers l'API ElevenLabs pour générer l'audio
      const options = {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_id: "eleven_multilingual_v2",
          text: text,
          voice_settings: {
            "similarity_boost": 1,
            "stability": 1,
            "style": 0,
            "use_speaker_boost": true
          }
        })
      };

      // Envoi de la requête HTTP pour générer l'audio
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/39NYW1oeLie2ykDvLsaF?output_format=mp3_22050_32', options);
      const blob = await response.blob(); // Récupère le blob audio depuis la réponse
      const audioUrl = URL.createObjectURL(blob); // Crée une URL pour le blob audio

      // Met à jour l'état des messages avec l'URL du blob audio
      setMessages(prevMessages =>
        prevMessages.map((msg, msgIndex) =>
          msgIndex === index ? { ...msg, audioUrl } : msg
        )
      );

      // Crée un nouvel élément audio et joue l'audio
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error fetching audio from ElevenLabs:', error); // Gestion des erreurs
    }
  };

  // Fonction pour envoyer le message de l'utilisateur à l'API Mistral
  const sendMessageToMistral = async (message: string) => {
    if (!message) return; // Vérifie si le message est vide, alors quitte la fonction

    // Ajoute le message de l'utilisateur à la liste des messages
    setMessages(prev => [...prev, { author: 'user', content: message }]);

    // Contexte pour la conversation avec Mistral
    const lapieContext = [
      {
        "role": "system",
        "content": "tu es Lapie, un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre.",
      },
    ];

    try {
      // Envoi du message de l'utilisateur à l'API Mistral pour obtenir une réponse
      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model: "mistral-medium",
          messages: lapieContext.concat([{ role: "user", content: message }]),
          safe_prompt: false
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`
          }
        }
      );

      // Récupère la réponse de Mistral et l'ajoute à la liste des messages
      const lapieResponse = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { author: 'bot', content: lapieResponse }]);
    } catch (error) {
      console.error('Error sending message to Mistral:', error); // Gestion des erreurs
    }
  };

  // Rendu du composant Chatbot
  return (
    <div>
      <div className={styles.container}>
        {/* Affichage des messages dans le chat */}
        {messages.map((msg, index) => (
          <div key={index} className={msg.author === 'user' ? styles.messageUser : styles.messageBot}>
            {msg.content}
            {/* Bouton pour écouter l'audio (uniquement pour les réponses du chatbot) */}
            {msg.author === 'bot' && (
              <button onClick={() => fetchAudioFromElevenLabs(msg.content, index)}>
                🔊 Écouter
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Champ de saisie du message de l'utilisateur */}
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Écrivez votre message ici"
        className={styles.input}
      />
      {/* Bouton pour envoyer le message */}
      <button
        onClick={() => {
          sendMessageToMistral(userMessage); // Appelle la fonction pour envoyer le message à Mistral
          setUserMessage(''); // Réinitialise le champ de saisie du message
        }}
        className={styles.button}
      >
        Envoyer
      </button>
    </div>
  );
};

export default Chatbot; // Exportation du composant Chatbot
