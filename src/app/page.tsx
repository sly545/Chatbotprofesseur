/** @jsxImportSource react */
"use client";
import React, { useState } from 'react';
import Chatbot from "./compoments/Chatbot";
import Tigrou from "./compoments/Tigrou";
import Foxy from "./compoments/Foxy";
import SelectionPerso from './compoments/SelectionCards';
import Menu from './compoments/Menu' // Import du composant Menu 

export default function Home() {
  const [activeChatbot, setActiveChatbot] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setActiveChatbot(id);
  };

  const handleBack = () => {
    setActiveChatbot(null);
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
      {activeChatbot ? (
        <>
          {activeChatbot === 'Foxie' && <Foxy />}
          {activeChatbot === 'Tigrou' && <Tigrou />}
          {activeChatbot === 'Chatbot' && <Chatbot />}
          <button onClick={handleBack} className="backButton">Retour</button>
        </>
      ) : (
        <SelectionPerso onSelect={handleSelect} />
      )}
    </div>
  );
}
