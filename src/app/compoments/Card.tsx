// components/Card.tsx
import React from 'react';
import Image from 'next/image';
import styles from './Card.module.css'; // Assurez-vous que le chemin est correct

interface CardProps {
  id: string;
  nom: string;
  image: string;
  description: string;
  onSelect: (id: string) => void;
  cardBackground: string;
  wrapTextBackground: string;
  hoverShadowColor: string; // Ajoutez cette prop pour la couleur de l'ombre au hover
}

const Card: React.FC<CardProps> = ({ id, nom, image, description, onSelect, cardBackground, wrapTextBackground, hoverShadowColor }) => {
  // Appliquez le style inline pour la couleur de fond et définissez la variable CSS pour la couleur de l'ombre au hover
  const cardStyle = {
    backgroundColor: cardBackground,
    '--card-hover-shadow-color': hoverShadowColor, // Utilisation de la prop pour définir la couleur d'ombre au hover
  } as React.CSSProperties; // Casting pour TypeScript

  return (
    <div className={styles.card} style={cardStyle} onClick={() => onSelect(id)}>
      <div style={{ backgroundColor: wrapTextBackground }} className={styles.wrapimgtext}> 
        <Image className={styles.imgcard} src={image} alt={nom} width={350} height={250}  />
        <div className={styles.wraptext}>
          <h3>{nom}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
