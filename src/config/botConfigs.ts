// src/config/botConfigs.ts
export const config = {
  Chatbot: {
    context: [
      {
        role: "system",
        content: "tu es Lapie. Tu es un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        role: "system",
        content: "tu ne devras pas utiliser d'anglicismes, tu enseignes à des enfants français. Présente les choses de manière simple  evite ce genre de presentation [ \text{Aire} = \text{longueur} \times \text{largeur} ] ,il faut que tu te refaire au programe de la classe des enfants!"
      },
      {
        role: "system",
        content: "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, tu feras un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple qui est proche et ensuite travaille avec lui en le corrigeant."
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
        content: "tu ne devras pas utiliser d'anglicismes, tu enseignes à des enfants français. Présente les choses de manière simple et claire en te référant au programme scolaire des enfants."
      },
      {
        role: "system",
        content: "Une fois que tu t'es présenté, demande l'âge de l'enfant, son prénom et ajuste tes explications en fonction de l'âge des enfants. Si on t'envoie une photo, tu feras un compliment sur ses vêtements ou son visage. S'il t'envoie un exercice, ne lui donne pas la réponse mais aide-le à comprendre avec un autre exemple qui est proche et ensuite travaille avec lui en le corrigeant."
      }
    ],
    images: [
      { src: '/images/apeldu18.webp', alt: 'Image 1' },
      { src: '/images/theatre.webp', alt: 'Image 2' },
    
    ],
    voiceId: '2PlXoKMEvIhzIyBSrhWe', //voix pour grue

    styles: {
      conteneurglobalBackgroundColor: 'black',
      containerBackgroundColor: '#f5f5f5',
      messageBotBackgroundColor: '#ff9800',
      messageBotTextColor: 'black',
      messageUserBackgroundColor: '#fff7e6',
      messageUserTextColor: 'black',
      buttonBackgroundColor: '#ff9800',
      buttonTextColor: 'black',
      buttonHoverBackgroundColor: '#e65100',
      buttonWithIconBackgroundColor: '#ff9800',
      buttonWithIconHoverBackgroundColor: 'black',
      iconColor: 'red',
      textareaBorderColor: 'red',
      recognizingBackgroundColor: 'red',
      countdownBackgroundColor: 'orange', 
    }
  },

  Foxie: {
    context: [
      {
        role: "system",
        content: "tu es Foxie. Tu es un professeur de francais et tu aides les enfants à faire leur devoir de chinois sans leur donner les réponses. Tu utiliseras le tutoiement pour parler aux enfants."
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
      { src: '/images/foxy2.webp', alt: 'Image 1' },
      { src: '/images/theatre.webp', alt: 'Image 2' },
    
    ],
    voiceId: '2PlXoKMEvIhzIyBSrhWe', //voix pour grue

    styles: {
      conteneurglobalBackgroundColor: '#f4e8df',
      containerBackgroundColor: '#b4d9d6',
      messageBotBackgroundColor: '#e2c784',
      messageBotTextColor: 'black',
      messageUserBackgroundColor: '#c4b291',
      messageUserTextColor: 'black',
      buttonBackgroundColor: '#008b8b',
      buttonTextColor: 'white',
      buttonHoverBackgroundColor: '#006666',
      buttonWithIconBackgroundColor: '#e2c783',
      buttonWithIconHoverBackgroundColor: '#f4e8df',
      iconColor: '#006666',
      textareaBorderColor: '#006666',
      recognizingBackgroundColor: '#c4b291',
      countdownBackgroundColor: '#e2c784b3', 
    }
  },



};

