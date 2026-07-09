/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  CheckSquare, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Zap,
  Loader2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Quiz, QuizQuestion, User } from '../types';

interface QuizViewProps {
  currentUser: User;
  quizzes: Quiz[];
  onSubmitQuizScore: (id: string, score: number) => Promise<void>;
  onPublishQuiz: (newQuiz: Quiz) => Promise<void>;
  offlineMode: boolean;
}

export default function QuizView({
  currentUser,
  quizzes,
  onSubmitQuizScore,
  onPublishQuiz,
  offlineMode
}: QuizViewProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  
  // Student states for taking active quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalCalculatedScore, setFinalCalculatedScore] = useState(0);

  // States for Teacher generating Quiz via Gemini
  const [aiQuizTopic, setAiQuizTopic] = useState('');
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizSuccessMsg, setQuizSuccessMsg] = useState(false);

  const startTakingQuiz = (q: Quiz) => {
    setSelectedQuiz(q);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setFinalCalculatedScore(0);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Analyze final score
      let scoreCount = 0;
      selectedQuiz.questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctOptionIndex) {
          scoreCount += 1;
        }
      });
      setFinalCalculatedScore(scoreCount);
      setQuizFinished(true);
      onSubmitQuizScore(selectedQuiz.id, scoreCount);
    }
  };

  // Triggers server-side AI quiz generator using Gemini 3.5
  const generateQuizFromIa = async () => {
    if (!aiQuizTopic) return;
    setIsGeneratingQuiz(true);
    setAiGeneratedQuestions([]);
    setQuizSuccessMsg(false);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiQuizTopic })
      });
      const data = await response.json();
      if (data.questions) {
        setAiGeneratedQuestions(data.questions);
      }
    } catch {
      // Fallback in case of server transport error
      console.error('Quiz AI Generation Error');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Publishes generated quiz in memory
  const saveAndPublishQuiz = async () => {
    if (!selectedQuiz && aiGeneratedQuestions.length === 0) return;
    const newQuizObj: Quiz = {
      id: "quiz-" + Date.now(),
      courseId: "c1",
      courseTitle: "Algorithmique et Structures de Données",
      title: "Quiz IA : " + aiQuizTopic,
      description: "Quiz auto-généré sur " + aiQuizTopic,
      durationMinutes: 10,
      questions: aiGeneratedQuestions,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    await onPublishQuiz(newQuizObj);
    setQuizSuccessMsg(true);
    setAiGeneratedQuestions([]);
    setAiQuizTopic('');
  };

  return (
    <div id="quiz-view" className="space-y-6">
      
      {/* Header element */}
      <header id="quiz-header">
        <h1 className="text-2xl font-bold tracking-tight text-white">Quiz & Évaluations Progressives</h1>
        <p className="text-sm text-slate-400">Validez vos compétences acquises grâce à des QCM interactifs auto-évalués de 5 minutes.</p>
      </header>

      <section id="quiz-workspace" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column list of quizzes available */}
        <div id="quiz-list-col" className="lg:col-span-1 space-y-4">
          <div className="bg-slate-850 p-4 border border-slate-800 rounded-2xl">
            <h2 className="text-sm font-bold text-slate-250 mb-3 block">Quiz du semestre</h2>
            <div className="space-y-3">
              {quizzes.map(q => {
                const isSelected = selectedQuiz?.id === q.id;
                return (
                  <button
                    key={q.id}
                    id={`quiz-row-btn-${q.id}`}
                    onClick={() => startTakingQuiz(q)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${isSelected ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-slate-800/80 border-slate-705 text-slate-300 hover:border-slate-650'}`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold text-slate-400 mb-1.5 shrink-0">
                      <span>{q.questions.length} Questions</span>
                      {q.submitted ? (
                        <span className="text-emerald-400">✓ Réalisé</span>
                      ) : (
                        <span className="text-amber-500">Non soumis</span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-200 block text-sm leading-snug line-clamp-1">{q.title}</span>
                    <span className="text-[11px] text-slate-400 italic block mt-1.5 truncate">{q.courseTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teacher AI Quiz Generator block */}
          {currentUser.role === 'teacher' && (
            <div id="teacher-quiz-generator-block" className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                Créer un Quiz par IA (Gemini)
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">Saisissez un chapitre de cours ou un sujet de travaux pratiques pour générer instantanément un QCM de 3 questions révisables.</p>
              
              <div className="space-y-3 text-sm">
                <input 
                  type="text" 
                  value={aiQuizTopic}
                  onChange={e => setAiQuizTopic(e.target.value)}
                  placeholder="e.g. Listes chaînées en structures linéaires"
                  className="w-full bg-slate-800 border border-slate-705 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-mono"
                />

                <button
                  id="generate-quiz-btn"
                  onClick={generateQuizFromIa}
                  disabled={isGeneratingQuiz || !aiQuizTopic}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 text-xs"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Génération IA...</span>
                    </>
                  ) : (
                    "Générer via Gemini 3.5"
                  )}
                </button>
              </div>

              {/* Display resulting questions and let professor saving them */}
              {aiGeneratedQuestions.length > 0 && (
                <div id="generated-quiz-reviewer" className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-emerald-400 block font-mono">✓ Quiz Généré avec succès !</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto text-xs p-2 bg-slate-800 rounded-lg">
                    {aiGeneratedQuestions.map((gq, idx) => (
                      <div key={idx} className="border-b border-slate-700/50 pb-2 last:border-0">
                        <span className="font-semibold text-white block">{idx + 1}. {gq.text}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block italic">Options: {gq.options?.join(', ')}</span>
                      </div>
                    ))}
                  </div>

                  {quizSuccessMsg && (
                    <div className="text-[11px] font-mono text-emerald-400 text-center py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      Quiz intégré et disponible pour les étudiants !
                    </div>
                  )}

                  <button
                    id="publish-quiz-btn"
                    onClick={saveAndPublishQuiz}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-1.5 rounded-lg text-xs font-sans"
                  >
                    Publier sur la plateforme
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Interaction view for taking selected quiz */}
        <div id="quiz-interaction-col" className="lg:col-span-2">
          {selectedQuiz ? (
            <div id="active-quiz-frame" className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-sm">
              <header className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 italic font-sans">{selectedQuiz.courseTitle}</span>
                  <h2 className="text-lg font-bold text-white leading-tight mt-0.5">{selectedQuiz.title}</h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-350 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-705">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedQuiz.durationMinutes} minutes</span>
                </div>
              </header>

              {/* Questionnaire details */}
              {!quizFinished && !selectedQuiz.submitted ? (
                /* Question detail row */
                <div id="quiz-ongoing-mode" className="space-y-6">
                  <div className="bg-slate-800/60 p-4 border border-slate-705/40 rounded-xl flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-400 font-mono">Question {currentQuestionIndex + 1} de {selectedQuiz.questions.length}</span>
                      <h4 className="text-md font-bold text-white leading-snug font-sans mt-1">
                        {selectedQuiz.questions[currentQuestionIndex].text}
                      </h4>
                    </div>
                  </div>

                  {/* Multiple options select container */}
                  <div id="quiz-options-list" className="space-y-3.5">
                    {selectedQuiz.questions[currentQuestionIndex].options?.map((opt, oIdx) => {
                      const isChecked = selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          id={`opt-idx-btn-${oIdx}`}
                          onClick={() => handleSelectOption(selectedQuiz.questions[currentQuestionIndex].id, oIdx)}
                          className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-center justify-between group ${isChecked ? 'bg-emerald-600/15 border-emerald-500 text-emerald-100 font-semibold' : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300'}`}
                        >
                          <span>{opt}</span>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isChecked ? 'border-emerald-400 bg-emerald-500 text-white' : 'border-slate-650 group-hover:border-slate-500'}`}>
                            {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Next / Submit buttons bar */}
                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      id="next-question-btn"
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === undefined}
                      className="bg-emerald-600 hover:bg-emerald-555 disabled:bg-slate-750 disabled:text-slate-500 text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>{currentQuestionIndex === selectedQuiz.questions.length - 1 ? "Terminer & Soumettre" : "Question Suivante"}</span>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Quiz Scorecard displaying automatically graded points */
                <div id="quiz-results-mode" className="space-y-6 text-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
                    <h3 className="text-xl font-bold text-white">Évaluation Terminée !</h3>
                    <p className="text-slate-400 text-xs font-mono">Auto-correction effectuée à {new Date().toLocaleTimeString('fr-FR')}</p>
                  </div>

                  {/* Score circle badge */}
                  <div className="inline-flex bg-slate-800/80 border border-slate-705 px-8 py-5 rounded-2xl flex-col shadow-inner">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold">Votre Score</span>
                    <span className="text-3xl font-extrabold text-white mt-1">
                      {selectedQuiz.submitted ? (selectedQuiz.score !== undefined ? selectedQuiz.score : finalCalculatedScore) : finalCalculatedScore} / {selectedQuiz.questions.length}
                    </span>
                    <span className="text-xs text-emerald-405 font-sans mt-1">Évaluation validée académiquement</span>
                  </div>

                  {/* Explanatory Review of answers correctness */}
                  <div className="text-left space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">Correction détaillée</h4>
                    {selectedQuiz.questions.map((q, idx) => {
                      const userAns = selectedAnswers[q.id];
                      const currentIsCorrect = userAns === q.correctOptionIndex;
                      return (
                        <div key={q.id} className="p-4 bg-slate-800 border border-slate-750/70 rounded-xl text-xs space-y-2">
                          <span className="font-semibold text-slate-100 block">{idx + 1}. {q.text}</span>
                          <div className="flex flex-col gap-1 font-sans">
                            <span className={`flex items-center gap-1.5 font-medium ${currentIsCorrect || selectedQuiz.submitted ? 'text-emerald-400' : 'text-rose-450'}`}>
                              <span>{currentIsCorrect || selectedQuiz.submitted ? '✓ Votre option choisie est correcte' : '✗ Mauvais choix'}</span>
                            </span>
                            <span className="text-slate-400 italic font-mono block">Option attendue : "{q.options?.[q.correctOptionIndex!]}"</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div id="quiz-onboarding-card" className="bg-slate-850 p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center gap-3.5 shadow-sm h-64">
              <CheckSquare className="w-10 h-10 text-slate-600 animate-pulse" />
              <div className="max-w-md">
                <span className="text-md font-bold text-slate-350 block leading-tight">Aucun quiz sélectionné</span>
                <span className="text-xs text-slate-500 block mt-1">Sélectionnez une évaluation à choix multiples sur le panneau latéral pour évaluer vos compétences scolaires.</span>
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
