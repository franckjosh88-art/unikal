/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  CheckCircle, 
  BookMarked,
  FileText,
  Video,
  Volume2,
  FileSpreadsheet,
  AlertCircle,
  PlusCircle,
  Trash,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Search,
  Mic,
  MicOff
} from 'lucide-react';
import { Course, CourseMaterial, User } from '../types';

interface CoursesViewProps {
  currentUser: User;
  courses: Course[];
  onAddCourse: (newCourse: Course) => void;
  onMaterialDownload: (courseId: string, idxModule: string, materialId: string) => void;
  downloadedMaterialIds: Record<string, boolean>; // track downloaded ids
  offlineMode: boolean;
  onStartVideoCall?: (subjectName: string, subjectSubtitle: string, letter: string) => void;
}

export default function CoursesView({
  currentUser,
  courses,
  onAddCourse,
  onMaterialDownload,
  downloadedMaterialIds,
  offlineMode,
  onStartVideoCall
}: CoursesViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCourseTab, setActiveCourseTab] = useState<'modules' | 'ai-summary' | 'study-notes'>('modules');
  
  // Teachers states
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState(6);
  const [newCourseFaculty, setNewCourseFaculty] = useState(currentUser.faculty || 'Sciences Appliquées & Polytechnique');
  const [newCourseDept, setNewCourseDept] = useState('Génie Informatique');
  
  // AI summarization state
  const [aiSummaryResult, setAiSummaryResult] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  // AI revision cards state
  const [aiRevisionTopic, setAiRevisionTopic] = useState('');
  const [aiRevisionResult, setAiRevisionResult] = useState('');
  const [isGeneratingRevision, setIsGeneratingRevision] = useState(false);

  // Simulated download progress variables
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Hands-free speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Web Speech API - Speech Synthesis State
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const utteranceRef = useRef<any>(null);

  const getSpeechSynthesis = (): SpeechSynthesis | null => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return window.speechSynthesis;
      }
    } catch (e) {
      console.warn("SpeechSynthesis is restricted/disabled in this context:", e);
    }
    return null;
  };

  const createUtterance = (text: string): SpeechSynthesisUtterance | null => {
    try {
      if (typeof window !== 'undefined' && 'SpeechSynthesisUtterance' in window) {
        return new SpeechSynthesisUtterance(text);
      }
    } catch (e) {
      console.warn("SpeechSynthesisUtterance creation failed or is restricted:", e);
    }
    return null;
  };

  // Cancel any ongoing speaking when course selections change
  useEffect(() => {
    return () => {
      const synth = getSpeechSynthesis();
      if (synth) {
        try {
          synth.cancel();
        } catch (e) {
          console.warn("Failed to cancel audio play:", e);
        }
      }
    };
  }, [selectedCourse]);

  const startSpeaking = (textId: string, textToSpeak: string) => {
    const synth = getSpeechSynthesis();
    if (!synth) {
      alert("La synthèse vocale n'est pas prise en charge ou est restreinte par votre navigateur dans cet environnement.");
      return;
    }

    if (speakingId === textId) {
      if (isSpeechPaused) {
        try {
          synth.resume();
          setIsSpeechPaused(false);
        } catch (e) {
          console.warn("speechSynthesis.resume failed:", e);
        }
      } else {
        try {
          synth.pause();
          setIsSpeechPaused(true);
        } catch (e) {
          console.warn("speechSynthesis.pause failed:", e);
        }
      }
      return;
    }

    try {
      synth.cancel();
    } catch (e) {}

    // Clean markdown styling for crisp pronunciation
    const cleanText = textToSpeak.replace(/[#*`_\-]/g, ' ');
    const utterance = createUtterance(cleanText);
    if (!utterance) {
      alert("Impossible de créer l'objet vocale.");
      return;
    }

    utterance.lang = 'fr-FR';

    try {
      const voices = synth.getVoices();
      const frVoice = voices.find(v => v.lang.startsWith('fr') || v.lang.startsWith('FR'));
      if (frVoice) {
        utterance.voice = frVoice;
      }
    } catch (e) {
      console.warn("Failed to fetch speech voices:", e);
    }

    utterance.onstart = () => {
      setSpeakingId(textId);
      setIsSpeechPaused(false);
    };

    utterance.onend = () => {
      setSpeakingId(null);
      setIsSpeechPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      setSpeakingId(null);
      setIsSpeechPaused(false);
    };

    utteranceRef.current = utterance;
    try {
      synth.speak(utterance);
    } catch (err) {
      console.warn("synth.speak invocation failed:", err);
      setSpeakingId(null);
      setIsSpeechPaused(false);
    }
  };

  const pauseSpeaking = () => {
    const synth = getSpeechSynthesis();
    if (synth) {
      try {
        synth.pause();
        setIsSpeechPaused(true);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const resumeSpeaking = () => {
    const synth = getSpeechSynthesis();
    if (synth) {
      try {
        synth.resume();
        setIsSpeechPaused(false);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const stopSpeaking = () => {
    const synth = getSpeechSynthesis();
    if (synth) {
      try {
        synth.cancel();
      } catch (e) {
        console.warn(e);
      }
    }
    setSpeakingId(null);
    setIsSpeechPaused(false);
  };

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
      console.warn("Failed to lookup SpeechRecognition properties in window inside CoursesView:", e);
    }

    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'fr-FR';

        rec.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            const cleanText = transcript.trim().replace(/\.$/, '');
            setSearchQuery(cleanText);
          }
        };

        rec.onerror = (event: any) => {
          console.error('Speech recognition error in Courses', event.error);
          setSpeechError(event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.warn("SpeechRecognition instantiation failed in CoursesView due to browser sandboxing:", err);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas prise en charge ou non autorisée dans ce navigateur.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Failed to stop SpeechRecognition:", e);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filters visible list based on student's faculty
  const filteredCourses = courses.filter(c => {
    if (currentUser.role === 'student' && currentUser.faculty) {
      // Allow general algorithmic or their faculty
      return c.faculty === currentUser.faculty || c.id === 'c1' || c.id === 'c2';
    }
    return true; // show all for teachers/admins
  });

  // Filter courses by search query from standard input or speech transcript
  const searchedCourses = filteredCourses.filter(c => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(query) || 
           c.code.toLowerCase().includes(query) || 
           c.description.toLowerCase().includes(query) ||
           c.teacherName.toLowerCase().includes(query);
  });

  const triggerDownload = (cId: string, modId: string, mat: CourseMaterial) => {
    if (downloadedMaterialIds[mat.id]) return;
    setDownloadingId(mat.id);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          onMaterialDownload(cId, modId, mat.id);
          return 0;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Triggers server-side Gemini AI summarizer
  const fetchAiSummary = async (course: Course) => {
    setIsSummarizing(true);
    setAiSummaryResult('');
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: course.title,
          context: course.description
        })
      });
      const data = await response.json();
      setAiSummaryResult(data.text || 'Erreur lors du résumé.');
    } catch {
      setAiSummaryResult('Erreur de transport réseau. Impossible de contacter le serveur IA.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // Triggers server-side Gemini revision notes generator
  const fetchAiRevisionNotes = async (course: Course) => {
    if (!aiRevisionTopic) return;
    setIsGeneratingRevision(true);
    setAiRevisionResult('');
    try {
      const response = await fetch('/api/ai/revision-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course.title,
          topic: aiRevisionTopic
        })
      });
      const data = await response.json();
      setAiRevisionResult(data.notes || 'Erreur lors de la génération.');
    } catch {
      setAiRevisionResult('Erreur de transport. Vérifiez votre connectivité au Tanganyika.');
    } finally {
      setIsGeneratingRevision(false);
    }
  };

  // Pre-load summary when switching to AI tab
  useEffect(() => {
    if (selectedCourse && activeCourseTab === 'ai-summary' && !aiSummaryResult) {
      fetchAiSummary(selectedCourse);
    }
  }, [activeCourseTab, selectedCourse]);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseTitle) return;
    const added: Course = {
      id: "course-" + Date.now(),
      code: newCourseCode,
      title: newCourseTitle,
      description: newCourseDesc || "Aucune description fournie.",
      credits: Number(newCourseCredits),
      faculty: newCourseFaculty,
      department: newCourseDept,
      academicYear: "Deuxième Licence LMD",
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      modules: [
        {
          id: "m-dummy-1",
          title: "Chapitre 1 : Introduction de base",
          materials: [
            { id: "mat-dum-1", title: "Syllabus Général du cours", type: "pdf", url: "/mock.pdf", size: "1.0 MB" }
          ]
        }
      ]
    };
    onAddCourse(added);
    setShowAddCourseForm(false);
    setNewCourseTitle('');
    setNewCourseCode('');
    setNewCourseDesc('');
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-400 shrink-0" />;
      case 'video': return <Video className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'audio': return <Volume2 className="w-5 h-5 text-teal-400 shrink-0" />;
      case 'presentation': return <FileSpreadsheet className="w-5 h-5 text-amber-500 shrink-0" />;
      default: return <BookMarked className="w-5 h-5 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div id="courses-view" className="space-y-6">
      
      {!selectedCourse ? (
        <>
          {/* Header block with search & add action */}
          <div id="courses-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Espace d'Apprentissage (Cours)</h1>
              <p className="text-sm text-slate-400">Accédez aux matières, téléchargez vos chapitres et révisez avec l'intelligence artificielle.</p>
            </div>
            {currentUser.role === 'teacher' && (
              <button
                id="create-course-btn"
                onClick={() => setShowAddCourseForm(!showAddCourseForm)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Créer un nouveau cours
              </button>
            )}
          </div>

          {/* Form to create Course */}
          {showAddCourseForm && (
            <div id="add-course-form" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-md font-bold text-white mb-4">Paramètres du Cours Universitaire</h2>
              <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs text-slate-405 mb-1">Code du Cours</label>
                  <input 
                    type="text" 
                    value={newCourseCode} 
                    onChange={e => setNewCourseCode(e.target.value)}
                    placeholder="e.g. INF-302"
                    required
                    className="w-full bg-slate-800 border border-slate-705 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-405 mb-1">Nom du Cours</label>
                  <input 
                    type="text" 
                    value={newCourseTitle} 
                    onChange={e => setNewCourseTitle(e.target.value)}
                    placeholder="e.g. Systèmes d'exploitation distribués"
                    required
                    className="w-full bg-slate-800 border border-slate-705 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-450 mb-1">Faculté</label>
                  <select 
                    value={newCourseFaculty} 
                    onChange={e => setNewCourseFaculty(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-705 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Sciences Appliquées & Polytechnique">Sciences Appliquées & Polytechnique</option>
                    <option value="Sciences Agronomiques">Sciences Agronomiques</option>
                    <option value="Sciences Économiques & Gestion">Sciences Économiques & Gestion</option>
                    <option value="Médecine & Santé Publique">Médecine & Santé Publique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-450 mb-1">Crédits (ECTS)</label>
                  <input 
                    type="number" 
                    value={newCourseCredits} 
                    onChange={e => setNewCourseCredits(Number(e.target.value))}
                    min={1}
                    max={15}
                    className="w-full bg-slate-800 border border-slate-705 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-450 mb-1">Description / Objectifs d'apprentissage</label>
                  <textarea 
                    value={newCourseDesc} 
                    onChange={e => setNewCourseDesc(e.target.value)}
                    placeholder="Décrivez les chapitres abordés..."
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-705 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddCourseForm(false)}
                    className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Enregistrer le cours
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search filters with vocal recognition */}
          <div id="courses-filters-bar" className="bg-slate-850 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher un cours par titre, code ou par enseignant..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                id="mic-search-button-courses"
                type="button"
                onClick={toggleSpeechRecognition}
                className={`absolute right-3 top-2 p-1.5 rounded-full transition-all ${isListening ? 'bg-red-500/10 text-red-500 animate-pulse scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                title={isListening ? "Écoute active... Parlez maintenant." : "Recherche vocale mains libres"}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Grid layout of available Courses */}
          <div id="courses-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchedCourses.map((c) => (
              <div 
                key={c.id} 
                id={`course-card-${c.id}`} 
                onClick={() => {
                  setSelectedCourse(c);
                  setActiveCourseTab('modules');
                  setAiSummaryResult('');
                  setAiRevisionResult('');
                  setAiRevisionTopic('');
                }}
                className="bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono bg-slate-800 py-1 px-2.5 rounded-full text-emerald-400 font-bold">{c.code}</span>
                    <span className="text-slate-400 font-mono italic">{c.credits} Crédits</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">{c.title}</h3>
                  <p className="text-sm text-slate-350 line-clamp-3 leading-relaxed">{c.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-slate-400 max-w-40 truncate">{c.teacherName}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">{c.faculty}</span>
                  </div>
                  <div className="flex items-center text-emerald-400 font-bold gap-1 shrink-0">
                    <span>Ouvrir</span>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Isolated detail screen for selected course */
        <div id="course-detail-container" className="space-y-6">
          
          {/* Back Navigation Bar */}
          <nav id="course-back-nav" className="flex items-center gap-3">
            <button 
              id="back-btn-courses"
              onClick={() => setSelectedCourse(null)}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all flex items-center gap-2.5 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la liste des cours</span>
            </button>
          </nav>

          {/* Banner describing course code & title */}
          <div id="course-header-banner" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="bg-slate-800 px-3 py-1 font-mono text-xs text-emerald-350 font-bold rounded-full">{selectedCourse.code}</span>
                <span className="text-xs text-slate-400 font-medium italic">{selectedCourse.faculty}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-rose-500 animate-pulse font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 shrink-0">
                  <span className="h-1.5 w-1.5 bg-rose-500 rounded-full"></span>
                  AMPHITHÉÂTRE VIRTUEL PRÊT
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white mt-2 leading-tight">{selectedCourse.title}</h1>
              <p className="text-sm text-slate-350 mt-1 max-w-3xl">{selectedCourse.description}</p>
              
              {/* Text to Speech for course details */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  id="read-course-description-btn"
                  onClick={() => startSpeaking('course-desc', `${selectedCourse.title}. Objectifs du cours : ${selectedCourse.description}`)}
                  className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg border font-medium transition-all ${speakingId === 'course-desc' ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'}`}
                  title="Écouter la description du cours"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${speakingId === 'course-desc' ? 'animate-bounce text-amber-400' : ''}`} />
                  <span>{speakingId === 'course-desc' ? 'Lecture vocale en cours...' : 'Écouter le cours (Audio)'}</span>
                </button>
                {speakingId === 'course-desc' && (
                  <div className="flex items-center gap-1.5">
                    {isSpeechPaused ? (
                      <button onClick={resumeSpeaking} className="p-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-medium">Reprendre</button>
                    ) : (
                      <button onClick={pauseSpeaking} className="p-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 font-medium">Pause</button>
                    )}
                    <button onClick={stopSpeaking} className="p-1 px-2 text-[11px] bg-rose-950/40 text-rose-450 hover:text-rose-400 rounded border border-rose-900/30 font-medium">Arrêter</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-stretch gap-3 shrink-0 self-start md:self-center">
              <div className="text-center font-sans bg-slate-800/60 p-3.5 border border-slate-705 rounded-xl flex flex-col items-center justify-center min-w-40">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Enseignant responsable</span>
                <span className="text-xs font-bold text-slate-205">{selectedCourse.teacherName}</span>
              </div>
              <button
                id="launch-live-course-video"
                type="button"
                onClick={() => {
                  if (onStartVideoCall) {
                    onStartVideoCall(
                      selectedCourse.title,
                      `Cours en direct (${selectedCourse.code})`,
                      selectedCourse.code.charAt(0)
                    );
                  }
                }}
                className="bg-sky-600 hover:bg-sky-550 text-white font-bold p-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-102 active:scale-98 border border-sky-500 hover:shadow-sky-550/10"
              >
                <Video className="w-4 h-4 text-sky-200 shrink-0" />
                <span>
                  {currentUser.role === 'teacher' ? "Lancer cours en direct" : "Rejoindre le direct"}
                </span>
              </button>
            </div>
          </div>

          {/* Category Tabs Inside Course */}
          <div id="course-tabs" className="flex border-b border-slate-800">
            <button
              id="course-tab-modules"
              onClick={() => setActiveCourseTab('modules')}
              className={`pb-3 px-6 text-sm font-semibold transition-colors relative ${activeCourseTab === 'modules' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              Modules & Téléchargements
              {activeCourseTab === 'modules' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
            </button>
            <button
              id="course-tab-ai-summary"
              onClick={() => setActiveCourseTab('ai-summary')}
              className={`pb-3 px-6 text-sm font-semibold transition-colors relative flex items-center gap-2 ${activeCourseTab === 'ai-summary' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              <Sparkles className="w-4 h-4 text-emerald-350" />
              Résumé Complet IA
              {activeCourseTab === 'ai-summary' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
            </button>
            <button
              id="course-tab-study-notes"
              onClick={() => setActiveCourseTab('study-notes')}
              className={`pb-3 px-6 text-sm font-semibold transition-colors relative ${activeCourseTab === 'study-notes' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-100'}`}
            >
              Fiches de Révision IA
              {activeCourseTab === 'study-notes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"></div>}
            </button>
          </div>

          {/* Course View Panes */}
          {activeCourseTab === 'modules' && (
            <div id="course-modules-pane" className="space-y-6">
              {selectedCourse.modules.map((mod) => (
                <div key={mod.id} id={`mod-row-${mod.id}`} className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                  {/* Module Header Title */}
                  <div className="bg-slate-800/40 p-4 border-b border-slate-800/80 font-bold text-sm text-slate-100 flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{mod.title}</span>
                  </div>

                  {/* Materials list */}
                  <div className="divide-y divide-slate-800/60 p-4 space-y-3 divide-y-0">
                    {mod.materials.map((mat) => {
                      const isDownloaded = !!downloadedMaterialIds[mat.id];
                      return (
                        <div key={mat.id} id={`mat-item-${mat.id}`} className="p-3 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-705 border border-slate-800 rounded-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                          <div className="flex items-center gap-3">
                            {getMaterialIcon(mat.type)}
                            <div className="flex flex-col">
                              <span className="font-sans font-semibold text-slate-100 leading-tight">{mat.title}</span>
                              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                                <span className="uppercase">{mat.type}</span>
                                {mat.size && <span>• {mat.size}</span>}
                                {mat.duration && <span>• {mat.duration} min</span>}
                              </div>
                            </div>
                          </div>

                          {/* Access / Downloader controls */}
                          <div className="flex items-center gap-4 self-stretch sm:self-center justify-between sm:justify-end border-t border-slate-800/45 sm:border-0 pt-2.5 sm:pt-0 shrink-0">
                            {/* Speech Synthesis TTS button */}
                            <div className="flex items-center gap-2">
                              <button
                                id={`speak-mat-btn-${mat.id}`}
                                onClick={() => startSpeaking(mat.id, `Ceci est le document intitulé: ${mat.title}. C'est un support d'étude sous format ${mat.type} pour le cours de: ${selectedCourse.title} de l'Université de Kalemie. Il est maintenant disponible en version parlée pour faciliter votre apprentissage.`)}
                                className={`p-2 rounded-xl transition-all border shrink-0 flex items-center justify-center gap-1.5 min-w-[36px] h-9 ${speakingId === mat.id ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-800 hover:bg-slate-700/60 text-slate-300 border-slate-700'}`}
                                title="Écouter ce support de cours"
                              >
                                <Volume2 className={`w-4 h-4 shrink-0 ${speakingId === mat.id ? 'animate-bounce text-amber-400' : ''}`} />
                                {speakingId === mat.id && <span className="text-[11px] font-medium hidden md:inline">Lecture...</span>}
                              </button>
                              {speakingId === mat.id && (
                                <div className="flex items-center gap-1 shrink-0">
                                  {isSpeechPaused ? (
                                    <button type="button" onClick={resumeSpeaking} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-1 rounded border border-slate-700 font-medium">Reprendre</button>
                                  ) : (
                                    <button type="button" onClick={pauseSpeaking} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-350 px-1.5 py-1 rounded border border-slate-700 font-medium">Pause</button>
                                  )}
                                  <button type="button" onClick={stopSpeaking} className="text-[10px] bg-rose-950/40 text-rose-400 hover:text-rose-300 px-1.5 py-1 rounded border border-rose-900/30 font-medium">Arrêt</button>
                                </div>
                              )}
                            </div>

                            {/* Offline mode label */}
                            {offlineMode ? (
                              isDownloaded ? (
                                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
                                  ✓ Dispo hors-ligne
                                </span>
                              ) : (
                                <span className="text-[11.5px] font-sans text-amber-500 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>Non chargé</span>
                                </span>
                              )
                            ) : (
                              /* Standard network state */
                              <>
                                {isDownloaded ? (
                                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Téléchargé</span>
                                  </div>
                                ) : (
                                  <button
                                    id={`dl-btn-${mat.id}`}
                                    onClick={() => triggerDownload(selectedCourse.id, mod.id, mat)}
                                    disabled={downloadingId !== null}
                                    className={`text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors ${downloadingId === mat.id ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
                                  >
                                    {downloadingId === mat.id ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                                        <span>{downloadProgress}%</span>
                                      </>
                                    ) : (
                                      <>
                                        <Download className="w-3.5 h-3.5 shrink-0" />
                                        <span>Cache clé USB</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCourseTab === 'ai-summary' && (
            <div id="course-ai-summary-pane" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Résumé Académique par Gemini 3.5</h2>
                </div>
                {!offlineMode && (
                  <button 
                    id="regenerate-summary-btn"
                    onClick={() => fetchAiSummary(selectedCourse)} 
                    disabled={isSummarizing}
                    className="text-xs text-emerald-400 border border-emerald-500/25 bg-emerald-500/10 p-2 rounded-lg font-bold"
                  >
                    Régénérer
                  </button>
                )}
              </div>

              {isSummarizing ? (
                <div id="loading-summary" className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                  <span className="text-sm font-mono text-slate-400">Analyse pédagogique en cours par l'IA...</span>
                </div>
              ) : (
                <>
                  {aiSummaryResult && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/40 p-3.5 rounded-xl border border-slate-705 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-450 shrink-0" />
                        <span className="text-slate-300 font-medium">Écouter ce résumé académique (Audio pour mobile) :</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          id="speak-ai-summary-btn"
                          onClick={() => startSpeaking('ai-summary', aiSummaryResult)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${speakingId === 'ai-summary' ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-350 hover:text-white hover:bg-slate-800'}`}
                        >
                          {speakingId === 'ai-summary' ? (isSpeechPaused ? 'Démarré' : 'Lecture en cours...') : 'Lancer l\'audio'}
                        </button>
                        {speakingId === 'ai-summary' && (
                          <div className="flex items-center gap-1">
                            {isSpeechPaused ? (
                              <button onClick={resumeSpeaking} className="bg-slate-900 border border-slate-705 text-slate-300 px-2 py-1 rounded">Reprendre</button>
                            ) : (
                              <button onClick={pauseSpeaking} className="bg-slate-900 border border-slate-705 text-slate-300 px-2 py-1 rounded">Pause</button>
                            )}
                            <button onClick={stopSpeaking} className="bg-rose-950/40 border border-rose-900/30 text-rose-400 px-2 py-1 rounded">Arrêt</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-slate-205 leading-relaxed font-sans prose prose-invert max-w-none whitespace-pre-wrap mt-2">
                    {aiSummaryResult || "Aucun résumé n'a pu être extrait. Cliquez sur Régénérer."}
                  </div>
                </>
              )}
            </div>
          )}

          {activeCourseTab === 'study-notes' && (
            <div id="course-study-notes-pane" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Générateur de Fiches de Révisions IA</h2>
              </div>
              <p className="text-xs text-slate-400">Pour économiser votre réseau mobile, notre tuteur intelligent transcrit vos chapitres d'étude sous forme de fiches mémos compactes directement affichables sur téléphone portable.</p>
              
              <div id="revision-form" className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  value={aiRevisionTopic}
                  onChange={(e) => setAiRevisionTopic(e.target.value)}
                  placeholder="e.g. Algorithme de tri à bulles (Qu'est-ce que c'est ?)"
                  className="flex-1 bg-slate-800 border border-slate-705 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                />
                <button
                  id="generate-revision-btn"
                  onClick={() => fetchAiRevisionNotes(selectedCourse)}
                  disabled={isGeneratingRevision || !aiRevisionTopic}
                  className="bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shrink-0 flex items-center justify-center gap-2"
                >
                  {isGeneratingRevision ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>Génération...</span>
                    </>
                  ) : (
                    "Générer la Fiche"
                  )}
                </button>
              </div>

              {aiRevisionResult && !isGeneratingRevision && (
                <div className="space-y-3 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-705 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-450 shrink-0" />
                      <span className="text-slate-350 font-medium">Écouter la fiche de révision générée :</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id="speak-revision-btn"
                        onClick={() => startSpeaking('study-notes', aiRevisionResult)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${speakingId === 'study-notes' ? 'bg-amber-600/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'}`}
                        title="Lire à haute voix cette fiche mémotech"
                      >
                        {speakingId === 'study-notes' ? (isSpeechPaused ? 'Démarré' : 'Lecture en cours...') : 'Lancer la dictée'}
                      </button>
                      {speakingId === 'study-notes' && (
                        <div className="flex items-center gap-1">
                          {isSpeechPaused ? (
                            <button onClick={resumeSpeaking} className="bg-slate-900 border border-slate-705 text-slate-300 px-2 py-1 rounded">Reprendre</button>
                          ) : (
                            <button onClick={pauseSpeaking} className="bg-slate-900 border border-slate-705 text-slate-300 px-2 py-1 rounded">Pause</button>
                          )}
                          <button onClick={stopSpeaking} className="bg-rose-950/40 border border-rose-900/30 text-rose-450 px-2 py-1 rounded">Arrêt</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div id="revision-result-panel" className="p-5 bg-slate-800/80 rounded-2xl border border-slate-705 overflow-hidden text-sm text-slate-100 whitespace-pre-wrap font-sans leading-relaxed">
                    {aiRevisionResult}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
