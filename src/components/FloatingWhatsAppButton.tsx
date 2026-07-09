import React, { useState } from 'react';
import { MessageSquare, Send, X, ShieldCheck } from 'lucide-react';

export default function FloatingWhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; time: string }>>([
    {
      text: "Bonjour et bienvenue à l'Université de Kalemie (UNIKAL) ! 🎓 Comment pouvons-nous vous aider dans vos démarches aujourd'hui ? Secrétariat en ligne.",
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const typed = inputValue.toLowerCase();
    setInputValue('');

    // Generate smart simulated reply
    setTimeout(() => {
      let replyText = "Merci pour votre message. Notre secrétariat académique prend note de votre demande. Vous pouvez aussi nous joindre au rectorat@unikal.ac.cd ou par téléphone au +243 81 037 0286. 🌟";
      
      if (typed.includes('inscri') || typed.includes('admiss') || typed.includes('dépos') || typed.includes('candidat')) {
        replyText = "Les inscriptions pour l'année académique 2025-2026 sont ouvertes ! Vous pouvez déposer votre candidature directement en ligne en cliquant sur le bouton d'inscription de notre site. C'est rapide et sécurisé. 💻";
      } else if (typed.includes('frais') || typed.includes('pay') || typed.includes('prix') || typed.includes('coût')) {
        replyText = "Nos frais de scolarité annuels varient entre $280 et $380 selon la faculté d'orientation (médecine, agronomie, appliquée, etc.). Le paiement s'effectue en 3 tranches à la banque. Consultez notre page 'Admissions > Frais de Scolarité' pour plus de détails. 💰";
      } else if (typed.includes('facult') || typed.includes('cours') || typed.includes('option') || typed.includes('fili')) {
        replyText = "L'UNIKAL propose 6 facultés d'excellence sous le système LMD : Santé (avec Cliniques Universitaires), Économie & Gestion, Droit, Sciences Appliquées, Agronomie, et Lettres/Arts. Toutes nos filières sont agréées. 📚";
      } else if (typed.includes('sante') || typed.includes('medecin') || typed.includes('clinique') || typed.includes('hopital')) {
        replyText = "Notre Faculté de Médecine/Santé bénéficie du support direct des Cliniques Universitaires de Kalemie, notre hôpital d'application de pointe sur le campus. Un cadre unique dans la province ! 🏥";
      }

      const adminReply = {
        text: replyText,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, adminReply]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] font-sans">
      
      {/* 1. WHATSAPP EXPANDED CONVERSATION WINDOW */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[450px] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col mb-4 animate-in slide-in-from-bottom-6 duration-200">
          
          {/* Header of WhatsApp box */}
          <div className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center font-black text-xs shrink-0 select-none">
                UNI
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide">Secrétariat UNIKAL</h4>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-ping"></span>
                  <span className="text-[10px] text-emerald-100 font-bold">Assistance en ligne</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer"
              aria-label="Fermer le chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat history list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs relative shadow-xs ${
                  msg.isUser 
                    ? 'bg-emerald-100 text-slate-800 self-end rounded-tr-none' 
                    : 'bg-white text-slate-800 self-start rounded-tl-none border border-slate-100/60'
                }`}
              >
                <p className="leading-relaxed font-semibold">{msg.text}</p>
                <span className="block text-[8px] text-slate-400 text-right mt-1.5 font-mono">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Form input messaging */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input 
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
              placeholder="Posez votre question académique..."
            />
            <button 
              type="submit"
              className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-md shrink-0"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* 2. FLOATING GREEN CHAT BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer relative group border border-emerald-500/10"
        aria-label="Discuter avec l'administration sur WhatsApp"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        
        {/* Unread dot notice */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 font-black text-[9px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
            1
          </span>
        )}
      </button>

    </div>
  );
}
