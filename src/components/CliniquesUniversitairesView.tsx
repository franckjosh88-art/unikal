import React from 'react';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Users, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  Stethoscope, 
  ChevronRight, 
  Building, 
  MapPin 
} from 'lucide-react';

interface CliniquesUniversitairesViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function CliniquesUniversitairesView({ onBack, onNavigate }: CliniquesUniversitairesViewProps) {
  const departments = [
    { name: "Pédiatrie & Néonatalogie", desc: "Soins spécialisés pour les nourrissons et les enfants, doté d'incubateurs de dernière génération." },
    { name: "Gynécologie & Obstétrique", desc: "Prise en charge de la maternité, des accouchements physiologiques ou par césarienne." },
    { name: "Médecine Interne", desc: "Diagnostic et traitement des pathologies cardiovasculaires, infectieuses ou métaboliques." },
    { name: "Chirurgie Générale", desc: "Bloc opératoire moderne pour les interventions viscérales, orthopédiques et traumatologiques." },
    { name: "Laboratoire d'Analyses Médicales", desc: "Analyses biochimiques, parasitologiques et hématologiques rapides et fiables." },
    { name: "Imagerie Médicale & Échographie", desc: "Radiographie numérique et échographie Doppler de haute résolution." }
  ];

  return (
    <div className="w-full font-sans space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation breadcrumb */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-700 hover:text-blue-900 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Retour à l'accueil</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-400 font-bold truncate">Cliniques Universitaires</span>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-900 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_50%)]"></div>
        <div className="relative z-10 space-y-4 max-w-3xl">
          <span className="px-3 py-1 bg-white/10 text-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-full border border-white/10 inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Fleuron Hospitalier de la Plateforme d'Étude</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Cliniques Universitaires de la Plateforme d'Étude
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm leading-relaxed font-medium">
            Rattachées à la Faculté des Sciences de la Santé, nos Cliniques Universitaires unissent de manière indissociable la formation médicale de haut niveau, la recherche scientifique clinique et l'offre de soins de qualité supérieure pour les populations de la province du Tanganyika.
          </p>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left main content: Departments & Missions */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Core values/Missions */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Notre Triple Mission</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Soins d'Excellence</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Fournir des soins médicaux de qualité, éthiques et abordables à la communauté du Tanganyika.</p>
              </div>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">2</div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Formation Clinique</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Offrir un terrain de stage de premier plan pour nos étudiants en Médecine et Sciences Infirmières.</p>
              </div>
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Recherche Médicale</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Étudier les pathologies infectieuses locales et promouvoir la santé publique régionale.</p>
              </div>
            </div>
          </div>

          {/* Specialties / Departments */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Nos Services & Spécialités Médicales</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dept, idx) => (
                <div key={idx} className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100/80 hover:border-emerald-200 hover:bg-white transition-all space-y-2 group">
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{dept.name}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{dept.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right side: Emergency & Visiting Hours */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Emergency contacts card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/5 rounded-full blur-2xl"></div>
            <div className="relative z-10 space-y-4">
              <span className="px-2.5 py-0.5 bg-red-600 text-[8px] font-black uppercase rounded tracking-widest inline-block">Urgence H24</span>
              <h3 className="text-base font-black">Besoin d'aide médicale urgente ?</h3>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Nos équipes de garde médicale, de maternité et de bloc opératoire sont prêtes à vous accueillir 24h/24 et 7j/7.
              </p>
              <div className="p-4 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center gap-3">
                <PhoneCall className="w-6 h-6 text-red-500 shrink-0 animate-bounce" />
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-black leading-none">Numéro d'appel Direct</span>
                  <span className="text-base font-black text-white">+243 81 037 0286</span>
                </div>
              </div>
            </div>
          </div>

          {/* Practical Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Informations Pratiques</h3>
            
            <div className="space-y-4">
              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="block font-black text-slate-900 leading-none mb-1">Heures de Visite aux patients</span>
                  <span className="text-slate-500 leading-relaxed font-medium">
                    Matin : 11h30 - 13h00 <br />
                    Soir : 16h30 - 18h30
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="block font-black text-slate-900 leading-none mb-1">Localisation</span>
                  <span className="text-slate-500 leading-relaxed font-medium">
                    Avenue des Cliniques, Quartier Kisebwe, Ville de Plateforme d'Étude (face à la Plateforme d'Étude).
                  </span>
                </div>
              </div>

              {/* Health assurances */}
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="block font-black text-slate-900 leading-none mb-1">Assurances & Prises en Charge</span>
                  <span className="text-slate-500 leading-relaxed font-medium">
                    Agréé pour les agents publics, entreprises de logistique de la Plateforme d'Étude, et conventions humanitaires.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button 
                onClick={() => onNavigate('contact')}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Nous Contacter / Prendre RDV
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
