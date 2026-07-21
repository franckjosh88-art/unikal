import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Activity, 
  BookOpen, 
  TrendingUp, 
  Scale, 
  Cpu, 
  Leaf, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  X, 
  Flame,
  User,
  ChevronDown,
  ChevronUp,
  BookMarked,
  Trophy
} from 'lucide-react';
import facultiesData from '../data/faculties.json';
import newsData from '../data/news.json';
import partnersData from '../data/partners.json';
import staffData from '../data/staff.json';

interface SectionProps {
  onNavigate: (view: string) => void;
  onSelectFaculty?: (id: string) => void;
}

// 1. SECTION "POURQUOI LE LYCÉE AMANI"
export function PourquoiLycetAmani() {
  const points = [
    {
      title: "Excellence Académique",
      desc: "Un taux de réussite exceptionnel de 100% à l'Examen d'État et des cours interactifs conformes aux exigences modernes de l'enseignement.",
      icon: Award,
      color: "bg-blue-500/10 text-blue-900 border-blue-500/20"
    },
    {
      title: "Discipline & Rigueur",
      desc: "Un encadrement moral, éthique et civique rigoureux inspiré des valeurs catholiques pour forger des citoyens intègres.",
      icon: ShieldCheck,
      color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    },
    {
      title: "Laboratoires Modernes",
      desc: "Une formation pratique renforcée par notre nouveau laboratoire équipé de chimie et de physique pour les sciences appliquées.",
      icon: Sparkles,
      color: "bg-amber-500/10 text-amber-700 border-amber-500/20"
    },
    {
      title: "Transition Numérique",
      desc: "Une salle informatique autonome dotée de 120 ordinateurs solaires, d'une bibliothèque numérique locale et d'un portail LMS.",
      icon: Cpu,
      color: "bg-purple-500/10 text-purple-700 border-purple-500/20"
    }
  ];

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase text-blue-900 tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">Pourquoi choisir notre établissement ?</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Le Sommet de l'Éducation au Tanganyika</h2>
          <p className="text-sm text-slate-500 font-medium">La Plateforme d'Étude unit la rigueur morale et intellectuelle à la technologie éducative pour former les élites de demain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${pt.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2.5">{pt.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{pt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 2. SECTION "NOS SECTIONS D'ÉTUDES"
export function NosFacultes({ onNavigate }: SectionProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return Cpu;
      case 'TrendingUp': return TrendingUp;
      case 'BookOpen': return BookOpen;
      default: return BookOpen;
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white border-y border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase text-blue-900 tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">3 Sections d'Excellence</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Des Filières d'Avenir</h2>
          <p className="text-sm text-slate-500 font-medium">Découvrez nos trois sections officiellement agréées, encadrées par un corps professoral d'exception.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultiesData.map((fac) => {
            const FacIcon = getIcon(fac.iconName);
            return (
              <div key={fac.id} className="bg-slate-50/60 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-lg bg-blue-900 text-white flex items-center justify-center border-b-2 border-amber-400">
                    <FacIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-900 transition-colors">{fac.title}</h3>
                    <p className="text-[11px] font-mono text-blue-900 mt-1 font-bold">Enseignement Secondaire & Humanités</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{fac.shortDescription}</p>
                </div>
                <div className="pt-6 border-t border-slate-100/60 mt-6 flex justify-between items-center text-xs">
                  <span className="font-mono text-slate-400 font-semibold">{fac.stats.students} Élèves</span>
                  <button 
                    onClick={() => {
                      onNavigate(`faculty-${fac.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 font-black text-blue-900 hover:text-amber-500 transition-colors group/btn cursor-pointer"
                  >
                    <span>Découvrir</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 3. SECTION "MOT DE LA PRÉFÈTE"
export function MotDuRecteur({ onNavigate }: SectionProps) {
  const r = staffData.rector;
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-slate-900 text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-950/70 z-0"></div>
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Photo de la Préfète (Cadre doré élégant) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-4 border-amber-400 bg-slate-950 shadow-2xl shrink-0 flex flex-col items-center justify-center p-6 text-center group">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-full text-amber-400 mb-4 group-hover:scale-105 transition-transform duration-500">
              <User className="w-16 h-16" />
            </div>
            <div className="space-y-1">
              <span className="block text-xs font-black text-amber-400 uppercase tracking-wider">{r.title}</span>
              <span className="block text-sm font-mono text-white font-bold">{r.name}</span>
            </div>
          </div>
        </div>

        {/* Message / Citation */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-block px-3 py-1 text-[10px] font-black bg-amber-400 text-slate-950 rounded-full tracking-wider uppercase">
            Mot d'Accueil de la Préfète
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Bienvenue sur le portail numérique de la Plateforme d'Étude
          </h2>
          
          <div className="relative">
            <span className="absolute -top-6 -left-3 text-7xl text-amber-400/20 font-serif leading-none">“</span>
            <blockquote className="text-base md:text-lg italic font-medium text-slate-200 leading-relaxed pl-4 border-l-2 border-amber-400/80">
              {r.citation}
            </blockquote>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
            Fidèles à notre devise <strong className="text-amber-400">Paix, Travail, Excellence</strong>, nous croyons fermement à l'alliance de la rigueur morale, de la discipline chrétienne et des technologies modernes numériques pour préparer nos élèves à réussir brillamment les examens nationaux et à intégrer les meilleures filières d'avenir.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                onNavigate('about-rector');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 self-start shadow-md hover:scale-103"
            >
              <span>Lire le message d'accueil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onNavigate('about-committee');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 self-start hover:scale-103"
            >
              <span>Voir le Comité de Direction</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4. SECTION GALERIE PHOTO (AVEC LIGHTBOX)
export function CampusGallery() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      title: "Bibliothèque Numérique Plateforme d'Étude",
      desc: "Accès à des milliers de manuels scolaires et d'encyclopédies interactives."
    },
    {
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      title: "Nouveau Laboratoire de Chimie et Physique",
      desc: "Installations pratiques équipées pour la section Scientifique."
    },
    {
      src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800",
      title: "Salle Informatique Alimentée au Solaire",
      desc: "120 ordinateurs légers connectés en réseau pour l'apprentissage du LMS."
    },
    {
      src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      title: "Mini-Entreprises de Gestion",
      desc: "Exercices pratiques OHADA de simulation commerciale par nos terminales."
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      title: "Salles de Classe Aérées",
      desc: "Un environnement d'apprentissage calme, propice à la concentration académique."
    },
    {
      src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
      title: "Activités Culturelles & Théâtre",
      desc: "Clubs culturels et d'art oratoire pour stimuler l'éloquence de nos élèves."
    }
  ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-slate-50 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase text-blue-900 tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">Vie de l'Établissement</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Galerie Photo de l'Établissement</h2>
          <p className="text-sm text-slate-500 font-medium">Découvrez notre campus, nos infrastructures de pointe et la vie animée de nos élèves à la Plateforme d'Étude.</p>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => openLightbox(idx)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs cursor-pointer group hover:shadow-lg transition-all duration-300 relative"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-950/40 transition-colors duration-300"></div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-xs border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xs font-black text-slate-900 mb-1">{img.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{img.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Fermer la lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-4 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Précédent"
          >
            <span className="text-lg font-bold">←</span>
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <img 
              src={images[lightboxIndex].src} 
              alt={images[lightboxIndex].title} 
              className="max-h-[70vh] max-w-full object-contain rounded-lg border border-white/10 shadow-2xl"
            />
            <div className="text-center text-white space-y-1 px-4 max-w-xl">
              <h3 className="text-sm font-black text-amber-400">{images[lightboxIndex].title}</h3>
              <p className="text-xs text-slate-300 font-medium">{images[lightboxIndex].desc}</p>
            </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-4 w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            aria-label="Suivant"
          >
            <span className="text-lg font-bold">→</span>
          </button>
        </div>
      )}
    </section>
  );
}

// 5. SECTION "ACTUALITÉS RÉCENTES"
export function ActualitesRecentes({ onNavigate }: SectionProps) {
  const sanitizeNewsList = (list: any[]) => {
    return list.map(item => {
      // Clear image if it's an Unsplash stock photo
      if (item.image && item.image.includes('unsplash.com')) {
        return { ...item, image: "" };
      }
      return item;
    });
  };

  const [allNews, setAllNews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('amani_news_list');
      if (saved) {
        return sanitizeNewsList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error reading local news list in ActualitesRecentes:", e);
    }
    return sanitizeNewsList(newsData);
  });

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('amani_news_list');
        if (saved) {
          setAllNews(sanitizeNewsList(JSON.parse(saved)));
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Also poll/check just in case of local actions
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-black uppercase text-blue-900 tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">Actualités de la Plateforme d'Étude</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dernières Nouvelles</h2>
            <p className="text-sm text-slate-500 font-medium">Suivez au quotidien l'actualité de nos sections, de nos laboratoires et de nos clubs sportifs.</p>
          </div>
          <button 
            onClick={() => {
              onNavigate('news-archive');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl border border-blue-900 hover:bg-blue-50 text-blue-900 text-xs font-bold flex items-center gap-1.5 transition-all self-start cursor-pointer hover:scale-103"
          >
            <span>Toutes les actualités</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* news items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.slice(0, visibleCount).map((item) => (
            <div key={item.id} className="bg-slate-50/40 rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-200 hover:bg-white shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full">
              <div className="flex flex-col h-full">
                {item.image && (
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-103 transition-transform duration-500" 
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-blue-900 text-white font-black text-[9px] uppercase tracking-wider rounded">
                      {item.category}
                    </span>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col space-y-3">
                  {!item.image && (
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-950 text-white font-black text-[9px] uppercase tracking-wider rounded">
                        {item.category}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Le {item.date}</span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900 leading-snug hover:text-blue-900 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3 flex-1">
                    {item.excerpt}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-slate-100/60 mt-4">
                <button 
                  onClick={() => {
                    onNavigate(`news-detail-${item.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-black text-blue-900 hover:text-amber-500 flex items-center gap-1 group/btn cursor-pointer"
                >
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {allNews.length > 3 && (
          <div className="flex justify-center pt-8 gap-4">
            {visibleCount < allNews.length ? (
              <button
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer hover:scale-103"
              >
                <span>Voir plus d'actualités</span>
                <ChevronDown className="w-4 h-4 text-amber-500 animate-bounce" />
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(3)}
                className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer hover:scale-103"
              >
                <span>Voir moins</span>
                <ChevronUp className="w-4 h-4 text-amber-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// 6. BANDEAU LOGOS PARTENAIRES (DÉFILEMENT HORIZONTAL INFINI AUTOMATIQUE)
export function PartnerSlider() {
  return (
    <section className="w-full py-10 px-4 md:px-8 bg-slate-50 border-b border-slate-100 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ils soutiennent la Plateforme d'Étude</span>
        </div>

        {/* Scrolling wrapper */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="flex gap-8 md:gap-12 animate-marquee items-center whitespace-nowrap">
            {[...partnersData, ...partnersData].map((p, idx) => (
              <div 
                key={idx} 
                className="inline-flex flex-col items-center justify-center px-6 py-3 bg-white border border-slate-100 rounded-xl shadow-xs shrink-0 select-none min-w-[170px]"
              >
                <span className="text-xs font-black text-blue-900 tracking-wider font-mono">{p.logoText}</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1 max-w-[150px] truncate text-center">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// 7. BANNIÈRE "ADMISSIONS OUVERTES" AVEC COMPTE À REBOURS
export function AdmissionsCountdown({ onNavigate }: SectionProps) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 45);

  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d > 0 ? d : 0,
        hours: h > 0 ? h : 0,
        minutes: m > 0 ? m : 0,
        seconds: s > 0 ? s : 0
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-blue-900 to-indigo-950 text-white py-12 px-6 md:px-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-3xl z-0 animate-pulse duration-5000"></div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="space-y-3 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider animate-bounce">
            <Flame className="w-3.5 h-3.5 fill-amber-950 text-amber-950 shrink-0" />
            <span>Admissions Ouvertes 2025-2026</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            Préparez l'avenir de votre enfant dès aujourd'hui !
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Les préinscriptions pour l'année scolaire 2025-2026 sont officiellement en cours. Inscrivez votre enfant en ligne en quelques clics ou déposez son dossier physique au secrétariat du lycée.
          </p>
        </div>

        {/* Countdown boxes */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/70 backdrop-blur-xs border border-white/10 rounded-2xl w-14 py-3 text-center shadow-xl">
              <span className="block text-xl font-mono font-black text-amber-400 leading-none">{timeLeft.days}</span>
              <span className="text-[8px] uppercase text-slate-400 font-bold tracking-wider mt-1 block">Jours</span>
            </div>
            <div className="bg-slate-950/70 backdrop-blur-xs border border-white/10 rounded-2xl w-14 py-3 text-center shadow-xl">
              <span className="block text-xl font-mono font-black text-amber-400 leading-none">{timeLeft.hours}</span>
              <span className="text-[8px] uppercase text-slate-400 font-bold tracking-wider mt-1 block">Heures</span>
            </div>
            <div className="bg-slate-950/70 backdrop-blur-xs border border-white/10 rounded-2xl w-14 py-3 text-center shadow-xl">
              <span className="block text-xl font-mono font-black text-amber-400 leading-none">{timeLeft.minutes}</span>
              <span className="text-[8px] uppercase text-slate-400 font-bold tracking-wider mt-1 block">Min</span>
            </div>
            <div className="bg-slate-950/70 backdrop-blur-xs border border-white/10 rounded-2xl w-14 py-3 text-center shadow-xl">
              <span className="block text-xl font-mono font-black text-amber-400 leading-none">{timeLeft.seconds}</span>
              <span className="text-[8px] uppercase text-slate-400 font-bold tracking-wider mt-1 block">Sec</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => {
                onNavigate('admissions-online');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>S'inscrire en Ligne</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onNavigate('admissions-conditions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all hover:scale-103 cursor-pointer text-center"
            >
              Consulter les Conditions
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

// 8. FORMULAIRE D'ADMINISTRATION POUR AJOUTER UNE ACTUALITÉ
interface AdminNewsFormProps {
  onNewsAdded?: () => void;
}

export function AdminNewsForm({ onNewsAdded }: AdminNewsFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Académique');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) return;

    // Get current news from localStorage
    let currentNews: any[] = [];
    try {
      const saved = localStorage.getItem('amani_news_list');
      currentNews = saved ? JSON.parse(saved) : newsData;
    } catch (err) {
      currentNews = newsData;
    }

    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newArticle = {
      id: `news-${Date.now()}`,
      title,
      date: formattedDate,
      category,
      excerpt,
      content,
      image: ""
    };

    const updatedNews = [newArticle, ...currentNews];

    try {
      localStorage.setItem('amani_news_list', JSON.stringify(updatedNews));
      setSuccess(true);
      setTitle('');
      setExcerpt('');
      setContent('');
      
      if (onNewsAdded) {
        onNewsAdded();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving news:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-xs font-sans">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-white font-black uppercase tracking-wider text-[11px]">Publier une Actualité</h4>
          <p className="text-[10px] text-slate-400">Ajouter un article d'actualité pour la Plateforme d'Étude</p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>L'actualité a été publiée avec succès ! Elle apparaît sur la page d'accueil.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-slate-400 font-bold block">Titre de l'Actualité</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Inauguration de la salle d'informatique solaire..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none placeholder-slate-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-bold block">Catégorie</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-medium"
            >
              <option value="Académique">Académique</option>
              <option value="Infrastructures">Infrastructures</option>
              <option value="Innovation">Innovation</option>
              <option value="Vie Scolaire">Vie Scolaire</option>
              <option value="Sport & Culture">Sport & Culture</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 font-bold block">Résumé Court</label>
          <textarea 
            required
            rows={2}
            maxLength={180}
            placeholder="Un paragraphe court pour la carte..."
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none placeholder-slate-500 font-medium leading-relaxed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-400 font-bold block">Contenu Détaillé de l'Article</label>
          <textarea 
            required
            rows={4}
            placeholder="Écrivez le communiqué détaillé..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none placeholder-slate-500 font-medium leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>Publier l'actualité</span>
          </button>
        </div>
      </form>
    </div>
  );
}
