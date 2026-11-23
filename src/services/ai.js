import { SYSTEM_PROMPT } from './prompts';

// Variables lues depuis le fichier .env (préfixe EXPO_PUBLIC_ obligatoire avec Expo)
const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY;
const MODEL = process.env.EXPO_PUBLIC_AI_MODEL || 'ministral-8b-latest';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const API_URL = 'https://api.mistral.ai/v1/chat/completions';

// Envoie l'historique de la conversation à l'IA et renvoie le texte de sa réponse.
// history = [{ id, role: 'user' | 'assistant', content }]
export async function sendMessage(history) {
  if (USE_MOCK) {
    return mockReply(history);
  }

  // L'API attend uniquement role + content : on retire l'id utilisé par la FlatList
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages }),
    });
  } catch (e) {
    // fetch lève une exception seulement quand le serveur est injoignable (pas de réseau)
    throw new Error('Pas de connexion réseau. Vérifie ta connexion.');
  }

  // fetch ne lève PAS d'erreur sur un code 401 ou 429 : il faut tester le statut nous-mêmes
  if (response.status === 401) {
    throw new Error('Clé API invalide.');
  }
  if (response.status === 429) {
    throw new Error('Trop de requêtes ou quota dépassé, réessaie dans un moment.');
  }
  if (!response.ok) {
    throw new Error(`Erreur du serveur (${response.status}).`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("L'IA a renvoyé une réponse vide.");
  }
  return content;
}

// ----- Mode mock : fausse IA pour tester sans clé -----

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockReply(history) {
  await wait(1000); // simule le temps de réponse du réseau

  const lastMessage = history[history.length - 1].content;

  // Taper "erreur" dans le chat permet de tester l'affichage d'une erreur
  if (lastMessage.toLowerCase().includes('erreur')) {
    throw new Error('Erreur simulée (mode mock).');
  }

  return `(Mock) Tu as écrit : "${lastMessage}". Ceci est une réponse simulée.`;
}
