import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Globe 
} from 'lucide-react';

interface UnikalFooterProps {
  onNavigate: (view: string) => void;
}

export default function UnikalFooter({ onNavigate }: UnikalFooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-16 pb-8 px-4 md:px-8 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Colonne 1 : Logo & Slogan */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-amber-400 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
              PE
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-wide uppercase">Plateforme d'Étude</h3>
              <p className="text-[10px] text-slate-400 font-semibold leading-tight">Plateforme de formation d'Élite</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "Paix, Travail, Excellence" <br />
            L'excellence académique au service de la nation.
          </p>
          <div className="text-xs text-slate-400 space-y-1.5 pt-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Avenue de la Paix, Quartier Kalala, Ville de Plateforme d'Étude, Province du Tanganyika, République Démocratique du Congo.</span>
            </div>
          </div>
        </div>

        {/* Colonne 2 : Liens Rapides */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider border-b border-slate-800 pb-2">
            Liens Utiles
          </h3>
          <ul className="text-xs space-y-2.5 font-medium">
            <li>
              <button onClick={() => handleLinkClick('about-unik')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer text-left">
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-500 transition-colors" />
                <span>À Propos de la Plateforme d'Étude</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('admissions-conditions')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer text-left">
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-500 transition-colors" />
                <span>Admissions & Inscriptions</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('news-archive')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer text-left">
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-500 transition-colors" />
                <span>Actualités de la Plateforme d'Étude</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('contact')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group cursor-pointer text-left">
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-500 transition-colors" />
                <span>Secrétariat / Contact</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Contacts & Réseaux Sociaux */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider border-b border-slate-800 pb-2">
            Contact Direct
          </h3>
          <ul className="text-xs space-y-3">
            <li>
              <a href="mailto:contact@plateformedetude.org" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>contact@plateformedetude.org</span>
              </a>
            </li>
            <li>
              <a href="tel:+243812345678" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+243 81 234 5678</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400 shrink-0" />
              <span>www.plateformedetude.org</span>
            </li>
          </ul>

          <div className="pt-3">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2.5">Suivez-nous</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com/plateformedetude" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all cursor-pointer"
                aria-label="Facebook Plateforme d'Étude"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/plateformedetude" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                aria-label="Twitter Plateforme d'Étude"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com/plateformedetude" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-500 transition-all cursor-pointer"
                aria-label="YouTube Plateforme d'Étude"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Colonne 4 : Carte interactive */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider border-b border-slate-800 pb-2">
            Localisation (Plateforme d'Étude)
          </h3>
          <div className="rounded-xl overflow-hidden border border-slate-800 h-36 relative shadow-inner">
            {/* Embedded map showing location */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.733230691763!2d29.1834522!3d-5.9004543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c4391ef1fc5773%3A0xe543c7b2cc89d4ee!2sKalemie!5e0!3m2!1sfr!2scd!4v1700000000000!5m2!1sfr!2scd" 
              className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all"
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Plan d'accès Plateforme d'Étude"
            />
            <div className="absolute bottom-2 left-2 bg-slate-950/95 border border-slate-800 px-2 py-0.5 rounded text-[8px] font-mono text-amber-400">
              Tanganyika, RDC
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
        <p>© {currentYear} Plateforme d'Étude. Tous droits réservés.</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:underline hover:text-slate-400">Mentions Légales</a>
          <span>•</span>
          <a href="#cookies" className="hover:underline hover:text-slate-400">Charte de Confidentialité</a>
          <span>•</span>
          <span className="text-amber-500 font-bold">"Paix, Travail, Excellence"</span>
        </div>
      </div>
    </footer>
  );
}
