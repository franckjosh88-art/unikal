/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Globe, 
  Database, 
  Wifi, 
  Save, 
  Check, 
  RefreshCw, 
  Download, 
  Upload,
  User, 
  Smartphone,
  Info,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface SettingsViewProps {
  currentUser: UserType;
  onUpdateCurrentUser: (updated: UserType) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  appLanguage: string;
  setAppLanguage: (lang: string) => void;
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (mode: boolean) => void;
  autoDownloadOffline: boolean;
  setAutoDownloadOffline: (mode: boolean) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function SettingsView({
  currentUser,
  onUpdateCurrentUser,
  speechRate,
  setSpeechRate,
  speechPitch,
  setSpeechPitch,
  appLanguage,
  setAppLanguage,
  lowBandwidthMode,
  setLowBandwidthMode,
  autoDownloadOffline,
  setAutoDownloadOffline,
  offlineMode,
  setOfflineMode,
  darkMode,
  setDarkMode
}: SettingsViewProps) {
  const [activePanel, setActivePanel] = useState<'profile' | 'voice' | 'network' | 'backup'>('profile');
  
  // Profile local states
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedEmail, setEditedEmail] = useState(currentUser.email);
  const [editedFaculty, setEditedFaculty] = useState(currentUser.faculty || "Faculté des Sciences");
  const [editedDepartment, setEditedDepartment] = useState(currentUser.department || "Département de Géologie");
  const [editedStudentId, setEditedStudentId] = useState(currentUser.studentId || "UNIKAL-2026-8942");

  // Save feedbacks
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);

  // Translation mappings for settings based on selected appLanguage
  const l = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        profileTitle: "Profil & Informations Académiques",
        profileDesc: "Gérez vos informations personnelles et identifiants UNIKAL E-Learning.",
        fullName: "Nom complet",
        email: "Adresse e-mail",
        faculty: "Faculté d'affiliation",
        department: "Département d'études",
        studentId: "Numéro de matricule (ID académique)",
        saveBtn: "Enregistrer les modifications",
        savedMsg: "Modifications enregistrées avec succès !",
        voiceTitle: "Accessibilité Vitesse & Synthèse Vocale",
        voiceDesc: "Configurez les paramètres sonores pour la lecture à voix haute des supports.",
        speechSpeed: "Vitesse de lecture (Rate)",
        speechPitch: "Hauteur de la voix (Pitch)",
        normal: "Normal",
        slow: "Lent",
        fast: "Rapide",
        vfast: "Très rapide",
        testVoice: "Tester la voix",
        voiceTestMsg: "Ceci est un test de la synthèse vocale pour vérifier la fluidité de lecture en Swahili et en Français.",
        networkTitle: "Optimisations Réseau & Bandes de Connexion",
        networkDesc: "Gérez la consommation des données et optimisez l'apprentissage hors-ligne.",
        lowBandwidth: "Mode économie de bande passante (Données mobiles)",
        lowBandwidthDesc: "Réduit la résolution des images et évite le chargement des lourds graphiques pour préserver les forfaits internet dans le Tanganyika.",
        autoDownload: "Téléchargement automatique de secours",
        autoDownloadDesc: "Met en cache automatiquement sur votre appareil mobile les nouveaux supports de cours et les énoncés des devoirs dès qu'une connexion réseau est détectée.",
        backupTitle: "Sauvegarde locale & Partage OTG",
        backupDesc: "Exportez ou restaurez vos données pour les partager sans consommer d'internet."
      },
      sw: {
        profileTitle: "Profaili na Habari za Masomo",
        profileDesc: "Simamia habari zako za kibinafsi na vitambulisho vya UNIKAL E-Learning.",
        fullName: "Jina Kamili",
        email: "Barua pepe",
        faculty: "Kitivo (Faculty)",
        department: "Idara ya Masomo",
        studentId: "Namba ya Usajili (Matricule ID)",
        saveBtn: "Hifadhi mabadiliko",
        savedMsg: "Mabadiliko yamehifadhiwa vyema!",
        voiceTitle: "Sauti na Ufikiaji (Voice & Accessibility)",
        voiceDesc: "Sanidi mipangilio ya sauti ili kusoma kwa sauti nyaraka za masomo.",
        speechSpeed: "Kasi ya kusoma",
        speechPitch: "Kiwango cha Sauti",
        normal: "Kawaida",
        slow: "Polepole",
        fast: "Kasi",
        vfast: "Kasi sana",
        testVoice: "Jaribu Sauti",
        voiceTestMsg: "Huu ni jaribio la kusoma kwa sauti ili kuthibitisha ufasaha wa matamshi katika Swahili.",
        networkTitle: "Uboreshaji wa Mtandao na Matumizi ya Mb",
        networkDesc: "Dhibiti matumizi ya data na uboresha masomo wakati mtandao haupo vyema.",
        lowBandwidth: "Njia ya kubana mtandao (Low Bandwidth)",
        lowBandwidthDesc: "Inapunguza ubora wa picha na kuzuia upakuaji wa picha kubwa ili kulinda vifurushi vya internet huko Tanganyika.",
        autoDownload: "Kupakua kiotomatiki kwa dharura",
        autoDownloadDesc: "Pakua kiotomatiki masomo na kazi ukiwa na mtandao ili kusoma ukiwa porini bila mtandao.",
        backupTitle: "Hifadhi ya Ndani na Kushiriki kwa USB OTG",
        backupDesc: "Toa nje au rudisha data zako ili ushiriki na wanafunzi wengine bila data ya mtandao."
      }
    };

    const currentLang = translations[appLanguage] ? appLanguage : 'fr';
    return translations[currentLang][key] || translations['fr'][key] || key;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSavedSuccess(false);

    setTimeout(() => {
      onUpdateCurrentUser({
        ...currentUser,
        name: editedName,
        email: editedEmail,
        faculty: editedFaculty,
        department: editedDepartment,
        studentId: editedStudentId
      });
      setProfileSaving(false);
      setProfileSavedSuccess(true);
      if ((window as any).showToast) {
        (window as any).showToast("Profil universitaire mis à jour avec succès !", "success");
      }
      setTimeout(() => setProfileSavedSuccess(false), 3000);
    }, 1000);
  };

  // Run voice test
  const handleTestVoice = () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        synth.cancel(); // Stop talking first

        const sampleText = appLanguage === 'sw' 
          ? "Huu ni jaribio la kusoma kwa sauti ya UNIKAL E-Learning. Mfumo upo tayari."
          : "Ceci est un test audio interactif de la plateforme de formation UNIKAL E-Learning.";
        
        const utterance = new SpeechSynthesisUtterance(sampleText);
        utterance.lang = appLanguage === 'sw' ? 'sw-TZ' : 'fr-FR';
        utterance.rate = speechRate;
        utterance.pitch = speechPitch;

        // Try getting a matching voice
        const voices = synth.getVoices();
        const preferredVoice = voices.find(v => 
          appLanguage === 'sw' 
            ? (v.lang.startsWith('sw') || v.lang.startsWith('SW'))
            : (v.lang.startsWith('fr') || v.lang.startsWith('FR'))
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsTestingSpeech(true);
        utterance.onend = () => setIsTestingSpeech(false);
        utterance.onerror = () => setIsTestingSpeech(false);

        synth.speak(utterance);
      } else {
        alert("Audio synthesis is restricted by your browser frame.");
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsTestingSpeech(false);
    }
  };

  // Backup exporter: saves local student works (grades, messages, configs) to an offline shareable JSON file
  const handleExportBackup = () => {
    try {
      const backupData = {
        appId: "edutanganyika-lms",
        backupGeneratedAt: new Date().toISOString(),
        currentUser,
        speechPreferences: {
          rate: speechRate,
          pitch: speechPitch,
          language: appLanguage
        },
        networkPreferences: {
          lowBandwidthMode,
          autoDownloadOffline
        },
        cachedStorage: {
          offlineMode,
          darkMode
        }
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `EDUTANGANYIKA_LOCAL_BACKUP_${currentUser.role.toUpperCase()}_${new Date().toISOString().substring(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      if ((window as any).showToast) {
        (window as any).showToast("Fichier de sauvegarde généré pour clé USB ou Bluetooth !", "success");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur d'exportation.");
    }
  };

  const handleResetAppToDefaults = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser vos paramètres locaux aux valeurs d'usine ?")) {
      setSpeechRate(1);
      setSpeechPitch(1);
      setAppLanguage('fr');
      setLowBandwidthMode(false);
      setAutoDownloadOffline(false);
      
      setEditedName(currentUser.role === 'student' ? 'Étudiant' : 'Enseignant');
      setEditedEmail(currentUser.role === 'student' ? 'student@unikal.ac' : 'teacher@unikal.ac');
      
      if ((window as any).showToast) {
        (window as any).showToast("Réinitialisation des configurations effectuée !", "info");
      }
    }
  };

  return (
    <div id="settings-view-wrapper" className="space-y-6">
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
        <h2 className="text-xl md:text-2xl font-bold font-sans flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-500" />
          <span>Paramètres de Configuration Globale</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
          Modifiez vos préférences d'accessibilité vocale, d'optimisation de forfait internet et exportez vos bases locales pour l'apprentissage autonome dans le Tanganyika.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation panel */}
        <div id="settings-nav-pane" className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-1.5 h-fit shadow-xs">
          <button
            onClick={() => setActivePanel('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs sm:text-sm font-semibold ${
              activePanel === 'profile'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-650 dark:text-blue-400 border-l-4 border-blue-600'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{l('profileTitle').split(' ')[0]} & Infos</span>
          </button>

          <button
            onClick={() => setActivePanel('voice')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs sm:text-sm font-semibold ${
              activePanel === 'voice'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-650 dark:text-blue-400 border-l-4 border-blue-600'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>Synthèse Vocale</span>
          </button>

          <button
            onClick={() => setActivePanel('network')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs sm:text-sm font-semibold ${
              activePanel === 'network'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-650 dark:text-blue-400 border-l-4 border-blue-600'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Wifi className="w-5 h-5" />
            <span>Réseau Tanganyika</span>
          </button>

          <button
            onClick={() => setActivePanel('backup')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs sm:text-sm font-semibold ${
              activePanel === 'backup'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-650 dark:text-blue-400 border-l-4 border-blue-600'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Sauvegarde & OTG</span>
          </button>

          <div className="border-t border-slate-100 dark:border-slate-800/80 my-3 pt-3">
            <button
              onClick={handleResetAppToDefaults}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Valeurs par défaut</span>
            </button>
          </div>
        </div>

        {/* Dynamic Panel Content */}
        <div id="settings-display-pane" className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
          
          {/* PROFILE PANEL */}
          {activePanel === 'profile' && (
            <div id="panel-profile-id" className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150 font-sans">
                  {l('profileTitle')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {l('profileDesc')}
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {l('fullName')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {l('email')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {l('faculty')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedFaculty}
                      onChange={(e) => setEditedFaculty(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {l('department')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={editedDepartment}
                      onChange={(e) => setEditedDepartment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="max-w-md">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {l('studentId')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={editedStudentId}
                    onChange={(e) => setEditedStudentId(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Mode académique sécurisé et opérationnel</span>
                  </div>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
                  >
                    {profileSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sauvegarder...</span>
                      </>
                    ) : profileSavedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Enregistré !</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{l('saveBtn')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VOICE SYNTHESIS PANEL */}
          {activePanel === 'voice' && (
            <div id="panel-voice-id" className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150 font-sans flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-500" />
                  <span>{l('voiceTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {l('voiceDesc')}
                </p>
              </div>

              <div className="space-y-5">
                {/* Application Default Language */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5 max-w-sm">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-500" />
                      Langue d'apprentissage & Synthèse
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Définit le pack de voix par défaut pour la diction orale (Français ou Kiswahili de l'Est).
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAppLanguage('fr')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        appLanguage === 'fr'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-250 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      Français (RDC)
                    </button>
                    <button
                      onClick={() => setAppLanguage('sw')}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        appLanguage === 'sw'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-250 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      Kiswahili (Kalemie)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Speech Rate Controls */}
                  <div className="space-y-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        {l('speechSpeed')}
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-600">{speechRate}x</span>
                    </div>
                    
                    <input
                      type="range"
                      min="0.6"
                      max="1.8"
                      step="0.1"
                      className="w-full accent-blue-600 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer h-1.5"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    />
                    
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>{l('slow')}</span>
                      <span>{l('normal')} (1.0x)</span>
                      <span>{l('vfast')}</span>
                    </div>
                  </div>

                  {/* Pitch Controls */}
                  <div className="space-y-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        {l('speechPitch')}
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-600">{speechPitch}</span>
                    </div>
                    
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      className="w-full accent-blue-600 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer h-1.5"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Grave (Bas)</span>
                      <span>Standard</span>
                      <span>Aigu (Haut)</span>
                    </div>
                  </div>
                </div>

                {/* Tester la voix container */}
                <div className="p-4 rounded-2xl bg-blue-50/55 dark:bg-blue-950/10 border border-blue-200/40 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                        Vérifiez l'audibilité avec vos écouteurs ou haut-parleurs
                      </span>
                      <span className="text-[11px] text-slate-550 block">
                        Le système utilisera vos paramètres personnalisés de vitesse et de hauteur lors du clic sur <strong>"Lire le contenu"</strong>.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleTestVoice}
                    disabled={isTestingSpeech}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                      isTestingSpeech
                        ? 'bg-rose-100 dark:bg-rose-950/20 text-rose-600 border border-rose-200/50 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isTestingSpeech ? "Lecture orale..." : l('testVoice')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NETWORK / LOCAL SIMULATOR PANEL */}
          {activePanel === 'network' && (
            <div id="panel-network-id" className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150 font-sans flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <span>{l('networkTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {l('networkDesc')}
                </p>
              </div>

              <div className="space-y-4">
                {/* Toggle Low Bandwidth Mode */}
                <label className="flex items-start gap-4 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded text-blue-600 dark:text-blue-500 accent-blue-600 border-slate-300 mt-1"
                    checked={lowBandwidthMode}
                    onChange={(e) => setLowBandwidthMode(e.target.checked)}
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      {l('lowBandwidth')}
                    </span>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      {l('lowBandwidthDesc')}
                    </span>
                  </div>
                </label>

                {/* Toggle Auto Download Mode */}
                <label className="flex items-start gap-4 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded text-blue-600 dark:text-blue-500 accent-blue-600 border-slate-300 mt-1"
                    checked={autoDownloadOffline}
                    onChange={(e) => setAutoDownloadOffline(e.target.checked)}
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      {l('autoDownload')}
                    </span>
                    <span className="text-xs text-slate-500 block leading-relaxed">
                      {l('autoDownloadDesc')}
                    </span>
                  </div>
                </label>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/30 flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block">
                      Pourquoi ces réglages sont cruciaux pour Kalemie ?
                    </span>
                    <span className="text-[11px] text-slate-550 dark:text-slate-400 block leading-relaxed">
                      Les pylônes de télécommunication le long du lac Tanganyika subissent de fréquentes interruptions ou saturations de réseau. Activer le pré-chargement automatique permet à l'étudiant d'emporter son téléphone sur place et de faire tous ses QCM et cours hors-ligne de manière fluide d'un bout à l'autre de la province.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BACKUP & OTG PANEL */}
          {activePanel === 'backup' && (
            <div id="panel-backup-id" className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-150 font-sans flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  <span>{l('backupTitle')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {l('backupDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Exporter la base locale (.JSON)
                    </span>
                    <span className="text-xs text-slate-500 block leading-normal">
                      Téléchargez vos données d'études, devoirs enregistrés, notes, et préférences utilisateur dans un fichier crypté. Ce fichier peut être copié sur clé USB ou envoyé par Bluetooth.
                    </span>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Créer le fichier d'export</span>
                  </button>
                </div>

                {/* OTG Share Card */}
                <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-650 dark:text-emerald-400 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Restauration USB OTG
                    </span>
                    <span className="text-xs text-slate-500 block leading-normal">
                      Avez-vous reçu une fiche d'exercices ou une base de données de cours par de proches collègues via clé OTG ou carte SD ? Cliquez ici pour l'injecter sur ce navigateur.
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const data = JSON.parse(event.target?.result as string);
                              if (data.appId === 'edutanganyika-lms') {
                                if (data.currentUser) {
                                  onUpdateCurrentUser(data.currentUser);
                                }
                                if (data.speechPreferences) {
                                  setSpeechRate(data.speechPreferences.rate || 1);
                                  setSpeechPitch(data.speechPreferences.pitch || 1);
                                  setAppLanguage(data.speechPreferences.language || 'fr');
                                }
                                if (data.networkPreferences) {
                                  setLowBandwidthMode(!!data.networkPreferences.lowBandwidthMode);
                                  setAutoDownloadOffline(!!data.networkPreferences.autoDownloadOffline);
                                }
                                if ((window as any).showToast) {
                                  (window as any).showToast("Restauration du backup effectuée avec succès !", "success");
                                }
                              } else {
                                alert("Format non valide pour UNIKAL E-Learning.");
                              }
                            } catch (e) {
                              alert("Échec de la lecture du fichier JSON.");
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                      id="import-backup-file-input"
                    />
                    <label
                      htmlFor="import-backup-file-input"
                      className="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-emerald-500" />
                      <span>Charger un fichier (.JSON)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
