"use client"; // Indique que ce fichier doit être traité comme un composant côté client
import React, { useState, useRef } from 'react'; // Importation des fonctionnalités de React et useRef
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
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null); // useRef pour gérer l'audio courant

  const fetchAudioFromElevenLabs = async (text: string, index: number) => {
    const currentMessage = messages[index];
    if (currentMessage.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(currentMessage.audioUrl);
      audio.play();
      audioRef.current = audio;
      return;
    }

    try {
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

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/39NYW1oeLie2ykDvLsaF?output_format=mp3_22050_32', options);
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);

      setMessages(prevMessages =>
        prevMessages.map((msg, msgIndex) =>
          msgIndex === index ? { ...msg, audioUrl } : msg
        )
      );

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioUrl);
      audio.play();
      audioRef.current = audio;
    } catch (error) {
      console.error('Error fetching audio from ElevenLabs:', error);
    }
  };

  const sendMessageToMistral = async (message: string) => {
    if (!message) return;
    setMessages(prev => [...prev, { author: 'user', content: message }]);

    const lapieContext = [
      {
        "role": "system",
        "content": "tu es Lapie, un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre.",
      },
    ];

    try {
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

      const lapieResponse = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { author: 'bot', content: lapieResponse }]);
    } catch (error) {
      console.error('Error sending message to Mistral:', error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToMistral(userMessage);
    setUserMessage('');
  };

  return (
    <div>
      <div className={styles.container}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.author === 'user' ? styles.messageUser : styles.messageBot}>
            {msg.content}
            {msg.author === 'bot' && (
              <button onClick={() => fetchAudioFromElevenLabs(msg.content, index)}>
                🔊 Écouter
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Écrivez votre message ici"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
