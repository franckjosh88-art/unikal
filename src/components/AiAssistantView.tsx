/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Languages, 
  HelpCircle, 
  Volume2, 
  Check, 
  Copy,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { User } from '../types';

interface AiAssistantViewProps {
  currentUser: User;
  offlineMode: boolean;
}

interface ChatMessageLocal {
  role: 'user' | 'assistant';
  text: string;
}

export default function AiAssistantView({
  currentUser,
  offlineMode
}: AiAssistantViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'translate'>('qa');

  // Q&A states
  const [chatHistory, setChatHistory] = useState<ChatMessageLocal[]>([
    { role: 'assistant', text: `Jambo ${currentUser.name} ! Je suis votre tuteur d'intelligence artificielle UNIKAL E-Learning. \n\nJe suis capable de répondre à vos questions académiques (algorithmes, agronomie tropicale durables, géométrie) ou de vous traduire vos phrases. Comment puis-je vous guider ?` }
  ]);
  const [qaInput, setQaInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  // Translation states
  const [translationText, setTranslationText] = useState("L'accès aux études universitaires est la clé du d'un avenir prospère pour la province du Tanganyika.");
  const [targetLang, setTargetLang] = useState('Swahili');
  const [translatedResult, setTranslatedResult] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Standard Q&A processor calling server endpoint
  const handleQaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || isAnswering) return;

    const userMsgText = qaInput.trim();
    setQaInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsgText }]);
    setIsAnswering(true);

    try {
      const response = await fetch('/api/ai/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsgText,
          history: chatHistory
        })
      });
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', text: data.response || "Erreur de décodage serveur." }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "Erreur de connexion avec le serveur Gemini IA. Le signal est instable." }]);
    } finally {
      setIsAnswering(false);
    }
  };

  // Translation processor calling server endpoint
  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translationText.trim() || isTranslating) return;
    setIsTranslating(true);
    setTranslatedResult('');

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translationText,
          targetLang
        })
      });
      const data = await response.json();
      setTranslatedResult(data.translatedText || "Échec.");
    } catch {
      setTranslatedResult("Erreur lors de la traduction (serveur instable).");
    } finally {
      setIsTranslating(false);
    }
  };

  const triggerCopy = () => {
    if (!translatedResult) return;
    navigator.clipboard.writeText(translatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-assistant-view" className="space-y-6">
      
      {/* View Header with Subtabs switcher */}
      <div id="ai-view-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
            Assistant Académique Intelligent
          </h1>
          <p className="text-sm text-slate-400">Résumez, questionnez et traduisez vos cours instantanément grâce au moteur de raisonnement Gemini 3.5.</p>
        </div>

        {/* Local subtabs selector */}
        <div id="ai-tabs-picker" className="inline-flex bg-slate-850 rounded-xl p-1 shrink-0 border border-slate-750">
          <button
            id="ai-tab-qa-btn"
            onClick={() => setActiveSubTab('qa')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeSubTab === 'qa' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            Tuteur Interactif (Q/R)
          </button>
          <button
            id="ai-tab-translate-btn"
            onClick={() => setActiveSubTab('translate')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeSubTab === 'translate' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            Traducteur Fr/Sw/En
          </button>
        </div>
      </div>

      {/* Pane 1 : Interactive Q&A Chat */}
      {activeSubTab === 'qa' && (
        <section id="ai-qa-workspace" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chat dialog panel */}
          <div id="chat-scroller-panel" className="lg:col-span-2 bg-slate-850 rounded-2xl border border-slate-800 flex flex-col justify-between h-112 shadow-sm">
            
            {/* Thread scroller wrapper */}
            <div id="chat-messages" className="flex-1 p-5 space-y-4 overflow-y-auto max-h-80">
              {chatHistory.map((h, idx) => (
                <div key={idx} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-lg text-sm whitespace-pre-wrap leading-relaxed shadow-sm flex flex-col gap-1 ${h.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none font-sans' : 'bg-slate-800 text-slate-200 border border-slate-705 rounded-bl-none font-sans'}`}>
                    <span className="font-semibold text-[10px] uppercase font-mono tracking-widest text-slate-400">
                      {h.role === 'user' ? 'Moi' : 'Gemini Tuteur'}
                    </span>
                    <p className="text-xs pt-0.5">{h.text}</p>
                  </div>
                </div>
              ))}
              
              {isAnswering && (
                <div className="flex justify-start">
                  <div className="p-4 bg-slate-800 text-slate-400 rounded-2xl rounded-bl-none border border-slate-705 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span className="text-xs font-mono">Gemini est en train de formuler sa réponse pédagogique...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form control messaging widget */}
            <form id="qa-query-form" onSubmit={handleQaSubmit} className="p-4 border-t border-slate-800 bg-slate-900/30 flex gap-3 text-sm">
              <input 
                type="text" 
                value={qaInput}
                onChange={e => setQaInput(e.target.value)}
                placeholder="Posez votre question (e.g. Qu'est-ce qu'une structure linéaire de file ?)"
                required
                className="flex-1 bg-slate-800 border border-slate-705 rounded-xl px-4 py-2.5 text-white placeholder-slate-505 focus:outline-none focus:border-emerald-500 text-xs"
              />
              <button
                type="submit"
                disabled={isAnswering}
                className="bg-emerald-600 hover:bg-emerald-555 text-white p-2.5 rounded-xl text-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4 animate-pulse" />
              </button>
            </form>
          </div>

          {/* Guidelines & Quick Q&A suggest widgets on right column */}
          <div id="ai-suggest-column" className="space-y-4 text-sm bg-slate-850 p-5 rounded-2xl border border-slate-800 shadow-sm h-fit">
            <h3 className="font-bold text-white flex items-center gap-1.5 leading-snug">
              <HelpCircle className="w-4 h-4 text-emerald-350 shrink-0 animate-bounce" />
              Sujets d'intérêts courants
            </h3>
            <p className="text-xs text-slate-400">Cliquez sur un modèle ci-dessous pour l'envoyer comme question instantanée d'étude :</p>
            
            <div className="space-y-2 pt-2.5">
              {[
                { label: "Explique l'importance du Lithium à Manono", q: "Dis-moi en quoi consistent les pegmatites de Manono et leur importance en géologie minière." },
                { label: "Explique l'agriculture des berges à Kalemie", q: "Quelles sont les bonnes pratiques d'irrigation et de cultures maraîchères sur les pentes près du Lac Tanganyika ?" },
                { label: "Qu'est-ce qu'une complexité en O(N log N) ?", q: "Peux-tu m'expliquer de manière très simple avec des cas pratiques d'algorithmique la complexité temporelle asymptotique en O(N log N) ?" }
              ].map((sug, sIdx) => (
                <button
                  key={sIdx}
                  id={`sug-btn-${sIdx}`}
                  onClick={() => setQaInput(sug.q)}
                  className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-705/85 transition-colors text-xs text-slate-300 block font-medium"
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pane 2 : Linguistic translation module */}
      {activeSubTab === 'translate' && (
        <section id="ai-translate-workspace" className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-sm">
          
          {/* Source Input text column */}
          <div id="translation-input-box" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Langue de départ : Français</label>
              <div className="flex gap-2 items-center text-xs">
                <span className="text-slate-400">Traduire vers :</span>
                <select 
                  value={targetLang}
                  onChange={e => setTargetLang(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                >
                  <option value="Swahili">Swahili de Tanganyika</option>
                  <option value="English">Anglais Académique</option>
                </select>
              </div>
            </div>

            <textarea
              value={translationText}
              onChange={e => setTranslationText(e.target.value)}
              placeholder="Saisissez en français l'expression ou le support pédagogique du cours..."
              rows={6}
              className="w-full bg-slate-800 border border-slate-705 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
            />

            <button
              id="submit-translate-btn"
              onClick={handleTranslate}
              disabled={isTranslating || !translationText}
              className="bg-emerald-600 hover:bg-emerald-555 disabled:bg-slate-755 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 self-end"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Traitement IA linguistique...</span>
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4 shrink-0" />
                  <span>Traduire maintenant</span>
                </>
              )}
            </button>
          </div>

          {/* Results column */}
          <div id="translation-output-box" className="p-4 bg-slate-800/80 rounded-2xl border border-slate-705 flex flex-col justify-between h-fit min-h-64">
            <div className="space-y-3">
              <header className="flex justify-between items-center border-b border-slate-700/60 pb-2 bg-transparent">
                <span className="text-xs font-mono font-bold text-emerald-400 capitalize bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                  {targetLang} Résultat
                </span>
                
                {translatedResult && (
                  <button
                    id="copy-translation-btn"
                    onClick={triggerCopy}
                    className="p-1 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
                    title="Copier le texte traduit"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-450" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </header>

              <div className="text-sm font-sans text-slate-205 leading-relaxed font-medium whitespace-pre-wrap">
                {translatedResult || (
                  <div className="text-xs text-slate-500 select-none flex items-center gap-2 py-8">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Cliquez sur Traduire pour générer automatiquement l'interprétation Swahili / Anglais.</span>
                  </div>
                )}
              </div>
            </div>

            {translatedResult && (
              <footer className="pt-2 text-[10px] text-slate-450 font-mono italic">
                Réalisé à l'aide de l'API de traitement de langage naturel Gemini.
              </footer>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
