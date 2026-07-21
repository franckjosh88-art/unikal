import React from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Users, 
  FlaskConical, 
  CheckCircle, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  Scale, 
  Cpu, 
  Leaf, 
  MessageSquare, 
  Mail, 
  Phone 
} from 'lucide-react';
import facultiesData from '../data/faculties.json';

interface FacultyDetailViewProps {
  facultyId: string;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function FacultyDetailView({ facultyId, onBack, onNavigate }: FacultyDetailViewProps) {
  // Find the selected faculty data
  const faculty = facultiesData.find(f => f.id === facultyId);

  if (!faculty) {
    return (
      <div className="text-center py-20 font-sans space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Faculté non trouvée</h2>
        <button onClick={onBack} className="px-4 py-2 bg-blue-900 text-white rounded-lg">Retour</button>
      </div>
    );
  }

  // Get matching icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return Activity;
      case 'TrendingUp': return TrendingUp;
      case 'Scale': return Scale;
      case 'Cpu': return Cpu;
      case 'Leaf': return Leaf;
      case 'BookOpen': return BookOpen;
      default: return GraduationCap;
    }
  };

  const FacIcon = getIcon(faculty.iconName);

  return (
    <div className="w-full font-sans space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-700 hover:text-blue-900 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Retour à l'accueil</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-400 font-bold truncate">Facultés</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-blue-900 font-extrabold truncate">{faculty.title}</span>
      </div>

      {/* Header Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <FacIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{faculty.title}</h1>
            <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium">
              {faculty.description}
            </p>
          </div>

          {/* Quick stats board */}
          <div className="bg-slate-950/40 backdrop-blur-xs border border-white/10 rounded-2xl p-6 grid grid-cols-3 gap-6 shrink-0 text-center min-w-[280px]">
            <div>
              <span className="block text-xl font-black text-amber-400">{faculty.stats.students}</span>
              <span className="text-[9px] uppercase text-slate-300 font-black tracking-wider">Étudiants</span>
            </div>
            <div className="border-x border-white/10">
              <span className="block text-xl font-black text-amber-400">{faculty.stats.teachers}</span>
              <span className="text-[9px] uppercase text-slate-300 font-black tracking-wider">Professeurs</span>
            </div>
            <div>
              <span className="block text-xl font-black text-amber-400">{faculty.stats.labs}</span>
              <span className="text-[9px] uppercase text-slate-300 font-black tracking-wider">Labos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main detail columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Programs & Departments */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Departments */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-3">Départements d'Enseignement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {faculty.departments.map((dep, idx) => (
                <div key={idx} className="p-4 bg-slate-50/60 rounded-xl border border-slate-100/80 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{dep}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Curricula / Programs */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-8">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-3">Offre de Formations LMD</h2>
            
            {/* Undergraduate Level (Licence) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-black uppercase">Cycle de Licence (LMD)</span>
              </div>
              <div className="divide-y divide-slate-50">
                {faculty.programs.licence.map((prog, idx) => (
                  <div key={idx} className="py-3 flex items-start gap-3">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-900 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 font-semibold">{prog}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Postgraduate Level (Master) */}
            {faculty.programs.master && faculty.programs.master.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100/60">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-blue-950 text-[10px] font-black uppercase">Cycle de Master</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {faculty.programs.master.map((prog, idx) => (
                    <div key={idx} className="py-3 flex items-start gap-3">
                      <CheckCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-semibold">{prog}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Key strengths & Enrollment Promo */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Key strengths */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">Spécificités & Atouts</h2>
            <div className="space-y-4">
              {faculty.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">✓</span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cliniques Universitaires Promo banner if Health sciences */}
          {facultyId === 'sante' && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl space-y-4 shadow-md">
              <span className="px-2 py-0.5 bg-white text-emerald-800 text-[8px] font-black uppercase tracking-wider rounded">Exclusivité Lycée Amani</span>
              <h3 className="text-base font-black leading-tight">Nos Cliniques Universitaires à votre service</h3>
              <p className="text-xs text-slate-100 leading-relaxed font-medium">
                Les Cliniques Universitaires de Kalemie constituent notre hôpital d'application directe. Les étudiants y effectuent leurs stages d'immersion clinique sous l'encadrement de médecins et spécialistes de renom.
              </p>
              <button 
                onClick={() => onNavigate('cliniques-universitaires')}
                className="w-full py-2.5 bg-white hover:bg-slate-50 text-emerald-800 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
              >
                Découvrir l'Hôpital
              </button>
            </div>
          )}

          {/* Contact / Inscription Promo */}
          <div className="bg-slate-50/60 p-6 rounded-3xl border border-slate-100 space-y-5">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Secrétariat de Section</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Pour toute question sur l'admission, le choix des options ou l'organisation des cours dans cette section :
            </p>
            <div className="space-y-2.5 text-xs text-slate-700 font-bold">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-900 shrink-0" />
                <span>section-{facultyId}@lyceeamani.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-900 shrink-0" />
                <span>+243 81 037 0286</span>
              </div>
            </div>
            <div className="border-t border-slate-200/50 pt-4">
              <button
                onClick={() => onNavigate('admissions-online')}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md text-center cursor-pointer hover:scale-103"
              >
                Déposer ma Candidature
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
