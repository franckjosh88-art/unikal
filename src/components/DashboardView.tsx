/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Bell, 
  Calendar, 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle, 
  CheckSquare,
  AlertTriangle,
  Send,
  PlusCircle,
  Clock,
  Briefcase,
  FileText
} from 'lucide-react';
import { User, Course, Announcement, Assignment, Quiz } from '../types';
import { PARENT_LOGS_MAP, UNIVERSITIES } from '../mockData';

interface DashboardViewProps {
  currentUser: User;
  courses: Course[];
  announcements: Announcement[];
  assignments: Assignment[];
  quizzes: Quiz[];
  onAddAnnouncement: (title: string, content: string) => void;
  offlineMode: boolean;
}

export default function DashboardView({
  currentUser,
  courses,
  announcements,
  assignments,
  quizzes,
  onAddAnnouncement,
  offlineMode
}: DashboardViewProps) {
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  // Submits a classroom announcement for teachers
  const handleAnnPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    onAddAnnouncement(newAnnTitle, newAnnContent);
    setNewAnnTitle('');
    setNewAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  // Student details computation
  const enrolledCourses = courses.filter(c => c.faculty === currentUser.faculty || c.id === 'c1' || c.id === 'c2');
  const pendingAssignments = assignments.filter(a => !a.submitted);
  const pendingQuizzes = quizzes.filter(q => !q.submitted);

  // Parent specific details (e.g., tracking student Pascal Kabobe Kyungu)
  const parentLog = PARENT_LOGS_MAP['p1'];

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Offline Alert Indicator */}
      {offlineMode && (
        <div id="offline-alert-banner" className="bg-amber-550/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3.5 items-start text-amber-100">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-white">Mode Réseau Tanganyika Limité Activé.</span> L'application fonctionne actuellement à partir des données en cache local (mémoire tampon persistante). Vous pouvez continuer à consulter vos cours téléchargés, interagir et soumettre de futurs devoirs. Vos actions se synchroniseront de manière atomique dès la liaison restaurée.
          </div>
        </div>
      )}

      {/* Hero Welcome banner */}
      <header id="dashboard-welcome-hero" className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-800/80 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-bold">
              Bienvenue sur le portail du Lycée Amani
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
              Jambo, {currentUser.name} !
            </h1>
            <p className="text-sm text-slate-350 mt-1.5 max-w-xl">
              {currentUser.role === 'student' && "Prêt à poursuivre votre apprentissage aujourd'hui ? Accédez à vos modules d'étude, soumettez vos devoirs et explorez la bibliothèque numérique."}
              {currentUser.role === 'teacher' && "Gérez vos classes et supports, planifiez de nouvelles évaluations intelligentes par IA et suivez l'avancement de vos promotions d'étudiants."}
              {currentUser.role === 'parent' && `Suivez la scolarité et les progrès scolaires de votre enfant ${parentLog?.studentName || "l'Élève"} à Kalemie.`}
              {currentUser.role === 'admin' && "Pilotez l'administration scolaire du Lycée Amani, configurez les années d'étude et examinez les données d'apprentissage."}
            </p>
          </div>
          <div className="bg-slate-800/80 border border-slate-750 p-4 rounded-xl flex items-center gap-3 self-start md:self-center">
            <Calendar className="w-10 h-10 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-mono">Année Scolaire</span>
              <span className="text-sm font-bold text-slate-100">2025 - 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid containing core analytical view widgets */}
      <section id="dashboard-stats-grid" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {currentUser.role === 'student' && (
          <>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Mes Cours Inscrits</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{enrolledCourses.length} Cours</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Devoirs à Rendre</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{pendingAssignments.length} Devoirs</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Quiz Non Résolus</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{pendingQuizzes.length} Quiz</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Téléchargements</span>
                <h3 className="text-xl font-bold text-white mt-0.5">3 Éléments Cache</h3>
              </div>
            </div>
          </>
        )}

        {currentUser.role === 'teacher' && (
          <>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Mes Cours Gérés</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{courses.filter(c => c.teacherId === currentUser.id).length} Cours</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-sky-500/10 text-sky-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Total Étudiants</span>
                <h3 className="text-xl font-bold text-white mt-0.5">142 Étudiants</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Copies à Corriger</span>
                <h3 className="text-xl font-bold text-white mt-0.5">3 Soumissions</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Quiz IA Créés</span>
                <h3 className="text-xl font-bold text-white mt-0.5">8 Quiz Auto</h3>
              </div>
            </div>
          </>
        )}

        {currentUser.role === 'parent' && (
          <>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 md:col-span-2">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Taux de Présence de l'Enfant</span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{parentLog?.attendanceRate}% (Assidu)</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 md:col-span-2">
              <div className="p-3.5 bg-sky-500/10 text-sky-450 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Moyenne Scolaire Générale</span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{parentLog?.recentGradeAverage}/20 (Très Bien)</h3>
              </div>
            </div>
          </>
        )}

        {currentUser.role === 'admin' && (
          <>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-teal-500/10 text-teal-400 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Universités d'Étude</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{UNIVERSITIES.length} Campus</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Total Comptes</span>
                <h3 className="text-xl font-bold text-white mt-0.5">1 680 Utilisateurs</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Titres de Cours</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{courses.length} Filières</h3>
              </div>
            </div>
            <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Bibliothèque</span>
                <h3 className="text-xl font-bold text-white mt-0.5">48 TFC & Livres</h3>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Main content grid splitting announcements and context specific columns */}
      <div id="dashboard-detail-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Column for Announcements or custom widgets */}
        <div id="sub-widgets-left" className="lg:col-span-2 space-y-6">
          
          {/* Announcements block (Canvas standard feed) */}
          <div id="announcement-feed-card" className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-150 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Annonces & Bulletins Officiels</h2>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-1 text-slate-400 rounded-full font-sans uppercase">Lycée Amani</span>
            </div>
            <div className="p-6 space-y-5">
              {announcements.map((ann) => (
                <article key={ann.id} id={`announc-item-${ann.id}`} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-sm space-y-2">
                  <header className="flex items-center justify-between">
                    <h3 className="text-md font-bold text-white tracking-tight">{ann.title}</h3>
                    <time className="text-[10px] text-slate-400 font-mono">
                      {new Date(ann.createdAt).toLocaleDateString('fr-FR')}
                    </time>
                  </header>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">{ann.content}</p>
                  <footer className="pt-2 text-[11px] text-emerald-400 font-sans italic">
                    Par : {ann.authorName}
                  </footer>
                </article>
              ))}
            </div>
          </div>

          {/* Special view for Parents: Activity follow-up logs */}
          {currentUser.role === 'parent' && (
            <div id="parent-activity-log-card" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Dernières Activités de : {parentLog?.studentName || "l'Étudiant"}
              </h3>
              <div className="h-0.5 bg-slate-850 border-t border-slate-800"></div>
              <ul className="space-y-3 font-sans">
                {parentLog?.recentActivity.map((act: string, idx: number) => (
                  <li key={idx} id={`parent-log-${idx}`} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course card listings for Student/Teacher quick jump */}
          {(currentUser.role === 'student' || currentUser.role === 'teacher') && (
            <div id="courses-quick-peek" className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Aperçu de mes Séquences de cours
              </h2>
              <motion.div 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {enrolledCourses.map((c) => (
                  <motion.div 
                    key={c.id} 
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } }
                    }}
                    whileHover={{ scale: 1.015 }}
                    className="p-5 bg-slate-850 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full">{c.code}</span>
                        <span className="text-[11px] text-slate-400 font-mono italic">{c.credits} Crédits</span>
                      </div>
                      <h4 className="text-md font-bold text-white leading-tight">{c.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-3">{c.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{c.teacherName}</span>
                      <span className="font-semibold text-emerald-400 font-sans">{c.modules.length} modules</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>

        {/* Right sidebar column: Quick action tools */}
        <div id="sub-widgets-right" className="space-y-6">
          
          {/* Assignment Progress Chart (Recharts Pie Chart) */}
          <div id="assignment-progress-chart-card" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Statuts des Devoirs (Rendu vs Attente)
            </h3>
            
            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Rendus', value: assignments.filter(a => a.submitted).length || 0 },
                      { name: 'En attente', value: assignments.filter(a => !a.submitted).length || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#2563eb" /> {/* primary blue for Completed */}
                    <Cell fill="#f59e0b" /> {/* amber for Pending */}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      borderColor: '#475569',
                      borderRadius: '0.75rem',
                      color: '#ffffff',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-blue-600">
                  {Math.round((assignments.filter(a => a.submitted).length / (assignments.length || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Complété</span>
              </div>
            </div>

            <div className="flex items-center justify-around text-xs border-t border-slate-200 pt-4 font-sans">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-slate-700 font-medium">Complétés ({assignments.filter(a => a.submitted).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-slate-700 font-medium">En attente ({assignments.filter(a => !a.submitted).length})</span>
              </div>
            </div>
          </div>
          
          {/* Action widget customized for Teachers : Fast announcement publisher */}
          {currentUser.role === 'teacher' && (
            <div id="teacher-announcement-publisher" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-md font-bold text-white flex items-center gap-2.5">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Publier une annonce officielle
              </h3>
              <form onSubmit={handleAnnPublish} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Titre de l'Annonce</label>
                  <input 
                    type="text"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="e.g. Session de laboratoire annulée"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Corps de l'Annonce</label>
                  <textarea 
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    placeholder="Consignes détaillées pour les étudiants de la faculté..."
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {annSuccess && (
                  <div className="text-xs text-emerald-400 font-mono text-center">
                    ✓ Publiée avec succès dans l'ensemble de l'université !
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2.5"
                >
                  <Send className="w-4 h-4" />
                  Diffuser l'information
                </button>
              </form>
            </div>
          )}

          {/* Academic agenda / upcoming deadlines widget */}
          <div id="agenda-calendar-mini" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Échéances & Agenda
            </h3>
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {assignments.map(a => (
                <motion.div 
                  key={a.id} 
                  variants={{
                    hidden: { opacity: 0, x: 15 },
                    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } }
                  }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="p-3 bg-slate-800/80 rounded-xl border border-slate-705 text-xs flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-amber-400 uppercase font-semibold">Devoir à rendre</span>
                    <span className="text-slate-400">{new Date(a.dueDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <span className="font-semibold text-slate-100 font-sans leading-tight line-clamp-2">{a.title}</span>
                  <span className="text-[10px] text-slate-400 italic mt-1">{a.courseTitle}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
