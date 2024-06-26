// src/config/botConfigs.ts
export const config = {
  Chatbot: {
    context: [
      {
        "role": "system",
        "content": "tu es Lapie. Tu es un professeur de mathématiques et tu aides les enfants à faire leurs devoirs. Tu ne dois pas donner les réponses mais les aider à comprendre. Utilise le tutoiement pour parler aux enfants."
      },
      {
        "role": "system",
        "content": "Tu enseignes à des enfants français. Présente les choses de manière simple et claire, en évitant ce qui ne sert à rien."
      },
      {
        "role": "system",
        "content": "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, fais un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple proche et ensuite travaille avec lui en le corrigeant."
      },
      {
        "role": "system",
        "content": "Lorsque tu présentes des fractions, explique-les de manière visuelle et textuelle. Par exemple, pour expliquer un quart (1/4), dis : 'Un quart signifie une partie sur quatre parties égales. Imagine une pizza coupée en quatre parts égales. Une part représente un quart de la pizza.' Écris les fractions de cette façon pour qu'elles soient claires : '1 sur 4' ou '1/4'."
      }
    ],
    images: [
      { src: '/images/lapie1.webp', alt: 'Image 1' },
      { src: '/images/fracavecs.webp', alt: 'Image 2' },
      { src: '/images/ecuation.webp', alt: 'Image 3' },
      { src: '/images/nombrepremier.webp', alt: 'Image 4' },
      { src: '/images/lasimetrie.webp', alt: 'Image 5' },
    ],
    voiceId: 'Z8TGMtMMeHhNttX8jPg0', // Identifiant de voix pour Chatbot
    styles: {
      conteneurglobalBackgroundColor: '#007bff',
      containerBackgroundColor: '#32c3cd',
      messageBotBackgroundColor: '#0056b3',
      messageBotTextColor: 'white',
      messageUserBackgroundColor: '#007bff',
      messageUserTextColor: 'white',
      buttonBackgroundColor: '#007bff',
      buttonTextColor: 'white',
      buttonHoverBackgroundColor: '#0056b3',
      buttonWithIconBackgroundColor: 'rgb(190 213 238)',
      buttonWithIconHoverBackgroundColor: '#002FA7',
      iconColor: '#007bff',
      textareaBorderColor: 'blue',
      recognizingBackgroundColor: '#0056b3',
      countdownBackgroundColor: 'rgba(42, 167, 179, 0.7)',
      loaderBubbleBackgroundColor: '#007bff', // Couleur de fond de la bulle
      bubbleColor: '#0056b3', // Couleur des points 
    }
    
  },



  Gru: {
    context: [
      {
        role: "system",
        content: "tu es Gru. Tu es un professeur de chinois et tu aides les enfants à faire leur devoir de chinois sans leur donner les réponses. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        role: "system",
        content: "tu ne devras pas utiliser d'anglicismes, tu enseignes à des enfants français. Présente les choses de manière simple et claire par exemple les fraction presente les comme ça :  en te référant au programme scolaire des enfants."
      },
      {
        role: "system",
        content: "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, tu feras un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple qui est proche et ensuite travaille avec lui en le corrigeant."
      }
    ],
    images: [
      { src: '/images/grue.webp', alt: 'Image 1' },
      { src: '/images/maisonsigne.webp', alt: 'Image 2' },
    
    ],
    voiceId: '2PlXoKMEvIhzIyBSrhWe', //voix pour Gru 

    styles: {
      conteneurglobalBackgroundColor: 'red',
      containerBackgroundColor: '#f6d59a',
      messageBotBackgroundColor: '#ff253a',
      messageBotTextColor: 'white',
      messageUserBackgroundColor: '#fff7e6',
      messageUserTextColor: 'black',
      buttonBackgroundColor: '#ff908d',
      buttonTextColor: 'white',
      buttonHoverBackgroundColor: '#750f0d',
      buttonWithIconBackgroundColor: '#750f0d',
      buttonWithIconHoverBackgroundColor: 'black',
      iconColor: '#ff908d',
      textareaBorderColor: 'red',
      recognizingBackgroundColor: 'red',
      countdownBackgroundColor: 'red', 
      loaderBubbleBackgroundColor: '#ff908d', // Couleur de fond de la bulle
      bubbleColor: '#750f0d', // Couleur des points
    }
  },

  Foxie: {
    context: [
      {
        "role": "system",
        "content": "tu es Foxy. Tu es un professeur de Français et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        "role": "system",
        "content": "Tu enseignes à des enfants français. Présente les choses de manière simple en évitant ce qui ne sert à rien. Lorsque tu présentes des conjugaisons de verbes, utilise des listes à puces ou des sauts de ligne pour que ce soit clair et lisible."
      },
      {
        "role": "system",
        "content": "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, tu feras un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple qui est proche et ensuite travaille avec lui en le corrigeant."
      },
      {
        "role": "system",
        "content": "Pour les conjugaisons, présente chaque forme du verbe sur une nouvelle ligne. Par exemple : je finis, tu finis, il/elle/on finit, nous finîmes, vous finîtes, ils/elles finirent."
      }
      
    ],
    images: [
      { src: '/images/foxy2.webp', alt: 'Image 1' },
      { src: '/images/theatre.webp', alt: 'Image 2' },
    
    ],
    voiceId: '2PlXoKMEvIhzIyBSrhWe', 

    styles: {
      conteneurglobalBackgroundColor: '#f4e8df',
      containerBackgroundColor: '#b4d9d6',
      messageBotBackgroundColor: '#e2c784',
      messageBotTextColor: 'black',
      messageUserBackgroundColor: '#c4b291',
      messageUserTextColor: 'black',
      buttonBackgroundColor: '#c4b291',
      buttonTextColor: 'white',
      buttonHoverBackgroundColor: '#006666',
      buttonWithIconBackgroundColor: '#e2c783',
      buttonWithIconHoverBackgroundColor: '#f4e8df',
      iconColor: '#006666',
      textareaBorderColor: '#006666',
      recognizingBackgroundColor: '#c4b291',
      countdownBackgroundColor: '#e2c784b3', 
      loaderBubbleBackgroundColor: '#f4e8df', // Couleur de fond de la bulle
      bubbleColor: '#006666', // Couleur des points
    }
  },

  Tigrou: {
    context: [
      {
        role: 'system',
        content: 'Tu es Tigrou, un professeur d\'histoire-géographie qui aide les enfants à réviser leur leçon. Tu utiliseras le tutoiement pour parler aux enfants.'
      },
      {
        role: "system",
        content: "tu ne devras pas utiliser d'anglicismes, tu enseignes à des enfants français. Présente les choses de manière simple et claire en te référant au programme scolaire des enfants."
      },
      {
        role: "system",
        content: "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, tu feras un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple qui est proche et ensuite travaille avec lui en le corrigeant."
      }
    ],
    images: [
    { src: '/images/tigrou1.webp', alt: 'Image 1' },
    { src: '/images/premierroidefrance.webp', alt: 'Image 2' },
    { src: '/images/apeldu18.webp', alt: 'Image 3' },
    { src: '/images/danton-revolution.webp', alt: 'Image 4' },
    
    ],
    voiceId: '2PlXoKMEvIhzIyBSrhWe', 

    styles: {
      conteneurglobalBackgroundColor: '#1c5c66',
      containerBackgroundColor: '#4ecdc4',
      messageBotBackgroundColor: '#a0daa9',
      messageBotTextColor: 'black',
      messageUserBackgroundColor: '#add8e6',
      messageUserTextColor: 'black',
      buttonBackgroundColor: '#008b8b',
      buttonTextColor: 'white',
      buttonHoverBackgroundColor: '#006666',
      buttonWithIconBackgroundColor: '#add8e6',
      buttonWithIconHoverBackgroundColor: '#1c5c66',
      iconColor: '#008b8b',
      textareaBorderColor: '#006666',
      recognizingBackgroundColor: '#1c5c66',
      countdownBackgroundColor: 'rgba(42, 167, 179, 0.7)', 
      loaderBubbleBackgroundColor: '#1c5c66', // Couleur de fond de la bulle
      bubbleColor: '#008b8b', // Couleur des points
    }
  },



};

