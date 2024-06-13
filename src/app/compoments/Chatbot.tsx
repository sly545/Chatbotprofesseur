import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../compoments/Chatbot.module.css';
import Carrouselle from '../compoments/carrouselle';
import Loader from '../compoments/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faMicrophone, faArrowLeft, faCamera } from '@fortawesome/free-solid-svg-icons';
import CameraCapture from '../compoments/CameraCapture';

interface IMessage {
  content: string;
  audioUrl?: string;
  role: 'user' | 'assistant';
  imageUrl?: string; // Ajout de la propriété imageUrl
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Z8TGMtMMeHhNttX8jPg0?output_format=mp3_22050_32', options);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendImageWithText();
    }
  };

  const handleImageCapture = (dataUrl: string) => {
    setCapturedImage(dataUrl);
  };

  const removeCapturedImage = () => {
    setCapturedImage(null);
  };

  const handleSendImageWithText = async () => {
    if (!userMessage && !capturedImage) return;
    setIsLoading(true);

    const userMessageContent: IMessage = { content: userMessage, role: 'user' };
    if (capturedImage) {
      userMessageContent.imageUrl = capturedImage;
    }

    setMessages(prev => [...prev, userMessageContent]);

    const context = [
      {
        "role": "system",
        "content": "tu es Lapie. Tu es un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        "role": "system",
        "content": "tu ne devras pas utiliser d'anglicismes, tu enseignes à des enfants français. Présente les choses de manière simple  evite ce genre de presentation \[ \text{Aire} = \text{longueur} \times \text{largeur} \] ,il faut que tu te refaire au programe de la classe des enfants!"
      },
      {
        "role": "system",
        "content": "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, tu feras un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple qui est proche et ensuite travaille avec lui en le corrigeant."
      },
      ...messages.slice(-5),
      {
        role: 'user',
        content: capturedImage
          ? [
              {
                type: 'text',
                text: userMessage
              },
              {
                type: 'image_url',
                image_url: {
                  url: capturedImage
                }
              }
            ]
          : [
              {
                type: 'text',
                text: userMessage
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
      setCapturedImage(null);
      setUserMessage('');
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
        <form className={styles.fromflex} >
          <textarea
            ref={textareaRef}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message ici"
            className={styles.textarea}
          />
          <button
            type="button"
            onClick={handleSendImageWithText}
            className={styles.button}
          >
            Envoyer
          </button>
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
        {capturedImage && (
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center' }}>
            <img src={capturedImage} alt="Prévisualisation" style={{ width: '80%',borderRadius:'5px', }} />
            <button onClick={() => setCapturedImage(null)} className={styles.button}>Supprimer l'image</button>
          </div>
        )}
        <CameraCapture 
          onCapture={handleImageCapture} 
          buttonClassName={styles.button} 
          videoStyle={{ width: '100%', marginBottom: '5px', marginTop: '5px', borderRadius: '5px' }} 
          containerStyle={{ marginBottom: '0px' }}
        />
      </div>
    </div>
  </div>
);
};

export default Chatbot;