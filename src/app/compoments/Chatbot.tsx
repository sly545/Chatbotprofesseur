import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../compoments/Chatbot.module.css';
import Carrouselle from '../compoments/carrouselle';
import Loader from '../compoments/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faMicrophone, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CameraCapture from'../compoments/CameraCapture';


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

interface ChatbotProps {
  onBack: () => void;
  activeChatbot: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ onBack }) => {
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
    if (isRecognizing) {
      recognitionRef.current?.stop();
      setIsRecognizing(false);
      playSound('stop-sound.mp3');
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsRecognizing(true);
        playSound('start-sound.mp3');
      } else {
        alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      }
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
            "use_speaker_boost": true,
            "optimize_streaming_latency": 2,
          }
        })
      };

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/FVQMzxJGPUBtfz1Azdoy?output_format=mp3_22050_32', options);
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

  const sendMessageToGPT4 = async (message: string) => {
    if (!message) return;
    setIsLoading(true);

    setMessages(prev => [...prev, { content: message, role: 'user' }]);

    const context = [
      {
        "role": "system",
        "content": "tu es Lapie,. Tu es un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        "role": "system",
        "content": "Une fois que tu t'es présenté, demande l'âge de l'enfant son prénom et ajuste tes explications en fonction de l'âge des enfants. Présente-toi une seule fois !"
      },
      ...messages.slice(-5),
      { role: "user", content: message }
    ];

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o",
          messages: context,
          max_tokens: 1500,
          n: 1,
          stop: null,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const gptResponse = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { content: gptResponse, role: 'assistant' }]);
    } catch (error) {
      console.error('Error sending message to GPT-4:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessageToGPT4(userMessage);
    setUserMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  const handleImageCapture = async (dataUrl: string) => {
    if (!dataUrl) return;
    setIsLoading(true);
  
    // Ajouter l'image aux messages pour l'afficher dans la discussion
    setMessages(prev => [...prev, { content: 'Image envoyée', role: 'user', imageUrl: dataUrl }]);
  
    const context = [
      {
        "role": "system",
        "content": "tu es Lapie, un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        "role": "system",
        "content": "Une fois que tu t'es présenté, demande l'âge de l'enfant son prénom et ajuste tes explications en fonction de l'âge des enfants. Présente-toi une seule fois !"
      },
      ...messages.slice(-5),
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyse cette image : tu es Lapie, un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants. Si on t\'envoie une photo, tu feras un compliment par exemple "tu as de très belles lunettes".'
          },
          {
            type: 'image_url',
            image_url: {
              url: dataUrl
            }
          }
        ]
      }
    ];
  
    try {
      console.log('Sending context to API:', JSON.stringify(context, null, 2));
      
      const response = await axios.post(
        '/api/analyze-image',
        { messages: context },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const analysisResult = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { content: analysisResult, role: 'assistant' }]);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const images = [
    { src: '/images/lapie1.webp', alt: 'Image 1' },
    { src: '/images/fracavecs.webp', alt: 'Image 2' },
    { src: '/images/ecuation.webp', alt: 'Image 3' },
    { src: '/images/nombrepremier.webp', alt: 'Image 4' },
    { src: '/images/lasimetrie.webp', alt: 'Image 5' },
  ];

  return (
    <div className={styles.chatbotwrap}>
    <div className={styles.conteneurglobal}>
      <div className={styles.sizecarou}>
        <Carrouselle images={images} />
        <button onClick={onBack} className={styles.backButton}>Retour</button>
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
            {msg.imageUrl && <img src={msg.imageUrl} alt="Envoyé" className={styles.sentImage} />}
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
          <div className={styles.espacmentbutton}>
            <button
              type="button"
              onClick={startVoiceRecognition}
              className={`${styles.buttonWithIcon} ${isRecognizing ? styles.recognizing : ''}`}
            >
              <FontAwesomeIcon icon={faMicrophone} className={styles.iconStyle} />
            </button>
            <button
              type="button"
              onClick={onBack}
              className={styles.buttonWithIcon}
            >
              <FontAwesomeIcon icon={faArrowLeft} className={styles.iconStyle} />
            </button>
          </div>
        </form>
        <CameraCapture onCapture={handleImageCapture} />
      </div>
    </div>
  </div>
  );
  
};

export default Chatbot;


