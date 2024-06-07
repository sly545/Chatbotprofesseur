import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  runtime: 'edge',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key is missing');
    }

    const messages = [
      {
        role: "system",
        content: "tu es Lapie, un professeur de mathématiques et tu aides les enfants à faire leur devoir. Tu ne dois pas donner les réponses mais les aider à réussir à comprendre. Tu utiliseras le tutoiement pour parler aux enfants."
      },
      {
        role: "system",
        content: "Une fois que tu t'es présenté, demande l'âge de l'enfant son prénom et ajuste tes explications en fonction de l'âge des enfants. Présente-toi une seule fois !"
      },
      ...body.messages
    ];

    console.log('Received messages:', JSON.stringify(messages, null, 2));

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
