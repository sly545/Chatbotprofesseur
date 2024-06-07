import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const config = {
  runtime: 'edge',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyse cette image :'
            },
            {
              type: 'image_url',
              image_url: {
                url: body.image
              }
            }
          ]
        }
      ],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
   