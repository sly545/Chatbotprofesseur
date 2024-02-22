"use client"; // Assure que ce fichier est traité comme un composant client
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import styles from  '../compoments/Chatbot.module.css';


// Définition de l'interface pour les messages
interface IMessage {
  author: 'user' | 'bot';
  content: string;
}
const fetchAudioFromElevenLabs = async (text: string) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY, // Utilisez votre clé API réelle ici
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model_id: "eleven_multilingual_v2",
        text: text, // Ici, nous utilisons le paramètre `text` pour rendre la requête dynamique
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
    console.log(audioUrl); // Log l'URL du blob pour débogage
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Error fetching audio from ElevenLabs:', error);
  }
};




const Chatbot: React.FC = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]); // Ajouté ici

  const sendMessageToMistral = async (message: string) => {
    if (!message) return;

    // Ajoutez le message de l'utilisateur à l'état 'messages' avant d'envoyer à l'API
    setMessages(prev => [...prev, { author: 'user', content: message }]);
    
    const lapieContext = [
      {
        "role": "system",
        "content":"tu est lapie un professeur de matematique et tu aidet les enfants a faire leur devoir tu ne dois pas donner les reponse mais les aider a reussir a comprendre.",
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
      // Ici, au lieu de simplement mettre à jour 'botResponse',
      // ajoutez la réponse du bot à l'état 'messages'
      setMessages(prev => [...prev, { author: 'bot', content: lapieResponse }]);
    } catch (error: unknown) {
      // Gestion des erreurs identique à votre implémentation actuelle...
    }
  };

  // La logique pour gérer l'envoi de messages et la mise à jour de l'état reste ici...

  return (
    <div>
    <div className={styles.container}>
      {messages.map((msg, index) => (
        <div key={index} className={msg.author === 'user' ? styles.messageUser : styles.messageBot}>
          {msg.content}
          {msg.author === 'bot' && (
          <button onClick={() => fetchAudioFromElevenLabs(msg.content)}>
          🔊 Écouter
        </button>
        
          )}
        </div>
      ))}
    </div>
    <input
      type="text"
      value={userMessage}
      onChange={(e) => setUserMessage(e.target.value)}
      placeholder="Écrivez votre message ici"
      className={styles.input}
    />
    <button 
      onClick={() => {
        sendMessageToMistral(userMessage);
        setUserMessage(''); // Réinitialise le champ après l'envoi
      }}
      className={styles.button}
    >
      Envoyer
    </button>
  </div>
  );
};

export default Chatbot;
