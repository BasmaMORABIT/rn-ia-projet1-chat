# Journal d'utilisation de l'IA

## Outils utilisés

- **Claude (Anthropic), via l'extension Claude Code dans VS Code**, utilisé pour :
  - découper le projet en étapes et savoir quand commiter ;
  - obtenir des explications sur les concepts (state, props, `FlatList`, `fetch`, variables d'environnement...) ;
  - m'aider à diagnostiquer les erreurs ;
  - m'aider à rédiger la documentation (README et ce journal).
- **Mistral AI** (`ministral-8b-latest`) : c'est l'IA *utilisée par l'application* elle-même, pas un outil de développement.

## 3 prompts significatifs

1. **Organisation du travail**
   > Accompagne-moi pas à pas sur ce projet Expo : une étape à la fois, avec l'explication de chaque partie, le moment où commiter et le message de commit à écrire.

   Objectif : avancer par petites étapes testées, plutôt que d'obtenir tout le projet d'un coup sans le comprendre.

2. **Outillage et sécurité**
   > Explique-moi le rôle d'Expo dans un projet React Native, ainsi que celui du `.gitignore` et du `.env`. Signale-moi tout risque de fuite de la clé API avant mon premier commit.

   Résultat : j'ai découvert que le `.gitignore` généré par Expo n'ignorait **pas** le fichier `.env`. Je l'ai corrigé avant de créer ce fichier.

3. **Diagnostic d'une erreur API**
   > Mon application affiche une erreur 429 « Trop de requêtes » avec Mistral, que j'avais déjà eue avec une autre clé. Comment savoir si le problème vient de la clé, du modèle ou du fournisseur ?

   Résultat : plutôt que de changer de fournisseur, j'ai testé l'API directement. La clé était valide ; seul le modèle `mistral-small-latest` était bloqué.

## Erreurs ou limites de l'IA repérées et corrigées

1. **Modèle inadapté à l'offre gratuite.**
   L'IA m'a proposé le modèle `mistral-small-latest`. Avec ma clé, il renvoyait **systématiquement** une erreur 429 (« Rate limit exceeded »).
   Vérification : la liste des modèles (`GET /v1/models`) répondait 200, donc la clé était valide, et le modèle `ministral-8b-latest` répondait normalement.
   **Correction :** passage à `ministral-8b-latest` dans `.env`, `.env.example` et la valeur par défaut de `ai.js`.

2. **Mauvais diagnostic d'un problème de connexion à Expo Go.**
   Mon téléphone affichait encore l'écran par défaut alors que mon code était à jour. Le terminal affichait un message `iOS ERROR ... signed in to Expo Go`, et l'IA m'a conseillé de créer un compte Expo. Or mon téléphone est sous **Android** : ce message venait d'un autre appareil sur le réseau.
   **Vraie cause :** Expo Go avait gardé une ancienne connexion au serveur. En relançant `npx expo start` puis en appuyant sur `r`, le serveur a renvoyé le code à jour au téléphone et la connexion s'est rétablie. Le mode `--tunnel` règle aussi ce problème sur le réseau de l'école.

## Autres problèmes rencontrés

- **La clé API semblait ne pas fonctionner** : l'application renvoyait toujours les réponses du mock. J'avais bien ajouté la clé dans `.env`, mais laissé `EXPO_PUBLIC_USE_MOCK=true`. Passer à `false` **et relancer le serveur** (le `.env` n'est lu qu'au démarrage) a résolu le problème.
- **L'écran ne se mettait pas à jour** après le remplacement de `App.js` : le Fast Refresh n'avait pas suivi. Appuyer sur `r` (ou lancer `npx expo start -c`) recharge l'application.

## Ce que j'ai appris

- **Expo** est une boîte à outils autour de React Native : création du projet, serveur de développement avec QR code, application Expo Go qui exécute mon JavaScript sans compiler d'application native, et versions de librairies compatibles (`npx expo install`).
- **Sécurité des secrets** : `.env` (jamais commité) vs `.env.example` (commité, sans valeur).
- **Composant conteneur / composants de présentation** : `App.js` gère le state ; `MessageBubble`, `ChatInput` et `ErrorBanner` n'ont pas de state et reçoivent tout en props.
- **Le state n'est pas mis à jour immédiatement** après `setMessages` : c'est pourquoi je construis une variable `history` pour l'envoyer à l'IA. Et je crée toujours un **nouveau tableau** (`[...messages, x]`) au lieu d'utiliser `push`.
- **L'IA n'a pas de mémoire** : pour qu'elle garde le contexte, je lui renvoie tout l'historique à chaque message, avec le prompt système en tête. Le coût en tokens augmente donc avec la conversation.
- **`fetch` ne lève pas d'erreur sur un code HTTP 401 ou 429** : il faut tester `response.status` / `response.ok` soi-même. `fetch` ne lève une exception qu'en l'absence de réseau.
- **Le mode mock** permet de développer et de faire tester l'application sans clé ni réseau : seule la source de la réponse change, l'écran ne voit pas la différence.
- **Méthode de débogage** : isoler le problème (tester l'API directement plutôt que changer de fournisseur), lire le message d'erreur complet, recharger l'application quand l'écran ne correspond pas au code.
