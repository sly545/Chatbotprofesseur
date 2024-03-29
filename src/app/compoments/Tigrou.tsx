// Indique que ce fichier doit être traité comme un composant côté client
"use client";
import React, { useState, useRef } from 'react'; // Importation de React, useState, et useRef
import axios from 'axios'; // Importation d'Axios pour les requêtes HTTP
import styles from '../compoments/Tigrou.module.css'; // Assurez-vous que le chemin est correct
import Carrouselle from './carrouselle';  
// Composant Loader pour l'animation pendant le chargement
import Loader from '../compoments/Loader'; // Assurez-vous que le chemin d'accès est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

// Définition de l'interface IMessage
interface IMessage {
  author: 'user' | 'bot';
  content: string;
  audioUrl?: string; // URL optionnelle pour le blob audio
}

const Chatbot: React.FC = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); // État de chargement
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAudioFromElevenLabs = async (text: string, index: number) => {
    setIsLoading(true); // Commence le chargement
    const currentMessage = messages[index];
    if (currentMessage.audioUrl) {
      setIsLoading(false); // Arrête le chargement si l'URL audio existe déjà
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
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? '' ,
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

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/OG2Slr3235xGcdCqVh4Z?output_format=mp3_22050_32', options);
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
    } finally {
      setIsLoading(false); // Arrête le chargement après la requête
    }
  };

  const sendMessageToMistral = async (message: string) => {
    if (!message) return;
    setIsLoading(true); // Commence le chargement
    setMessages(prev => [...prev, { author: 'user', content: message }]);

    // Contexte LAPI ajouté dans la requête à Mistral
    const lapieContext = [
      {
        "role": "system",
        "content": "Tu es tigrou,un perssonage sympatique professeur d'histoire geo et tu aides les enfants à faire leur devoir et a reviser leur leçon.",
      },
 
      {
        "role": "system",
        "content": "tu utilisera le tutoiment ! ",
      },
    ];

    try {
      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model: "mistral-small",
          messages: lapieContext.concat([{ role: "user", content: message }]), // Ajout du message utilisateur au contexte LAPI
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
    } finally {
      setIsLoading(false); // Arrête le chargement après la requête
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToMistral(userMessage);
    setUserMessage('');
  };
 


  const images = [
    { src: '/images/tigrou1.webp', alt: 'Image 1' },
    { src: '/images/tigrou1.webp', alt: 'Image 2' },
  ];
    
  return (
    <div className={styles.chatbotwrap}>
      <div className={styles.conteneurglobal}>
        <div className={styles.sizecarou}>  
      <Carrouselle images={images} />
      </div>
      {/* Ajout d'une div pour l'effet de transparence sur les messages pendant le chargement */}
      <div className={`${styles.container} ${isLoading ? styles.translucent : ''}`}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.author === 'user' ? styles.messageUser : styles.messageBot}>
            {msg.content}
            {msg.author === 'bot' && (
              <button onClick={() => fetchAudioFromElevenLabs(msg.content, index)} className={styles.buttonWithIcon }>
              <FontAwesomeIcon icon={faVolumeUp} className={styles.iconStyle} />
            </button>
            
            )}
          </div>
        ))}
        {/* Le Loader est affiché au-dessus des messages, permettant leur visibilité à travers une transparence */}
        {isLoading && <div className={styles.loaderOverlay}><Loader /></div>}
        
      <form className={styles.fromflex} onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Écrivez votre message ici"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Envoyer</button>
      </form>
      
      </div>
      </div>
    </div>
  );
};

export default Chatbot;
