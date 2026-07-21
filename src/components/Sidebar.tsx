/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  Calendar, 
  Sparkles, 
  BookMarked, 
  Shield, 
  FileCode, 
  User as UserIcon,
  Wifi,
  WifiOff,
  ChevronDown,
  Sun,
  Moon,
  Settings,
  GraduationCap,
  Mail,
  Megaphone
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  currentUser: User;
  usersList: User[];
  onChangeRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  firebaseUser?: any;
  onGoogleSignIn?: () => void;
  onGoogleSignOut?: () => void;
  onEmailSignIn?: () => void;
  isGoogleSigningIn?: boolean;
  onReturnToWebsite?: () => void;
  unreadAnnouncementsCount?: number;
}

export default function Sidebar({
  currentUser,
  usersList,
  onChangeRole,
  activeTab,
  setActiveTab,
  offlineMode,
  setOfflineMode,
  darkMode,
  setDarkMode,
  firebaseUser,
  onGoogleSignIn,
  onGoogleSignOut,
  onEmailSignIn,
  isGoogleSigningIn = false,
  onReturnToWebsite,
  unreadAnnouncementsCount = 0
}: SidebarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: BookMarked },
    { id: 'announcements', label: 'Annonces Scolaires', icon: Megaphone },
    { id: 'courses', label: 'Espace Cours', icon: BookOpen },
    { id: 'assignments', label: 'Devoirs & Travaux', icon: Award },
    { id: 'quizzes', label: 'Quiz & Évaluations', icon: CheckSquare },
    { id: 'library', label: 'Bibliothèque', icon: BookMarked },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'ai-assistant', label: 'Assistant IA', icon: Sparkles },
    { id: 'uml-docs', label: 'Docs & UML (Livrables)', icon: FileCode },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const activeMenuItems = [...menuItems];
  if (currentUser.role === 'student') {
    // Insert after Dashboard
    activeMenuItems.splice(1, 0, { id: 'student-account', label: 'Compte Étudiant (UNILAK)', icon: UserIcon });
  }
  if (currentUser.role === 'teacher') {
    // Insert after Dashboard
    activeMenuItems.splice(1, 0, { id: 'teacher-space', label: 'Espace Professeur', icon: GraduationCap });
  }

  // If role is admin, show admin panel tab
  const showAdminTab = currentUser.role === 'admin';

  return (
    <aside id="canvas-sidebar" className="w-full md:w-68 bg-slate-900 text-slate-350 flex flex-col h-auto md:h-screen border-r border-slate-800 shrink-0">
      {/* Brand Header */}
      <div id="sidebar-brand" className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-blue-400 font-sans">Lycée Amani</span>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase mt-1">Plateforme Numérique</span>
        </div>
        
        {/* Connection Toggle */}
        <button 
          id="offline-toggle-btn"
          onClick={() => setOfflineMode(!offlineMode)}
          className={`p-1.5 rounded-lg transition-all ${offlineMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}
          title={offlineMode ? "Mode Hors-ligne activé (Réseau Tanganyika faible)" : "Mode En-ligne connecté"}
        >
          {offlineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
        </button>
      </div>

      {/* Firebase Auth & Sync Status */}
      <div id="firebase-auth-widget" className="p-4 mx-4 mt-4 mb-1 bg-slate-850/80 rounded-xl border border-blue-500/15 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sync Firestore</span>
        </div>
        {firebaseUser ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {firebaseUser.photoURL ? (
                <img src={firebaseUser.photoURL} alt="Avatar" className="w-7 h-7 rounded-full border border-slate-700 shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-blue-400 font-mono leading-none">Google Connecté</span>
              </div>
            </div>
            <button
              id="google-sign-out-btn"
              type="button"
              onClick={onGoogleSignOut}
              className="w-full text-center py-1 rounded bg-slate-800 hover:bg-slate-750 text-[10px] font-semibold text-slate-300 hover:text-white border border-slate-700/50 transition-all cursor-pointer"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 leading-normal">
              Connectez-vous pour synchroniser vos travaux, notes, discussions et cours en temps réel.
            </p>
            <button
              id="email-sign-in-btn"
              type="button"
              onClick={onEmailSignIn}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-blue-600 hover:bg-blue-550 text-white text-[11px] font-bold transition-all shadow-xs border border-blue-500 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              Connexion / Inscription
            </button>
            <button
              id="google-sign-in-btn"
              type="button"
              onClick={onGoogleSignIn}
              disabled={isGoogleSigningIn}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-[11px] font-bold transition-all shadow-xs border cursor-pointer ${
                isGoogleSigningIn
                  ? 'bg-slate-100 text-slate-500 border-slate-300 opacity-60 pointer-events-none'
                  : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-200'
              }`}
            >
              {isGoogleSigningIn ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500 border-t-transparent animate-spin shrink-0" />
              ) : (
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-3.3-4.53-6.16-4.53z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {isGoogleSigningIn ? 'Connexion...' : 'Google Connexion'}
            </button>
          </div>
        )}
      </div>

      {/* Role Switcher Widget */}
      <div id="role-switcher-container" className="p-4 mx-4 my-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium">Rôle Actuel</span>
              <span className="text-sm font-semibold text-white capitalize">{currentUser.role === 'teacher' ? 'Enseignant' : currentUser.role === 'student' ? 'Étudiant' : currentUser.role === 'parent' ? 'Parent' : 'Administrateur'}</span>
            </div>
          </div>
          <button 
            id="toggle-role-menu-btn"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="p-1 hover:bg-slate-700 rounded-md transition-colors text-slate-400 hover:text-white"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRoleMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Selected User Details */}
        <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-700/40 pt-1.5 font-mono truncate">
          {currentUser.name}
        </div>

        {showRoleMenu && (
          <div id="role-dropdown" className="absolute left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-sm">
            <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-850 border-b border-slate-700 px-3">
              Changer d'utilisateur démo
            </div>
            {usersList.map((usr) => (
              <button
                key={usr.id}
                id={`role-select-${usr.role}`}
                onClick={() => {
                  onChangeRole(usr.role);
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-3 py-2.5 hover:bg-slate-700 transition-colors flex flex-col ${currentUser.role === usr.role ? 'bg-blue-500/10 text-blue-400' : 'text-slate-200'}`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>{usr.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-900 rounded-md text-slate-400">
                    {usr.role === 'teacher' ? 'Enseignant' : usr.role === 'student' ? 'Étudiant' : usr.role === 'parent' ? 'Parent' : 'Admin'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono italic">{usr.email}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {activeMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`tab-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.id === 'announcements' && unreadAnnouncementsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shrink-0">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>
          );
        })}

        {/* Administration Tab */}
        {showAdminTab && (
          <button
            id="tab-link-admin"
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-medium ${
              activeTab === 'admin' 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Shield className={`w-5 h-5 shrink-0 ${activeTab === 'admin' ? 'text-white' : 'text-slate-400'}`} />
            <span>Gestion Admin</span>
          </button>
        )}

        {onReturnToWebsite && (
          <button
            id="tab-link-return-website"
            onClick={onReturnToWebsite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-sm font-bold text-amber-400 hover:bg-slate-800 hover:text-amber-300 mt-2 border border-amber-500/20"
          >
            <GraduationCap className="w-5 h-5 shrink-0 text-amber-400" />
            <span>Retour au Site Lycée Amani</span>
          </button>
        )}
      </nav>

      {/* Dark Mode Toggle Widget */}
      <div id="dark-mode-container" className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/20 shrink-0">
        <button
          id="dark-mode-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition-all font-sans font-medium border border-transparent hover:border-slate-700/30"
          title={darkMode ? "Activer le Mode Clair" : "Activer le Mode Sombre pour la nuit"}
        >
          <div className="flex items-center gap-2.5">
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>{darkMode ? 'Mode Clair' : 'Mode Nuit (Sombre)'}</span>
          </div>
          <span className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${darkMode ? 'bg-blue-500' : 'bg-slate-600'}`}>
            <span className={`block w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${darkMode ? 'translate-x-3.5' : 'translate-x-0'}`} />
          </span>
        </button>
      </div>

      {/* Network and Offline indicator */}
      <div id="network-indicator-footer" className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 font-mono space-y-1 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className={`w-2 h-2 rounded-full ${offlineMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
          <span>Réseau : {offlineMode ? 'Hors-ligne' : 'Excellente connexion'}</span>
        </div>
        <div id="tanganyika-local-time" className="text-[10px] text-slate-500">
          Kalemie, Tanganyika, RDC
        </div>
      </div>
    </aside>
  );
}
