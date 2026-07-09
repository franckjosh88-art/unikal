/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookMarked, 
  Search, 
  Download, 
  CheckCircle, 
  PlusCircle, 
  BookOpen, 
  Clock, 
  FileText,
  Loader2,
  Mic,
  MicOff
} from 'lucide-react';
import { LibraryItem, User } from '../types';

interface DigitalLibraryViewProps {
  currentUser: User;
  libraryItems: LibraryItem[];
  onAddLibraryItem: (newItem: LibraryItem) => Promise<void>;
  downloadedLibraryItemIds: Record<string, boolean>;
  onDownloadLibraryItem: (id: string) => void;
  offlineMode: boolean;
}

export default function DigitalLibraryView({
  currentUser,
  libraryItems,
  onAddLibraryItem,
  downloadedLibraryItemIds,
  onDownloadLibraryItem,
  offlineMode
}: DigitalLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'livre' | 'tfc' | 'memoire' | 'revue'>('all');
  
  // Hands-free speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
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
      console.warn("Failed to lookup SpeechRecognition properties inside DigitalLibraryView:", e);
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
          console.error('Speech recognition error', event.error);
          setSpeechError(event.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.warn("SpeechRecognition instantiation failed in DigitalLibraryView due to browser sandboxing:", err);
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
        console.warn("Failed to stop speech recognition:", e);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };
  
  // States for uploading manuscripts
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newType, setNewType] = useState<'livre' | 'tfc' | 'memoire' | 'revue'>('tfc');
  const [newYear, setNewYear] = useState(2025);
  const [newInstitution, setNewInstitution] = useState('Université de Kalemie (UNIKAL)');
  const [newFaculty, setNewFaculty] = useState('Sciences Appliquées');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // States for downloading
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const startDownload = (id: string) => {
    if (downloadedLibraryItemIds[id]) return;
    setDownloadingId(id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          onDownloadLibraryItem(id);
          return 0;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handlePublishManuscript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(async () => {
      const added: LibraryItem = {
        id: "lib-" + Date.now(),
        title: newTitle,
        author: newAuthor,
        type: newType,
        year: Number(newYear),
        institution: newInstitution,
        faculty: newFaculty,
        size: "3.2 MB",
        downloadsCount: 0
      };
      await onAddLibraryItem(added);
      setIsUploading(false);
      setShowUploadForm(false);
      setNewTitle('');
      setNewAuthor('');
      setNewType('tfc');
    }, 1200);
  };

  // Filter computations
  const filteredItems = libraryItems.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    return matchQuery && matchType;
  });

  return (
    <div id="library-view" className="space-y-6">
      
      {/* Header element */}
      <div id="library-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Bibliothèque Numérique Académique</h1>
          <p className="text-sm text-slate-400">Accédez aux thèses de doctorat, mémoires de licence LMD, TFCs d'anciens et revues scientifiques locales.</p>
        </div>
        <button
          id="show-upload-manuscript-btn"
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-emerald-600 hover:bg-emerald-555 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Déposer un manuscrit (TFC/Mémoire)</span>
        </button>
      </div>

      {/* Upload manuscript modal form */}
      {showUploadForm && (
        <div id="manuscript-upload-form" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 text-sm shadow-md">
          <h2 className="text-md font-bold text-white mb-2">Enregistrer un Travail Académique</h2>
          <form onSubmit={handlePublishManuscript} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Titre de l'Ouvrage ou Titre du Devoir de Fin de Cycle (TFC)</label>
              <input 
                type="text" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Conception d'un tracker d'ensoleillement solaire à Manono"
                required
                className="w-full bg-slate-800 border border-slate-705 px-3.5 py-2 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom Complet de l'Auteur principal</label>
              <input 
                type="text" 
                value={newAuthor} 
                onChange={e => setNewAuthor(e.target.value)}
                placeholder="e.g. Patient Ngoy"
                required
                className="w-full bg-slate-800 border border-slate-705 px-3.5 py-2 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Type de Document</label>
              <select 
                value={newType} 
                onChange={e => setNewType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-705 px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="tfc">Travail de Fin de Cycle (TFC)</option>
                <option value="memoire">Mémoire de Licence</option>
                <option value="livre">Manuel Universitaire</option>
                <option value="revue">Revue Scientifique</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Année de Présentation</label>
              <input 
                type="number" 
                value={newYear} 
                onChange={e => setNewYear(Number(e.target.value))}
                min={2000}
                max={2026}
                required
                className="w-full bg-slate-800 border border-slate-705 px-3.5 py-2 rounded-lg text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Institution d'Émission</label>
              <input 
                type="text" 
                value={newInstitution} 
                onChange={e => setNewInstitution(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-705 px-3.5 py-2 rounded-lg text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Département ou Faculté</label>
              <input 
                type="text" 
                value={newFaculty} 
                onChange={e => setNewFaculty(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-705 px-3.5 py-2 rounded-lg text-white focus:outline-none"
              />
            </div>

            {isUploading && (
              <div className="md:col-span-2">
                <div className="h-2 w-full bg-slate-800 rounded-lg overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span className="text-[11px] text-slate-405 font-mono text-center block mt-1">Téléversement crypté du PDF académique... {uploadProgress}%</span>
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3 mt-1">
              <button 
                type="button" 
                onClick={() => setShowUploadForm(false)}
                className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold py-2 px-4 rounded-lg transition-colors border border-slate-750"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Publier le manuscrit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and search element */}
      <div id="library-filters-bar" className="bg-slate-850 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, auteur de TFC ou mot-clé..."
            className="w-full bg-slate-850 border border-slate-700 rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            id="mic-search-button-library"
            type="button"
            onClick={toggleSpeechRecognition}
            className={`absolute right-3 top-2 p-1.5 rounded-full transition-all ${isListening ? 'bg-red-500/10 text-red-500 animate-pulse scale-110' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={isListening ? "Écoute active... Parlez maintenant." : "Recherche vocale mains libres"}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>
        <div id="category-selector-pills" className="flex flex-wrap gap-2 justify-start shrink-0">
          {(['all', 'tfc', 'memoire', 'livre', 'revue'] as const).map(cat => (
            <button
              key={cat}
              id={`cat-pill-${cat}`}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filterType === cat ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-350 hover:bg-slate-750'}`}
            >
              {cat === 'all' ? 'Tout' : cat === 'memoire' ? 'Mémoires' : cat === 'livre' ? 'Livres/Manuels' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing items */}
      <div id="library-items-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const isDownloaded = !!downloadedLibraryItemIds[item.id];
          return (
            <div key={item.id} id={`lib-card-${item.id}`} className="p-5 bg-slate-850 rounded-2xl border border-slate-800 hover:border-slate-705 transition-all flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase py-0.5 px-2.5 rounded-md border ${item.type === 'tfc' ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : item.type === 'memoire' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                    {item.type === 'tfc' ? 'Travail de fin de cycle' : item.type === 'memoire' ? 'Mémoire' : item.type === 'livre' ? 'Livre' : 'Revue'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono italic">{item.year}</span>
                </div>
                
                <h3 className="text-md font-bold text-white leading-snug line-clamp-2">{item.title}</h3>
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="font-semibold">{item.author}</p>
                  <p className="text-[11px] truncate">{item.institution} • {item.faculty}</p>
                </div>
              </div>

              {/* Progress Bar for Active Download */}
              {downloadingId === item.id && (
                <div className="mt-3.5 space-y-1.5" id={`dl-progress-bar-${item.id}`}>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-blue-500 font-medium">Téléchargement en cours...</span>
                    <span className="text-blue-500 font-bold">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-150" 
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[10.5px]">{item.size} PDF</span>
                
                {offlineMode ? (
                  isDownloaded ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">Disponible</span>
                  ) : (
                    <span className="text-[10px] text-amber-550 border border-amber-500/15 bg-amber-500/5 px-2 py-1 rounded-md">Déconnecté</span>
                  )
                ) : (
                  <>
                    {isDownloaded ? (
                      <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Téléchargé</span>
                      </div>
                    ) : (
                      <button
                        id={`dl-lib-btn-${item.id}`}
                        onClick={() => startDownload(item.id)}
                        disabled={downloadingId !== null}
                        className="text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-555 hover:text-white px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all flex items-center gap-1 shrink-0"
                      >
                        {downloadingId === item.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                            <span>{downloadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Prendre pour USB</span>
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
  );
}
