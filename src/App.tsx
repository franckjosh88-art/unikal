/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  MessageSquare,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MonitorUp,
  Radio,
  Volume1,
  Volume2,
  VolumeX,
  Play,
  Square,
  AlertCircle,
  X,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ZoomIn,
  EyeOff,
  Smile,
  Clock,
  ShieldAlert
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AnnouncementsView from './components/AnnouncementsView';
import CoursesView from './components/CoursesView';
import AssignmentsView from './components/AssignmentsView';
import QuizView from './components/QuizView';
import DigitalLibraryView from './components/DigitalLibraryView';
import CommunicationView from './components/CommunicationView';
import AiAssistantView from './components/AiAssistantView';
import UmlDocsView from './components/UmlDocsView';
import AdminPanel from './components/AdminPanel';
import SettingsView from './components/SettingsView';
import TeacherView from './components/TeacherView';
import RegisterView from './components/RegisterView';
import UnikalHeader from './components/UnikalHeader';
import UnikalFooter from './components/UnikalFooter';
import UnikalHero from './components/UnikalHero';
import { 
  PourquoiUnikal, 
  NosFacultes, 
  MotDuRecteur, 
  ActualitesRecentes, 
  PartnerSlider, 
  AdmissionsCountdown 
} from './components/UnikalSections';
import FacultyDetailView from './components/FacultyDetailView';
import CliniquesUniversitairesView from './components/CliniquesUniversitairesView';
import AboutContactViews from './components/AboutContactViews';
import AdmissionsView from './components/AdmissionsView';
import NewsViews from './components/NewsViews';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';

import { 
  User, 
  UserRole, 
  Course, 
  Announcement, 
  Assignment, 
  Quiz, 
  LibraryItem, 
  ForumTopic, 
  ForumPost, 
  ChatMessage 
} from './types';

import { 
  INITIAL_USERS, 
  INITIAL_COURSES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_QUIZZES, 
  INITIAL_LIBRARY, 
  INITIAL_FORUM_TOPICS, 
  INITIAL_FORUM_POSTS, 
  INITIAL_MESSAGES 
} from './mockData';

import { 
  auth, 
  signInWithPopup, 
  signOut, 
  googleProvider, 
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  deleteDoc,
  updateDoc
} from './lib/firebase';

import { 
  seedInitialDataIfEmpty, 
  getOrCreateUserProfile, 
  updateUserProfileInFirestore,
  subscribeUsers, 
  subscribeAnnouncements, 
  addAnnouncementInFirestore, 
  updateAnnouncementInFirestore,
  deleteAnnouncementInFirestore,
  subscribeCourses, 
  addCourseInFirestore, 
  subscribeAssignments, 
  saveAssignmentInFirestore, 
  subscribeQuizzes, 
  saveQuizInFirestore, 
  subscribeLibrary, 
  saveLibraryItemInFirestore, 
  subscribeForumTopics, 
  saveForumTopicInFirestore, 
  subscribeForumPosts, 
  saveForumPostInFirestore, 
  subscribeChatMessages, 
  sendChatMessageInFirestore 
} from './lib/firebaseSync';

export default function App() {
  // Global LMS states loaded from seeded mock parameters
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // default: Pascal Kabobe (student)
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(INITIAL_LIBRARY);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(INITIAL_FORUM_TOPICS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const [readAnnouncements, setReadAnnouncements] = useState<string[]>(() => {
    const saved = localStorage.getItem('read_announcements');
    return saved ? JSON.parse(saved) : [];
  });

  const handleMarkAsRead = (id: string) => {
    setReadAnnouncements(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem('read_announcements', JSON.stringify(updated));
      return updated;
    });
  };

  const handleMarkAllAsRead = () => {
    const visibleIds = announcements.filter(ann => {
      if (currentUser.role === 'admin' || ann.authorId === currentUser.id) return true;
      if (ann.isActive === false) return false;
      if (ann.targetAudience === 'tous') return true;
      if (ann.targetAudience === 'étudiants' && currentUser.role === 'student') return true;
      if (currentUser.role === 'student') {
        if (currentUser.faculty && ann.targetAudience === currentUser.faculty) return true;
        if (currentUser.department && ann.targetAudience === currentUser.department) return true;
      }
      return currentUser.role === 'teacher' || currentUser.role === 'parent';
    }).map(ann => ann.id);

    setReadAnnouncements(prev => {
      const merged = Array.from(new Set([...prev, ...visibleIds]));
      localStorage.setItem('read_announcements', JSON.stringify(merged));
      return merged;
    });
  };

  const visibleAnnouncements = announcements.filter(ann => {
    if (currentUser.role === 'admin' || ann.authorId === currentUser.id) return true;
    if (ann.isActive === false) return false;
    if (ann.targetAudience === 'tous') return true;
    if (ann.targetAudience === 'étudiants' && currentUser.role === 'student') return true;
    if (currentUser.role === 'student') {
      if (currentUser.faculty && ann.targetAudience === currentUser.faculty) return true;
      if (currentUser.department && ann.targetAudience === currentUser.department) return true;
    }
    return currentUser.role === 'teacher' || currentUser.role === 'parent';
  });
  const unreadAnnouncementsCount = visibleAnnouncements.filter(ann => !readAnnouncements.includes(ann.id)).length;

  // Firebase Authentication State
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Firebase Auth & Firestore Synchronization Effect
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const clearSubscriptions = () => {
      unsubs.forEach(unsub => {
        try { unsub(); } catch (e) { console.error("Error clearing subscription:", e); }
      });
      unsubs = [];
    };

    // Setup Auth listener
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      clearSubscriptions();

      if (user) {
        setFirebaseUser(user);
        
        try {
          // 1. Seed the default courses, library, quiz, forum data into Firestore if empty
          await seedInitialDataIfEmpty();

          // 2. Set up real-time active subscriptions to Firestore collections
          unsubs.push(subscribeUsers(setUsersList));
          unsubs.push(subscribeAnnouncements(setAnnouncements));
          unsubs.push(subscribeCourses(setCourses));
          unsubs.push(subscribeAssignments(setAssignments));
          unsubs.push(subscribeQuizzes(setQuizzes));
          unsubs.push(subscribeLibrary(setLibraryItems));
          unsubs.push(subscribeForumTopics(setForumTopics));
          unsubs.push(subscribeForumPosts(setForumPosts));
          unsubs.push(subscribeChatMessages(setChatMessages));

          // 3. Create/retrieve user profile in Firestore
          const profile = await getOrCreateUserProfile(user.uid, {
            name: user.displayName || 'Utilisateur Google',
            email: user.email || '',
            role: 'student',
            faculty: 'Sciences Appliquées & Polytechnique',
            department: 'Génie Informatique'
          });
          setCurrentUser(profile);
        } catch (err) {
          console.error("Error initializing Firebase data subscriptions:", err);
        }
      } else {
        setFirebaseUser(null);
        setCurrentUser(INITIAL_USERS[0]);
        // Reset state to mock data for offline/unauthenticated experience
        setUsersList(INITIAL_USERS);
        setAnnouncements(INITIAL_ANNOUNCEMENTS);
        setCourses(INITIAL_COURSES);
        setAssignments(INITIAL_ASSIGNMENTS);
        setQuizzes(INITIAL_QUIZZES);
        setLibraryItems(INITIAL_LIBRARY);
        setForumTopics(INITIAL_FORUM_TOPICS);
        setForumPosts(INITIAL_FORUM_POSTS);
        setChatMessages(INITIAL_MESSAGES);
      }
    });

    // Unsubscribe from all active listeners on cleanup
    return () => {
      clearSubscriptions();
      unsubAuth();
    };
  }, []);

  // System parameters
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showEmailAuthModal, setShowEmailAuthModal] = useState<boolean>(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState<boolean>(false);
  const [commSubTab, setCommSubTab] = useState<'forum' | 'chat'>('forum');
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  // UNIKAL Public Website states
  const [isLmsPortalOpen, setIsLmsPortalOpen] = useState<boolean>(false);
  const [publicView, setPublicView] = useState<string>('home');

  // Settings Configuration states
  const [speechRate, setSpeechRate] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('edu-speechRate');
        return v ? parseFloat(v) : 1.0;
      }
    } catch { return 1.0; }
    return 1.0;
  });
  const [speechPitch, setSpeechPitch] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('edu-speechPitch');
        return v ? parseFloat(v) : 1.0;
      }
    } catch { return 1.0; }
    return 1.0;
  });
  const [appLanguage, setAppLanguage] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('edu-appLanguage');
        return v || 'fr';
      }
    } catch { return 'fr'; }
    return 'fr';
  });
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('edu-lowBandwidthMode');
        return v === 'true';
      }
    } catch { return false; }
    return false;
  });
  const [autoDownloadOffline, setAutoDownloadOffline] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('edu-autoDownloadOffline');
        return v === 'true';
      }
    } catch { return false; }
    return false;
  });

  // Watch and persist new properties to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('edu-speechRate', String(speechRate));
        window.localStorage.setItem('edu-speechPitch', String(speechPitch));
        window.localStorage.setItem('edu-appLanguage', appLanguage);
        window.localStorage.setItem('edu-lowBandwidthMode', String(lowBandwidthMode));
        window.localStorage.setItem('edu-autoDownloadOffline', String(autoDownloadOffline));
      }
    } catch (e) {
      console.warn("Could not save settings to localStorage:", e);
    }
  }, [speechRate, speechPitch, appLanguage, lowBandwidthMode, autoDownloadOffline]);

  // Dark Mode state with persistence in localStorage with safe try-catch fallback for sandboxed iframes
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('edu-darkMode');
        return saved === 'true';
      }
    } catch (e) {
      console.warn("localStorage is not available in this context:", e);
    }
    return false;
  });

  // Apply dark mode on mount or change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('edu-darkMode', String(darkMode));
      }
    } catch (e) {
      console.warn("Could not save to localStorage in this context:", e);
    }
  }, [darkMode]);

  // Toast notifications state to replace browser alerts and avoid sandboxing blocked warnings
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'info' | 'error' | 'success' | 'warning' }[]>([]);

  const showToast = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = showToast;
      // Intercept window.alert inside the sandboxed iframe automatically
      window.alert = (message: string) => {
        showToast(message, 'info');
      };
    }
  }, []);

  // Web Speech Synthesis state for reading active viewport layout content aloud
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const speechUtteranceRef = useRef<any>(null);

  const getAppSpeechSynthesis = (): SpeechSynthesis | null => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return window.speechSynthesis;
      }
    } catch (e) {
      console.warn("speechSynthesis is disabled or restricted in this browser context:", e);
    }
    return null;
  };

  const handleReadAloud = () => {
    const synth = getAppSpeechSynthesis();
    if (!synth) {
      alert("La synthèse vocale n'est pas prise en charge ou est restreinte par votre navigateur dans cet environnement.");
      return;
    }

    if (isReadingAloud) {
      try {
        synth.cancel();
      } catch (e) {
        console.warn(e);
      }
      setIsReadingAloud(false);
      return;
    }

    // Capture readable text content inside the lms-viewport
    const viewport = document.getElementById('lms-viewport');
    if (!viewport) {
      alert("Impossible de trouver le conteneur de contenu.");
      return;
    }

    const textParts: string[] = [];
    
    // Add tab context introduction
    const tabNames: Record<string, string> = {
      dashboard: "Tableau de bord de l'application",
      courses: "Supports de cours",
      assignments: "Espace devoirs et exercices",
      quizzes: "Évaluations et questionnaires écrits",
      library: "Bibliothèque de documents numériques scolaires",
      communication: "Espace d'échange et discussion",
      'ai-assistant': "Assistant virtuel intelligent Tanganyika",
      'uml-docs': "Spécifications de l'architecture logicielle",
      admin: "Panneau de configuration administrative"
    };
    
    textParts.push(`Lecture audio. Section active : ${tabNames[activeTab] || activeTab}.`);

    const walkNode = (node: Node) => {
      if (!node) return;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();
        
        // Skip interactive and formatting-noise nodes
        if (['button', 'input', 'select', 'textarea', 'script', 'style', 'svg', 'noscript', 'img', 'iframe'].includes(tagName)) {
           return;
        }

        // Skip hidden layers
        if (el.getAttribute('aria-hidden') === 'true' || el.classList.contains('hidden')) {
          return;
        }
        
        // Skip accessibility widgets
        if (el.id === 'network-status-indicator' || el.id === 'top-quick-chat-btn' || el.id === 'lms-read-aloud-toolbar' || el.id === 'top-read-aloud-btn') {
          return;
        }

        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'span', 'td', 'blockquote'].includes(tagName)) {
          const text = (el.textContent || '').trim();
          if (text && text.length > 3 && !textParts.includes(text)) {
            if (!text.includes('constructor') && !text.includes('function') && !text.includes('=>') && !text.includes('{') && !text.includes('}')) {
              textParts.push(text);
            }
          }
          if (['p', 'li', 'h1', 'h2', 'h3', 'h4'].includes(tagName)) {
            return; 
          }
        }
      }

      for (let i = 0; i < node.childNodes.length; i++) {
        walkNode(node.childNodes[i]);
      }
    };

    walkNode(viewport);

    const fullTextToRead = textParts
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .join(". ");

    if (!fullTextToRead || fullTextToRead.length < 5) {
      alert("Aucun texte lisible n'a été trouvé dans cette vue.");
      return;
    }

    try {
      synth.cancel();
    } catch (e) {}

    try {
      // Chunk text into sentences to avoid timeout limits in webkit engines
      const sentences = fullTextToRead.match(/[^.!?]+[.!?]+/g) || [fullTextToRead];
      let sentenceIndex = 0;

      const speakNextSentence = () => {
        if (sentenceIndex >= sentences.length) {
          setIsReadingAloud(false);
          return;
        }

        const sentenceText = sentences[sentenceIndex].trim();
        if (!sentenceText) {
          sentenceIndex++;
          speakNextSentence();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sentenceText);
        utterance.lang = appLanguage === 'sw' ? 'sw-TZ' : 'fr-FR';
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;
        
        try {
          const voices = synth.getVoices();
          const targetVoice = voices.find(v => 
            appLanguage === 'sw'
              ? (v.lang.startsWith('sw') || v.lang.startsWith('SW'))
              : (v.lang.startsWith('fr') || v.lang.startsWith('FR'))
          );
          if (targetVoice) {
            utterance.voice = targetVoice;
          }
        } catch (e) {
          console.warn("SpeechSynthesisVoices list failed:", e);
        }

        utterance.onend = () => {
          sentenceIndex++;
          speakNextSentence();
        };

        utterance.onerror = (e) => {
          console.warn("SpeechSynthesisUtterance boundary:", e);
          setIsReadingAloud(false);
        };

        speechUtteranceRef.current = utterance;
        synth.speak(utterance);
      };

      setIsReadingAloud(true);
      speakNextSentence();

    } catch (err) {
      console.error("Reader failed:", err);
      setIsReadingAloud(false);
    }
  };

  // Clean speaking on activeTab updates
  useEffect(() => {
    const synth = getAppSpeechSynthesis();
    if (synth) {
      try {
        synth.cancel();
      } catch (e) {}
    }
    setIsReadingAloud(false);
  }, [activeTab]);

  // Video calling states (WebRTC)
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamMuted, setIsCamMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteVolume, setRemoteVolume] = useState<number>(80);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  const [isRemoteVideoFullscreen, setIsRemoteVideoFullscreen] = useState(false);
  const [remoteVideoFit, setRemoteVideoFit] = useState<'fit' | 'fill'>('fit');
  const [isRemoteVideoBlurred, setIsRemoteVideoBlurred] = useState(false);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [activeReactions, setActiveReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);
  const [connectionPing, setConnectionPing] = useState(35);
  const [callSubject, setCallSubject] = useState<{ name: string; subtitle: string; logoLetter: string } | null>(null);

  // Periodic latency simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionPing(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2ms to +2ms
        const next = prev + delta;
        return Math.max(28, Math.min(55, next)); // Keep ping in a healthy range 28-55ms
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerReaction = (emoji: string) => {
    const newReaction = {
      id: 'reaction-' + Date.now() + '-' + Math.random(),
      emoji,
      left: 10 + Math.random() * 80 // random percentage position on stream
    };
    setActiveReactions(prev => [...prev, newReaction]);
    // Auto remove after animation completes
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  // Exit fullscreen on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRemoteVideoFullscreen) {
        setIsRemoteVideoFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRemoteVideoFullscreen]);

  // Floating Chat Button Draggable State
  const [chatPosition, setChatPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDraggingChat, setIsDraggingChat] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; btnX: number; btnY: number } | null>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (!isDraggingChat) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!dragStartRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const dx = clientX - dragStartRef.current.clientX;
      const dy = clientY - dragStartRef.current.clientY;

      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        hasMovedRef.current = true;
      }

      let newX = dragStartRef.current.btnX + dx;
      let newY = dragStartRef.current.btnY + dy;

      // Keep within viewport boundaries
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const btnWidth = 160; // approximate width of the button
      const btnHeight = 60; // approximate height

      newX = Math.max(10, Math.min(viewportWidth - btnWidth - 10, newX));
      newY = Math.max(10, Math.min(viewportHeight - btnHeight - 10, newY));

      setChatPosition({ x: newX, y: newY });
    };

    const handleGlobalEnd = () => {
      setIsDraggingChat(false);
    };

    window.addEventListener('mousemove', handleGlobalMove, { passive: false });
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDraggingChat]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);

  // Stop video stream on unmount or hangup
  useEffect(() => {
    return () => {
      if (localStream) {
        try {
          localStream.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [localStream]);

  // Keep track of call duration
  useEffect(() => {
    if (callState === 'connected') {
      setCallDuration(0);
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState]);

  // Mount local stream object to video tag whenever localStream or callState updates
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callState]);

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async (subjectName: string, subjectSubtitle: string, letter: string) => {
    if (offlineMode) {
      alert("La vidéoconférence requiert une connexion internet active. Veuillez d'abord désactiver le Mode Hors-ligne.");
      return;
    }
    setCallSubject({ name: subjectName, subtitle: subjectSubtitle, logoLetter: letter });
    setCallState('calling');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setTimeout(() => {
        setCallState('connected');
      }, 2500);
    } catch (err) {
      console.warn("Camera or microphone permission failed/not available. Using fallback mock stream.", err);
      // Fallback
      setTimeout(() => {
        setCallState('connected');
      }, 2500);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      try {
        localStream.getTracks().forEach(track => track.stop());
      } catch (e) {}
      setLocalStream(null);
    }
    setCallState('ended');
    setIsScreenSharing(false);
    setTimeout(() => {
      setCallState('idle');
      setCallSubject(null);
    }, 2000);
  };

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMicMuted(!isMicMuted);
  };

  const handleToggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsCamMuted(!isCamMuted);
  };

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      if (localStream) {
        try {
          localStream.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.warn("Could not restore camera after screen share", err);
        setLocalStream(null);
      }
    } else {
      try {
        const nav = navigator as any;
        const mediaDevicesObj = nav.mediaDevices || {};
        const getDisplayMedia = mediaDevicesObj.getDisplayMedia || (nav.getDisplayMedia ? nav.getDisplayMedia.bind(nav) : null);
        
        if (getDisplayMedia) {
          const stream = await getDisplayMedia({ video: true });
          setLocalStream(stream);
          setIsScreenSharing(true);
          if (stream.getVideoTracks()[0]) {
            stream.getVideoTracks()[0].onended = () => {
              setIsScreenSharing(false);
            };
          }
        } else {
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.warn("Screen share cancel/fail", err);
      }
    }
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'communication') {
      setCommSubTab('forum'); // standard navigation goes to forum
    }
  };

  // Real-time connectivity and dynamic sync simulation states
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>("à l'instant");

  // Automatically trigger a short synchronization spinner whenever network comes back or tab changes
  useEffect(() => {
    if (!offlineMode) {
      setSyncStatus('syncing');
      const timer = setTimeout(() => {
        setSyncStatus('synced');
        setLastSyncTime("à l'instant");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [offlineMode, activeTab]);

  useEffect(() => {
    if (offlineMode) return;
    const interval = setInterval(() => {
      setLastSyncTime(prev => {
        if (prev === "à l'instant") return "il y a 1 min";
        if (prev === "il y a 1 min") return "il y a 2 min";
        if (prev === "il y a 2 min") return "il y a 3 min";
        return "il y a quelques minutes";
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [offlineMode]);

  const triggerSync = () => {
    if (offlineMode) return;
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime("à l'instant");
    }, 1200);
  };

  // Cache download tracers for low network weak signal simulation
  const [downloadedMaterialIds, setDownloadedMaterialIds] = useState<Record<string, boolean>>({
    'mat-1-1': true // seed with one pre-downloaded item
  });
  const [downloadedLibraryItemIds, setDownloadedLibraryItemIds] = useState<Record<string, boolean>>({
    'lib-1': true
  });

  // Switcher between demo roles (student, teacher, parent, admin)
  const handleChangeRole = async (role: UserRole) => {
    if (firebaseUser) {
      try {
        const defaultRoleTemplate = INITIAL_USERS.find(u => u.role === role);
        const updates: Partial<User> = {
          role,
          faculty: defaultRoleTemplate?.faculty || '',
          department: defaultRoleTemplate?.department || '',
        };
        await updateUserProfileInFirestore(firebaseUser.uid, updates);
        setActiveTab('dashboard');
      } catch (err) {
        console.error("Error changing role in Firestore:", err);
      }
    } else {
      const selected = usersList.find(u => u.role === role);
      if (selected) {
        setCurrentUser(selected);
        setActiveTab('dashboard'); // reset to landing
      }
    }
  };

  // Add course announcement
  const handleAddAnnouncement = async (titleOrAnn: string | Announcement, content?: string) => {
    let fresh: Announcement;
    if (typeof titleOrAnn === 'object') {
      fresh = titleOrAnn;
    } else {
      fresh = {
        id: "ann-" + Date.now(),
        title: titleOrAnn,
        content: content || '',
        createdAt: new Date().toISOString(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        targetAudience: 'tous',
        category: 'Académique',
        isPinned: false,
        isActive: true,
        scope: 'all'
      };
    }
    try {
      await addAnnouncementInFirestore(fresh);
    } catch (err) {
      console.error("Error adding announcement in Firestore:", err);
      setAnnouncements(prev => [fresh, ...prev]);
    }
  };

  const handleUpdateAnnouncement = async (ann: Announcement) => {
    try {
      await updateAnnouncementInFirestore(ann);
    } catch (err) {
      console.error("Error updating announcement in Firestore:", err);
      setAnnouncements(prev => prev.map(item => item.id === ann.id ? ann : item));
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncementInFirestore(id);
    } catch (err) {
      console.error("Error deleting announcement in Firestore:", err);
      setAnnouncements(prev => prev.filter(item => item.id !== id));
    }
  };

  // Add a course
  const handleAddCourse = async (newCourse: Course) => {
    try {
      await addCourseInFirestore(newCourse);
    } catch (err) {
      console.error("Error adding course in Firestore:", err);
      setCourses(prev => [newCourse, ...prev]);
    }
  };

  // Keep track of course materials downloaded on the device local memory
  const handleMaterialDownload = (courseId: string, idxModule: string, materialId: string) => {
    setDownloadedMaterialIds(prev => ({
      ...prev,
      [materialId]: true
    }));
  };

  // Keep track of library PDF items stored locally on user's device
  const handleDownloadLibraryItem = (id: string) => {
    setDownloadedLibraryItemIds(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Submit student homework text copy
  const handleSubmitAssignment = async (assignmentId: string, text: string) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (target) {
      const updated: Assignment = {
        ...target,
        submitted: true,
        submissionText: text,
        submissionDate: new Date().toISOString()
      };
      try {
        await saveAssignmentInFirestore(updated);
      } catch (err) {
        console.error("Error submitting assignment:", err);
        setAssignments(prev => prev.map(a => a.id === assignmentId ? updated : a));
      }
    }
  };

  // Grade student submitted assignments
  const handleGradeAssignment = async (assignmentId: string, score: number, feedback: string) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (target) {
      const updated: Assignment = {
        ...target,
        grade: score,
        gradeFeedback: feedback
      };
      try {
        await saveAssignmentInFirestore(updated);
      } catch (err) {
        console.error("Error grading assignment:", err);
        setAssignments(prev => prev.map(a => a.id === assignmentId ? updated : a));
      }
    }
  };

  // Create or Update custom assignment (used by TeacherView)
  const handleAddAssignment = async (newAssign: Assignment) => {
    try {
      await saveAssignmentInFirestore(newAssign);
    } catch (err) {
      console.error("Error saving assignment in Firestore:", err);
      setAssignments(prev => {
        const exists = prev.some(a => a.id === newAssign.id);
        if (exists) {
          return prev.map(a => a.id === newAssign.id ? newAssign : a);
        } else {
          return [newAssign, ...prev];
        }
      });
    }
  };

  // Publish a new MCQ quiz generated by AI
  const handlePublishQuiz = async (newQuiz: Quiz) => {
    try {
      await saveQuizInFirestore(newQuiz);
    } catch (err) {
      console.error("Error publishing quiz:", err);
      setQuizzes(prev => [newQuiz, ...prev]);
    }
  };

  // Submits quiz results and updates the scorecards instantly
  const handleSubmitQuizScore = async (quizId: string, score: number) => {
    const target = quizzes.find(q => q.id === quizId);
    if (target) {
      const updated: Quiz = {
        ...target,
        submitted: true,
        score
      };
      try {
        await saveQuizInFirestore(updated);
      } catch (err) {
        console.error("Error submitting quiz score:", err);
        setQuizzes(prev => prev.map(q => q.id === quizId ? updated : q));
      }
    }
  };

  // Add forum discussion thread
  const handleAddForumTopic = async (title: string, desc: string, cat: 'cours' | 'partage' | 'admin' | 'autre') => {
    const threadId = "topic-" + Date.now();
    const freshTopic: ForumTopic = {
      id: threadId,
      title,
      description: desc,
      category: cat,
      createdAt: new Date().toISOString(),
      authorName: currentUser.name,
      repliesCount: 0,
      viewsCount: 0
    };

    const freshPost: ForumPost = {
      id: "post-" + Date.now(),
      topicId: threadId,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: desc,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    try {
      await saveForumTopicInFirestore(freshTopic);
      await saveForumPostInFirestore(freshPost);
    } catch (err) {
      console.error("Error adding forum topic:", err);
      setForumTopics(prev => [freshTopic, ...prev]);
      setForumPosts(prev => [freshPost, ...prev]);
    }
  };

  // Add response comments inside forum discussion
  const handleAddForumReply = async (topicId: string, content: string) => {
    const targetPost = forumPosts.find(post => post.topicId === topicId);
    if (targetPost) {
      const updatedPost: ForumPost = {
        ...targetPost,
        replies: [
          ...(targetPost.replies || []),
          {
            id: "rep-" + Date.now(),
            authorName: currentUser.name,
            authorRole: currentUser.role,
            content,
            createdAt: new Date().toISOString()
          }
        ]
      };
      try {
        await saveForumPostInFirestore(updatedPost);
      } catch (err) {
        console.error("Error saving forum post reply:", err);
      }
    }

    const targetTopic = forumTopics.find(t => t.id === topicId);
    if (targetTopic) {
      const updatedTopic: ForumTopic = {
        ...targetTopic,
        repliesCount: targetTopic.repliesCount + 1
      };
      try {
        await saveForumTopicInFirestore(updatedTopic);
      } catch (err) {
        console.error("Error updating topic replies count:", err);
      }
    }
  };

  // Sending private chat message
  const handleSendChatMessage = async (receiverId: string, content: string) => {
    const freshChat: ChatMessage = {
      id: "chat-" + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };
    try {
      await sendChatMessageInFirestore(freshChat);
    } catch (err) {
      console.error("Error sending private message:", err);
      setChatMessages(prev => [...prev, freshChat]);
    }
  };

  // Admin section creators/deleters
  const handleAddUser = async (joined: User) => {
    try {
      await setDoc(doc(db, 'users', joined.id), joined);
    } catch (err) {
      console.error("Error adding user:", err);
      setUsersList(prev => [...prev, joined]);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setUsersList(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', id), updates);
    } catch (err) {
      console.error("Error updating user:", err);
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    }
  };

  const handleResetDatabase = async () => {
    // Re-seed all data to default initial values
    try {
      console.log("Resetting database by seeding defaults...");
      for (const course of INITIAL_COURSES) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }
      for (const assign of INITIAL_ASSIGNMENTS) {
        await setDoc(doc(db, 'assignments', assign.id), assign);
      }
      for (const quiz of INITIAL_QUIZZES) {
        await setDoc(doc(db, 'quizzes', quiz.id), quiz);
      }
      for (const lib of INITIAL_LIBRARY) {
        await setDoc(doc(db, 'library', lib.id), lib);
      }
      for (const topic of INITIAL_FORUM_TOPICS) {
        await setDoc(doc(db, 'forum_topics', topic.id), topic);
      }
      for (const post of INITIAL_FORUM_POSTS) {
        await setDoc(doc(db, 'forum_posts', post.id), post);
      }
      for (const msg of INITIAL_MESSAGES) {
        await setDoc(doc(db, 'messages', msg.id), msg);
      }
    } catch (err) {
      console.error("Error resetting Firestore collections:", err);
    }

    setCourses(INITIAL_COURSES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setQuizzes(INITIAL_QUIZZES);
    setLibraryItems(INITIAL_LIBRARY);
    setForumTopics(INITIAL_FORUM_TOPICS);
    setForumPosts(INITIAL_FORUM_POSTS);
    setChatMessages(INITIAL_MESSAGES);
    setUsersList(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setDownloadedMaterialIds({ 'mat-1-1': true });
    setDownloadedLibraryItemIds({ 'lib-1': true });
    setOfflineMode(false);
    setActiveTab('dashboard');
  };

  // Google Auth helpers
  const handleGoogleSignIn = async () => {
    if (isGoogleSigningIn) return;
    setIsGoogleSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err?.code === 'auth/cancelled-popup-request' || err?.code === 'auth/popup-closed-by-user') {
        console.log("Sign-in popup closed or cancelled by user.");
      } else {
        console.error("Google sign-in error:", err);
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Google sign-out error:", err);
    }
  };

  if (!isLmsPortalOpen) {
    return (
      <div id="unikal-public-website" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
        <UnikalHeader 
          onNavigate={(view) => {
            setPublicView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          currentView={publicView} 
          onOpenLms={() => {
            setIsLmsPortalOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
        
        {/* Public Website View router viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
          {publicView === 'home' && (
            <div className="space-y-16">
              <UnikalHero onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <PourquoiUnikal />
              <NosFacultes onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <MotDuRecteur onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <ActualitesRecentes onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <PartnerSlider />
              <AdmissionsCountdown onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            </div>
          )}

          {publicView.startsWith('faculty-') && (
            <FacultyDetailView 
              facultyId={publicView.substring(8)} 
              onBack={() => setPublicView('home')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {publicView === 'cliniques-universitaires' && (
            <CliniquesUniversitairesView 
              onBack={() => setPublicView('home')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {publicView.startsWith('about-') && (
            <AboutContactViews 
              viewType={publicView.substring(6) as any} 
              onBack={() => setPublicView('home')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {publicView === 'contact' && (
            <AboutContactViews 
              viewType="contact" 
              onBack={() => setPublicView('home')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {publicView.startsWith('admissions-') && (
            <AdmissionsView 
              viewType={publicView.substring(11) as any} 
              onBack={() => setPublicView('home')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {publicView === 'news-archive' && (
            <NewsViews 
              viewType="archive" 
              onBack={() => setPublicView('home')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {publicView.startsWith('news-detail-') && (
            <NewsViews 
              viewType="detail" 
              selectedNewsId={publicView.substring(12)} 
              onBack={() => setPublicView('news-archive')} 
              onNavigate={(view) => {
                setPublicView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>

        <UnikalFooter onNavigate={(view) => {
          setPublicView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />

        {/* Floating WhatsApp chat assistant */}
        <FloatingWhatsAppButton />
      </div>
    );
  }

  return (
    <div id="edutanganyika-root-container" className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      
      {/* Global Sidebar layout */}
      <Sidebar 
        currentUser={currentUser}
        usersList={usersList}
        onChangeRole={handleChangeRole}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        offlineMode={offlineMode}
        setOfflineMode={setOfflineMode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        firebaseUser={firebaseUser}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onEmailSignIn={() => setShowEmailAuthModal(true)}
        isGoogleSigningIn={isGoogleSigningIn}
        onReturnToWebsite={() => setIsLmsPortalOpen(false)}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
      />

      {/* Main interactive window viewport */}
      <main id="lms-viewport" className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen space-y-6">
        
        {/* Top Header Bar with real-time Network Status and System Info */}
        <div id="top-lms-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && "Tableau de Bord"}
              {activeTab === 'courses' && "Mes Cours & Supports"}
              {activeTab === 'assignments' && "Mes Devoirs"}
              {activeTab === 'quizzes' && "Évaluations & Quiz"}
              {activeTab === 'library' && "Bibliothèque Numérique"}
              {activeTab === 'communication' && "Espace Communication"}
              {activeTab === 'ai-assistant' && "Assistant IA Tanganyika"}
              {activeTab === 'uml-docs' && "Architecture & UML"}
              {activeTab === 'admin' && "Panneau d'Administration"}
              {activeTab === 'settings' && "Paramètres du Système"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Connecté en tant que <span className="font-semibold text-slate-700">{currentUser.name}</span> ({currentUser.role === 'student' ? 'Étudiant' : currentUser.role === 'teacher' ? 'Enseignant' : currentUser.role === 'parent' ? 'Parent' : 'Administrateur'})
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            {/* Accessibility Reader Button ("Lire le contenu") */}
            <button
              id="top-read-aloud-btn"
              onClick={handleReadAloud}
              className={`p-2.5 rounded-xl border shadow-sm transition-all flex items-center gap-2 min-h-[44px] px-3.5 hover:scale-105 font-semibold text-xs md:text-sm ${
                isReadingAloud 
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 animate-pulse' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border-slate-200'
              }`}
              title={isReadingAloud ? "Arrêter la synthèse vocale" : "Lire le contenu textuel de la page à haute voix (Accessibilité)"}
            >
              {isReadingAloud ? (
                <>
                  <VolumeX className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="hidden sm:inline">Arrêter la lecture</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="hidden sm:inline">Lire le contenu</span>
                </>
              )}
            </button>

            {/* Quick Access Chat Button */}
            <button
              id="top-quick-chat-btn"
              onClick={() => {
                setActiveTab('communication');
                setCommSubTab('chat');
              }}
              className="relative p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center justify-center min-h-[44px] min-w-[44px] hover:scale-105"
              title="Ouvrir la messagerie privée (Chat)"
            >
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white animate-pulse">
                2
              </span>
            </button>

            {/* Existing Network status indicator */}
            <div id="network-status-indicator" className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs shrink-0">
            {offlineMode ? (
              <div className="flex items-center gap-2">
                <div className="flex h-2.5 w-2.5 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1 leading-none">
                    <WifiOff className="w-3.5 h-3.5" /> MODE HORS-LIGNE
                  </span>
                  <span className="text-[9px] text-slate-500 leading-tight">Tanganyika instable / Stockage local actif</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-2.5 w-2.5 relative shrink-0">
                  {syncStatus === 'syncing' ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 leading-none">
                    {syncStatus === 'syncing' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                        <span className="text-blue-600 font-bold uppercase tracking-wider">Synchronisation...</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">Réseau Connecté</span>
                      </>
                    )}
                  </span>
                  <span className="text-[9px] text-slate-500 leading-tight">
                    {syncStatus === 'syncing' 
                      ? "Synchronisation des cours et devoirs..." 
                      : `Synchro: ${lastSyncTime}`}
                  </span>
                </div>
                {syncStatus !== 'syncing' && (
                  <button 
                    onClick={triggerSync}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                    title="Forcer la synchronisation avec le serveur"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
        
        {activeTab === 'dashboard' && (
          <DashboardView 
            currentUser={currentUser}
            courses={courses}
            announcements={announcements}
            assignments={assignments}
            quizzes={quizzes}
            onAddAnnouncement={handleAddAnnouncement}
            offlineMode={offlineMode}
          />
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsView 
            currentUser={currentUser}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            readAnnouncements={readAnnouncements}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView 
            currentUser={currentUser}
            courses={courses}
            onAddCourse={handleAddCourse}
            onMaterialDownload={handleMaterialDownload}
            downloadedMaterialIds={downloadedMaterialIds}
            offlineMode={offlineMode}
            onStartVideoCall={handleStartCall}
          />
        )}

        {activeTab === 'assignments' && (
          <AssignmentsView 
            currentUser={currentUser}
            assignments={assignments}
            onSubmitAssignment={handleSubmitAssignment}
            onGradeAssignment={handleGradeAssignment}
            offlineMode={offlineMode}
          />
        )}

        {activeTab === 'quizzes' && (
          <QuizView 
            currentUser={currentUser}
            quizzes={quizzes}
            onSubmitQuizScore={handleSubmitQuizScore}
            onPublishQuiz={handlePublishQuiz}
            offlineMode={offlineMode}
          />
        )}

        {activeTab === 'library' && (
          <DigitalLibraryView 
            currentUser={currentUser}
            libraryItems={libraryItems}
            onAddLibraryItem={handleAddCourse as any} // map to simple addition
            downloadedLibraryItemIds={downloadedLibraryItemIds}
            onDownloadLibraryItem={handleDownloadLibraryItem}
            offlineMode={offlineMode}
          />
        )}

        {activeTab === 'communication' && (
          <CommunicationView
            currentUser={currentUser}
            usersList={usersList}
            forumTopics={forumTopics}
            forumPosts={forumPosts}
            chatMessages={chatMessages}
            onAddForumTopic={handleAddForumTopic}
            onAddForumReply={handleAddForumReply}
            onSendChatMessage={handleSendChatMessage}
            offlineMode={offlineMode}
            defaultSubTab={commSubTab}
            onStartVideoCall={handleStartCall}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AiAssistantView 
            currentUser={currentUser}
            offlineMode={offlineMode}
          />
        )}

        {activeTab === 'uml-docs' && (
          <UmlDocsView />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            currentUser={currentUser}
            usersList={usersList}
            courses={courses}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onUpdateUser={handleUpdateUser}
            onResetDatabase={handleResetDatabase}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            currentUser={currentUser}
            onUpdateCurrentUser={(updated) => {
              setCurrentUser(updated);
              setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
            }}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            speechPitch={speechPitch}
            setSpeechPitch={setSpeechPitch}
            appLanguage={appLanguage}
            setAppLanguage={setAppLanguage}
            lowBandwidthMode={lowBandwidthMode}
            setLowBandwidthMode={setLowBandwidthMode}
            autoDownloadOffline={autoDownloadOffline}
            setAutoDownloadOffline={setAutoDownloadOffline}
            offlineMode={offlineMode}
            setOfflineMode={setOfflineMode}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}

        {activeTab === 'teacher-space' && currentUser.role === 'teacher' && currentUser.status === 'pending' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto my-12 text-center space-y-6 animate-fade-in font-sans">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Compte en cours de validation académique</h2>
            <p className="text-sm text-slate-405 leading-relaxed max-w-md mx-auto">
              Bonjour <strong className="text-slate-200">{currentUser.name}</strong>. Votre inscription en tant que professeur à l'Université de Kalemie est actuellement en cours d'examen par la direction académique.
            </p>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-left space-y-2.5 max-w-md mx-auto text-xs">
              <p className="font-semibold text-slate-300">Détails de votre demande :</p>
              <div className="text-slate-400 space-y-1 font-mono">
                <p>• Matricule : {currentUser.matricule || 'En attente'}</p>
                <p>• Faculté : {currentUser.faculty}</p>
                <p>• Département : {currentUser.department}</p>
                {currentUser.specialty && <p>• Matières : {currentUser.specialty}</p>}
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Vous recevrez une de nos notifications dès que l'accès sera approuvé. Merci pour votre patience.
            </p>
          </div>
        )}

        {activeTab === 'teacher-space' && currentUser.role === 'teacher' && currentUser.status === 'rejected' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl mx-auto my-12 text-center space-y-6 animate-fade-in font-sans">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Accès Rejeté / Révoqué</h2>
            <p className="text-sm text-slate-405 leading-relaxed max-w-md mx-auto">
              Votre demande d'accès à l'espace enseignant d'UNIKAL E-Learning a été rejetée ou révoquée par l'administration académique.
            </p>
            <p className="text-xs text-slate-500">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le secrétariat académique de votre faculté.
            </p>
          </div>
        )}

        {activeTab === 'teacher-space' && currentUser.role === 'teacher' && (currentUser.status === 'approved' || !currentUser.status) && (
          <TeacherView 
            currentUser={currentUser}
            courses={courses}
            assignments={assignments}
            quizzes={quizzes}
            usersList={usersList}
            onAddCourse={handleAddCourse}
            onAddAssignment={handleAddAssignment}
            onAddQuiz={handlePublishQuiz}
            onUpdateCourse={handleAddCourse}
            offlineMode={offlineMode}
          />
        )}

      </main>

      {/* Dynamic Video Conference Modal overlay (Tanganyika Meet) */}
      {callState !== 'idle' && callSubject && (
        <div id="video-call-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div id="video-call-card" className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col h-[580px]">
            
            {/* Meet Header */}
            <header className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    Vidéoconférence Tanganyika Meet
                    <span className="text-[10px] font-mono bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest animate-pulse">
                      Direct Live
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    Session d'apprentissage connectée à l'Université de Kalemie
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  id="btn-mute-all"
                  type="button"
                  onClick={() => {
                    if (isMicMuted && remoteVolume === 0) {
                      setIsMicMuted(false);
                      setRemoteVolume(80);
                    } else {
                      setIsMicMuted(true);
                      setRemoteVolume(0);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMicMuted && remoteVolume === 0
                      ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                  title={isMicMuted && remoteVolume === 0 ? "Désactiver le Mode Silence (rétablir micro et volume)" : "Activer le Mode Silence (couper micro et volume)"}
                >
                  <VolumeX className={`w-4 h-4 shrink-0 ${isMicMuted && remoteVolume === 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                  <span>{isMicMuted && remoteVolume === 0 ? "Mode Silence : Actif" : "Mode Silence"}</span>
                </button>

                {isMicMuted && remoteVolume === 0 && (
                  <span id="silence-witness" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-[10.5px] font-bold font-mono uppercase tracking-wider animate-pulse shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                    Silence
                  </span>
                )}

                <span className="text-xs text-slate-300 font-mono bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-bold shrink-0">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  {formatDuration(callDuration)}
                </span>
              </div>
            </header>

            {/* Meet Videos grid */}
            <div id="video-grid-panels" className="flex-1 p-5 bg-slate-950 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center overflow-hidden">
              
              {/* Remote stream view */}
              <div 
                id="remote-video-frame" 
                className={`relative bg-slate-900 border-2 border-slate-800/80 rounded-2xl h-full flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                  isRemoteVideoFullscreen 
                    ? 'fixed inset-0 z-[100000] rounded-none border-none' 
                    : ''
                }`}
                style={{ objectFit: remoteVideoFit === 'fit' ? 'contain' : 'cover' }}
              >
                {callState === 'calling' ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-500 animate-bounce" />
                    </div>
                    <span className="text-xs text-slate-300 animate-pulse">Appel ou Connexion de {callSubject.name}...</span>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Initialisation du pipeline WebRTC</span>
                  </div>
                ) : callState === 'ended' ? (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-650/10 border border-red-500/20 flex items-center justify-center">
                      <PhoneOff className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="text-xs text-rose-500 font-bold">Appel / Flux en direct terminé</span>
                    <span className="text-[10px] text-slate-550 font-mono">Merci pour votre assiduité</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      {/* Audio visualizer peaks */}
                      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 items-end h-16 pointer-events-none px-6">
                        {isRemoteAudioMuted ? (
                          <>
                            <div className="w-1.5 bg-slate-800 rounded-full h-1.5 transition-all"></div>
                            <div className="w-1.5 bg-slate-800 rounded-full h-1.5 transition-all"></div>
                            <div className="w-1.5 bg-slate-800 rounded-full h-1.5 transition-all"></div>
                            <div className="w-1.5 bg-slate-800 rounded-full h-1.5 transition-all"></div>
                            <div className="w-1.5 bg-slate-800 rounded-full h-1.5 transition-all"></div>
                            <div className="w-1.5 bg-slate-800 rounded-full h-1.5 transition-all"></div>
                          </>
                        ) : (
                          <>
                            <div className="w-1 bg-blue-500 rounded-full h-8 animate-pulse"></div>
                            <div className="w-1 bg-emerald-500 rounded-full h-12 animate-pulse delay-75"></div>
                            <div className="w-1 bg-indigo-500 rounded-full h-16 animate-pulse delay-150"></div>
                            <div className="w-1 bg-purple-500 rounded-full h-10 animate-pulse delay-75"></div>
                            <div className="w-1 bg-teal-500 rounded-full h-14 animate-pulse delay-200"></div>
                            <div className="w-1 bg-indigo-500 rounded-full h-7 animate-pulse delay-100"></div>
                          </>
                        )}
                      </div>
                      
                      <div className="text-center flex flex-col items-center gap-4 text-sm font-sans">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white uppercase tracking-wider shadow-lg border-2 border-slate-700 animate-pulse">
                          {callSubject.logoLetter}
                        </div>
                        <div className="space-y-1 pb-1">
                          <span className="block font-bold text-white text-base">{callSubject.name}</span>
                          <span className="text-xs text-sky-400 font-mono bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                            {callSubject.subtitle}
                          </span>
                        </div>
                        <span className="text-[11.5px] text-slate-400 max-w-xs block leading-relaxed italic">
                          "Bienvenue dans cette session interactive en direct."
                        </span>
                      </div>
                    </div>

                    {isRemoteVideoBlurred && (
                      <div 
                        id="remote-video-blur-overlay"
                        className="absolute inset-0 pointer-events-none transition-all duration-300"
                        style={{ 
                          backdropFilter: 'blur(16px)', 
                          WebkitBackdropFilter: 'blur(16px)',
                          backgroundColor: 'rgba(15, 23, 42, 0.4)',
                          zIndex: 5
                        }}
                      />
                    )}

                    {/* Floating student reactions overlay */}
                    <div 
                      id="remote-video-reactions-container"
                      className="absolute inset-0 pointer-events-none overflow-hidden z-30"
                    >
                      {activeReactions.map(r => (
                        <div
                          key={r.id}
                          className="absolute bottom-6 text-4xl animate-emoji-float pointer-events-none"
                          style={{
                            left: `${r.left}%`,
                          }}
                        >
                          {r.emoji}
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                      <div className="bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10.5px] border border-slate-800 text-slate-350 font-semibold flex items-center gap-1.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Flux Distant Actif</span>
                      </div>
                      <div
                        id="remote-video-ping-indicator"
                        className="bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10.5px] border border-slate-800 text-slate-350 font-semibold font-mono flex items-center gap-1.5 shadow-xs transition-all duration-300"
                        title="Latence de connexion en temps réel (Ping)"
                      >
                        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{connectionPing}ms</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                      {/* Standalone independent Zoom button */}
                      <button
                        id="remote-video-zoom-btn"
                        type="button"
                        onClick={() => setRemoteVideoFit(prev => prev === 'fit' ? 'fill' : 'fit')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-xs ${
                          remoteVideoFit === 'fill'
                            ? 'bg-blue-600/25 border-blue-500/40 text-blue-400 hover:bg-blue-600/35'
                            : 'bg-slate-950/80 border-slate-800 text-slate-350 hover:bg-slate-900 hover:text-white'
                        }`}
                        title={remoteVideoFit === 'fit' ? "Changer en mode Remplissage (Fill)" : "Changer en mode Ajuster (Fit)"}
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                        <span>Zoom : {remoteVideoFit === 'fit' ? 'Ajuster' : 'Remplir'}</span>
                      </button>

                      {/* Blur Toggle Button */}
                      <button
                        id="remote-video-blur-btn"
                        type="button"
                        onClick={() => setIsRemoteVideoBlurred(prev => !prev)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-xs ${
                          isRemoteVideoBlurred
                            ? 'bg-amber-600/25 border-amber-500/40 text-amber-400 hover:bg-amber-600/35'
                            : 'bg-slate-950/80 border-slate-800 text-slate-350 hover:bg-slate-900 hover:text-white'
                        }`}
                        title={isRemoteVideoBlurred ? "Désactiver le floutage" : "Activer le floutage d'arrière-plan (Confidentialité)"}
                      >
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>Flou : {isRemoteVideoBlurred ? 'Activé' : 'Désactivé'}</span>
                      </button>

                      {/* Live Non-Verbal Feedback Reaction Button */}
                      <div className="relative">
                        <button
                          id="remote-video-react-btn"
                          type="button"
                          onClick={() => setShowReactionMenu(prev => !prev)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-xs ${
                            showReactionMenu
                              ? 'bg-purple-600/25 border-purple-500/40 text-purple-400 hover:bg-purple-600/35'
                              : 'bg-slate-950/80 border-slate-800 text-slate-350 hover:bg-slate-900 hover:text-white'
                          }`}
                          title="Envoyer une réaction non-verbale"
                        >
                          <Smile className="w-3.5 h-3.5 text-purple-400" />
                          <span>Réagir</span>
                        </button>

                        {showReactionMenu && (
                          <div
                            id="remote-video-emojis-popup"
                            className="absolute top-full right-0 mt-2 bg-slate-950/95 border border-slate-800/80 p-3 rounded-xl shadow-2xl z-50 min-w-[210px] backdrop-blur-md animate-fade-in"
                          >
                            <div className="text-[9.5px] font-extrabold text-slate-400 mb-2.5 uppercase tracking-wider text-center">
                              Réactions en Direct
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {['👍', '❤️', '👏', '🔥', '💡', '❓', '😮', '🎉', '😂', '💯', '🤔', '🙌'].map((emoji) => (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => triggerReaction(emoji)}
                                  className="w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-slate-800/80 transition-all cursor-pointer duration-100 active:scale-90"
                                  title={`Envoyer ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[9px] text-slate-500">
                              <span>Cliquez pour envoyer</span>
                              <button
                                type="button"
                                onClick={() => setShowReactionMenu(false)}
                                className="hover:text-white transition-colors cursor-pointer font-semibold uppercase"
                              >
                                Fermer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Standalone independent mute/unmute button */}
                      <button
                        id="remote-audio-toggle-btn"
                        type="button"
                        onClick={() => setIsRemoteAudioMuted(!isRemoteAudioMuted)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-xs ${
                          isRemoteAudioMuted
                            ? 'bg-red-500/15 border-red-500/35 text-red-400 hover:bg-red-500/25'
                            : 'bg-slate-950/80 border-slate-800 text-slate-350 hover:bg-slate-900 hover:text-white'
                        }`}
                        title={isRemoteAudioMuted ? "Rétablir l'audio distant" : "Couper l'audio distant (Indépendamment)"}
                      >
                        {isRemoteAudioMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            <span className="font-bold">Audio Coupé</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mute distant</span>
                          </>
                        )}
                      </button>

                      {/* Standalone Full Screen Toggle Button */}
                      <button
                        id="remote-video-fullscreen-btn"
                        type="button"
                        onClick={() => setIsRemoteVideoFullscreen(!isRemoteVideoFullscreen)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-xs ${
                          isRemoteVideoFullscreen
                            ? 'bg-blue-600/25 border-blue-500/40 text-blue-400 hover:bg-blue-600/35'
                            : 'bg-slate-950/80 border-slate-800 text-slate-350 hover:bg-slate-900 hover:text-white'
                        }`}
                        title={isRemoteVideoFullscreen ? "Quitter le plein écran (Esc)" : "Passer en plein écran"}
                      >
                        {isRemoteVideoFullscreen ? (
                          <>
                            <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Quitter plein écran</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Plein écran</span>
                          </>
                        )}
                      </button>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[10px] text-emerald-400 font-mono tracking-wider select-none">
                        Audio HD / WebRTC Stable
                      </div>
                    </div>
 
                    {/* Volume control slider for remote stream */}
                    <div id="remote-volume-control" className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-950/85 hover:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-lg transition-all">
                      <button
                        type="button"
                        onClick={() => {
                          if (isRemoteAudioMuted) {
                            setIsRemoteAudioMuted(false);
                          } else {
                            setRemoteVolume(prev => prev === 0 ? 80 : 0);
                          }
                        }}
                        className="text-slate-400 hover:text-white transition-colors focus:outline-hidden flex items-center justify-center"
                        title={isRemoteAudioMuted ? "Réactiver l'audio distant" : remoteVolume === 0 ? "Réactiver le son" : "Couper le son"}
                      >
                        {isRemoteAudioMuted || remoteVolume === 0 ? (
                          <VolumeX className="w-4.5 h-4.5 text-rose-500" />
                        ) : remoteVolume < 50 ? (
                          <Volume1 className="w-4.5 h-4.5 text-sky-400" />
                        ) : (
                          <Volume2 className="w-4.5 h-4.5 text-emerald-400" />
                        )}
                      </button>
                      <input
                        id="remote-audio-volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={isRemoteAudioMuted ? 0 : remoteVolume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRemoteVolume(val);
                          if (isRemoteAudioMuted && val > 0) {
                            setIsRemoteAudioMuted(false);
                          }
                        }}
                        className="w-18 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all focus:outline-hidden"
                        title={isRemoteAudioMuted ? "Audio distant coupé" : `Volume distant : ${remoteVolume}%`}
                      />
                      <span className="text-[10px] font-mono text-slate-400 min-w-[28px] text-right select-none">
                        {isRemoteAudioMuted ? "0" : remoteVolume}%
                      </span>
                    </div>

                    {/* Visual audio spectrum analyzer bar at the very bottom */}
                    <div 
                      id="remote-audio-spectrum-bar" 
                      className="absolute bottom-0 inset-x-0 h-4 bg-slate-950/60 border-t border-slate-800/40 flex items-end justify-between px-1 gap-[2px] overflow-hidden pointer-events-none z-10"
                    >
                      {isRemoteAudioMuted || remoteVolume === 0 ? (
                        <div className="w-full h-[2px] bg-slate-700/50 rounded-full transition-all duration-300"></div>
                      ) : (
                        Array.from({ length: 48 }).map((_, idx) => {
                          const patternNum = (idx % 4) + 1;
                          const duration = 0.5 + (idx % 5) * 0.15;
                          const delay = (idx % 7) * 0.1;
                          return (
                            <div 
                              key={idx} 
                              className="spectrum-indicator-bar"
                              style={{ 
                                animation: `spectrum-bar-pulsing-${patternNum} ${duration}s ease-in-out infinite alternate`,
                                animationDelay: `${delay}s`
                              }}
                            />
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Local Stream Screen (User camera) */}
              <div id="local-video-frame" className="relative bg-slate-905 border-2 border-slate-800/80 rounded-2xl h-full flex flex-col items-center justify-center overflow-hidden">
                {isCamMuted ? (
                  <div className="flex flex-col items-center gap-1.5 text-slate-500">
                    <VideoOff className="w-10 h-10" />
                    <span className="text-[11px] font-mono uppercase">Caméra désactivée</span>
                  </div>
                ) : localStream ? (
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center text-slate-500 px-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-sm font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-300 font-bold">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-550 leading-normal max-w-xs">
                      (Flux vidéo local actif)
                    </span>
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10.5px] border border-slate-800 text-slate-300 font-semibold">
                  {currentUser.name} (Vous) {isMicMuted && "🔇"}
                </div>

                {isScreenSharing && (
                  <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-center p-4">
                    <MonitorUp className="w-10 h-10 text-blue-500 animate-bounce mb-2" />
                    <span className="text-xs font-bold text-white">Partage d'Écran Actif</span>
                    <span className="text-[10px] text-slate-400">Vous diffusez votre bureau</span>
                  </div>
                )}
              </div>

            </div>

            {/* Meet Control Actions Footer */}
            <footer className="p-5 border-t border-slate-800 bg-slate-900/40 flex justify-between items-center shrink-0 select-none">
              <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Réseau : Telco Tanganyika HD</span>
              </div>

              <div id="meet-controls-center" className="flex items-center gap-4">
                {/* Microphone trigger */}
                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`p-3 rounded-full transition-all border flex items-center justify-center ${isMicMuted ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-705'}`}
                  title={isMicMuted ? "Réactiver le microphone" : "Désactiver le microphone"}
                >
                  {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Camera Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleCam}
                  className={`p-3 rounded-full transition-all border flex items-center justify-center ${isCamMuted ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-705'}`}
                  title={isCamMuted ? "Activer la caméra" : "Désactiver la caméra"}
                >
                  {isCamMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                {/* Screen share tool */}
                <button
                  type="button"
                  onClick={handleToggleScreenShare}
                  className={`p-3 rounded-full transition-all border flex items-center justify-center ${isScreenSharing ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-705'}`}
                  title={isScreenSharing ? "Arrêter la diffusion" : "Partager l'écran"}
                >
                  <MonitorUp className="w-5 h-5" />
                </button>

                {/* Return/Hangup calling line */}
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-full transition-all flex items-center justify-center shadow-lg hover:scale-105"
                  title="Abandonner l'appel"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>

              <div className="text-[10.5px] font-mono text-slate-500 font-semibold tracking-wider">
                CANAL SÉCURISÉ (TLS)
              </div>
            </footer>

          </div>
        </div>
      )}

      {/* Bouton de chat flottant toujours visible sur toutes les pages */}
      <button
        id="floating-quick-chat-trigger"
        onMouseDown={(e) => {
          if (e.button !== 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          dragStartRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            btnX: rect.left,
            btnY: rect.top,
          };
          hasMovedRef.current = false;
          setIsDraggingChat(true);
        }}
        onTouchStart={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          dragStartRef.current = {
            clientX: e.touches[0].clientX,
            clientY: e.touches[0].clientY,
            btnX: rect.left,
            btnY: rect.top,
          };
          hasMovedRef.current = false;
          setIsDraggingChat(true);
        }}
        onClick={(e) => {
          if (hasMovedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          setActiveTab('communication');
          setCommSubTab('chat');
        }}
        style={{
          left: chatPosition.x !== null ? `${chatPosition.x}px` : undefined,
          top: chatPosition.y !== null ? `${chatPosition.y}px` : undefined,
          bottom: chatPosition.x === null ? '1.5rem' : 'auto',
          right: chatPosition.y === null ? '1.5rem' : 'auto',
        }}
        className={`fixed bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-350 z-[99999] flex items-center justify-center gap-1.5 md:gap-2 group border border-emerald-500/30 font-sans font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-400 select-none active:bg-emerald-700 ${
          isDraggingChat ? 'cursor-grabbing scale-105' : 'cursor-grab'
        }`}
        title="Ouvrir la messagerie privée (Glisser pour déplacer)"
      >
        <MessageSquare className="w-5 h-5 shrink-0" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-32 group-focus:max-w-32 group-active:max-w-32 transition-all duration-500 ease-in-out whitespace-nowrap leading-none select-none">
          Ouvrir le Chat
        </span>
        <span className="bg-red-500 text-white text-[9.5px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white animate-pulse shrink-0 select-none">
          2
        </span>
      </button>

      {/* Floating Toast Notification Overlay to handle intercepted window.alert notices natively */}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            let IconComponent = AlertCircle;
            let iconColor = "text-blue-600 dark:text-blue-400";
            let borderColor = "border-slate-200/80 dark:border-slate-850";
            
            if (toast.type === 'success') {
              IconComponent = CheckCircle2;
              iconColor = "text-emerald-600 dark:text-emerald-400";
              borderColor = "border-emerald-200/60 dark:border-emerald-900/40";
            } else if (toast.type === 'error') {
              IconComponent = ShieldAlert;
              iconColor = "text-rose-600 dark:text-rose-400";
              borderColor = "border-rose-200/60 dark:border-rose-900/40";
            } else if (toast.type === 'warning') {
              IconComponent = AlertCircle;
              iconColor = "text-amber-500 dark:text-amber-400";
              borderColor = "border-amber-200/60 dark:border-amber-900/40";
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
                exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-md`}
              >
                <IconComponent className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {showEmailAuthModal && (
        <RegisterView 
          onClose={() => setShowEmailAuthModal(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setFirebaseUser(auth.currentUser);
          }}
        />
      )}

    </div>
  );
}
