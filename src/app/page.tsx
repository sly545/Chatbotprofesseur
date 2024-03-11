// Ajoutez cette ligne au début de votre fichier Chatbot.tsx
/** @jsxImportSource react */ // Assurez-vous que JSX est correctement traité
"use client"; // Marque ce composant pour un rendu côté client
import Chatbot from "./compoments/Chatbot";
import Tigrou from "./compoments/Tigrou";
import Foxy from "./compoments/Foxy"



export default function Home() {
  return (
  <div>
    <div>
    <Foxy/>
    </div>
  </div>
  );  
}
