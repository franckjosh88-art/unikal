/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, LibraryItem, ForumTopic, ForumPost, Announcement, User, Assignment, Quiz } from './types';

// Écoles secondaires de la Plateforme d'Étude
export const UNIVERSITIES = [
  { id: 'lycee-amani', name: 'Plateforme d\'Étude', city: 'Plateforme d\'Étude' },
  { id: 'college-st-albert', name: 'Collège Saint-Albert', city: 'Plateforme d\'Étude' },
  { id: 'inst-kalemie', name: 'Institut de la Plateforme d\'Étude', city: 'Plateforme d\'Étude' },
  { id: 'lycee-maendeleo', name: 'Lycée Maendeleo', city: 'Plateforme d\'Étude' },
];

export const FACULTIES = [
  'Humanités Scientifiques',
  'Commerciale et Gestion',
  'Pédagogie Générale'
];

export const INITIAL_USERS: User[] = [
  { id: 's1', name: 'Élève Christian Mwamba', email: 'christian.mwamba@plateformedetude.org', role: 'student', faculty: 'Humanités Scientifiques', department: 'Option Physique-Chimie', studentId: 'PLATEFORME-DETUDE-2025-0453' },
  { id: 's2', name: 'Élève Sarah Kitenge', email: 'sarah.kitenge@plateformedetude.org', role: 'student', faculty: 'Commerciale et Gestion', department: 'Option Commerciale & Administrative', studentId: 'PLATEFORME-DETUDE-2025-0112' },
  { id: 't1', name: 'Professeur Jean Bosco Kabulo', email: 'jean.bosco@plateformedetude.org', role: 'teacher', faculty: 'Humanités Scientifiques', department: 'Option Physique-Chimie' },
  { id: 't2', name: 'Professeur Aimé Ilunga', email: 'aime.ilunga@plateformedetude.org', role: 'teacher', faculty: 'Pédagogie Générale', department: 'Option Pédagogique' },
  { id: 'p1', name: 'Parent Lambert Mwamba', email: 'lambert.mwamba@gmail.com', role: 'parent' }, // Parent de Christian Mwamba
  { id: 'admin1', name: 'Sœur Marie-Thérèse Mwamba', email: 'prefecture@plateformedetude.org', role: 'admin' }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'PHYS-401',
    title: 'Physique Optique et Électricité Statique',
    description: 'Concepts de base de l\'optique géométrique (lentilles convergentes, miroirs sphériques) et des phénomènes électrostatiques. Ce cours prépare rigoureusement les élèves de 4ème Scientifique aux épreuves théoriques et pratiques de l\'Examen d\'État national.',
    faculty: 'Humanités Scientifiques',
    department: 'Option Physique-Chimie',
    academicYear: '4ème Scientifique (Terminale)',
    credits: 6,
    teacherId: 't1',
    teacherName: 'Prof. Jean Bosco Kabulo',
    modules: [
      {
        id: 'c1-m1',
        title: 'Chapitre 1 : Lentilles Minces Convergentes et Divergentes',
        materials: [
          { id: 'mat1', title: 'Support de Cours PDF - Formules de conjugaison et foyers', type: 'pdf', url: '/pdf/lentilles_convergentes.pdf', size: '1.2 MB' },
          { id: 'mat2', title: 'Vidéo : Tracé de rayons lumineux et construction d\'images', type: 'video', url: '/video/optique_rayons.mp4', duration: '12:45', size: '15.4 MB' }
        ]
      },
      {
        id: 'c1-m2',
        title: 'Chapitre 2 : Électrostatique - Loi de Coulomb et Champs Électriques',
        materials: [
          { id: 'mat3', title: 'Fiche Synthétique - Interactions de charges et potentiel', type: 'presentation', url: '/slides/electrostatique_coulomb.pptx', size: '2.5 MB' },
          { id: 'mat4', title: 'Audio de Synthèse : Récapitulatif de cours de physique', type: 'audio', url: '/audio/recap_electrostatique.ogg', duration: '05:30', size: '2.1 MB' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    code: 'COMPTA-305',
    title: 'Comptabilité Générale et Système OHADA',
    description: 'Étude approfondie de l\'enregistrement comptable des pièces de commerce, de l\'établissement du journal, du grand livre et de la balance. Ce cours forme les élèves de la section Commerciale et Gestion aux normes comptables harmonisées de l\'Afrique centrale.',
    faculty: 'Commerciale et Gestion',
    department: 'Option Commerciale & Administrative',
    academicYear: '3ème Commerciale',
    credits: 5,
    teacherId: 't2',
    teacherName: 'Prof. Aimé Ilunga',
    modules: [
      {
        id: 'c2-m1',
        title: 'Chapitre 1 : Le Bilan d\'Ouverture et de Clôture',
        materials: [
          { id: 'mat6', title: 'Structure du Bilan selon le plan comptable OHADA', type: 'pdf', url: '/pdf/bilan_ohada.pdf', size: '1.5 MB' }
        ]
      },
      {
        id: 'c2-m2',
        title: 'Chapitre 2 : Les Comptes de Gestion et les Écritures de Vente',
        materials: [
          { id: 'mat7', title: 'Fiche d\'exercices résolus : Facturation et TVA', type: 'pdf', url: '/pdf/exercices_tva_ohada.pdf', size: '850 KB' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    code: 'CHIM-402',
    title: 'Chimie Organique : Les Hydrocarbures',
    description: 'Nomenclature, propriétés physiques, synthèses et réactions caractéristiques des alcanes, alcènes et alcynes. Ce cours met en évidence les applications industrielles en pétrochimie et la rigueur d\'analyse moléculaire attendue au baccalauréat congolais.',
    faculty: 'Humanités Scientifiques',
    department: 'Option Physique-Chimie',
    academicYear: '4ème Scientifique (Terminale)',
    credits: 6,
    teacherId: 't1',
    teacherName: 'Prof. Jean Bosco Kabulo',
    modules: [
      {
        id: 'c3-m1',
        title: 'Chapitre 1 : Alcanes - Isomérie de chaîne et réactions de substitution',
        materials: [
          { id: 'mat9', title: 'Cours complet PDF - Les Alcanes', type: 'pdf', url: '/pdf/chimie_alcanes.pdf', size: '3.4 MB' }
        ]
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    courseTitle: 'Physique Optique et Électricité Statique',
    title: 'Devoir : Détermination de la distance focale d\'une lentille convergente',
    description: 'En utilisant la formule de conjugaison de Descartes (1/p\' - 1/p = 1/f\'), déterminez la position de l\'image d\'un objet situé à 20 cm devant une lentille convergente de distance focale f\' = 10 cm. Représentez le schéma optique à l\'échelle sur vos cahiers et téléversez la photo.',
    dueDate: '2026-06-30T18:00:00Z',
    points: 20
  },
  {
    id: 'a2',
    courseId: 'c2',
    courseTitle: 'Comptabilité Générale et Système OHADA',
    title: 'Travail Pratique : Établissement de la Balance à 4 Colonnes',
    description: 'Sur la base de la liste des opérations commerciales du mois de Mai fournie dans le document d\'exercices (achat de marchandises, paiement de transport, ventes à crédit), dressez le Grand Livre et établissez la Balance de vérification à 4 colonnes.',
    dueDate: '2026-07-05T23:59:00Z',
    points: 15,
    submitted: true,
    submissionDate: '2026-06-21T10:30:00Z',
    submissionText: 'Rapport rédigé par l\'élève Christian Mwamba pour la comptabilité OHADA de la boutique d\'essai "Tanganyika Distribution". J\'ai équilibré les colonnes des débits et des crédits et vérifié que la somme des soldes débiteurs est égale à celle des soldes créditeurs (3.450.000 FC).',
    grade: 18,
    gradeFeedback: 'Excellent travail rigoureux ! Aucun centime d\'écart. Les libellés d\'écriture sont parfaits. Continuez sur cette lancée pour les Examens d\'État.'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    courseId: 'c3',
    courseTitle: 'Chimie Organique : Les Hydrocarbures',
    title: 'Quiz 1 : Nomenclature et réactivité des alcanes',
    description: 'Ce quiz rapide évalue votre maîtrise des règles de nomenclature IUPAC, des isomères de constitution et des réactions d\'halogénation étudiées au Chapitre 1.',
    durationMinutes: 15,
    dueDate: '2026-06-28T20:00:00Z',
    questions: [
      {
        id: 'q1-1',
        text: 'Quel est le nom de l\'hydrocarbure saturé linéaire comportant 5 atomes de carbone ?',
        type: 'mcq',
        options: ['Méthane', 'Propane', 'Pentane', 'Hexane'],
        correctOptionIndex: 2
      },
      {
        id: 'q1-2',
        text: 'La formule générale brute d\'un alcane acyclique saturé est :',
        type: 'mcq',
        options: ['CnH2n', 'CnH2n-2', 'CnH2n+2', 'CnHn'],
        correctOptionIndex: 2
      },
      {
        id: 'q1-3',
        text: 'La réaction d\'un alcane avec du chlore en présence de lumière (UV) est une réaction de :',
        type: 'mcq',
        options: ['Substitution radicalaire', 'Addition électrophile', 'Élimination', 'Combustion incomplète'],
        correctOptionIndex: 0
      }
    ]
  }
];

export const INITIAL_LIBRARY: LibraryItem[] = [
  { id: 'lib1', title: 'Annales d\'Examens d\'État RDC - Chimie Pratique (2018-2025)', author: 'Inspection Provinciale Tanganyika', type: 'livre', year: 2025, institution: 'Plateforme d\'Étude', faculty: 'Humanités Scientifiques', size: '4.8 MB', downloadsCount: 312 },
  { id: 'lib2', title: 'Précis de Pédagogie Générale et Psychologie de l\'Enfant', author: 'Sœurs de la Charité', type: 'livre', year: 2024, institution: 'Plateforme d\'Étude', faculty: 'Pédagogie Générale', size: '3.1 MB', downloadsCount: 245 },
  { id: 'lib3', title: 'Manuel de Comptabilité Générale des Entreprises (OHADA Scolaire)', author: 'Ministère de l\'EPST', type: 'livre', year: 2023, institution: 'Éditions Scolaires Nationales RDC', faculty: 'Commerciale et Gestion', size: '12.5 MB', downloadsCount: 189 },
  { id: 'lib4', title: 'Annales d\'Examens d\'État - Mathématiques et Physique', author: 'Comité Pédagogique de la Plateforme d\'Étude', type: 'livre', year: 2025, institution: 'Plateforme d\'Étude', faculty: 'Humanités Scientifiques', size: '5.4 MB', downloadsCount: 405 }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Lancement de la Session de Préparation Intensive à l\'Examen d\'État',
    content: 'Chers élèves de 4ème (Terminale), les sessions d\'examens blancs provinciaux et les manipulations pratiques obligatoires au nouveau laboratoire de chimie débuteront ce lundi. La présence de tous les élèves finalistes est strictement requise dès 07h15 en uniforme officiel.',
    category: 'Examens',
    authorId: 'admin1',
    authorName: 'Sœur Marie-Thérèse Mwamba - Préfète',
    authorRole: 'admin',
    targetAudience: 'tous',
    createdAt: '2026-06-22T08:00:00Z',
    isPinned: true,
    isActive: true,
    scope: 'all'
  },
  {
    id: 'ann2',
    title: 'Disponibilité de l\'assistant intelligent IA de la Plateforme d\'Étude (Gratuit & Hors-ligne)',
    content: 'Le comité de gestion de l\'école est fier d\'annoncer que l\'assistant de révision Gemini AI est désormais intégré à notre portail numérique. Il permet de générer des questions de révision adaptées au programme de l\'EPST et de résumer vos cours. L\'assistant a été programmé pour être extrêmement léger afin d\'économiser les forfaits mobiles des familles.',
    category: 'Académique',
    authorId: 'admin1',
    authorName: 'Administrateur de la Plateforme d\'Étude',
    authorRole: 'admin',
    targetAudience: 'tous',
    createdAt: '2026-06-20T14:30:00Z',
    isPinned: false,
    isActive: true,
    scope: 'all'
  }
];

export const INITIAL_FORUM_TOPICS: ForumTopic[] = [
  { id: 'topic1', title: 'Meilleurs trucs pour retenir la nomenclature des hydrocarbures acycliques', description: 'Bonjour chers camarades de la terminale scientifique, avez-vous des astuces mnémotechniques simples pour mémoriser l\'ordre des préfixes des premiers alcanes (méth, éth, prop, but, pent, hex...) pour le prochain QCM ?', category: 'cours', courseId: 'c1', authorName: 'Christian Mwamba', createdAt: '2026-06-21T18:00:00Z', repliesCount: 2, viewsCount: 45 },
  { id: 'topic2', title: 'Lancement du Club d\'Émulation Scientifique et Robotique', description: 'Sous le patronage de la Sœur Préfète, nous créons un club scientifique pour concevoir de mini panneaux solaires mobiles et automatiser des circuits d\'éclairage économes pour le lycée.', category: 'partage', authorName: 'Sarah Kitenge', createdAt: '2026-06-20T09:12:00Z', repliesCount: 1, viewsCount: 24 }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'fp1',
    topicId: 'topic1',
    authorName: 'Christian Mwamba',
    authorRole: 'student',
    content: 'Pour me souvenir des quatre premiers préfixes de chimie organique (Méthane, Éthane, Propane, Butane), j\'utilise la phrase "Maman Est Partie Bouder". Les initiales M, E, P, B m\'aident énormément !',
    createdAt: '2026-06-21T18:05:00Z',
    likes: 5,
    replies: [
      {
        id: 'fpr1',
        authorName: 'Prof. Jean Bosco Kabulo',
        authorRole: 'teacher',
        content: 'C\'est une excellente astuce de mémorisation Christian ! Je la conseillerai à tous les élèves lors du prochain cours pratique en laboratoire.',
        createdAt: '2026-06-22T08:45:00Z'
      },
      {
        id: 'fpr2',
        authorName: 'Sarah Kitenge',
        authorRole: 'student',
        content: 'Wow, merci Christian ! "Maman Est Partie Bouder" va sauver ma note de chimie organique ce vendredi !',
        createdAt: '2026-06-22T19:30:00Z'
      }
    ]
  }
];

export const INITIAL_MESSAGES = [
  { id: 'msg1', senderId: 't1', senderName: 'Prof. Jean Bosco Kabulo', senderRole: 'teacher', receiverId: 's1', content: 'Christian, j\'ai passé en revue la photo de ton exercice d\'optique sur les lentilles convergentes. Ton calcul est impeccable, mais assure-toi de tracer les lignes pointillées pour les foyers virtuels lors de l\'examen.', createdAt: '2026-06-22T16:00:00Z', read: true },
  { id: 'msg2', senderId: 's1', senderName: 'Christian Mwamba', senderRole: 'student', receiverId: 't1', content: 'Merci beaucoup Professeur ! J\'ai téléchargé la fiche récapitulative d\'optique en mode hors-ligne pour la réviser ce soir et je referai le tracé propre.', createdAt: '2026-06-22T17:15:00Z', read: true }
];

export const PARENT_LOGS_MAP: Record<string, any> = {
  'p1': {
    studentName: 'Christian Mwamba',
    studentId: 'PLATEFORME-DETUDE-2025-0453',
    attendanceRate: 98,
    recentGradeAverage: 16.5,
    recentActivity: [
      'Présence confirmée au laboratoire de physique (Optique) (Mardi 23 Juin)',
      'A obtenu 18/20 au travail pratique de comptabilité OHADA (Prof. Aimé Ilunga)',
      'A téléchargé le manuel "Annales de Chimie Pratique (2018-2025)" pour révisions hors-ligne',
      'A partagé une astuce de révision approuvée par le professeur sur le forum scolaire'
    ]
  }
};

// Architecture de la Plateforme d'Étude
export const SYSTEM_DOCUMENTATION = {
  architecture: {
    title: 'Architecture Logicielle de la Plateforme d\'Étude',
    overview: 'La Plateforme d\'Étude numérique a été conçue pour surmonter les restrictions de connectivité et de bande passante dans la province du Tanganyika. Son architecture distribue de façon optimale le client léger React (optimisé pour les smartphones des familles) de l\'API d\'Intelligence Artificielle de secours animée par Gemini.',
    components: [
      { name: 'Portail Client Léger React.js', desc: 'Interface responsive animée par Tailwind CSS et Framer Motion, stockant en local les supports de cours et QCMs préchargés en cache pour garantir un mode hors-ligne strict.' },
      { name: 'Serveur Académique Node.js', desc: 'Centralise les bases de données d\'évaluation, le suivi de discipline des élèves et distribue les fiches de cours décompressées et optimisées.' },
      { name: 'Moteur IA Gemini Server-Side', desc: 'Modèle de traitement de texte qui convertit les annales d\'examens lourdes en mini fiches résumées textuelles de 2 Ko, idéales pour l\'envoi direct par SMS ou faible réseau.' },
      { name: 'Bases de Données Intégrées', desc: 'Modèle hybride relationnel pour structurer les liens étroits entre élèves, enseignants, devoirs scolaires et bilans comptables OHADA.' }
    ],
    offlineOptimizations: [
      'Bouton de préchargement : Téléchargement asynchrone des médias scolaires lors d\'une connexion wifi stable.',
      'Compression audio de cours : Remplacement des vidéos lourdes par des enregistrements vocaux MP3/OGG de 1,5 MB.',
      'Stockage hors-ligne strict : Résolution locale des QCMs et mise en attente de synchronisation automatique des copies dès reconnexion.'
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
                        | 0..*                       +--------------------------+
           +------------v------------+               |       CourseModule       |
           |       ForumTopic        |               +--------------------------+
           +-------------------------+               | - id: String             |
           | - id: String            |               | - title: String          |
           | - title: String         |               | - materials: Material[]  |
           | - description: String   |               +--------------------------+
           | - category: String      |                            | 1
           | - authorName: String    |                            |
           +------------+------------+                            | 0..*
                        |                                         v
                        | 1                          +--------------------------+
                        |                            |      CourseMaterial      |
                        | 0..*                       |   (Fiche/Audio/Exos)     |
           +------------v------------+               +--------------------------+
           |        ForumPost        |               | - id: String             |
           +-------------------------+               | - title: String          |
           | - id: String            |               | - type: MediaType        |
           | - authorName: String    |               | - url: String            |
           | - content: String       |               | - size: String           |
           +-------------------------+               +--------------------------+

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
