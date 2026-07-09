/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash, 
  ShieldAlert, 
  CheckCircle, 
  Plus, 
  Database,
  Search,
  BookOpen,
  UserCheck,
  UserX,
  Clock,
  XCircle
} from 'lucide-react';
import { User, UserRole, Course } from '../types';
import { AdminNewsForm } from './UnikalSections';

interface AdminPanelProps {
  currentUser: User;
  usersList: User[];
  courses: Course[];
  onAddUser: (newUser: User) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onResetDatabase: () => void;
}

export default function AdminPanel({
  currentUser,
  usersList,
  courses,
  onAddUser,
  onDeleteUser,
  onUpdateUser,
  onResetDatabase
}: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration form inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserFaculty, setNewUserFaculty] = useState('Sciences Appliquées');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const item: User = {
      id: "usr-" + Date.now(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      faculty: newUserRole === 'student' ? newUserFaculty : undefined,
      status: newUserRole === 'teacher' ? 'approved' : undefined // Admin-created teachers are pre-approved
    };
    onAddUser(item);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddForm(false);
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter teachers by status
  const pendingTeachers = usersList.filter(u => u.role === 'teacher' && u.status === 'pending');
  const approvedTeachers = usersList.filter(u => u.role === 'teacher' && u.status === 'approved');

  return (
    <div id="admin-panel-view" className="space-y-6">
      
      {/* View Header */}
      <header id="admin-header">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-rose-500" />
          Console d'Administration Académique
        </h1>
        <p className="text-sm text-slate-405">Gérez les comptes utilisateurs, pilotez la base de données locale d'étude et examinez la télémétrie LMS.</p>
      </header>

      {/* Numerical Stats overview */}
      <section id="admin-analytics-tiles" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 bg-rose-500/10 text-rose-455 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Comptes Inscrits</span>
            <h3 className="text-xl font-bold text-white mt-0.5">{usersList.length} Profils</h3>
          </div>
        </div>
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/10 text-blue-450 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Titres de cours actifs</span>
            <h3 className="text-xl font-bold text-white mt-0.5">{courses.length} Filières</h3>
          </div>
        </div>
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 text-amber-450 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-350 font-medium">Etat d'Architecture</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Firebase/PostgreSQL Prêt</h3>
          </div>
        </div>
      </section>

      {/* Main operational sections split */}
      <div id="admin-main-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Column for User Accounts rows list */}
        <div id="admin-user-mgmt-panel" className="lg:col-span-2 space-y-6">
          
          {/* Section: Publication d'Actualités UNIKAL */}
          <AdminNewsForm />
          
          {/* Section: Demandes d'Enseignants en Attente */}
          <div id="admin-teacher-pending-panel" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Demandes d'inscription Enseignants ({pendingTeachers.length})</span>
            </h3>
            
            {pendingTeachers.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
                Aucune demande de validation d'enseignant en attente pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingTeachers.map(teacher => (
                  <div key={teacher.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm">{teacher.name}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold">Matricule: {teacher.matricule || 'N/A'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">{teacher.email}</p>
                      <div className="text-[11px] text-slate-350 space-y-0.5 pt-1">
                        <p><span className="text-slate-500">Faculté :</span> {teacher.faculty}</p>
                        <p><span className="text-slate-500">Département :</span> {teacher.department}</p>
                        {teacher.specialty && <p><span className="text-slate-500">Spécialité/Matières :</span> {teacher.specialty}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onUpdateUser(teacher.id, { status: 'approved' })}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-555 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approuver</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateUser(teacher.id, { status: 'rejected' })}
                        className="px-3 py-1.5 bg-rose-600/15 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Enseignants Approuvés */}
          <div id="admin-teacher-approved-panel" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Enseignants validés et actifs ({approvedTeachers.length})</span>
            </h3>
            
            {approvedTeachers.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-xl">
                Aucun enseignant actif enregistré.
              </p>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-slate-300 font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider text-left border-b border-slate-700">
                      <th className="p-3">Enseignant / Matricule</th>
                      <th className="p-3">Filière / Spécialité</th>
                      <th className="p-3 text-right">Contrôle d'Accès</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {approvedTeachers.map(teacher => (
                      <tr key={teacher.id} className="hover:bg-slate-800/40">
                        <td className="p-3 flex flex-col">
                          <span className="font-semibold text-slate-100">{teacher.name}</span>
                          <span className="text-[10px] text-slate-455 font-mono">{teacher.email}</span>
                          {teacher.matricule && <span className="text-[9px] text-emerald-400 font-mono">Mat: {teacher.matricule}</span>}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold block text-slate-200 text-[11px]">{teacher.faculty}</span>
                          <span className="text-[10px] text-slate-450 block">{teacher.department}</span>
                          {teacher.specialty && <span className="text-[9px] text-slate-400 italic">Spéc: {teacher.specialty}</span>}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => onUpdateUser(teacher.id, { status: 'rejected' })}
                            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-600 border border-amber-500/20 text-amber-400 hover:text-white rounded-lg transition-all text-[10px] font-bold cursor-pointer"
                            title="Révoquer l'accès à l'espace enseignant"
                          >
                            Révoquer l'accès
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section: Comptes Généraux */}
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Liste de tous les comptes</h3>
              <button
                id="show-add-user-btn"
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-emerald-600 hover:bg-emerald-555 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Créer un profil</span>
              </button>
            </div>

          {/* Create user subform popup */}
          {showAddForm && (
            <form onSubmit={handleCreateUser} className="p-4 bg-slate-800 border border-slate-750 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-slate-400 mb-1">Nom Complet</label>
                <input 
                  type="text" 
                  value={newUserName} 
                  onChange={e => setNewUserName(e.target.value)} 
                  placeholder="Jean-Paul Mujinga" 
                  required
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email universitaire</label>
                <input 
                  type="email" 
                  value={newUserEmail} 
                  onChange={e => setNewUserEmail(e.target.value)} 
                  placeholder="jp.mujinga@unikal.cd" 
                  required
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Rôle</label>
                <select 
                  value={newUserRole} 
                  onChange={e => setNewUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Enseignant</option>
                  <option value="parent">Parent d'élève</option>
                </select>
              </div>
              {newUserRole === 'student' && (
                <div>
                  <label className="block text-slate-400 mb-1">Faculté</label>
                  <input 
                    type="text" 
                    value={newUserFaculty} 
                    onChange={e => setNewUserFaculty(e.target.value)} 
                    placeholder="Polytechnique"
                    className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              )}
              <div className="sm:col-span-2 flex justify-end gap-2.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-850 hover:bg-slate-800 border border-slate-750 px-3 py-1.5 rounded-lg text-slate-350"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-555 text-white px-4 py-1.5 rounded-lg"
                >
                  Créer
                </button>
              </div>
            </form>
          )}

          {/* Search filter bar */}
          <div className="relative text-xs">
            <Search className="w-3.5 h-3.5 text-slate-550 absolute left-3 top-2.5 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par adresse email, nom..."
              className="w-full bg-slate-850 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Interactive Accounts Table */}
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-slate-300 font-sans border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider text-left border-b border-slate-700">
                  <th className="p-3">Utilisateur</th>
                  <th className="p-3">Rôle / Faculté</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map(usr => (
                  <tr key={usr.id} className="hover:bg-slate-800/40">
                    <td className="p-3 flex flex-col">
                      <span className="font-semibold text-slate-105">{usr.name}</span>
                      <span className="text-[10px] text-slate-455 font-mono">{usr.email}</span>
                    </td>
                    <td className="p-3">
                      <span className={`capitalize font-semibold ${usr.role === 'teacher' ? 'text-teal-400' : usr.role === 'student' ? 'text-indigo-400' : 'text-amber-450'}`}>{usr.role}</span>
                      {usr.faculty && <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">{usr.faculty}</span>}
                    </td>
                    <td className="p-3 text-right">
                      {usr.id !== currentUser.id && (
                        <button
                          id={`del-usr-btn-${usr.id}`}
                          onClick={() => onDeleteUser(usr.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-455 hover:text-white rounded-lg transition-all"
                          title="Supprimer le compte"
                        >
                          <Trash className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* Right sidebar column: Maintenance controls & System audit log */}
        <div id="admin-operations-col" className="space-y-6">
          
          {/* Danger Maintenance panel */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              Maintenance & Réinitialisation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">Réinitialisez l'entièreté de la base de données de travail locale de démonstration (purger les chapitres, devoirs remis, fiches et nouveaux cours créés).</p>
            
            <button
              id="reset-db-btn"
              onClick={onResetDatabase}
              className="w-full bg-rose-500/10 hover:bg-rose-550 border border-rose-500/20 hover:text-white text-rose-440 font-semibold py-2 rounded-xl transition-colors text-xs text-center block"
            >
              Réinitialiser les états LMS
            </button>
          </div>

          {/* Audit trail system logs list */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
            <span className="text-xs font-bold text-slate-205 block font-mono">Journaux système d'audit</span>
            <div className="h-0.5 bg-slate-800 border-t border-slate-755 mb-2"></div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto text-[10px] font-mono leading-relaxed text-slate-400">
              <div className="flex gap-2.5 items-start">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>[10:14] Serveur Node.js démarré avec succès sur port 3000.</span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>[10:14] Connexion au pipeline Gemini-2.0-flash validée.</span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>[10:15] Intégration de la base de données de Tanganyika opérationnelle.</span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>[10:17] Compilateur de fiches IA à Kalemie réactif.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
