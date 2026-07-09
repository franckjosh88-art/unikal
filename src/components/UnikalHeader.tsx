import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  ChevronDown, 
  Menu, 
  X, 
  ExternalLink, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  Scale, 
  Cpu, 
  Leaf, 
  GraduationCap, 
  Info, 
  Clock, 
  Compass, 
  MapPin, 
  Globe, 
  Users, 
  MessageSquare, 
  FileText 
} from 'lucide-react';

interface UnikalHeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onOpenLms: () => void;
}

export default function UnikalHeader({ onNavigate, currentView, onOpenLms }: UnikalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordions, setMobileAccordions] = useState<Record<string, boolean>>({});

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const facultiesList = [
    { id: 'sante', name: 'Sciences de la Santé', icon: Activity },
    { id: 'economie', name: 'Sciences Économiques & Gestion', icon: TrendingUp },
    { id: 'droit', name: 'Sciences Juridiques & Politiques', icon: Scale },
    { id: 'appliquees', name: 'Sciences Appliquées', icon: Cpu },
    { id: 'agronomie', name: 'Sciences Agronomiques', icon: Leaf },
    { id: 'lettres', name: 'Lettres, Langues & Arts', icon: BookOpen }
  ];

  return (
    <header className="w-full z-50 relative font-sans">
      {/* 1. TOP BAR (Fond bleu très foncé / marine) */}
      <div className="w-full bg-slate-950 text-slate-200 text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center border-b border-slate-800/60 gap-2">
        {/* Contacts gauche */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] md:text-xs">
          <a href="mailto:rectorat@unikal.ac.cd" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <span>rectorat@unikal.ac.cd</span>
          </a>
          <a href="tel:+243810370286" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>+243 81 037 0286</span>
          </a>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:inline text-[11px] text-slate-400 italic">Devise : <strong>"Scientia Splendet Conscientia"</strong></span>
        </div>

        {/* Liens d'accès rapides droite */}
        <div className="hidden md:flex md:flex-row md:items-center md:flex-nowrap gap-4 lg:gap-6 font-bold text-[10px] tracking-wider text-slate-300 whitespace-nowrap">
          <button 
            onClick={onOpenLms} 
            className="px-2.5 py-0.5 rounded bg-blue-600/90 text-white hover:bg-blue-600 transition-all shadow-sm uppercase text-[10px] cursor-pointer hover:scale-105 shrink-0"
          >
            💻 PORTAIL EN LIGNE (LMS)
          </button>
          <button 
            onClick={onOpenLms} 
            className="hover:text-amber-400 transition-colors uppercase cursor-pointer shrink-0"
          >
            E-Learning
          </button>
          <button 
            onClick={() => handleLinkClick('library-portal')} 
            className="hover:text-amber-400 transition-colors uppercase cursor-pointer shrink-0"
          >
            Bibliothèque
          </button>
          <a 
            href="https://revues.unikal.ac.cd/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-amber-400 transition-colors flex items-center gap-1 uppercase shrink-0"
          >
            Revues Scientifiques <ExternalLink className="w-2.5 h-2.5 shrink-0" />
          </a>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL */}
      <div className="w-full bg-white text-slate-900 py-3.5 px-4 md:px-8 flex justify-between items-center border-b border-slate-100 shadow-xs">
        {/* Logo circulaire UNIKAL & Titre */}
        <div 
          onClick={() => handleLinkClick('home')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo UNIKAL de type emblème */}
          <div className="w-12 h-12 rounded-full bg-blue-900 border-2 border-amber-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md overflow-hidden relative shrink-0 transition-transform duration-300 group-hover:scale-105">
            <div className="absolute inset-0 bg-radial from-blue-800 to-blue-950"></div>
            <div className="relative text-center leading-none flex flex-col items-center">
              <span className="text-[10px] text-amber-400 tracking-tighter">UNI</span>
              <span className="text-[13px] tracking-wide font-black">KAL</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase font-extrabold text-blue-900 tracking-wider">Université de Kalemie</span>
              <span className="px-1.5 py-0.5 bg-amber-400 text-[9px] text-blue-950 font-black rounded tracking-widest uppercase">RDC</span>
            </div>
            <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-900 transition-colors">
              UNIKAL
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-500 italic font-mono font-medium leading-none">
              Scientia Splendet Conscientia
            </p>
          </div>
        </div>

        {/* Bouton de contact rapide d'admission */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Besoin d'aide ?</span>
            <span className="text-sm font-extrabold text-blue-900 hover:text-blue-800 transition-colors">+243 81 037 0286</span>
          </div>
          <button 
            onClick={() => handleLinkClick('admissions-online')} 
            className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm border border-amber-500/20 hover:scale-103 transition-all cursor-pointer"
          >
            Inscriptions Ouvertes 2025-2026
          </button>
        </div>

        {/* Burger Mobile Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-blue-900 transition-colors focus:outline-hidden"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 3. MENU DE NAVIGATION HORIZONTAL STICKY */}
      <nav className="hidden lg:block w-full bg-blue-900 border-b border-blue-950 shadow-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center">
            {/* À propos Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer ${currentView.startsWith('about-') ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}>
                <span>À Propos</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white border border-slate-100 rounded-b-xl shadow-2xl py-2 z-50 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-left">
                <button onClick={() => handleLinkClick('about-unik')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-900" /> Qui sommes-nous ?
                </button>
                <button onClick={() => handleLinkClick('about-rector')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-900" /> Mot du Recteur
                </button>
                <button onClick={() => handleLinkClick('about-committee')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-900" /> Comité de Gestion
                </button>
                <button onClick={() => handleLinkClick('about-campus')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-900" /> Notre Campus
                </button>
                <button onClick={() => handleLinkClick('about-virtual')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-blue-900" /> Visite Virtuelle 3D
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button onClick={() => handleLinkClick('contact')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-900" /> Contact & Localisation
                </button>
              </div>
            </li>

            {/* Admissions Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('admissions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer ${currentView.startsWith('admissions-') ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}>
                <span>Admissions</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              <div className="absolute left-0 mt-0 w-60 bg-white border border-slate-100 rounded-b-xl shadow-2xl py-2 z-50 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-left">
                <button onClick={() => handleLinkClick('admissions-conditions')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Conditions d'accès</button>
                <button onClick={() => handleLinkClick('admissions-calendar')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Calendrier Académique</button>
                <button onClick={() => handleLinkClick('admissions-fees')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Frais de Scolarité 2025-2026</button>
                <div className="border-t border-slate-100 my-1"></div>
                <button onClick={() => handleLinkClick('admissions-online')} className="w-full text-left px-4 py-2 text-xs text-blue-900 hover:bg-slate-50 font-bold bg-amber-400/10">Inscriptions en Ligne</button>
              </div>
            </li>

            {/* Facultés Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('faculties')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer ${currentView.startsWith('faculty-') ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}>
                <span>Facultés</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              <div className="absolute left-0 mt-0 w-80 bg-white border border-slate-100 rounded-b-xl shadow-2xl py-2.5 z-50 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-left">
                <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 border-b border-slate-50 mb-1.5">
                  6 Facultés d'Excellence UNIKAL
                </div>
                {facultiesList.map((fac) => {
                  const FacIcon = fac.icon;
                  return (
                    <button 
                      key={fac.id}
                      onClick={() => handleLinkClick(`faculty-${fac.id}`)} 
                      className="w-full text-left px-4 py-2 text-[11px] text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-bold flex items-center gap-2.5"
                    >
                      <span className="p-1 rounded bg-blue-50 text-blue-900">
                        <FacIcon className="w-3.5 h-3.5" />
                      </span>
                      <span>{fac.name}</span>
                    </button>
                  );
                })}
              </div>
            </li>

            {/* Recherche Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('research')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer ${currentView.startsWith('research-') ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}>
                <span>Recherche</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              <div className="absolute left-0 mt-0 w-52 bg-white border border-slate-100 rounded-b-xl shadow-2xl py-2 z-50 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-left">
                <button onClick={() => handleLinkClick('research-projects')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-900" /> Projets en cours</button>
                <button onClick={() => handleLinkClick('research-publications')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-900" /> Publications</button>
                <button onClick={() => handleLinkClick('research-database')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-blue-900" /> Base de données</button>
              </div>
            </li>

            {/* Cliniques Universitaires (Spécificité Forte - Page dédiée !) */}
            <li>
              <button 
                onClick={() => handleLinkClick('cliniques-universitaires')} 
                className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1.5 cursor-pointer relative ${currentView === 'cliniques-universitaires' ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}
              >
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cliniques Universitaires</span>
                <span className="absolute -top-1.5 -right-2 px-1 py-0.5 bg-emerald-500 text-[8px] text-white font-black rounded-sm uppercase tracking-widest scale-90">Hôpital</span>
              </button>
            </li>

            {/* Vie Étudiante */}
            <li 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('student-life')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer ${currentView.startsWith('student-life-') ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}>
                <span>Vie Étudiante</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              <div className="absolute left-0 mt-0 w-52 bg-white border border-slate-100 rounded-b-xl shadow-2xl py-2 z-50 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-left">
                <button onClick={() => handleLinkClick('student-life-housing')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Logements</button>
                <button onClick={() => handleLinkClick('student-life-culture')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Sport & Culture</button>
                <button onClick={() => handleLinkClick('student-life-associative')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Vie Associative</button>
              </div>
            </li>

            {/* Actualités */}
            <li>
              <button 
                onClick={() => handleLinkClick('news-archive')} 
                className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all cursor-pointer ${currentView === 'news-archive' ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}
              >
                Actualités
              </button>
            </li>

            {/* International */}
            <li 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('international')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`px-4 py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer ${currentView.startsWith('international-') ? 'bg-blue-950 text-amber-400 border-b-2 border-amber-400' : ''}`}>
                <span>International</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>
              <div className="absolute right-0 mt-0 w-52 bg-white border border-slate-100 rounded-b-xl shadow-2xl py-2 z-50 transform scale-95 opacity-0 pointer-events-none group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 origin-top-right">
                <button onClick={() => handleLinkClick('international-partnerships')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Partenariats</button>
                <button onClick={() => handleLinkClick('international-exchanges')} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-semibold">Échanges Universitaires</button>
              </div>
            </li>
          </ul>

          {/* Slogan d'entête à côté */}
          <div className="hidden xl:block text-[11px] italic text-slate-300 font-medium tracking-tight">
            "La Science s'éclaire par la Conscience"
          </div>
        </div>
      </nav>

      {/* 4. MOBILE ACCORDION DRAWER VIEW */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-0 right-0 bg-white border-b border-slate-200 shadow-2xl z-40 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-4 space-y-3">
            {/* Boutons rapides mobiles */}
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold tracking-wider">
              <button onClick={onOpenLms} className="p-2 bg-blue-600 text-white rounded-lg uppercase">Portail LMS</button>
              <button onClick={() => handleLinkClick('admissions-online')} className="p-2 bg-amber-400 text-slate-950 rounded-lg uppercase">S'inscrire</button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Accordion Portails & E-Services */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('services')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>Portails & E-Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['services'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['services'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    <button onClick={onOpenLms} className="text-left py-1 hover:text-blue-900 font-semibold flex items-center gap-1.5 cursor-pointer">💻 Portail en ligne (LMS)</button>
                    <button onClick={onOpenLms} className="text-left py-1 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer">E-Learning</button>
                    <button onClick={() => handleLinkClick('library-portal')} className="text-left py-1 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer">Bibliothèque</button>
                    <a 
                      href="https://revues.unikal.ac.cd/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-left py-1 hover:text-blue-900 flex items-center gap-1.5"
                    >
                      <span>Revues Scientifiques</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                    </a>
                  </div>
                )}
              </div>

              {/* Accordion À Propos */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('about')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>À Propos</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['about'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['about'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    <button onClick={() => handleLinkClick('about-unik')} className="text-left py-1 hover:text-blue-900">Qui sommes-nous ?</button>
                    <button onClick={() => handleLinkClick('about-rector')} className="text-left py-1 hover:text-blue-900">Mot du Recteur</button>
                    <button onClick={() => handleLinkClick('about-committee')} className="text-left py-1 hover:text-blue-900">Comité de Gestion</button>
                    <button onClick={() => handleLinkClick('about-campus')} className="text-left py-1 hover:text-blue-900">Notre Campus</button>
                    <button onClick={() => handleLinkClick('about-virtual')} className="text-left py-1 hover:text-blue-900">Visite Virtuelle 3D</button>
                    <button onClick={() => handleLinkClick('contact')} className="text-left py-1 hover:text-blue-900 font-bold text-blue-900">Contact & Plan d'accès</button>
                  </div>
                )}
              </div>

              {/* Accordion Admissions */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('admissions')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>Admissions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['admissions'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['admissions'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    <button onClick={() => handleLinkClick('admissions-conditions')} className="text-left py-1 hover:text-blue-900">Conditions d'accès</button>
                    <button onClick={() => handleLinkClick('admissions-calendar')} className="text-left py-1 hover:text-blue-900">Calendrier Académique</button>
                    <button onClick={() => handleLinkClick('admissions-fees')} className="text-left py-1 hover:text-blue-900">Frais de Scolarité</button>
                    <button onClick={() => handleLinkClick('admissions-online')} className="text-left py-1 text-blue-900 font-bold bg-amber-400/20 px-2 py-0.5 rounded">Inscription en Ligne</button>
                  </div>
                )}
              </div>

              {/* Accordion Facultés */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('faculties')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>Facultés</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['faculties'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['faculties'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    {facultiesList.map((fac) => (
                      <button 
                        key={fac.id}
                        onClick={() => handleLinkClick(`faculty-${fac.id}`)} 
                        className="text-left py-1 hover:text-blue-900 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-900 rounded-full"></span>
                        <span>{fac.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cliniques Universitaires */}
              <div className="py-2.5">
                <button 
                  onClick={() => handleLinkClick('cliniques-universitaires')}
                  className="w-full text-left text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cliniques Universitaires</span>
                </button>
              </div>

              {/* Accordion Recherche */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('research')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>Recherche</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['research'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['research'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    <button onClick={() => handleLinkClick('research-projects')} className="text-left py-1 hover:text-blue-900">Projets en cours</button>
                    <button onClick={() => handleLinkClick('research-publications')} className="text-left py-1 hover:text-blue-900">Publications</button>
                    <button onClick={() => handleLinkClick('research-database')} className="text-left py-1 hover:text-blue-900">Base de données</button>
                  </div>
                )}
              </div>

              {/* Accordion Vie Étudiante */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('student-life')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>Vie Étudiante</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['student-life'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['student-life'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    <button onClick={() => handleLinkClick('student-life-housing')} className="text-left py-1 hover:text-blue-900">Logements</button>
                    <button onClick={() => handleLinkClick('student-life-culture')} className="text-left py-1 hover:text-blue-900">Sport & Culture</button>
                    <button onClick={() => handleLinkClick('student-life-associative')} className="text-left py-1 hover:text-blue-900">Vie Associative</button>
                  </div>
                )}
              </div>

              {/* Actualités */}
              <div className="py-2.5">
                <button 
                  onClick={() => handleLinkClick('news-archive')}
                  className="w-full text-left text-xs font-bold uppercase text-slate-800"
                >
                  Actualités
                </button>
              </div>

              {/* Accordion International */}
              <div className="py-2.5">
                <button 
                  onClick={() => toggleMobileAccordion('international')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-800"
                >
                  <span>International</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileAccordions['international'] ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordions['international'] && (
                  <div className="pl-3 mt-2 space-y-2 flex flex-col border-l border-slate-100 text-xs text-slate-600">
                    <button onClick={() => handleLinkClick('international-partnerships')} className="text-left py-1 hover:text-blue-900">Partenariats</button>
                    <button onClick={() => handleLinkClick('international-exchanges')} className="text-left py-1 hover:text-blue-900">Échanges Universitaires</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
