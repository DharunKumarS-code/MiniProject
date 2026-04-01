const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const askGroq = async (prompt) => {
  console.log('API Key loaded:', GROQ_API_KEY ? 'YES' : 'NO - KEY MISSING');
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  const data = await response.json();
  console.log('Groq response:', data);
  if (!response.ok) throw new Error(data.error?.message || 'API error');
  return data.choices[0].message.content;
};
