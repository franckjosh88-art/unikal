/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  Calendar, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Send,
  UserCheck,
  Check
} from 'lucide-react';
import { Assignment, User } from '../types';

interface AssignmentsViewProps {
  currentUser: User;
  assignments: Assignment[];
  onSubmitAssignment: (id: string, text: string) => Promise<void>;
  onGradeAssignment: (id: string, score: number, feedback: string) => Promise<void>;
  offlineMode: boolean;
}

export default function AssignmentsView({
  currentUser,
  assignments,
  onSubmitAssignment,
  onGradeAssignment,
  offlineMode
}: AssignmentsViewProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionValue, setSubmissionValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // States for Teacher grading
  const [gradingScore, setGradingScore] = useState(16);
  const [gradingFeedback, setGradingFeedback] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [gradeSuccess, setGradeSuccess] = useState(false);

  const handleHomeworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionValue) return;
    setSubmitting(true);
    setSubmitSuccess(false);
    
    // Simulate low internet transmission buffer delay
    setTimeout(async () => {
      try {
        await onSubmitAssignment(selectedAssignment.id, submissionValue);
        setSubmitSuccess(true);
        // Refresh selected object reference for updated UI
        selectedAssignment.submitted = true;
        selectedAssignment.submissionText = submissionValue;
        selectedAssignment.submissionDate = new Date().toISOString();
        setSubmissionValue('');
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }, 800);
  };

  const handleTeacherGrading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setIsGrading(true);
    setGradeSuccess(false);

    setTimeout(async () => {
      try {
        await onGradeAssignment(selectedAssignment.id, gradingScore, gradingFeedback);
        setGradeSuccess(true);
        selectedAssignment.grade = gradingScore;
        selectedAssignment.gradeFeedback = gradingFeedback;
        setGradingFeedback('');
      } catch (err) {
        console.error(err);
      } finally {
        setIsGrading(false);
      }
    }, 500);
  };

  return (
    <div id="assignments-view" className="space-y-6">
      
      {/* Header and overview block */}
      <header id="assignments-header">
        <h1 className="text-2xl font-bold tracking-tight text-white">Devoirs & Travaux Académiques</h1>
        <p className="text-sm text-slate-400">Rendez vos travaux de maison, examinez les évaluations des enseignants et suivez vos points.</p>
      </header>

      <section id="assignments-layout-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: List of Assignments */}
        <div id="assignments-list-col" className="lg:col-span-1 space-y-4">
          <div className="bg-slate-850 p-4 border border-slate-800 rounded-2xl">
            <h2 className="text-sm font-bold text-slate-200 mb-3 font-sans">Sujets d'Évaluation Disponibles</h2>
            <div className="space-y-3">
              {assignments.map(a => {
                const isSelected = selectedAssignment?.id === a.id;
                return (
                  <button
                    key={a.id}
                    id={`assign-row-btn-${a.id}`}
                    onClick={() => {
                      setSelectedAssignment(a);
                      setSubmissionValue(a.submissionText || '');
                      setGradingFeedback(a.gradeFeedback || '');
                      setGradingScore(a.grade || 16);
                      setSubmitSuccess(false);
                      setGradeSuccess(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-slate-800/80 border-slate-705 text-slate-200 hover:border-slate-650'}`}
                  >
                    <div className="flex justify-between items-start text-[10px] font-mono mb-1.5 uppercase tracking-wide">
                      <span className="text-emerald-400 font-bold">{a.points} Points Max</span>
                      {a.submitted ? (
                        <span className="text-emerald-450 font-bold">✓ Soumis</span>
                      ) : (
                        <span className="text-amber-500 font-bold shrink-0">À faire</span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-100 font-sans leading-snug block line-clamp-1">{a.title}</span>
                    <span className="text-[11px] text-slate-405 italic mt-1.5 block truncate">{a.courseTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Primary Detail Submission or Grading Container */}
        <div id="assignments-detail-col" className="lg:col-span-2">
          {selectedAssignment ? (
            <div id="active-assign-card" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-sm">
              
              {/* Assignment descriptive attributes */}
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-slate-400 font-sans italic">{selectedAssignment.courseTitle}</span>
                <h2 className="text-lg md:text-xl font-bold text-white mt-1 leading-tight">{selectedAssignment.title}</h2>
                
                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 mt-3 border-t border-slate-800/40 pt-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Échéance : {new Date(selectedAssignment.dueDate).toLocaleString('fr-FR')}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Barème : {selectedAssignment.points} Pts</span>
                  </span>
                </div>
              </div>

              {/* Work instructions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-widest font-mono">Enoncé du Devoir</h3>
                <p className="text-sm text-slate-205 leading-relaxed bg-slate-800/65 p-4 rounded-xl border border-slate-705/50 font-sans">
                  {selectedAssignment.description}
                </p>
              </div>

              {/* Core interactive block split based on Role: Student Submit vs Teacher grading */}
              {currentUser.role === 'student' && (
                <div id="student-submission-panel" className="border-t border-slate-800 pt-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    {selectedAssignment.submitted ? "Votre copie d'examen / TP" : "Soumettre votre copie rédigée"}
                  </h3>

                  {selectedAssignment.submitted ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800 border border-slate-750 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {selectedAssignment.submissionText}
                      </div>

                      {/* Display grades and teacher review if graded */}
                      {selectedAssignment.grade !== undefined ? (
                        <div id="receipt-grading-block" className="p-4 bg-emerald-555/10 border-l-4 border-emerald-500 rounded-r-xl space-y-2 text-sm text-emerald-100">
                          <h4 className="font-extrabold text-white">Félicitations, copie corrigée !</h4>
                          <div className="flex items-center font-mono font-bold text-lg text-emerald-400">
                            Note obtenue : {selectedAssignment.grade} / {selectedAssignment.points}
                          </div>
                          <p className="font-sans italic text-slate-300">" {selectedAssignment.gradeFeedback} "</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3.5 bg-slate-800 rounded-xl text-xs text-slate-400 font-mono">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>Copie reçue le {new Date(selectedAssignment.submissionDate!).toLocaleDateString('fr', { day: 'numeric', month: 'short' })}. En cours d'analyse/correction par l'enseignant.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Submit Form */
                    <form onSubmit={handleHomeworkSubmit} className="space-y-3">
                      <textarea
                        value={submissionValue}
                        onChange={e => setSubmissionValue(e.target.value)}
                        placeholder="Rédigez la réponse à votre devoir ici. Vous pouvez également coller le code source de vos algorithmes..."
                        rows={6}
                        required
                        className="w-full bg-slate-800 border border-slate-705 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                      />

                      {submitSuccess && (
                        <div className="text-xs text-emerald-400 font-mono text-center">
                          ✓ Copie soumise avec succès au Secrétariat Académique !
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-755 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <span>Transmission cryptée...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Soumettre la copie</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Widget for Teachers to grade students copy */}
              {currentUser.role === 'teacher' && (
                <div id="teacher-correction-panel" className="border-t border-slate-800 pt-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    Copie de l'Étudiant (Simulation d'Évaluation)
                  </h3>

                  {selectedAssignment.submitted ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/80 border border-slate-705 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {selectedAssignment.submissionText}
                      </div>

                      {/* Grading form */}
                      <form onSubmit={handleTeacherGrading} className="bg-slate-800 p-4 border border-slate-750 rounded-xl space-y-3 text-sm">
                        <h4 className="font-bold text-white">Attribuer une note académique</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Cote d'Examen (sur {selectedAssignment.points})</label>
                            <input 
                              type="number" 
                              value={gradingScore}
                              onChange={e => setGradingScore(Number(e.target.value))}
                              min={0}
                              max={selectedAssignment.points}
                              required
                              className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3.5 py-1.5 text-white font-mono focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-400 mb-1">Commentaire Pédagogique</label>
                            <input 
                              type="text" 
                              value={gradingFeedback}
                              onChange={e => setGradingFeedback(e.target.value)}
                              placeholder="Félicitations, travail structuré..."
                              required
                              className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {gradeSuccess && (
                          <div className="text-xs text-emerald-400 font-mono text-center py-1">
                            ✓ Note attribuée et envoyée avec succès dans l'historique de l'étudiant !
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isGrading}
                          className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold py-2 px-5 rounded-lg text-xs transition-colors flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Valider la correction</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-800 text-xs text-slate-400 font-mono rounded-xl">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      <span>Aucune copie d'élève reçue pour l'instant.</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div id="assign-onboarding-card" className="bg-slate-850 p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-3.5 shadow-sm h-64">
              <Award className="w-10 h-10 text-slate-600 animate-pulse" />
              <div className="max-w-md">
                <span className="text-md font-bold text-slate-350 block leading-tight">Aucun devoir sélectionné</span>
                <span className="text-xs text-slate-500 select-none block mt-1">Sélectionnez une évaluation sur la gauche pour vérifier les consignes et soumettre vos travaux rédigés.</span>
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
