/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  INITIAL_COURSES, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_QUIZZES, 
  INITIAL_LIBRARY, 
  INITIAL_FORUM_TOPICS, 
  INITIAL_FORUM_POSTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_MESSAGES 
} from "./src/mockData.js";

// Lazy initialize Gemini client to avoid crash on startup if key is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper function to sanitize user input for Gemini prompts
function sanitizeInput(str: any, maxLength: number): string {
  if (typeof str !== "string") {
    return "";
  }
  // Remove HTML tags to prevent prompt injection, trim, and limit maximum length
  let sanitized = str.replace(/<[^>]*>/g, "").trim();
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory relational state databases representing the LMS
  let courses = [...INITIAL_COURSES];
  let assignments = [...INITIAL_ASSIGNMENTS];
  let quizzes = [...INITIAL_QUIZZES];
  let library = [...INITIAL_LIBRARY];
  let forumTopics = [...INITIAL_FORUM_TOPICS];
  let forumPosts = [...INITIAL_FORUM_POSTS];
  let announcements = [...INITIAL_ANNOUNCEMENTS];
  let messages = [...INITIAL_MESSAGES];

  // ==================== REST API ENDPOINTS ====================

  // Check backend health & whether Gemini API is active
  app.get("/api/health", (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    res.json({ 
      status: "ok", 
      time: new Date().toISOString(),
      aiActive: hasKey
    });
  });

  // Courses Endpoints
  app.get("/api/courses", (req, res) => {
    res.json(courses);
  });

  app.post("/api/courses", (req, res) => {
    const newCourse = req.body;
    courses.push(newCourse);
    res.status(201).json(newCourse);
  });

  // Assignments
  app.get("/api/assignments", (req, res) => {
    res.json(assignments);
  });

  app.post("/api/assignments/submit", (req, res) => {
    const { id, submissionText, submissionFile } = req.body;
    
    // Input Validation
    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({ error: "Identifiant 'id' invalide ou manquant" });
    }

    const item = assignments.find(a => a.id === id);
    if (item) {
      item.submitted = true;
      item.submissionDate = new Date().toISOString();
      item.submissionText = submissionText || "";
      item.submissionFile = submissionFile || "";
      item.grade = undefined; // reset grade if re-submitted
      return res.json({ success: true, assignment: item });
    }
    res.status(404).json({ error: "Devoir non trouvé" });
  });

  app.post("/api/assignments/grade", (req, res) => {
    const { id, grade, gradeFeedback } = req.body;
    
    // Input Validation
    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({ error: "Identifiant 'id' invalide ou manquant" });
    }
    if (grade === undefined || grade === null || isNaN(Number(grade))) {
      return res.status(400).json({ error: "Note 'grade' invalide ou manquante" });
    }

    const item = assignments.find(a => a.id === id);
    if (item) {
      item.grade = Number(grade);
      item.gradeFeedback = gradeFeedback || "";
      return res.json({ success: true, assignment: item });
    }
    res.status(404).json({ error: "Devoir non trouvé" });
  });

  // Quizzes
  app.get("/api/quizzes", (req, res) => {
    res.json(quizzes);
  });

  app.post("/api/quizzes", (req, res) => {
    const newQuiz = req.body;
    quizzes.push(newQuiz);
    res.status(201).json(newQuiz);
  });

  app.post("/api/quizzes/submit", (req, res) => {
    const { id, score } = req.body;
    
    // Input Validation
    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({ error: "Identifiant 'id' invalide ou manquant" });
    }
    if (score === undefined || score === null || isNaN(Number(score))) {
      return res.status(400).json({ error: "Score 'score' invalide ou manquant" });
    }

    const item = quizzes.find(q => q.id === id);
    if (item) {
      item.submitted = true;
      item.score = Number(score);
      return res.json({ success: true, quiz: item });
    }
    res.status(404).json({ error: "Quiz non trouvé" });
  });

  // Library Documents
  app.get("/api/library", (req, res) => {
    res.json(library);
  });

  app.post("/api/library", (req, res) => {
    const newItem = req.body;
    library.push(newItem);
    res.status(201).json(newItem);
  });

  // Forum Threads
  app.get("/api/forums", (req, res) => {
    res.json(forumTopics);
  });

  app.post("/api/forums", (req, res) => {
    const newTopic = req.body;
    forumTopics.unshift(newTopic);
    // Init empty post container for posts
    forumPosts.push({
      id: "post-" + newTopic.id,
      topicId: newTopic.id,
      authorName: newTopic.authorName,
      authorRole: "student",
      content: newTopic.description,
      createdAt: newTopic.createdAt,
      likes: 0,
      replies: []
    });
    res.status(201).json(newTopic);
  });

  app.get("/api/forums/:topicId/posts", (req, res) => {
    const tPosts = forumPosts.filter(p => p.topicId === req.params.topicId);
    res.json(tPosts);
  });

  app.post("/api/forums/:topicId/posts", (req, res) => {
    const { topicId } = req.params;
    const { authorName, authorRole, content } = req.body;
    
    // Increment reply counters
    const topic = forumTopics.find(t => t.id === topicId);
    if (topic) {
      topic.repliesCount += 1;
    }

    // Add replier row
    const rootPost = forumPosts.find(p => p.topicId === topicId);
    if (rootPost) {
      const newReply = {
        id: "rep-" + Date.now(),
        authorName,
        authorRole,
        content,
        createdAt: new Date().toISOString()
      };
      rootPost.replies.push(newReply);
      return res.status(201).json(rootPost);
    } else {
      // Create root post if it doesn't exist
      const newPost = {
        id: "post-" + topicId,
        topicId,
        authorName,
        authorRole,
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };
      forumPosts.push(newPost);
      return res.status(201).json(newPost);
    }
  });

  // Messages / Private Chat
  app.get("/api/messages", (req, res) => {
    res.json(messages);
  });

  app.post("/api/messages", (req, res) => {
    const { senderId, senderName, senderRole, receiverId, content } = req.body;
    const newMsg = {
      id: "msg-" + Date.now(),
      senderId,
      senderName,
      senderRole,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };
    messages.push(newMsg);
    res.status(201).json(newMsg);
  });

  // Announcements
  app.get("/api/announcements", (req, res) => {
    res.json(announcements);
  });

  app.post("/api/announcements", (req, res) => {
    const newAnn = {
      id: "ann-" + Date.now(),
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || "Académique",
      authorId: req.body.authorId || "admin-system",
      authorName: req.body.authorName || "Administration",
      authorRole: req.body.authorRole || "admin",
      targetAudience: req.body.targetAudience || "tous",
      createdAt: new Date().toISOString(),
      scope: req.body.scope || "all",
      targetUnit: req.body.targetUnit || ""
    };
    announcements.unshift(newAnn);
    res.status(201).json(newAnn);
  });

  // ==================== GEMINI AI ENDPOINTS ====================

  // Course Summarization
  app.post("/api/ai/summarize", async (req, res) => {
    const { title, context } = req.body;
    const sanitizedTitle = sanitizeInput(title, 200);
    const sanitizedContext = sanitizeInput(context, 2000);
    const client = getGeminiClient();

    if (!client) {
      // Return high-fidelity mock summaries tailored for Tanganyika if API key is not set
      const fallbackSummary = `### Résumé Académique : ${sanitizedTitle || "Le document"}
      
Ce support de cours aborde les concepts essentiels concernant **${sanitizedTitle || "la matière"}**.

**Points Clés :**
1. **Intégration d'outils durables** : Optimisation des ressources disponibles localement face aux coupures de réseau électrique régulières.
2. **Architecture Simplifiée** : Utilisation d'indices optimisés pour garantir un temps d'exécution minimal.
3. **Mise en Application Locale** : Adapter nos méthodologies aux problématiques réelles de la Plateforme d'Étude et Manono pour avoir un impact direct dès l'obtention du diplôme de Licence.

---
*💡 Muhtasari wa Swahili (Résumé en Swahili Tanganyika)*:
Hati hii inafasiri masomo muhimu ya **${sanitizedTitle || "somo"}** kwa ufupi. Pointi tatu kuu ni kuboresha rasilimali zilizopo, kupunguza matumizi ya umeme, na kutatua matatizo ya jimbo la Tanganyika (la Plateforme d'Étude, Kongolo, Manono).`;
      return res.json({ text: fallbackSummary, simulated: true });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Tu es l'assistant de révision intelligent d'EduTanganyika LMS destiné aux universités de la province du Tanganyika en RDC.
Rédige un résumé académique clair, synthétique et pédagogique en français pour le cours suivant : "${sanitizedTitle}". 
Contexte additionnel : ${sanitizedContext || "Pas de contexte additionnel fourni."}
Le résumé doit être structuré en markdown, d'environ 3 paragraphes ou puces majeures.
Ajoute obligatoirement à la fin une petite section nommée "💡 Muhtasari wa Swahili (Résumé en Swahili Tanganyika)" d'environ 2 à 3 lignes résumant l'essentiel pour les étudiants locaux dont la langue maternelle est le Swahili. Respecte le ton bienveillant d'un enseignant africain.`,
      });
      res.json({ text: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Quiz Generation from Text Topic or Title
  app.post("/api/ai/generate-quiz", async (req, res) => {
    const { topic } = req.body;
    const sanitizedTopic = sanitizeInput(topic, 500);
    const client = getGeminiClient();

    if (!client) {
      // Simulated Quiz fallback
      const simulatedQuiz = [
        {
          id: "sq1",
          text: `Dans le cadre du Tanganyika (RDC), pourquoi les applications légères et le code optimisé sont-ils préférables ?`,
          type: "mcq",
          options: [
            "Parce que la bande passante mobile locale est souvent saturée ou à débit limité.",
            "Parce que les téléphones coûteux refusent tout code trop lourd.",
            "Simplement pour suivre des contraintes de mode esthétiques.",
            "Pour augmenter délibérément la difficulté des examens."
          ],
          correctOptionIndex: 0
        },
        {
          id: "sq2",
          text: `Quel est le port par défaut utilisé par les serveurs proxy de développement montés sur nos architectures ?`,
          type: "mcq",
          options: ["8080", "5000", "3000", "27017"],
          correctOptionIndex: 2
        },
        {
          id: "sq3",
          text: `En Swahili rwandais ou congolais du Tanganyika, comment dit-on généralement 'Livre ou Manuel d'étude' ?`,
          type: "mcq",
          options: ["Meza", "Kitabu cha masomo", "Kazi ya nyumbani", "Barua"],
          correctOptionIndex: 1
        }
      ];
      return res.json({ questions: simulatedQuiz, simulated: true });
    }

    try {
      const prompt = `Tu es une intelligence académique d'un professeur d'université congolaise au Tanganyika.
Génère un quiz de 3 questions à choix multiples (QCM) sur le sujet suivant : "${sanitizedTopic}".
Chaque question doit comporter 4 options et un index d'option correcte (0 à 3).
Le résultat doit obligatoirement être au format JSON conforme à ce schéma :
{
  "questions": [
    {
      "id": "q-1",
      "text": "Texte de la question en français...",
      "type": "mcq",
      "options": ["Option a", "Option b", "Option c", "Option d"],
      "correctOptionIndex": 1
    }
  ]
}`;
      const response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["mcq"] },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    correctOptionIndex: { type: Type.INTEGER }
                  },
                  required: ["id", "text", "type", "options", "correctOptionIndex"]
                }
              }
            },
            required: ["questions"]
          }
        }
      });
      
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Translation (Français - Swahili - Anglais)
  app.post("/api/ai/translate", async (req, res) => {
    const { text, targetLang } = req.body;
    const sanitizedText = sanitizeInput(text, 2000);
    const sanitizedTargetLang = sanitizeInput(targetLang, 50);
    const client = getGeminiClient();

    if (!client) {
      const translations: Record<string, string> = {
        'swahili': 'Habari zenu wanafunzi wa Tanganyika, karibuni sana kwenye jukwaa letu la masomo (EduTanganyika LMS). Leo tutajifunza jinsi ya kutumia vifaa vyetu nje ya mtandao.',
        'english': 'Dear students of Tanganyika, welcome to our unified learning platform (EduTanganyika LMS). Today we will study how to access educational documents in offline mode.',
        'french': 'Chers étudiants du Tanganyika, bienvenue sur notre plateforme d’apprentissage unifiée (EduTanganyika LMS). Aujourd’hui nous allons étudier comment accéder aux cours en mode hors-ligne.'
      };
      const result = translations[sanitizedTargetLang.toLowerCase()] || sanitizedText;
      return res.json({ translatedText: result, simulated: true });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Traduis le texte suivant en ${sanitizedTargetLang} (les choix courants sont Français, Swahili de RDC Tanganyika, ou Anglais). 
Texte à traduire : "${sanitizedText}"
Donne simplement la traduction brute, aucun bavardage introductif.`,
      });
      res.json({ translatedText: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Course Q&A Assistant
  app.post("/api/ai/qa", async (req, res) => {
    const { question, history } = req.body;
    const sanitizedQuestion = sanitizeInput(question, 1000);
    const sanitizedHistory = Array.isArray(history)
      ? history.map((h: any) => ({
          role: sanitizeInput(h.role, 50),
          text: sanitizeInput(h.text, 1000)
        }))
      : [];
    const client = getGeminiClient();

    if (!client) {
      // Return custom helpful answers tailored to educational topics
      let fallbackText = `Chers élèves de la Plateforme d'Étude et du Tanganyika, voici une explication sur votre sujet d'intérêt.

Dans notre environnement universitaire, l'assimilation des cours passe par un travail récurrent de rédaction de fiches et d'auto-évaluation.
- **Réduction des données** : Profitez de la fonctionnalité d'enregistrement de cours PDF/Audio locaux pour économiser vos forfaits Internet.
- **Assiduité** : Discutez régulièrement avec vos enseignants via l'onglet Communication pour lever tout doute académique sur les TPs d'Algorithmique ou d'Agronomie.

*Swahili*: Tafadhali pakua mafunzo yako oli uweze kusoma bila kutumia internet kila mara ya mawasiliano.`;
      return res.json({ response: fallbackText, simulated: true });
    }

    try {
      // Standard simple chat implementation using generateContent with full payload
      const chatHistoryPrompt = sanitizedHistory?.map((h: any) => `${h.role === 'user' ? 'Étudiant' : 'Assistant'}: ${h.text}`).join('\n') || "";
      const prompt = `Tu es l'assistant IA officiel d'EduTanganyika LMS, une plateforme dédiée aux universités du Tanganyika en RDC.
Tu es un guide académique inspirant, amical, précis et formulé en français rwandais/congolais professionnel. 
Réponds avec sagesse et simplicité à la question de l'étudiant. S'il s'exprime en Swahili, réponds-lui également avec une synthèse finale en Swahili.

Historique récent :
${chatHistoryPrompt}

Question de l'étudiant :
"${sanitizedQuestion}"`;

      const response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });
      res.json({ response: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Revision Cards Generator
  app.post("/api/ai/revision-notes", async (req, res) => {
    const { courseTitle, topic } = req.body;
    const sanitizedCourseTitle = sanitizeInput(courseTitle, 200);
    const sanitizedTopic = sanitizeInput(topic, 500);
    const client = getGeminiClient();

    if (!client) {
      // Mock generated flashcards
      const mockNotes = `### 📝 Fiche de Révision : ${sanitizedTopic || "Récapitulatif de cours"}
      
**Matière** : ${sanitizedCourseTitle || "Algorithmique Générale"}

1. **Définition Cruciale** :
   - *Complexité Algorithmique* : Mesure quantitative de la quantité de ressources (temps et espace mémoire) consommées par un algorithme en fonction de la taille N du problème.
2. **Les 3 Règles d'Or** :
   - Éviter d'imbriquer inutilement des boucles pour ne pas exploser vers du O(N²).
   - Préférer la recherche binaire O(log N) à la recherche séquentielle O(N) dès que possible.
   - Penser à libérer la mémoire des structures de données temporaires.
3. **Mémento Swahili** :
   - *Kazi ya algorithmu* : Ni njama ya kupunguza muda na utumiaji wa kumbukumbu (memory) ya simu au kompyuta yako.

*Cette fiche est disponible dans votre stockage local hors-ligne.*`;
      return res.json({ notes: mockNotes, simulated: true });
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Tu es un tuteur scolaire renommé de la Plateforme d'Étude.
Génère une fiche de révision structurée sous forme de carte mémo pour le cours "${sanitizedCourseTitle}" portant spécifiquement sur le sujet : "${sanitizedTopic}".
Fais en sorte qu'elle soit courte, extremely lisible (titres gras, puces claires) pour pouvoir être consultée sur l'écran d\'un smartphone de taille modeste.
Ajoute quelques mots-clés bilingues (Français / Swahili) pour faciliter l'assimilation.`,
      });
      res.json({ notes: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== VITE MIDDLEWARE SETUP ====================

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
