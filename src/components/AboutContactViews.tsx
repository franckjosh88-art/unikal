import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Phone, 
  Compass, 
  Users, 
  GraduationCap, 
  Info, 
  Send, 
  CheckCircle, 
  Play, 
  Building,
  User
} from 'lucide-react';
import staffData from '../data/staff.json';

interface AboutContactViewsProps {
  viewType: 'unik' | 'rector' | 'committee' | 'campus' | 'virtual' | 'contact';
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function AboutContactViews({ viewType, onBack, onNavigate }: AboutContactViewsProps) {
  // Contact Form States
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Renseignements Généraux',
    message: ''
  });

  // Virtual Tour States
  const [activeHotspot, setActiveHotspot] = useState('central');
  const hotspots = {
    central: {
      name: "Bâtiment Administratif & Auditoires",
      desc: "Le cœur académique de l'UNIKAL, accueillant la direction générale, les bureaux facultaires, et les grands auditoires climatisés.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
    },
    library: {
      name: "Bibliothèque Centrale & Salle Solaire",
      desc: "Notre espace d'études moderne alimenté par panneaux solaires photovoltaïques autonomes, abritant plus de 10 000 ouvrages physiques et des terminaux e-learning.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200"
    },
    clinics: {
      name: "Cliniques Universitaires de Kalemie",
      desc: "L'hôpital d'application pratique de l'UNIKAL, doté de pavillons de néonatalogie, maternité, urgences, bloc opératoire et imagerie médicale.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200"
    },
    agronomy: {
      name: "Champs Expérimentaux d'Agronomie",
      desc: "Champs de recherche et d'application agronomique situés à la périphérie de Kalemie pour l'étude des sols et de la phytotechnie.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: 'Renseignements Généraux', message: '' });
    }, 2000);
  };

  return (
    <div className="w-full font-sans space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 text-slate-700 hover:text-blue-900 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Retour à l'accueil</span>
        </button>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-400 font-bold truncate">À Propos</span>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-blue-900 font-extrabold capitalize truncate">
          {viewType === 'unik' ? 'Qui sommes-nous ?' : viewType === 'rector' ? 'Mot du Recteur' : viewType === 'committee' ? 'Comité de Gestion' : viewType === 'campus' ? 'Notre Campus' : viewType === 'virtual' ? 'Visite Virtuelle' : 'Contact & Plan d\'accès'}
        </span>
      </div>

      {/* VIEW TYPE: QUI SOMMES-NOUS */}
      {viewType === 'unik' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white">L'Université de Kalemie (UNIKAL)</h1>
            <p className="text-slate-200 text-xs md:text-sm max-w-2xl mt-3 font-medium">Institution publique d'enseignement supérieur d'excellence en RDC.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6 text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2">Historique et Vision</h2>
              <p>
                Créée par arrêté ministériel pour répondre au besoin d'un enseignement supérieur de proximité au Tanganyika, l'Université de Kalemie est aujourd'hui une institution publique d'envergure. Elle regroupe des milliers d'étudiants répartis dans ses 6 facultés et formés par des professeurs de haut niveau.
              </p>
              <p>
                L'UNIKAL s'est fixé comme mission d'être un centre de savoir à fort impact régional, formant des professionnels doués d'une grande conscience morale. Sa devise <strong className="text-blue-900">Scientia Splendet Conscientia</strong> guide l'ensemble des activités pédagogiques et de recherche de l'institution.
              </p>

              <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2 pt-4">Nos Objectifs Académiques</h2>
              <ul className="space-y-3 pl-5 list-disc">
                <li>Garantir une formation supérieure de premier choix, ancrée dans le système LMD.</li>
                <li>Favoriser l'insertion professionnelle immédiate des lauréats.</li>
                <li>Développer la recherche appliquée axée sur la résolution des défis de la province du Tanganyika (lac, agriculture, santé).</li>
                <li>Incarner un pôle d'excellence en santé humaine grâce au soutien continu de nos Cliniques Universitaires.</li>
              </ul>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Quelques Chiffres</span>
                <div className="space-y-3.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">Facultés</span>
                    <span className="text-sm font-black text-blue-900">6</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">Filières</span>
                    <span className="text-sm font-black text-blue-900">12 +</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">Hôpital d'application</span>
                    <span className="text-xs font-black text-emerald-700">CU-Kalemie</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TYPE: MOT DU RECTEUR */}
      {viewType === 'rector' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row gap-6 items-center">
            <div className="w-24 h-24 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 flex items-center justify-center bg-slate-900 text-amber-400">
              {staffData.rector.image ? (
                <img src={staffData.rector.image} alt="Rector photo" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white">{staffData.rector.name}</h1>
              <p className="text-amber-400 text-xs font-mono mt-1 font-bold">{staffData.rector.title}</p>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2">Lettre de Bienvenue du Recteur</h2>
            <div className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium space-y-4 whitespace-pre-wrap">
              {staffData.rector.welcomeMessage}
            </div>
          </div>
        </div>
      )}

      {/* VIEW TYPE: COMITÉ DE GESTION */}
      {viewType === 'committee' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white">Le Comité de Gestion</h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 font-medium">Les membres du Comité de Gestion (COGE) de l'Université de Kalemie en charge du pilotage académique et administratif.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffData.managementCommittee.map((member, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                <div className="h-56 overflow-hidden relative bg-slate-950 flex items-center justify-center text-slate-400">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-amber-400">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-blue-900 text-white text-[9px] font-black uppercase rounded tracking-wider">
                    {member.role}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">{member.name}</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1 font-mono">{member.role}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW TYPE: NOTRE CAMPUS */}
      {viewType === 'campus' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white">Notre Campus Universitaire</h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 font-medium">Un cadre d'étude moderne et paisible sur les collines bordant le magnifique Lac Tanganyika.</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6 text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2">Infrastructures d'Apprentissage</h2>
            <p>
              Le campus principal d'UNIKAL est situé dans le Quartier Kisebwe de la ville de Kalemie. Il abrite les bâtiments administratifs, des salles de cours spacieuses adaptées au LMD, des laboratoires d'informatique et de chimie, et notre bibliothèque centrale.
            </p>
            <p>
              Nos auditoires sont dotés de matériel de projection et d'une sonorisation pour un apprentissage qualitatif. Face au campus, les Cliniques Universitaires de Kalemie accueillent également les auditoires pratiques de notre Faculté des Sciences de la Santé.
            </p>

            <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-2 pt-4">Autonomie Solaire et Connectivité</h2>
            <p>
              Parce que la continuité de l'apprentissage est notre priorité, l'UNIKAL s'est dotée d'une centrale solaire photovoltaïque alimentant la salle informatique de 120 ordinateurs et la bibliothèque centrale. Les étudiants peuvent ainsi accéder à l'e-learning et à internet de manière ininterrompue de 8h à 18h.
            </p>
          </div>
        </div>
      )}

      {/* VIEW TYPE: VISITE VIRTUELLE 3D (INTERACTIVE!) */}
      {viewType === 'virtual' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white">Visite Virtuelle du Campus 3D</h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 font-medium">Explorez nos infrastructures à distance comme si vous y étiez. Sélectionnez un hotspot pour naviguer.</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Camera viewer container */}
              <div className="lg:col-span-8 space-y-4">
                <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group bg-slate-900">
                  <img 
                    src={hotspots[activeHotspot as keyof typeof hotspots].image} 
                    alt={hotspots[activeHotspot as keyof typeof hotspots].name} 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  {/* Virtual drone camera controls overlay */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs border border-white/10 p-3 rounded-xl space-y-1">
                    <span className="block text-[8px] font-black text-amber-400 uppercase tracking-widest">DRONE CAMERA [ACTIVE]</span>
                    <span className="block text-xs font-bold text-white font-mono">{hotspots[activeHotspot as keyof typeof hotspots].name}</span>
                  </div>

                  {/* Panoramic indicators overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-slate-950/80 backdrop-blur-xs border border-white/5 p-3.5 rounded-xl">
                    <div className="text-xs">
                      <span className="block text-slate-400 text-[10px] font-semibold leading-none mb-1">Coordonnées Kalemie</span>
                      <span className="text-white font-mono">5° 54' 1.6" S, 29° 11' 0.4" E</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-600 rounded text-[9px] font-black uppercase text-white animate-pulse">Vue Panoramique 360°</span>
                  </div>
                </div>
              </div>

              {/* Hotspot select sidebar */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Sélectionner un point d'intérêt</h3>
                  <div className="space-y-2">
                    {Object.entries(hotspots).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => setActiveHotspot(key)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          activeHotspot === key
                            ? 'bg-blue-50 border-blue-900/40 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{data.name}</span>
                        <Play className={`w-3 h-3 ${activeHotspot === key ? 'text-blue-900' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-xs font-black text-slate-900 mb-2">Description du lieu :</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {hotspots[activeHotspot as keyof typeof hotspots].desc}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW TYPE: CONTACT */}
      {viewType === 'contact' && (
        <div className="space-y-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 md:p-12 shadow-xl">
            <h1 className="text-2xl md:text-4xl font-black text-white">Contact & Secrétariat Général</h1>
            <p className="text-slate-200 text-xs md:text-sm mt-3 font-medium">Pour toute question administrative, académique, ou demande d'admission, l'administration d'UNIKAL est à votre écoute.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Formulaire de contact */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xs">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-3 mb-6">Formulaire d'Échange Direct</h2>
              
              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Message envoyé avec succès !</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto font-medium">
                    Le secrétariat général de l'Université de Kalemie a reçu votre message et s'engage à vous répondre par e-mail dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Nom Complet *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: Justin Kakudji"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Adresse E-mail *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: justin@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Téléphone Mobile</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden"
                        placeholder="Ex: +243 810 370 286"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase font-bold text-slate-400">Objet de la Demande</label>
                      <select 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-hidden cursor-pointer"
                      >
                        <option>Renseignements Généraux</option>
                        <option>Inscriptions & Admissions</option>
                        <option>Partenariats & Recherche</option>
                        <option>Cliniques Universitaires</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase font-bold text-slate-400">Message *</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 bg-white placeholder-slate-400 focus:outline-hidden resize-none"
                      placeholder="Saisissez votre message ici..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="px-6 py-3 bg-blue-900 hover:bg-blue-950 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer hover:scale-103"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span>Envoyer mon message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Coordinates */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200/60 pb-2">Nos Coordonnées</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="block font-black text-slate-900 leading-none mb-1">Campus Principal</span>
                      <span>Avenue de l'Université, Quartier Kisebwe, Ville de Kalemie, Province du Tanganyika, RDC.</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="block font-black text-slate-900 leading-none mb-1">Secrétariat Général</span>
                      <a href="mailto:rectorat@unikal.ac.cd" className="text-blue-900 underline">rectorat@unikal.ac.cd</a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="block font-black text-slate-900 leading-none mb-1">Téléphone d'Accueil</span>
                      <a href="tel:+243810370286" className="text-slate-900 font-bold">+243 81 037 0286</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
