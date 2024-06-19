import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../compoments/Chatbot.module.css'; // Assurez-vous que le chemin est correct
import Carrouselle from '../compoments/carrouselle';
import Loader from '../compoments/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faMicrophone, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CameraCapture from '../compoments/CameraCapture';
import { config } from '../../config/botConfigs';

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
  activeChatbot: keyof typeof config;
}

const Chatbot: React.FC<ChatbotProps> = ({ onBack, activeChatbot }) => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const chatbotConfig = config[activeChatbot];
  const { images, styles: dynamicStyles } = chatbotConfig;

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

    const voiceId = chatbotConfig.voiceId;

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

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`, options);
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

  const handleSendImageWithText = async () => {
    if (!userMessage && !capturedImage) return;
    setIsLoading(true);

    const userMessageContent: IMessage = { content: userMessage, role: 'user' };
    if (capturedImage) {
      userMessageContent.imageUrl = capturedImage;
    }

    setMessages(prev => [...prev, userMessageContent]);

    const context = [
      ...chatbotConfig.context,
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
    
    return (
      <div className={styles.chatbotwrap}>
      <div className={styles.conteneurglobal} style={{ backgroundColor: dynamicStyles.containerBackgroundColor }}>
        <div className={styles.sizecarou}>
          <Carrouselle images={images} />
          <button 
            onClick={onBack} 
            className={styles.backButton} 
            style={{ backgroundColor: dynamicStyles.buttonBackgroundColor, color: dynamicStyles.buttonTextColor, transition: 'background-color 0.5s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonHoverBackgroundColor}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonBackgroundColor}
          >
            Retour
          </button>
        </div>
        <div className={`${styles.container} ${isLoading ? styles.translucent : ''}`} style={{ backgroundColor: dynamicStyles.containerBackgroundColor }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? styles.messageUser : styles.messageBot}
              style={msg.role === 'user' ?  { backgroundColor: dynamicStyles.messageUserBackgroundColor, color: dynamicStyles.messageUserTextColor } : { backgroundColor: dynamicStyles.messageBotBackgroundColor, color: dynamicStyles.messageBotTextColor }}
            >
              {msg.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                </React.Fragment>
              ))}
              {msg.imageUrl && <img src={msg.imageUrl} alt="Envoyé" className={styles.sentImage} />}
              {msg.role === 'assistant' && (
                <button className={styles.buttonWithIcon}
                  onClick={() => fetchAudioFromElevenLabs(msg.content, index)} 
                  style={{ backgroundColor: dynamicStyles.buttonWithIconBackgroundColor, color: dynamicStyles.buttonWithIconTextColor, transition: 'background-color 0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonHoverBackgroundColor}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonWithIconBackgroundColor}
                >
                  <FontAwesomeIcon icon={faVolumeUp} style={{ color: dynamicStyles.iconColor, fontSize: dynamicStyles.iconSize }} />
                </button>
              )}
            </div>
          ))}
          {isLoading && <div className={styles.loaderOverlay}><Loader /></div>}
          <form className={styles.fromflex}>
            <textarea
              ref={textareaRef}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrivez votre message ici"
              className={styles.textarea}
              style={{ borderColor: dynamicStyles.textareaBorderColor }}
            />
            <button
              type="button"
              onClick={handleSendImageWithText}
              className={styles.button}
              style={{ backgroundColor: dynamicStyles.buttonBackgroundColor, color: dynamicStyles.buttonTextColor, transition: 'background-color 0.5s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonHoverBackgroundColor}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonBackgroundColor}
            >
              Envoyer
            </button>
            <div className={styles.espacmentbutton}>
            <button
            type="button"
           onClick={startVoiceRecognition}
           className={`${styles.buttonWithIcon} ${isRecognizing ? styles.recognizing : ''}`}
           style={{
        backgroundColor: isRecognizing ? dynamicStyles.recognizingBackgroundColor : dynamicStyles.buttonWithIconBackgroundColor,
    color: dynamicStyles.buttonWithIconTextColor,
    transition: 'background-color 0.5s'
  }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonHoverBackgroundColor}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = isRecognizing ? dynamicStyles.recognizingBackgroundColor : dynamicStyles.buttonWithIconBackgroundColor}
>
  <FontAwesomeIcon icon={faMicrophone} style={{ color: dynamicStyles.iconColor, fontSize: dynamicStyles.iconSize }} />
</button>

              <button
                type="button"
                onClick={onBack}
                style={{ backgroundColor: dynamicStyles.buttonWithIconBackgroundColor, color: dynamicStyles.buttonWithIconTextColor, border: 'none', padding: '6px', margin: '10px', cursor: 'pointer', borderRadius: '50%', width: '45px', transition: 'background-color 0.5s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonHoverBackgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonWithIconBackgroundColor}
              >
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: dynamicStyles.iconColor, fontSize: dynamicStyles.iconSize }} />
              </button>
            </div>
          </form>
          {capturedImage && (
            <div className={styles.contenerprewieu}>
              <img src={capturedImage} alt="Prévisualisation" style={{ width: '80%', borderRadius: '5px' }} />
              <button 
                onClick={() => setCapturedImage(null)} 
                className={styles.button} 
                style={{ backgroundColor: dynamicStyles.buttonBackgroundColor, color: dynamicStyles.buttonTextColor, transition: 'background-color 0.5s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonHoverBackgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = dynamicStyles.buttonBackgroundColor}
              >
                Supprimer l'image
              </button>
            </div>
          )}
          <CameraCapture 
  onCapture={handleImageCapture} 
  buttonClassName={styles.button} 
  videoStyle={{ width: '100%', marginBottom: '5px', marginTop: '5px', borderRadius: '5px' }} 
  containerStyle={{ marginBottom: '0px' }}
  countdownClassName={styles.comptarebour}
  buttonStyles={{ backgroundColor: dynamicStyles.buttonBackgroundColor, color: dynamicStyles.buttonTextColor, transition: 'background-color 0.5s' }}
  buttonHoverStyles={{ backgroundColor: dynamicStyles.buttonHoverBackgroundColor }}
  countdownStyles={{ backgroundColor: dynamicStyles.countdownBackgroundColor, color: 'white', padding: '10px', borderRadius: '5px', textAlign: 'center' }}
/>
        </div>
      </div>
    </div>
    
    );
    };
    
    export default Chatbot;
    