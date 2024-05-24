import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../compoments/Tigrou.module.css';
import Carrouselle from './carrouselle';
import Loader from '../compoments/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';

interface IMessage {
  content: string;
  audioUrl?: string;
  role: 'user' | 'assistant';
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Chatbot: React.FC = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.continuous = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserMessage(prevMessage => prevMessage + ' ' + transcript);
        setIsRecognizing(false);
        playSound('stop-sound.mp3');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech Recognition Error', event);
        setIsRecognizing(false);
      };

      recognitionRef.current.onspeechend = () => {
        recognitionRef.current?.stop();
        setIsRecognizing(false);
        playSound('stop-sound.mp3');
      };
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [userMessage]);

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecognizing(true);
      playSound('start-sound.mp3');
    } else {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
    }
  };

  const playSound = (soundFile: string) => {
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play();
  };

  const fetchAudioFromElevenLabs = async (text: string, index: number) => {
    setIsLoading(true);
    const currentMessage = messages[index];
    if (currentMessage.audioUrl) {
      setIsLoading(false);
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
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ?? '',
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

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/KmqhNPEmmOndTBOPk4mJ?output_format=mp3_22050_32', options);
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
      setIsLoading(false);
    }
  };

  const sendMessageToMistral = async (message: string) => {
    if (!message) return;
    setIsLoading(true);

    setMessages(prev => [...prev, { content: message, role: 'user' }]);

    const lastTwoMessages = messages.slice(-2);
    const updatedLapieContext = [
      {
        role: "system",
        content: "tu es Tigrou, un personnage mignon inventé. Tu es un professeur de histoir géo et tu aides les enfants à réviser leur leçon. Tu utiliseras le tutoiement pour parler aux enfants.",
      },
      ...lastTwoMessages,
      { role: "user", content: message }
    ];

    try {
      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model: "mistral-small",
          messages: updatedLapieContext,
          safe_prompt: false,
          temperature: 0.5,
          top_p: 1,
          max_tokens: 5120,
          stream: false,
          random_seed: 1337
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`
          }
        }
      );

      const lapieResponse = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { content: lapieResponse, role: 'assistant' }]);
    } catch (error) {
      console.error('Error sending message to Mistral:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessageToMistral(userMessage);
    setUserMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  const images = [
    { src: '/images/tigrou1.webp', alt: 'Image 1' },
    { src: '/images/danton-revolution.webp', alt: 'Image 2' },
    { src: '/images/premierroidefrance.webp', alt: 'Image 3' },
    { src: '/images/apeldu18.webp', alt: 'Image 4' },
  ];

  return (
    <div className={styles.chatbotwrap}>
      <div className={styles.conteneurglobal}>
        <div className={styles.sizecarou}>
          <Carrouselle images={images} />
        </div>
        <div className={`${styles.container} ${isLoading ? styles.translucent : ''}`}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.role === 'user' ? styles.messageUser : styles.messageBot}>
              {msg.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
              {msg.role === 'assistant' && (
                <button onClick={() => fetchAudioFromElevenLabs(msg.content, index)} className={styles.buttonWithIcon}>
                  <FontAwesomeIcon icon={faVolumeUp} className={styles.iconStyle} />
                </button>
              )}
            </div>
          ))}
          {isLoading && <div className={styles.loaderOverlay}><Loader /></div>}
          <form className={styles.fromflex} onSubmit={handleFormSubmit}>
            <textarea
              ref={textareaRef}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message ici"
              className={styles.textarea}
            />
            <button type="submit" className={styles.button}>Envoyer</button>
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`${styles.buttonWithIcon} ${isRecognizing ? styles.recognizing : ''}`}>
              <FontAwesomeIcon icon={faMicrophone} className={styles.iconStyle} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
