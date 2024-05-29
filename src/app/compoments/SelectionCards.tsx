// components/SelectionCards.tsx

import React from 'react'; // Importe React
import Card from './Card';
import styles from './selecti.module.css'; // Assure-toi que le chemin est correct

const professeursData = [
  {
    id: 'Chatbot',
    nom: 'Lapie',
    image: '/images/lapie1.webp',
    description: 'Professeur de mathématiques',
    cardBackground: '#007bff', // Couleur de fond de la carte
    wrapTextBackground: '#32c3cd', // Couleur de fond pour la zone de texte
    hoverShadowColor: ' #007bff',
  }, 
  {
    id: 'Foxie',
    nom: 'Foxie',
    image: '/images/foxy2.webp',
    description: 'Professeur de français',
    cardBackground: '#f4e8df', // Couleur de fond de la carte
    wrapTextBackground: '#b4d9d6',
    hoverShadowColor: '#c4b291', // Couleur de fond pour la zone de texte
  },

  {
    id: 'Tigrou',
    nom: 'Tigrou',
    image: '/images/tigrou1.webp',
    description: "Professeur d'histoire-géographie",
    cardBackground: '#1c5c66', // Couleur de fond de la carte
    wrapTextBackground: '#4ECDC4',
    hoverShadowColor: '#1c5c66', // Couleur de fond pour la zone de texte
 
  },
  // Autres professeurs...
];

interface SelectionCardsProps {
  onSelect: (id: string) => void;
}

const SelectionCards: React.FC<SelectionCardsProps> = ({ onSelect }) => {
  return (
    <div className={styles.container}>
      {professeursData.map(professeur => (
        <Card
          key={professeur.id}
          id={professeur.id}
          nom={professeur.nom}
          image={professeur.image}
          description={professeur.description}
          onSelect={onSelect}
          cardBackground={professeur.cardBackground}
          wrapTextBackground={professeur.wrapTextBackground}
          hoverShadowColor={professeur.hoverShadowColor}
        />
      ))}
    </div>
  );
};

export default SelectionCards;
