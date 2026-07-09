import React, { useState, useEffect } from 'react';
import { Compass, FileEdit, GraduationCap, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnikalHeroProps {
  onNavigate: (view: string) => void;
}

export default function UnikalHero({ onNavigate }: UnikalHeroProps) {
  const slogans = [
    {
      title: "Éclairer les esprits, bâtir l'avenir du Tanganyika",
      subtitle: "L'Université de Kalemie forme les futurs leaders et innovateurs grâce à un enseignement supérieur de premier choix en RDC.",
      tag: "EXCELLENCE & VALEURS"
    },
    {
      title: "Le flambeau du savoir au cœur du bassin du Tanganyika",
      subtitle: "Fidèles à notre devise 'Scientia Splendet Conscientia', nous allions la rigueur des sciences à la force de la conscience.",
      tag: "TRADITION ACADÉMIQUE"
    },
    {
      title: "Vers l'excellence scientifique par la conscience et la lumière",
      subtitle: "Découvrez nos 6 facultés modernes, nos Cliniques Universitaires de pointe et nos projets de recherche d'impact mondial.",
      tag: "INNOVATION & IMPACT"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slogans.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % slogans.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + slogans.length) % slogans.length);
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden font-sans">
      {/* Background Image Overlay with deep Tanganyika Blue Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920" 
          alt="Campus UNIKAL" 
          className="w-full h-full object-cover opacity-25 scale-105 animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950/90 to-slate-950/80"></div>
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      {/* Slogans Container with AnimatePresence */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Tagline */}
            <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-black bg-amber-400 text-slate-950 rounded-full tracking-widest uppercase">
              {slogans[currentIndex].tag}
            </span>

            {/* Slogan principal */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              {slogans[currentIndex].title}
            </h2>

            {/* Phrase d'accroche */}
            <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              {slogans[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => onNavigate('admissions-online')}
            className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg border border-amber-500/10 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileEdit className="w-4 h-4 shrink-0" />
            <span>S'inscrire en ligne 2025-2026</span>
          </button>
          <button
            onClick={() => onNavigate('about-virtual')}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border border-white/10 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
          >
            <Compass className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Faire une visite virtuelle 3D</span>
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 pt-8">
          {slogans.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-amber-400 w-8' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Slogan ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Manual Control Arrows */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/50 hover:bg-slate-900 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer hover:scale-105"
        aria-label="Slogan précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={handleNext}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/50 hover:bg-slate-900 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer hover:scale-105"
        aria-label="Slogan suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Hero statistics bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-blue-900/95 border-t border-blue-950 py-4.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto grid grid-cols-4 text-center divide-x divide-blue-800">
          <div>
            <span className="block text-xl lg:text-2xl font-black text-amber-400 leading-none">6</span>
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Facultés d'Excellence</span>
          </div>
          <div>
            <span className="block text-xl lg:text-2xl font-black text-amber-400 leading-none">12 +</span>
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Filières LMD</span>
          </div>
          <div>
            <span className="block text-xl lg:text-2xl font-black text-amber-400 leading-none">CU-Kalemie</span>
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Cliniques Universitaires</span>
          </div>
          <div>
            <span className="block text-xl lg:text-2xl font-black text-amber-400 leading-none">2000+</span>
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Diplômés Actifs</span>
          </div>
        </div>
      </div>
    </section>
  );
}
