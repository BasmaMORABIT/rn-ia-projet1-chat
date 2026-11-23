import { useState, useRef } from 'react';
import { Text, FlatList, ActivityIndicator, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import MessageBubble from './src/components/MessageBubble';
import ChatInput from './src/components/ChatInput';
import { sendMessage } from './src/services/ai';

// Composant conteneur : il gère le state et le passe en props aux composants de présentation.
export default function App() {
  const [messages, setMessages] = useState([]); // [{ id, role, content }]
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const listRef = useRef(null); // référence vers la FlatList pour pouvoir la faire défiler

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendMessage(history); // tout l'historique : l'IA garde le contexte
      const aiMessage = { id: Date.now().toString(), role: 'assistant', content: reply };
      setMessages([...history, aiMessage]);
    } catch (e) {
      console.log('Erreur IA :', e.message); // affichage à l'écran : étape 6
    } finally {
      setIsLoading(false); // exécuté dans tous les cas, succès ou erreur
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Text style={styles.title}>Tuto — tuteur React Native</Text>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble role={item.role} content={item.content} />}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <Text style={styles.empty}>Pose une question sur React Native pour commencer.</Text>
            }
            contentContainerStyle={styles.list}
          />

          {isLoading && <ActivityIndicator size="small" color="#4f46e5" style={styles.loader} />}

          <ChatInput
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            disabled={input.trim() === '' || isLoading}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  list: {
    paddingVertical: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
  },
  loader: {
    marginBottom: 8,
  },
});
