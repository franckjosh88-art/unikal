/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Info, 
  CheckCheck, 
  PlusCircle, 
  ThumbsUp, 
  CornerDownRight, 
  ArrowLeft,
  ChevronRight,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MonitorUp,
  Volume2,
  Radio,
  Tv
} from 'lucide-react';
import { ForumTopic, ForumPost, ChatMessage, User } from '../types';
import { markMessageAsReadInFirestore } from '../lib/firebaseSync';

interface CommunicationViewProps {
  currentUser: User;
  usersList: User[];
  forumTopics: ForumTopic[];
  forumPosts: ForumPost[];
  chatMessages: ChatMessage[];
  onAddForumTopic: (title: string, desc: string, cat: string) => Promise<void>;
  onAddForumReply: (topicId: string, content: string) => Promise<void>;
  onSendChatMessage: (receiverId: string, content: string) => Promise<void>;
  offlineMode: boolean;
  defaultSubTab?: 'forum' | 'chat';
  onStartVideoCall?: (subjectName: string, subjectSubtitle: string, letter: string) => void;
}

export default function CommunicationView({
  currentUser,
  usersList,
  forumTopics,
  forumPosts,
  chatMessages,
  onAddForumTopic,
  onAddForumReply,
  onSendChatMessage,
  offlineMode,
  defaultSubTab = 'forum',
  onStartVideoCall
}: CommunicationViewProps) {
  const [activeCommTab, setActiveCommTab] = useState<'forum' | 'chat'>(defaultSubTab);

  useEffect(() => {
    if (defaultSubTab) {
      setActiveCommTab(defaultSubTab);
    }
  }, [defaultSubTab]);
  
  // Forum states
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [forumReplyValue, setForumReplyValue] = useState('');
  const [showCreateTopicForm, setShowCreateTopicForm] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicCat, setNewTopicCat] = useState('cours');

  // Private chat states with responsive initialization (pre-select on desktop, start with list on mobile)
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(() => {
    try {
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        return currentUser.role === 'student' 
          ? usersList.find(u => u.role === 'teacher') || null 
          : usersList.find(u => u.role === 'student') || null;
      }
    } catch (e) {
      console.warn("Could not detect window width:", e);
    }
    return null;
  });
  const [chatInputValue, setChatInputValue] = useState('');

  // Web Speech API - Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let SpeechRecognition: any = null;
    try {
      if (typeof window !== 'undefined') {
        if ('SpeechRecognition' in window) {
          SpeechRecognition = (window as any).SpeechRecognition;
        } else if ('webkitSpeechRecognition' in window) {
          SpeechRecognition = (window as any).webkitSpeechRecognition;
        }
      }
    } catch (e) {
      console.warn("Failed to lookup SpeechRecognition properties in window inside CommunicationView:", e);
    }

    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setChatInputValue(prev => prev + (prev ? ' ' : '') + finalTranscript);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === 'not-allowed') {
            alert("L'accès au microphone a été refusé ou n'est pas autorisé dans cet environnement.");
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.warn("SpeechRecognition instantiation failed due to iframe safety/permissions:", err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      const simulatedText = "Bonjour, j'écris ce message grâce à la dictée vocale de l'Université de Kalemie.";
      setChatInputValue(prev => prev + (prev ? ' ' : '') + simulatedText);
      alert("La dictée vocale n'est pas supportée nativement par votre navigateur dans cet environnement. Un message d'exemple a été inséré pour illustrer la fonctionnalité.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        if (offlineMode) {
          alert("La reconnaissance vocale peut être limitée en Mode Hors-ligne suivant les capacités hors-ligne de votre navigateur.");
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition", err);
        setIsListening(false);
      }
    }
  };

  const handleStartCallLocal = () => {
    if (offlineMode) {
      alert("La vidéoconférence requiert une connexion internet active. Veuillez d'abord désactiver le Mode Hors-ligne.");
      return;
    }
    if (onStartVideoCall && selectedRecipient) {
      onStartVideoCall(
        selectedRecipient.name,
        selectedRecipient.role === 'teacher' ? 'Enseignant' : 'Étudiant',
        selectedRecipient.name.charAt(0)
      );
    }
  };

  // Process selected topic posts
  const activePosts = selectedTopic ? forumPosts.filter(p => p.topicId === selectedTopic.id) : [];

  // Filter messages between current user and selection
  const activeChats = chatMessages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === selectedRecipient?.id) ||
         (m.senderId === selectedRecipient?.id && m.receiverId === currentUser.id)
  );

  // Mark incoming unread messages as read in active chat
  useEffect(() => {
    if (!selectedRecipient || offlineMode) return;
    const unreadIncoming = activeChats.filter(
      m => m.senderId === selectedRecipient.id && m.receiverId === currentUser.id && !m.read
    );
    if (unreadIncoming.length > 0) {
      unreadIncoming.forEach((msg) => {
        markMessageAsReadInFirestore(msg.id).catch((err) => {
          console.error("Failed to mark message as read:", err);
        });
      });
    }
  }, [selectedRecipient, activeChats, currentUser.id, offlineMode]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicDesc) return;
    await onAddForumTopic(newTopicTitle, newTopicDesc, newTopicCat);
    setNewTopicTitle('');
    setNewTopicDesc('');
    setShowCreateTopicForm(false);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !forumReplyValue) return;
    await onAddForumReply(selectedTopic.id, forumReplyValue);
    setForumReplyValue('');
  };

  const handleSendChatMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !chatInputValue) return;
    await onSendChatMessage(selectedRecipient.id, chatInputValue);
    setChatInputValue('');
  };

  return (
    <div id="communication-view" className="space-y-6">
      
      {/* Header and top tab select */}
      <div id="communication-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Espace de Communication</h1>
          <p className="text-sm text-slate-400">Restez en contact permanent avec vos enseignants, discutez au forum et échangez vos astuces hors-ligne.</p>
        </div>

        {/* Tab Selection buttons */}
        <div id="comm-tabs-button-group" className="inline-flex bg-slate-800 rounded-xl p-1 shrink-0">
          <button
            id="comm-tab-forum-btn"
            onClick={() => setActiveCommTab('forum')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeCommTab === 'forum' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            Forum Académique
          </button>
          <button
            id="comm-tab-chat-btn"
            onClick={() => setActiveCommTab('chat')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeCommTab === 'chat' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            Chat Privé Enseignants
          </button>
        </div>
      </div>

      {/* Pane 1 : Forum */}
      {activeCommTab === 'forum' && (
        <div id="forum-pane" className="space-y-6">
          {!selectedTopic ? (
            <>
              {/* Forum index layout */}
              <div id="forum-action-bar" className="flex justify-between items-center bg-slate-850 p-4 border border-slate-800 rounded-2xl">
                <span className="text-sm font-bold text-white leading-tight">Canaux de discussions ouverts</span>
                <button
                  id="show-create-topic-btn"
                  onClick={() => setShowCreateTopicForm(!showCreateTopicForm)}
                  className="bg-emerald-600 hover:bg-emerald-555 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Démarrer un fil de discussion</span>
                </button>
              </div>

              {/* Thread creation dialog */}
              {showCreateTopicForm && (
                <div id="forum-create-topic-dialog" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 text-sm shadow-md">
                  <h3 className="text-md font-bold text-white">Lancer un débat ou émettre une question</h3>
                  <form onSubmit={handleCreateTopic} className="space-y-3.5">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Titre de la Discussion</label>
                      <input 
                        type="text" 
                        value={newTopicTitle} 
                        onChange={e => setNewTopicTitle(e.target.value)}
                        placeholder="e.g. Problème d'ouverture d'un fichier PDF sur mobile Android"
                        required
                        className="w-full bg-slate-800 border border-slate-705 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Défis rencontrés / Description complète</label>
                      <textarea 
                        value={newTopicDesc} 
                        onChange={e => setNewTopicDesc(e.target.value)}
                        placeholder="Donnez plus de précisions (filières, cours, codes...)"
                        rows={3}
                        required
                        className="w-full bg-slate-800 border border-slate-705 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Catégorie</label>
                      <select 
                        value={newTopicCat} 
                        onChange={e => setNewTopicCat(e.target.value)}
                        className="bg-slate-800 border border-slate-705 rounded-lg px-3 py-1.5 text-white"
                      >
                        <option value="cours">Aide aux Cours & TPs</option>
                        <option value="partage">Partage d'astuces hors-ligne</option>
                        <option value="admin">Administratif</option>
                        <option value="autre">Autres</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowCreateTopicForm(false)}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold py-1.5 px-4 rounded-lg border border-slate-750 text-xs"
                      >
                        Annuler
                      </button>
                      <button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-555 text-white text-xs font-bold py-1.5 px-6 rounded-lg transition-colors"
                      >
                        Lancer le fil
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Forum threads rows */}
              <div id="forum-topics-container" className="space-y-4">
                {forumTopics.map(topic => (
                  <div 
                    key={topic.id} 
                    id={`topic-row-${topic.id}`}
                    onClick={() => setSelectedTopic(topic)}
                    className="p-5 bg-slate-850 rounded-2xl border border-slate-800 hover:border-slate-705 hover:shadow-md transition-all flex justify-between items-center cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase py-0.5 px-2.5 rounded-full border ${topic.category === 'cours' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-amber-405 bg-amber-500/10 border-amber-500/20'}`}>
                          {topic.category === 'cours' ? 'Support Cours' : 'Astuces Hors-ligne'}
                        </span>
                        <span className="text-xs text-slate-500 font-mono italic">Lancé par {topic.authorName}</span>
                      </div>
                      <h3 className="text-md font-bold text-white group-hover:text-emerald-400 leading-snug">{topic.title}</h3>
                      <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">{topic.description}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 text-slate-400 text-xs">
                      <div className="text-center font-mono select-none">
                        <span className="block font-bold text-white text-sm">{topic.repliesCount}</span>
                        <span className="text-[10px] text-slate-500">Réponses</span>
                      </div>
                      <ChevronRight className="w-5 h-5 shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Threads posts nested comments detail */
            <div id="active-thread-container" className="space-y-6">
              
              {/* Back navigation */}
              <button 
                id="back-btn-forum"
                onClick={() => setSelectedTopic(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour aux discussions</span>
              </button>

              <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Root post display */}
                <div id="thread-op-header" className="bg-slate-800/50 p-6 border-b border-slate-850">
                  <header className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Créateur : {selectedTopic.authorName}</span>
                    <span>{new Date(selectedTopic.createdAt).toLocaleDateString('fr-FR')}</span>
                  </header>
                  <h2 className="text-lg font-bold text-slate-100 mb-2">{selectedTopic.title}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{selectedTopic.description}</p>
                </div>

                {/* Displaying replies */}
                <div id="thread-replies-list" className="p-6 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Commentaires & Réponses académiques</h4>
                  
                  {activePosts[0]?.replies?.map(rep => (
                    <div key={rep.id} className="p-4 bg-slate-800/85 border border-slate-705 rounded-xl space-y-2 relative ml-3 sm:ml-6">
                      <CornerDownRight className="w-4 h-4 text-slate-500 absolute -left-5 top-4 shrink-0" />
                      
                      <header className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 font-sans">
                          <span className="font-bold text-white">{rep.authorName}</span>
                          <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-750 text-slate-400 font-mono text-[9.5px] rounded-md uppercase">
                            {rep.authorRole === 'teacher' ? 'Enseignant' : 'Élève'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(rep.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </header>

                      <p className="text-sm text-slate-205 leading-relaxed font-sans">{rep.content}</p>
                    </div>
                  ))}

                  {/* Submission form for replying to thread */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 flex gap-3 text-sm">
                    <input 
                      type="text" 
                      value={forumReplyValue}
                      onChange={e => setForumReplyValue(e.target.value)}
                      placeholder="Commenter ou proposer une solution de support..."
                      required
                      className="flex-1 bg-slate-800 border border-slate-705 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Répondre</span>
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Pane 2 : Instant Messaging Chat */}
      {activeCommTab === 'chat' && (
        <section id="chat-layout-grid" className="grid grid-cols-1 md:grid-cols-3 bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden h-[540px]">
          
          {/* Left panel chat contacts selection */}
          <div 
            id="chat-contacts-column" 
            className={`border-r border-slate-800/80 p-4 space-y-3 flex flex-col h-full bg-slate-900/40 ${selectedRecipient ? 'hidden md:flex' : 'flex'}`}
          >
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono select-none">Contacts académiques</h3>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {usersList.filter(u => u.id !== currentUser.id).map(usr => {
                const isSelected = selectedRecipient?.id === usr.id;
                const unreadCount = chatMessages.filter(
                  m => m.senderId === usr.id && m.receiverId === currentUser.id && !m.read
                ).length;
                return (
                  <button
                    key={usr.id}
                    id={`contact-usr-${usr.id}`}
                    onClick={() => {
                      setSelectedRecipient(usr);
                      setChatInputValue('');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 ${isSelected ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-slate-850 border-transparent hover:bg-slate-800 text-slate-300'}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold font-sans text-xs text-emerald-400 capitalize shrink-0 border border-slate-700">
                      {usr.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold block text-sm truncate leading-tight text-slate-100">{usr.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono capitalize block mt-0.5 truncate">{usr.role === 'teacher' ? 'Professeur' : usr.role === 'student' ? 'Élève' : 'Admin'}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel interactive dialog frame */}
          <div 
            id="chat-messages-column" 
            className={`md:col-span-2 flex flex-col h-full justify-between ${selectedRecipient ? 'flex' : 'hidden md:flex'}`}
          >
            {selectedRecipient ? (
              <>
                {/* Chat header contact label - Modern WhatsApp/Telegram Design */}
                <div id="chat-header-banner" className="bg-slate-850/90 px-4 py-3 sm:px-5 sm:py-3 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0 select-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Back arrow button on mobile to return to contact list */}
                    <button
                      onClick={() => setSelectedRecipient(null)}
                      className="md:hidden p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0 mr-0.5"
                      title="Retour aux contacts"
                    >
                      <ArrowLeft className="w-4.5 h-4.5" />
                    </button>

                    {/* Contact Avatar with status circle indicator */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-600/20 to-teal-500/20 text-emerald-400 border border-slate-700 flex items-center justify-center font-bold text-sm select-none uppercase shadow-sm">
                        {selectedRecipient.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-850 shadow-xs"></span>
                    </div>

                    {/* Name, role & online status info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-100 text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[200px] block leading-tight">
                          {selectedRecipient.name}
                        </span>
                        <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                          {selectedRecipient.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5 leading-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                        Disponible
                      </span>
                    </div>
                  </div>
                  
                  {/* Call action buttons (Appel Vocal & Appel Vidéo) - Perfectly visible on both desktop & mobile */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Audio Call Button */}
                    <button
                      id="start-voice-call-btn"
                      type="button"
                      onClick={() => {
                        if (offlineMode) {
                          alert("L'appel vocal requiert une connexion internet active. Veuillez d'abord désactiver le Mode Hors-ligne.");
                          return;
                        }
                        if (onStartVideoCall && selectedRecipient) {
                          onStartVideoCall(
                            selectedRecipient.name,
                            `${selectedRecipient.role === 'teacher' ? 'Enseignant' : 'Étudiant'} (Appel Audio)`,
                            selectedRecipient.name.charAt(0)
                          );
                        }
                      }}
                      className="bg-slate-800 hover:bg-slate-750 text-white p-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
                      title="Lancer un appel vocal"
                    >
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline text-xs font-bold text-slate-200">Appel Audio</span>
                    </button>

                    {/* Video Call Button */}
                    <button
                      id="start-video-call-btn"
                      type="button"
                      onClick={handleStartCallLocal}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0 font-bold"
                      title="Lancer un appel vidéo en direct"
                    >
                      <Video className="w-4 h-4 text-white" />
                      <span className="hidden sm:inline text-xs font-bold">Appel Vidéo</span>
                    </button>
                  </div>
                </div>

                {/* Dialog Messages list */}
                <div id="chat-messages-scroller" className="flex-1 p-5 space-y-4 overflow-y-auto max-h-72">
                  {activeChats.map(msg => {
                    const selfSent = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${selfSent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-[12px] py-[8px] rounded-[16px] text-[14px] max-w-sm flex flex-col gap-1 shadow-sm leading-relaxed ${selfSent ? 'bg-[#2563EB] text-white rounded-br-none' : 'bg-[#F3F4F6] text-[#1F2937] rounded-bl-none'}`}>
                          <span className="font-sans text-[14px]">{msg.content}</span>
                          <span className={`text-[10px] font-mono self-end ${selfSent ? 'text-blue-100/90' : 'text-gray-500'} flex items-center gap-1`}>
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            {selfSent && (
                              msg.read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-sky-300 inline-block" title="Vu par le destinataire" />
                              ) : (
                                <CheckCheck className="w-3.5 h-3.5 text-blue-200/40 inline-block" title="Envoyé" />
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit input messaging block */}
                <form id="chat-send-form" onSubmit={handleSendChatMsg} className="p-4 border-t border-slate-800 bg-slate-900/40 flex gap-3 text-sm items-center">
                  <div className="relative flex-1 flex items-center">
                    <input 
                      type="text" 
                      value={chatInputValue}
                      onChange={e => setChatInputValue(e.target.value)}
                      placeholder={isListening ? "Écoute en cours... Parlez maintenant." : `Écrire un message privé à ${selectedRecipient.name}...`}
                      required={!isListening}
                      className="w-full bg-slate-800 border border-slate-705 rounded-xl pl-4 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                    <button
                      id="voice-dictation-btn"
                      type="button"
                      onClick={toggleListening}
                      className={`absolute right-2.5 p-1.5 rounded-lg transition-all ${isListening ? 'bg-rose-600/30 text-rose-500 animate-pulse' : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                      title={isListening ? "Arrêter la dictée vocale" : "Dicter le message (Speech-to-Text)"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center shrink-0"
                    title="Envoyer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div id="chat-onboarding" className="p-12 text-center text-slate-500 font-sans text-xs flex flex-col items-center justify-center h-full gap-2">
                <MessageSquare className="w-8 h-8 text-slate-650 animate-pulse" />
                <span>Sélectionnez un contact universitaire pour démarrer l'échange privé.</span>
              </div>
            )}
          </div>

        </section>
      )}

    </div>
  );
}
