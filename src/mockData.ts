/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, LibraryItem, ForumTopic, ForumPost, Announcement, User, Assignment, Quiz } from './types';

// Universités du Tanganyika sous-jacentes
export const UNIVERSITIES = [
  { id: 'unikal', name: 'Université de Kalemie (UNIKAL)', city: 'Kalemie' },
  { id: 'uniman', name: 'Université de Kongolo (UNIMAN)', city: 'Kongolo' },
  { id: 'isp-kalemie', name: 'Institut Supérieur Pédagogique (ISP) Kalemie', city: 'Kalemie' },
  { id: 'istm-kalemie', name: 'Institut Supérieur des Techniques Médicales (ISTM)', city: 'Kalemie' },
  { id: 'uni-manono', name: 'Université de Manono', city: 'Manono' },
];

export const FACULTIES = [
  'Sciences Agronomiques',
  'Sciences Appliquées & Polytechnique',
  'Droit & Sciences Politiques',
  'Sciences Économiques & Gestion',
  'Lettre & Sciences Humaines',
  'Médecine & Santé Publique'
];

export const INITIAL_USERS: User[] = [
  { id: 's1', name: 'Étudiant A', email: 'etudiant.a@unik.edu', role: 'student', faculty: 'Sciences Appliquées & Polytechnique', department: 'Génie Informatique', studentId: 'UNIK-2025-0453' },
  { id: 's2', name: 'Étudiant B', email: 'etudiant.b@unik.edu', role: 'student', faculty: 'Sciences Économiques & Gestion', department: 'Gestion Financière', studentId: 'UNIK-2025-0112' },
  { id: 't1', name: 'Professeur A', email: 'professeur.a@unik.edu', role: 'teacher', faculty: 'Sciences Appliquées & Polytechnique', department: 'Génie Informatique' },
  { id: 't2', name: 'Professeur B', email: 'professeur.b@unik.edu', role: 'teacher', faculty: 'Sciences Agronomiques', department: 'Phytotechnie' },
  { id: 'p1', name: 'Parent A', email: 'parent.a@gmail.com', role: 'parent' }, // Parent de l'Étudiant A
  { id: 'admin1', name: 'Administrateur A', email: 'administrateur.a@unik.edu', role: 'admin' }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'POLY-201',
    title: 'Algorithmique et Structures de Données',
    description: 'Concepts de base de l\'algorithmique, complexité, structures de données linéaires (piles, files, listes) et arborescentes. Ce cours pose les fondations pour le développement de logiciels et d\'applications mobiles légères adaptées aux réseaux mobiles modestes du Tanganyika.',
    faculty: 'Sciences Appliquées & Polytechnique',
    department: 'Génie Informatique',
    academicYear: 'Deuxième Licence LMD',
    credits: 6,
    teacherId: 't1',
    teacherName: 'Professeur A',
    modules: [
      {
        id: 'c1-m1',
        title: 'Chapitre 1 : Introduction à la Complexité Algorithmique',
        materials: [
          { id: 'mat1', title: 'Support de Cours PDF - Complexité Algorithmique', type: 'pdf', url: '/pdf/intro_complexite.pdf', size: '1.2 MB' },
          { id: 'mat2', title: 'Vidéo Introductive : Notation Grand O (Basse Résolution)', type: 'video', url: '/video/intro_o.mp4', duration: '12:45', size: '15.4 MB' }
        ]
      },
      {
        id: 'c1-m2',
        title: 'Chapitre 2 : Listes Chaînées, Piles et Files',
        materials: [
          { id: 'mat3', title: 'Slides de Présentation - Structures de données linéaires', type: 'presentation', url: '/slides/data_structures.pptx', size: '2.5 MB' },
          { id: 'mat4', title: 'Audio de Récapitulatif de Séance (Faible Bande Passante)', type: 'audio', url: '/audio/recap_linear.ogg', duration: '05:30', size: '2.1 MB' }
        ]
      },
      {
        id: 'c1-m3',
        title: 'Chapitre 3 : Arbres et Algorithmes de Tri',
        materials: [
          { id: 'mat5', title: 'Support de cours PDF - Arbres et Tris', type: 'pdf', url: '/pdf/arbres_tri.pdf', size: '1.8 MB' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    code: 'AGRO-305',
    title: 'Pratiques Agro-pastorales durables au Tanganyika',
    description: 'Étude des techniques culturales et d\'élevage optimisées pour les sols argilo-sableux de la plaine de Kalemie et du bassin du fleuve Congo à Kongolo. Analyse de la sécurité alimentaire locale, la lutte contre l\'érosion et l\'irrigation traditionnelle.',
    faculty: 'Sciences Agronomiques',
    department: 'Phytotechnie',
    academicYear: 'Troisième Licence LMD',
    credits: 5,
    teacherId: 't2',
    teacherName: 'Professeur B',
    modules: [
      {
        id: 'c2-m1',
        title: 'Chapitre 1 : Typologie des sols de Kalemie et Manono',
        materials: [
          { id: 'mat6', title: 'Manuel de Pédologie du Tanganyika', type: 'pdf', url: '/pdf/pedologie_tanganyika.pdf', size: '4.1 MB' }
        ]
      },
      {
        id: 'c2-m2',
        title: 'Chapitre 2 : Aménagement des cultures sur berges (Bassin du Tanganyika)',
        materials: [
          { id: 'mat7', title: 'Fiche technique de culture maraîchère locale', type: 'pdf', url: '/pdf/culture_maraichere_local.pdf', size: '850 KB' },
          { id: 'mat8', title: 'Audio : Entretien avec les coopératives agricoles de Kongolo', type: 'audio', url: '/audio/coops_kongolo.mp3', duration: '15:20', size: '6.5 MB' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    code: 'GÉO-401',
    title: 'Géologie Minière et Gisements de Manono',
    description: 'Étude structurale et lithologique des gisements de pegmatite lithinifère (Lithium, étain, coltan) de la région minière de Manono dans le Tanganyika. Évaluation géophysique et enjeux de l\'exploitation minière responsable face aux enjeux écologiques nationaux.',
    faculty: 'Sciences Appliquées & Polytechnique',
    department: 'Génie Géologique',
    academicYear: 'Master 1',
    credits: 6,
    teacherId: 't1',
    teacherName: 'Professeur A',
    modules: [
      {
        id: 'c3-m1',
        title: 'Chapitre 1 : Contexte Géologique Régional de la Ceinture de Kibara',
        materials: [
          { id: 'mat9', title: 'Pegmatites de Manono et géologie structurale', type: 'pdf', url: '/pdf/pegmatites_manono.pdf', size: '3.4 MB' }
        ]
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    courseTitle: 'Algorithmique et Structures de Données',
    title: 'Travail Pratique : Implémentation d\'une Liste doublement chaînée',
    description: 'Écrire un algorithme complet (en pseudo-code ou Java / Python) pour implémenter une structure de liste doublement chaînée optimisée en mémoire. Incluez les fonctions d\'insertion au début, insertion à la fin, et suppression d\'un élément par index.',
    dueDate: '2026-06-30T18:00:00Z',
    points: 20
  },
  {
    id: 'a2',
    courseId: 'c2',
    courseTitle: 'Pratiques Agro-pastorales durables au Tanganyika',
    title: 'Rapport d\'analyse d\'une coopérative à Kalemie',
    description: 'Visitez ou documentez une coopérative agricole de votre collectivité. Décrivez leurs méthodes d\'aménagement des cultures, la gestion de l\'eau en saison sèche, et les principaux défis liés au transport des récoltes vers les marchés urbains.',
    dueDate: '2026-07-05T23:59:00Z',
    points: 15,
    submitted: true,
    submissionDate: '2026-06-21T10:30:00Z',
    submissionText: 'Rapport rédigé par l\'Étudiant A sur la coopérative maraîchère "Kenda" située sur les collines fertiles du lac Tanganyika. Nous avons analysé leur système d\'irrigation par gravité utilisant les petites rivières locales et mis en évidence un manque criant d\'entrepôts de réfrigération provoquant 40% de pertes post-récolte.',
    grade: 14,
    gradeFeedback: 'Très bon esprit synthétique. L\'analyse sur l\'irrigation par gravité est pertinente. Creusez davantage les alternatives de séchage solaire des fruits.'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    courseId: 'c1',
    courseTitle: 'Algorithmique et Structures de Données',
    title: 'Quiz 1 : Complexité Temporelle & Notation Grand O',
    description: 'Ce quiz évalue votre compréhension fondamentale de l\'analyse de la complexité des algorithmes récurrents étudiés lors du Chapitre 1.',
    durationMinutes: 15,
    dueDate: '2026-06-28T20:00:00Z',
    questions: [
      {
        id: 'q1-1',
        text: 'Quelle est la complexité d\'un algorithme de recherche binaire dans un tableau trié de taille N ?',
        type: 'mcq',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctOptionIndex: 1
      },
      {
        id: 'q1-2',
        text: 'Si un algorithme comporte deux boucles imbriquées dépendantes de la taille des données N, sa complexité asymptotique est typiquement :',
        type: 'mcq',
        options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
        correctOptionIndex: 2
      },
      {
        id: 'q1-3',
        text: 'La structure de données de Pile (Stack) obéit à quel principe d\'accès ?',
        type: 'mcq',
        options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Accès Direct Aléatoire', 'Priorité Croissante'],
        correctOptionIndex: 1
      }
    ]
  }
];

export const INITIAL_LIBRARY: LibraryItem[] = [
  { id: 'lib1', title: 'Évaluation des ressources hydriques de Kalemie et du Lac Tanganyika', author: 'Auteur A', type: 'tfc', year: 2024, institution: 'Université de Kalemie (UNIKAL)', faculty: 'Sciences Appliquées', size: '4.8 MB', downloadsCount: 245 },
  { id: 'lib2', title: 'Impact du changement climatique sur la pêche artisanale de Ndakala', author: 'Auteur B', type: 'memoire', year: 2023, institution: 'Université de Kalemie (UNIKAL)', faculty: 'Sciences Agronomiques', size: '6.2 MB', downloadsCount: 189 },
  { id: 'lib3', title: 'Manuel de Droit Foncier de la RDC : Enjeux fonciers ruraux au Tanganyika', author: 'Professeur C', type: 'livre', year: 2022, institution: 'Éditions Académiques Nationales d\'Afrique', faculty: 'Droit', size: '12.5 MB', downloadsCount: 312 },
  { id: 'lib4', title: 'Analyse de l\'exploitation artisanale du coltan à Manono et impacts socio-économiques', author: 'Auteur D', type: 'memoire', year: 2024, institution: 'Université de Manono', faculty: 'Polytechnique', size: '5.4 MB', downloadsCount: 94 }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Report de la session d\'examen de rattrapage',
    content: 'Chers étudiants, en raison de retards logistiques dans l\'acheminement du matériel de reprographie de Lubumbashi, la session extraordinaire de rattrapage est reportée d\'une semaine. Elle débutera le lundi 6 juillet 2026. Merci de votre compréhension.',
    category: 'Examens',
    authorId: 'admin1',
    authorName: 'Secrétariat Général Académique - UNIKAL',
    authorRole: 'admin',
    targetAudience: 'tous',
    createdAt: '2026-06-22T08:00:00Z',
    isPinned: true,
    isActive: true,
    scope: 'all'
  },
  {
    id: 'ann2',
    title: 'Disponibilité de l\'assistant IA UNIKAL E-Learning (Gratuit & Léger)',
    content: 'Nous avons le plaisir d\'annoncer que l\'assistant de révision à base d\'intelligence artificielle Gemini est désormais accessible sur notre LMS. Il est spécialement optimisé pour fonctionner à faible consommation de données mobiles, permettant de résumer vos cours et de générer des quiz linguistiques en Français/Swahili sans saturer votre forfait Internet !',
    category: 'Académique',
    authorId: 'admin1',
    authorName: 'Administrateur A',
    authorRole: 'admin',
    targetAudience: 'tous',
    createdAt: '2026-06-20T14:30:00Z',
    isPinned: false,
    isActive: true,
    scope: 'all'
  }
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  { id: 'topic1', title: 'Meilleures pratiques pour compiler sur mobile (sans internet)', description: 'Chers camarades, comme l\'électricité et le réseau connaissent des interruptions au quartier Kituku, quelles applications légères Android utilisez-vous pour coder et compiler nos TPs d\'algorithmique en local hors-ligne ?', category: 'cours', courseId: 'c1', authorName: 'Étudiant A', createdAt: '2026-06-21T18:00:00Z', repliesCount: 2, viewsCount: 45 },
  { id: 'topic2', title: 'Lancement du Club d\'Entrepreneuriat Agricole UNIKAL', description: 'Nous souhaitons regrouper des étudiants de plusieurs facultés (Agronomie, Gestion, Polytechnique) pour lancer des prototypes de fermes intelligentes ou cultures hydroponiques adaptées aux climats tropicaux humides.', category: 'partage', authorName: 'Étudiant B', createdAt: '2026-06-20T09:12:00Z', repliesCount: 1, viewsCount: 24 }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'fp1',
    topicId: 'topic1',
    authorName: 'Étudiant A',
    authorRole: 'student',
    content: 'J\'utilise personnellement l\'application "Acode" disponible sur Android. Elle est gratuite, ultra-légère (7 MB) et me permet d\'écrire les algorithmes en Javascript/HTML pour tester la logique même sans réseau.',
    createdAt: '2026-06-21T18:05:00Z',
    likes: 5,
    replies: [
      {
        id: 'fpr1',
        authorName: 'Professeur A',
        authorRole: 'teacher',
        content: 'Très bonne initiative. L\'éditeur Termux est aussi une excellente alternative en local pour exécuter des scripts Python ou compiler du C/C++ sans connexion. J\'apprécie ces astuces pour pallier les défis énergétiques de notre province.',
        createdAt: '2026-06-22T08:45:00Z'
      },
      {
        id: 'fpr2',
        authorName: 'Étudiant B',
        authorRole: 'student',
        content: 'Superbe astuce ! Je vais télécharger Acode et Termux la prochaine fois que je passe près de l\'antenne à l\'Université de Kalemie pour capter la 3G !',
        createdAt: '2026-06-22T19:30:00Z'
      }
    ]
  }
];

export const INITIAL_MESSAGES = [
  { id: 'msg1', senderId: 't1', senderName: 'Professeur A', senderRole: 'teacher', receiverId: 's1', content: 'Étudiant A, j\'ai beaucoup apprécié votre participation au cours d\'aujourd\'hui. Pensez à corriger les indices des boucles dans votre TP 1 avant de le soumettre.', createdAt: '2026-06-22T16:00:00Z', read: true },
  { id: 'msg2', senderId: 's1', senderName: 'Étudiant A', senderRole: 'student', receiverId: 't1', content: 'Merci Professeur! Je vais revoir mon algorithme ce soir en utilisant la méthode hors-ligne. Je vous soumettrai le rapport révisé dès que la connexion le permettra.', createdAt: '2026-06-22T17:15:00Z', read: true }
];

export const PARENT_LOGS_MAP: Record<string, any> = {
  'p1': {
    studentName: 'Étudiant A',
    studentId: 'UNIK-2025-0453',
    attendanceRate: 96,
    recentGradeAverage: 15.6,
    recentActivity: [
      'Présence confirmée au cours d\'Algorithmique (Mardi 23 Juin)',
      'A obtenu un 14/20 pour le Rapport d\'analyse maraîchère (Professeur B)',
      'A téléchargé le cours "Structures de données linéaires" en mode hors-ligne',
      'A participé activement au Forum académique d\'Algorithmique'
    ]
  }
};

// Architecture & UML details definitions for visual display
export const SYSTEM_DOCUMENTATION = {
  architecture: {
    title: 'Architecture du Système UNIKAL E-Learning',
    overview: 'UNIKAL E-Learning est conçu spécifiquement pour faire face aux contraintes réseau du Tanganyika (RDC). L\'architecture sépare de façon étanche le Client React (optimisé pour mobiles de gammes moyennes et connexions 2G/3G fluctuantes) du Serveur Node.js/Express, soutenu par une couche d\'Intelligence Artificielle server-side via l\'API Gemini.',
    components: [
      { name: 'Frontend React Mobile-First', desc: 'Rendu client léger, gestion fine du stockage cache local (localStorage) pour simuler et permettre l\'accès aux documents téléchargés et quiz en mode hors-ligne.' },
      { name: 'Backend Express Server', desc: 'Sert l\'API REST, orchestre la base de données persistante de l\'apprentissage et prépare les fiches légères de données à destination des appareils mobiles.' },
      { name: 'Couche IA Server-Side Gemini', desc: 'Interfacée avec le modèle ultra-efficace gemini-3.5-flash pour résumer des cours lourds sous forme de fiches de 2 Ko maximum, générer des quiz autonomes et servir d\'assistant multilingue.' },
      { name: 'Database Model', desc: 'Inspiré d\'un modèle hybride Firestore / Relational (utilisant des schémas de collections isolés, conformes aux exigences d\'intégrité relationnelle).' }
    ],
    offlineOptimizations: [
      'Faible consommation : Compression et nettoyage markdown des fiches produites par l\'IA.',
      'Séquençage audio léger : Remplacement des vidéos par des audios de cours compressés d\'environ 1,5 MB.',
      'Validation de données asynchrones : Soumission des devoirs mise en attente (queue) sur le client en cas de coupure réseau et synchronisation automatique au rétablissement du signal.'
    ]
  },
  umlClass: `
+-----------------------------------------------------------------------------------------+
|                                  DIAGRAMME DE CLASSES UML                               |
+-----------------------------------------------------------------------------------------+

           +-------------------------+               +--------------------------+
           |          User           |               |          Course          |
           +-------------------------+               +--------------------------+
           | - id: String            |               | - id: String             |
           | - name: String          |               | - code: String           |
           | - email: String         | 1        0..* | - title: String          |
           | - role: UserRole        +---------------+ - description: String    |
           | - faculty: String (opt) |               | - credits: Integer       |
           | - department: S. (opt)  |               | - teacherId: String      |
           | - studentId: S. (opt)   |               +--------------------------+
           +------------+------------+                            | 1
                        |                                         |
                        | 1                                       | 0..*
                        |                                         v
                        |                            +--------------------------+
                        | 0..*                       |       CourseModule       |
           +------------v------------+               +--------------------------+
           |       ForumTopic        |               | - id: String             |
           +-------------------------+               | - title: String          |
           | - id: String            |               | - materials: Material[]  |
           | - title: String         |               +--------------------------+
           | - description: String   |                            | 1
           | - category: String      |                            |
           | - authorName: String    |                            | 0..*
           +------------+------------+                            v
                        |                            +--------------------------+
                        | 1                          |      CourseMaterial      |
                        |                                 (PDF/Video/Audio)     |
                        | 0..*                       +--------------------------+
           +------------v------------+               | - id: String             |
           |        ForumPost        |               | - title: String          |
           +-------------------------+               | - type: MediaType        |
           | - id: String            |               | - url: String            |
           | - authorName: String    |               | - size: String           |
           | - content: String       |               +--------------------------+
           +-------------------------+

           +-------------------------+               +--------------------------+
           |       Assignment        |               |           Quiz           |
           +-------------------------+               +--------------------------+
           | - id: String            |               | - id: String             |
           | - courseId: String      |               | - courseId: String       |
           | - title: String         |               | - title: String          |
           | - dueDate: DateTime     |               | - dueDate: DateTime      |
           | - points: Integer       |               | - questions: Question[]  |
           | - submitted: Boolean    |               | - score: Integer (opt)   |
           +-------------------------+               +--------------------------+
  `,
  dbSchema: {
    collections: [
      { name: 'users', primary: 'id', fields: ['name (string)', 'email (string)', 'role (enum: student/teacher/parent/admin)', 'faculty? (string)', 'department? (string)'] },
      { name: 'courses', primary: 'id', fields: ['code (string)', 'title (string)', 'description (text)', 'faculty (string)', 'department (string)', 'credits (int)', 'teacherId (FK->users)', 'modules (array of module objects)'] },
      { name: 'assignments', primary: 'id', fields: ['courseId (FK->courses)', 'title (string)', 'description (text)', 'dueDate (timestamp)', 'points (int)', 'submissionText? (text)', 'grade? (int)', 'gradeFeedback? (text)'] },
      { name: 'quizzes', primary: 'id', fields: ['courseId (FK->courses)', 'title (string)', 'description (text)', 'durationMinutes (int)', 'questions (array of QCM/Open questions with correctIndex)', 'score? (int)'] },
      { name: 'library', primary: 'id', fields: ['title (string)', 'author (string)', 'type (enum: tfc/memoire/livre/revue)', 'year (int)', 'institution (string)', 'faculty (string)', 'size (string)'] },
      { name: 'forum_topics', primary: 'id', fields: ['title (string)', 'description (text)', 'category (string)', 'courseId? (string)', 'authorName (string)', 'repliesCount (int)', 'viewsCount (int)'] },
      { name: 'messages', primary: 'id', fields: ['senderId (FK->users)', 'senderName (string)', 'receiverId (FK->users)', 'content (text)', 'createdAt (timestamp)'] }
    ]
  }
};
