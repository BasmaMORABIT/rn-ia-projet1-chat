// Lue depuis le fichier .env. Attention : une variable d'environnement est toujours du TEXTE.
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

// Envoie l'historique de la conversation à l'IA et renvoie le texte de sa réponse.
// history = [{ id, role: 'user' | 'assistant', content }]
export async function sendMessage(history) {
  if (USE_MOCK) {
    return mockReply(history);
  }
  throw new Error("L'appel réel à l'IA n'est pas encore branché.");
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
