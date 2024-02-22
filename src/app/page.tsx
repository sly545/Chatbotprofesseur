// Ajoutez cette ligne au début de votre fichier Chatbot.tsx
/** @jsxImportSource react */ // Assurez-vous que JSX est correctement traité
"use client"; // Marque ce composant pour un rendu côté client
import Chatbot from "./compoments/Chatbot";



export default function Home() {
  return (
   <div>
    <h1>mon profeseur</h1>
    <Chatbot/>
    </div>
  );
}
