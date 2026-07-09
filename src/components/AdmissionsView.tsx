import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  User, 
  BookOpen, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Printer 
} from 'lucide-react';
import facultiesData from '../data/faculties.json';

interface AdmissionsViewProps {
  viewType: 'conditions' | 'calendar' | 'fees' | 'online';
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function AdmissionsView({ viewType, onBack, onNavigate }: AdmissionsViewProps) {
  // Online registration wizard steps
  const [step, setStep] = useState(1);
  const [regId, setRegId] = useState('');
  
  const [regForm, setRegForm] = useState({
    faculty: 'sante',
    department: 'Sciences Infirmières',
    cycle: 'Licence LMD',
    lastName: '',
    firstName: '',
    gender: 'Masculin',
    email: '',
    phone: '',
    stateDiplomaPct: '55',
    highSchoolName: '',
    highSchoolOption: 'Biologie-Chimie'
  });

  const getDepartmentsOfSelectedFaculty = () => {
    const f = facultiesData.find(fac => fac.id === regForm.faculty);
    return f ? f.departments : [];
  };

  const handleFacultyChange = (facId: string) => {
    const f = facultiesData.find(fac => fac.id === facId);
    setRegForm({
      ...regForm,
      faculty: facId,
      department: f && f.departments.length > 0 ? f.departments[0] : ''
    });
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a unique registration number for the student
    const randNum = Math.floor(10000 + Math.random() * 90000);
    setRegId(`UNIKAL-2025-${randNum}`);
    setStep(4);
  };

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
        <span className="text-xs text-slate-400 font-bold truncate">Admissions</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-blue-900 font-extrabold capitalize truncate">
          {viewType === 'conditions' ? 'Conditions d\'accès' : viewType === 'calendar' ? 'Calendrier' : viewType === 'fees' ? 'Frais de scolarité' : 'Inscriptions en Ligne'}
        </span>
      </div>

      {/* VIEW TYPE: CONDITIONS D'ACCÈS */}
      {viewType === 'conditions' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Conditions d'Admission</span>
            </h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 max-w-2xl font-medium">Rejoignez l'Université de Kalemie pour l'année académique 2025-2026. Découvrez les critères administratifs et scolaires requis.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              
              {/* Requirements card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
                <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-900" />
                  <span>Dossier d'Inscription Requis</span>
                </h2>
                
                <ul className="space-y-4 text-xs md:text-sm text-slate-600 font-medium">
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">1</span>
                    <p>Une copie certifiée conforme du <strong>Diplôme d'État</strong> ou attestation de réussite équivalente pour l'accès au premier cycle LMD.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">2</span>
                    <p>Les bulletins des 5ème et 6ème années des humanités secondaires (pour vérification du cursus).</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">3</span>
                    <p>Un extrait d'acte de naissance récent ou une attestation de naissance officielle.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">4</span>
                    <p>Un certificat médical d'aptitude physique récent délivré par un médecin agréé (les <strong>Cliniques Universitaires de Kalemie</strong> sont à votre disposition pour cette visite !).</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">5</span>
                    <p>Quatre (4) photos de passeport récentes et identiques en couleur sur fond blanc.</p>
                  </li>
                </ul>
              </div>

            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-amber-400 text-slate-950 p-6 rounded-3xl space-y-4 shadow-md">
                <span className="px-2 py-0.5 bg-slate-950 text-amber-400 text-[8px] font-black uppercase rounded">Note d'Admission</span>
                <h3 className="text-base font-black">Diplôme d'État RDC</h3>
                <p className="text-xs font-semibold leading-relaxed">
                  L'inscription est directe pour tout candidat ayant obtenu 60% ou plus au Diplôme d'État. Pour les pourcentages inférieurs (jusqu'à 50%), l'inscription est conditionnée par l'étude de dossier.
                </p>
                <button
                  onClick={() => onNavigate('admissions-online')}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  S'inscrire en ligne
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TYPE: CALENDRIER ACADÉMIQUE */}
      {viewType === 'calendar' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-2">
              <Calendar className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Calendrier Académique 2025-2026</span>
            </h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 max-w-2xl font-medium">Planifiez votre année universitaire avec le calendrier officiel fixé par le Comité de Gestion de l'UNIKAL.</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Premier semestre */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider border-b border-slate-100 pb-2">Premier Semestre</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Ouverture des inscriptions</span>
                    <span className="font-mono text-slate-500 font-semibold">15 Juillet 2025</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Début des enseignements</span>
                    <span className="font-mono text-slate-500 font-semibold">15 Octobre 2025</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Examens de mi-semestre</span>
                    <span className="font-mono text-slate-500 font-semibold">Décembre 2025</span>
                  </div>
                </div>
              </div>

              {/* Second semestre */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-wider border-b border-slate-100 pb-2">Second Semestre</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Début du second semestre</span>
                    <span className="font-mono text-slate-500 font-semibold">01 Mars 2026</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Examens de fin d'année</span>
                    <span className="font-mono text-slate-500 font-semibold">Fin Juin 2026</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Délibération et Clôture</span>
                    <span className="font-mono text-slate-500 font-semibold">Juillet 2026</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW TYPE: FRAIS DE SCOLARITÉ */}
      {viewType === 'fees' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Frais de Scolarité 2025-2026</span>
            </h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 max-w-2xl font-medium">Une éducation d'excellence accessible et transparente. Consultez le détail annuel par faculté.</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2">Frais Annuels par Faculté (USD)</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-black uppercase">
                    <th className="p-3">Faculté</th>
                    <th className="p-3">Frais d'inscription</th>
                    <th className="p-3">Frais de scolarité annuel</th>
                    <th className="p-3">Modalités de paiement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                  <tr>
                    <td className="p-3 font-black text-blue-900">Sciences de la Santé</td>
                    <td className="p-3">$30</td>
                    <td className="p-3">$380</td>
                    <td className="p-3">En 3 tranches</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-blue-900">Sciences Économiques & Gestion</td>
                    <td className="p-3">$30</td>
                    <td className="p-3">$320</td>
                    <td className="p-3">En 3 tranches</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-blue-900">Sciences Juridiques & Politiques</td>
                    <td className="p-3">$30</td>
                    <td className="p-3">$320</td>
                    <td className="p-3">En 3 tranches</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-blue-900">Sciences Appliquées</td>
                    <td className="p-3">$30</td>
                    <td className="p-3">$350</td>
                    <td className="p-3">En 3 tranches</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-blue-900">Sciences Agronomiques</td>
                    <td className="p-3">$30</td>
                    <td className="p-3">$280</td>
                    <td className="p-3">En 3 tranches</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-blue-900">Lettres, Langues & Arts</td>
                    <td className="p-3">$30</td>
                    <td className="p-3">$280</td>
                    <td className="p-3">En 3 tranches</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 italic pt-2">
              Note : Tous les frais scolaires d'UNIKAL sont payés directement aux guichets de nos banques partenaires à Kalemie. Aucun versement en espèces n'est autorisé au secrétariat académique.
            </p>
          </div>
        </div>
      )}

      {/* VIEW TYPE: INSCRIPTION EN LIGNE (MULTI-STEP WIZARD FORM!) */}
      {viewType === 'online' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
              <span>Candidature en Ligne</span>
            </h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 max-w-2xl font-medium">Déposez votre dossier d'admission de manière simple et dématérialisée en quelques minutes.</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs">
            
            {/* Step Wizard Progress Bar */}
            {step < 4 && (
              <div className="flex items-center justify-between max-w-lg mx-auto mb-10 text-[10px] md:text-xs font-black">
                <div className={`flex flex-col items-center gap-1.5 ${step >= 1 ? 'text-blue-900' : 'text-slate-300'}`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? 'border-blue-900 bg-blue-50' : 'border-slate-200'}`}>1</span>
                  <span>ORIENTATION</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-100 mx-3"></div>
                <div className={`flex flex-col items-center gap-1.5 ${step >= 2 ? 'text-blue-900' : 'text-slate-300'}`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? 'border-blue-900 bg-blue-50' : 'border-slate-200'}`}>2</span>
                  <span>IDENTITÉ</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-100 mx-3"></div>
                <div className={`flex flex-col items-center gap-1.5 ${step >= 3 ? 'text-blue-900' : 'text-slate-300'}`}>
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 3 ? 'border-blue-900 bg-blue-50' : 'border-slate-200'}`}>3</span>
                  <span>CURSUS & ENVOI</span>
                </div>
              </div>
            )}

            {/* WIZARD FORMS */}
            <form onSubmit={handleRegistrationSubmit}>
              
              {/* STEP 1: Orientation */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 border-b border-slate-50 pb-2">Sélectionnez votre Faculté et Orientation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Faculté visée</label>
                      <select 
                        value={regForm.faculty}
                        onChange={e => handleFacultyChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-hidden cursor-pointer font-bold"
                      >
                        {facultiesData.map(fac => (
                          <option key={fac.id} value={fac.id}>{fac.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Département d'orientation</label>
                      <select 
                        value={regForm.department}
                        onChange={e => setRegForm({...regForm, department: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-hidden cursor-pointer font-bold"
                      >
                        {getDepartmentsOfSelectedFaculty().map((dep, idx) => (
                          <option key={idx} value={dep}>{dep}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Cycle d'études LMD</label>
                    <select 
                      value={regForm.cycle}
                      onChange={e => setRegForm({...regForm, cycle: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-hidden cursor-pointer font-bold"
                    >
                      <option>Licence LMD (3 ans)</option>
                      <option>Master LMD (2 ans)</option>
                    </select>
                  </div>

                  <div className="pt-6 text-right">
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer hover:scale-103"
                    >
                      <span>Continuer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Identité */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 border-b border-slate-50 pb-2">Renseignements d'identité personnelle</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Nom de Famille *</label>
                      <input 
                        type="text" 
                        required
                        value={regForm.lastName}
                        onChange={e => setRegForm({...regForm, lastName: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: Kalunga"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Prénom *</label>
                      <input 
                        type="text" 
                        required
                        value={regForm.firstName}
                        onChange={e => setRegForm({...regForm, firstName: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: Justin"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Genre</label>
                      <select 
                        value={regForm.gender}
                        onChange={e => setRegForm({...regForm, gender: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-hidden cursor-pointer"
                      >
                        <option>Masculin</option>
                        <option>Féminin</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Adresse E-mail *</label>
                      <input 
                        type="email" 
                        required
                        value={regForm.email}
                        onChange={e => setRegForm({...regForm, email: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: kalunga@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Téléphone Mobile *</label>
                    <input 
                      type="tel" 
                      required
                      value={regForm.phone}
                      onChange={e => setRegForm({...regForm, phone: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                      placeholder="Ex: +243 81 037 0286"
                    />
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-bold cursor-pointer"
                    >
                      Retour
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer hover:scale-103"
                    >
                      <span>Continuer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Cursus et Envoi */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900 border-b border-slate-50 pb-2">Cursus secondaire & validation</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Nom de l'École de provenance *</label>
                      <input 
                        type="text" 
                        required
                        value={regForm.highSchoolName}
                        onChange={e => setRegForm({...regForm, highSchoolName: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: Institut de Kalemie"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Option d'étude suivie</label>
                      <input 
                        type="text" 
                        value={regForm.highSchoolOption}
                        onChange={e => setRegForm({...regForm, highSchoolOption: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: Biologie-Chimie, Commerciale..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Pourcentage obtenu au Diplôme d'État *</label>
                    <input 
                      type="number" 
                      required
                      min={50}
                      max={100}
                      value={regForm.stateDiplomaPct}
                      onChange={e => setRegForm({...regForm, stateDiplomaPct: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-hidden font-bold"
                    />
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all font-bold cursor-pointer"
                    >
                      Retour
                    </button>
                    <button 
                      type="submit"
                      className="px-7 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer hover:scale-103"
                    >
                      <span>Valider & Envoyer ma candidature</span>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: FÉLICITATIONS / ATTESTATION DE PRÉ-INSCRIPTION */}
              {step === 4 && (
                <div className="space-y-6 py-6 animate-in zoom-in-95 duration-200">
                  <div className="p-8 border-3 border-dashed border-amber-400 rounded-3xl bg-slate-50 text-center space-y-6 max-w-2xl mx-auto shadow-inner">
                    
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-black text-blue-900 tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">Attestation de Pré-inscription</span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Félicitations, {regForm.firstName} !</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Votre dossier de candidature a été validé et enregistré par l'administration d'UNIKAL. Vous êtes pré-inscrit pour l'année 2025-2026.
                      </p>
                    </div>

                    {/* Certificate Board */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-3 shadow-xs">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Numéro de dossier</span>
                        <span className="text-xs font-mono font-black text-amber-600">{regId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Candidat</span>
                          <span className="font-extrabold text-slate-800">{regForm.lastName} {regForm.firstName}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Orientation</span>
                          <span className="font-extrabold text-slate-800">{regForm.department}</span>
                        </div>
                        <div className="pt-2">
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Faculté</span>
                          <span className="font-extrabold text-slate-800">{facultiesData.find(f => f.id === regForm.faculty)?.title}</span>
                        </div>
                        <div className="pt-2">
                          <span className="block text-[9px] text-slate-400 uppercase font-bold">Statut</span>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase tracking-wider rounded-sm">Validé</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <button 
                        type="button"
                        onClick={() => window.print()}
                        className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-103"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer l'attestation</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setStep(1);
                          onNavigate('home');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                      >
                        Retour à l'accueil
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
