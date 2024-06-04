/** @jsxImportSource react */
"use client";
import React, { useState } from 'react';
import Chatbot from "./compoments/Chatbot";
import Tigrou from "./compoments/Tigrou";
import Foxy from "./compoments/Foxy";
import SelectionPerso from './compoments/SelectionCards';
import Menu from './compoments/Menu'; // Import du composant Menu 
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './compoments/selecti.module.css'; // Import du CSS

export default function Home() {
  const [activeChatbot, setActiveChatbot] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (id: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveChatbot(id);
      setIsTransitioning(false);
    }, 300); // Ajustez le délai pour correspondre à la durée de votre transition
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveChatbot(null);
      setIsTransitioning(false);
    }, 300); // Ajustez le délai pour correspondre à la durée de votre transition
  };

  // Définition d'un objet de couleurs par chatbot
  const chatbotColors = {
    Foxie: '#c4b291',
    Tigrou: '#008B8B',
    Chatbot: '#007bff',
  };

  // Obtention de la couleur actuelle en fonction du chatbot actif
  const currentColor = activeChatbot && Object.hasOwnProperty.call(chatbotColors, activeChatbot) ? chatbotColors[activeChatbot as keyof typeof chatbotColors] : '#666';

  // Utilisation de React.CSSProperties pour éviter l'erreur TypeScript
  const containerStyle: React.CSSProperties = {
    '--back-button-color': currentColor,
  } as React.CSSProperties;

  return (
    <div style={containerStyle} className="backButtonContainer">
      <Menu /> {/* Ajout du composant Menu */}
      <TransitionGroup>
        {activeChatbot ? (
          <CSSTransition key={activeChatbot} timeout={900} classNames="fade">
            <div className={`${styles.chatbotwrap} ${isTransitioning ? styles.hidden : ''}`}>
              {activeChatbot === 'Foxie' && <Foxy onBack={handleBack} activeChatbot={activeChatbot} />}
              {activeChatbot === 'Tigrou' && <Tigrou onBack={handleBack} activeChatbot={activeChatbot} />}
              {activeChatbot === 'Chatbot' && <Chatbot onBack={handleBack} activeChatbot={activeChatbot} />}
            </div>
          </CSSTransition>
        ) : (
          <CSSTransition key="selection" timeout={900} classNames="fade">
            <div className={`${styles.container} ${isTransitioning ? styles.hidden : ''}`}>
              <SelectionPerso onSelect={handleSelect} />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
}

