/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  CheckSquare, 
  Users, 
  Plus, 
  PlusCircle, 
  BookMarked, 
  FileText, 
  Check, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Course, Assignment, Quiz, User, CourseModule, CourseMaterial, QuizQuestion } from '../types';

interface TeacherViewProps {
  currentUser: User;
  courses: Course[];
  assignments: Assignment[];
  quizzes: Quiz[];
  usersList: User[];
  onAddCourse: (course: Course) => Promise<void>;
  onAddAssignment: (assignment: Assignment) => Promise<void>;
  onAddQuiz: (quiz: Quiz) => Promise<void>;
  onUpdateCourse?: (course: Course) => Promise<void>;
  offlineMode: boolean;
}

export default function TeacherView({
  currentUser,
  courses,
  assignments,
  quizzes,
  usersList,
  onAddCourse,
  onAddAssignment,
  onAddQuiz,
  onUpdateCourse,
  offlineMode
}: TeacherViewProps) {
  // Security role safeguard: Only users with role === 'teacher' can view or access this component
  if (currentUser.role !== 'teacher') {
    return (
      <div id="restricted-teacher-access" className="bg-slate-900 border border-slate-800 text-slate-100 p-8 rounded-2xl text-center max-w-lg mx-auto my-12 shadow-xl space-y-4">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-white">Accès Réservé aux Enseignants</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Désolé, votre compte n'a pas les privilèges nécessaires. Seuls les professeurs agréés de la Plateforme d'Étude peuvent accéder à cet espace de conception pédagogique et créer des quiz.
        </p>
      </div>
    );
  }

  // Navigation internal tabs
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'assignments' | 'quizzes' | 'students'>('courses');

  // Filter teacher's own courses
  const myCourses = courses.filter(c => c.teacherId === currentUser.id);
  const myCourseIds = myCourses.map(c => c.id);

  // Filter teacher's own assignments and quizzes
  const myAssignments = assignments.filter(a => myCourseIds.includes(a.courseId));
  const myQuizzes = quizzes.filter(q => myCourseIds.includes(q.courseId));

  // Filter students from the user list
  const students = usersList.filter(u => u.role === 'student');

  // Course Form States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseFaculty, setCourseFaculty] = useState(currentUser.faculty || 'Sciences Appliquées & Polytechnique');
  const [courseDept, setCourseDept] = useState(currentUser.department || 'Génie Informatique');
  const [courseCredits, setCourseCredits] = useState(5);
  const [courseYear, setCourseYear] = useState('Deuxième Licence LMD');
  const [courseSuccess, setCourseSuccess] = useState(false);

  // Module / Material Modal States
  const [selectedCourseForModule, setSelectedCourseForModule] = useState<Course | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialType, setMaterialType] = useState<'pdf' | 'video' | 'presentation' | 'audio' | 'text'>('pdf');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialSize, setMaterialSize] = useState('2.4 MB');
  const [moduleSuccess, setModuleSuccess] = useState(false);

  // Assignment Form States
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignPoints, setAssignPoints] = useState(20);
  const [assignCourseId, setAssignCourseId] = useState(myCourses[0]?.id || '');
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Grading State
  const [selectedSubmission, setSelectedSubmission] = useState<Assignment | null>(null);
  const [gradeScore, setGradeScore] = useState(15);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradeSuccess, setGradeSuccess] = useState(false);

  // Quiz Form States
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizStep, setQuizStep] = useState<1 | 2 | 3>(1);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizDuration, setQuizDuration] = useState(15);
  const [quizDueDate, setQuizDueDate] = useState('');
  const [quizCourseId, setQuizCourseId] = useState(myCourses[0]?.id || '');
  
  // Quiz Questions construction
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentQuestionType, setCurrentQuestionType] = useState<'mcq' | 'open'>('mcq');
  const [mcqOptions, setMcqOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // Student progress view selection
  const [selectedStudentProg, setSelectedStudentProg] = useState<User | null>(null);

  // Handle creating course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseCode) return;

    const newCourse: Course = {
      id: 'course-' + Date.now(),
      code: courseCode,
      title: courseTitle,
      description: courseDesc,
      faculty: courseFaculty,
      department: courseDept,
      academicYear: courseYear,
      credits: Number(courseCredits),
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      modules: []
    };

    try {
      await onAddCourse(newCourse);
      setCourseSuccess(true);
      setTimeout(() => {
        setShowCourseModal(false);
        setCourseSuccess(false);
        setCourseTitle('');
        setCourseCode('');
        setCourseDesc('');
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle adding module and material
  const handleAddModuleAndMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForModule || !moduleTitle) return;

    const newMaterial: CourseMaterial = {
      id: 'mat-' + Date.now(),
      title: materialTitle || 'Document de Support',
      type: materialType,
      url: materialUrl || `/docs/${materialType}_support_${Date.now()}`,
      size: materialSize || '1.5 MB'
    };

    const newModule: CourseModule = {
      id: 'mod-' + Date.now(),
      title: moduleTitle,
      materials: materialTitle ? [newMaterial] : []
    };

    const updatedCourse: Course = {
      ...selectedCourseForModule,
      modules: [...selectedCourseForModule.modules, newModule]
    };

    try {
      if (onUpdateCourse) {
        await onUpdateCourse(updatedCourse);
      } else {
        await onAddCourse(updatedCourse); // fallback
      }
      setModuleSuccess(true);
      setTimeout(() => {
        setSelectedCourseForModule(null);
        setModuleSuccess(false);
        setModuleTitle('');
        setMaterialTitle('');
        setMaterialUrl('');
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle creating assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseId = assignCourseId || myCourses[0]?.id;
    if (!assignTitle || !courseId) return;

    const selectedC = courses.find(c => c.id === courseId);
    const newAssign: Assignment = {
      id: 'assign-' + Date.now(),
      courseId,
      courseTitle: selectedC ? selectedC.title : 'Cours Enseignant',
      title: assignTitle,
      description: assignDesc,
      dueDate: assignDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      points: Number(assignPoints)
    };

    try {
      await onAddAssignment(newAssign);
      setAssignSuccess(true);
      setTimeout(() => {
        setShowAssignModal(false);
        setAssignSuccess(false);
        setAssignTitle('');
        setAssignDesc('');
        setAssignDueDate('');
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Grading
  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    const updated: Assignment = {
      ...selectedSubmission,
      grade: Number(gradeScore),
      gradeFeedback: gradeFeedback
    };

    try {
      await onAddAssignment(updated); // saveAssignmentInFirestore is mapped to this on backend
      setGradeSuccess(true);
      setTimeout(() => {
        setSelectedSubmission(null);
        setGradeSuccess(false);
        setGradeFeedback('');
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle adding question to quiz construct
  const handleAddQuestionToConstruct = () => {
    if (!currentQuestionText) return;

    const newQuestion: QuizQuestion = {
      id: 'q-const-' + Date.now() + '-' + quizQuestions.length,
      text: currentQuestionText,
      type: currentQuestionType,
      options: currentQuestionType === 'mcq' ? mcqOptions.filter(o => o !== '') : undefined,
      correctOptionIndex: currentQuestionType === 'mcq' ? correctOptionIdx : undefined
    };

    setQuizQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestionText('');
    setMcqOptions(['', '', '', '']);
    setCorrectOptionIdx(0);
  };

  // Handle publishing complete quiz
  const handlePublishQuiz = async () => {
    const courseId = quizCourseId || myCourses[0]?.id;
    if (!quizTitle || !courseId || quizQuestions.length === 0) return;

    const selectedC = courses.find(c => c.id === courseId);
    const newQuiz: Quiz = {
      id: 'quiz-' + Date.now(),
      courseId,
      courseTitle: selectedC ? selectedC.title : 'Cours Enseignant',
      title: quizTitle,
      description: quizDesc,
      durationMinutes: Number(quizDuration),
      dueDate: quizDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      questions: quizQuestions
    };

    try {
      await onAddQuiz(newQuiz);
      setQuizSuccess(true);
      setTimeout(() => {
        setShowQuizModal(false);
        setQuizSuccess(false);
        setQuizTitle('');
        setQuizDesc('');
        setQuizQuestions([]);
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="teacher-space-view" className="space-y-6">
      
      {/* Tab bar header for sub-navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          id="teacher-subtab-courses"
          onClick={() => setActiveSubTab('courses')}
          className={`py-2.5 px-4 font-sans font-semibold text-sm transition-all border-b-2 shrink-0 ${activeSubTab === 'courses' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Mes Cours ({myCourses.length})</span>
          </div>
        </button>

        <button
          id="teacher-subtab-assignments"
          onClick={() => setActiveSubTab('assignments')}
          className={`py-2.5 px-4 font-sans font-semibold text-sm transition-all border-b-2 shrink-0 ${activeSubTab === 'assignments' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Gestion des Devoirs ({myAssignments.length})</span>
          </div>
        </button>

        <button
          id="teacher-subtab-quizzes"
          onClick={() => setActiveSubTab('quizzes')}
          className={`py-2.5 px-4 font-sans font-semibold text-sm transition-all border-b-2 shrink-0 ${activeSubTab === 'quizzes' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            <span>Gestion des Quiz ({myQuizzes.length})</span>
          </div>
        </button>

        <button
          id="teacher-subtab-students"
          onClick={() => setActiveSubTab('students')}
          className={`py-2.5 px-4 font-sans font-semibold text-sm transition-all border-b-2 shrink-0 ${activeSubTab === 'students' ? 'border-blue-600 text-blue-650' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Mes Étudiants ({students.length})</span>
          </div>
        </button>
      </div>

      {/* 1. MES COURS SUB-TAB */}
      {activeSubTab === 'courses' && (
        <div id="teacher-courses-section" className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vos Enseignements à la Plateforme d'Étude</h2>
              <p className="text-xs text-slate-500 mt-1">Créez vos syllabus, ajoutez des chapitres et téléversez des supports d'étude.</p>
            </div>
            <button
              id="btn-trigger-course-modal"
              onClick={() => {
                setAssignCourseId(myCourses[0]?.id || '');
                setQuizCourseId(myCourses[0]?.id || '');
                setShowCourseModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-550 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un cours</span>
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
              <BookOpen className="w-10 h-10 text-slate-300" />
              <div className="max-w-md">
                <span className="font-bold text-slate-700 block">Aucun cours actif</span>
                <span className="text-xs text-slate-500 block mt-1">Vous n'avez pas encore créé de cours. Cliquez sur "Créer un cours" ci-dessus pour commencer.</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCourses.map(course => (
                <div key={course.id} id={`teacher-course-card-${course.id}`} className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-650 font-mono text-[10px] font-extrabold rounded-md uppercase">
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold">
                        {course.credits} Crédits
                      </span>
                    </div>
                    <h3 className="text-md font-bold text-slate-900 mt-2 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{course.faculty}</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{course.department}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50/50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">Syllabus & Modules ({course.modules?.length || 0})</h4>
                      {course.modules && course.modules.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {course.modules.map(mod => (
                            <div key={mod.id} className="text-xs flex items-center justify-between p-2 bg-white rounded-lg border border-slate-150">
                              <span className="font-semibold text-slate-700 truncate max-w-[200px]">{mod.title}</span>
                              <span className="text-[10px] font-mono text-slate-400 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                                {mod.materials?.length || 0} support(s)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic mt-1.5">Aucun module défini. Ajoutez-en un pour guider les étudiants.</p>
                      )}
                    </div>

                    <button
                      id={`btn-add-module-${course.id}`}
                      onClick={() => setSelectedCourseForModule(course)}
                      className="w-full py-2 bg-white hover:bg-slate-50 text-blue-650 font-bold text-xs rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Ajouter module + matériel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. GESTION DES DEVOIRS SUB-TAB */}
      {activeSubTab === 'assignments' && (
        <div id="teacher-assignments-section" className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Évaluation des Devoirs d'Étudiants</h2>
              <p className="text-xs text-slate-500 mt-1">Attribuez de nouveaux exercices pratiques et examinez les réponses transmises en temps réel.</p>
            </div>
            <button
              id="btn-trigger-assign-modal"
              disabled={myCourses.length === 0}
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-550 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un devoir</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List of active assignments */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-3xs">
                <h3 className="text-xs font-bold text-slate-700 mb-3 block uppercase tracking-wider font-mono">Devoirs du Semestre</h3>
                {myAssignments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">Aucun devoir créé.</p>
                ) : (
                  <div className="space-y-2.5">
                    {myAssignments.map(assign => {
                      const isSelected = selectedSubmission?.id === assign.id;
                      return (
                        <button
                          key={assign.id}
                          id={`teacher-assign-row-${assign.id}`}
                          onClick={() => {
                            setSelectedSubmission(assign);
                            setGradeScore(assign.grade || 15);
                            setGradeFeedback(assign.gradeFeedback || '');
                            setGradeSuccess(false);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all ${isSelected ? 'bg-blue-50 border-blue-400' : 'bg-slate-50/80 hover:bg-slate-100/50 border-slate-150'}`}
                        >
                          <div className="flex justify-between text-[10px] font-mono font-bold mb-1 uppercase tracking-wider text-slate-400">
                            <span>{assign.points} Pts</span>
                            {assign.submitted ? (
                              <span className="text-emerald-600 font-extrabold flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Soumis
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">À rendre</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-800 text-xs block truncate">{assign.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium mt-1 block truncate">{assign.courseTitle}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Submissions Detail Pane */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-xs font-mono font-bold text-blue-600 tracking-wide uppercase">{selectedSubmission.courseTitle}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedSubmission.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-3 font-mono">
                      <span>Échéance : {new Date(selectedSubmission.dueDate).toLocaleString('fr-FR')}</span>
                      <span className="font-bold text-blue-650">Points : {selectedSubmission.points}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Enoncé original</h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedSubmission.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <span>Copie Transmise par l'Étudiant</span>
                    </h4>

                    {selectedSubmission.submitted ? (
                      <div className="space-y-5">
                        <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-950">
                          {selectedSubmission.submissionText}
                        </div>

                        {/* Grading Form or Score Received */}
                        <form onSubmit={handleGradeSubmission} className="p-5 bg-slate-50 border border-slate-150 rounded-xl space-y-4 text-xs">
                          <h5 className="font-bold text-slate-800 text-sm">Coter la copie de l'élève</h5>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                              <label className="block font-semibold text-slate-600 mb-1">Note de l'examen (sur {selectedSubmission.points})</label>
                              <input
                                type="number"
                                value={gradeScore}
                                onChange={e => setGradeScore(Number(e.target.value))}
                                min={0}
                                max={selectedSubmission.points}
                                required
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:outline-none font-bold"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block font-semibold text-slate-600 mb-1">Commentaire Pédagogique (Feedback)</label>
                              <input
                                type="text"
                                value={gradeFeedback}
                                onChange={e => setGradeFeedback(e.target.value)}
                                placeholder="Excellent travail d'analyse, l'assimilation est parfaite."
                                required
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          {gradeSuccess && (
                            <div className="text-[11px] font-mono text-emerald-600 bg-emerald-50 p-2.5 rounded-lg text-center font-bold">
                              ✓ Note enregistrée et publiée avec succès !
                            </div>
                          )}

                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold py-2 px-5 rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Enregistrer la Correction</span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 text-xs text-slate-400 italic rounded-xl border border-slate-100 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                        <span>Aucune soumission reçue de la part des étudiants sur ce devoir.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 h-64">
                  <ClipboardList className="w-8 h-8 text-slate-300" />
                  <div>
                    <span className="font-bold text-slate-700 block">Aucun devoir sélectionné</span>
                    <span className="text-xs text-slate-400 block mt-1">Choisissez une évaluation dans la colonne de gauche pour l'analyser et y attribuer des notes.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. GESTION DES QUIZ SUB-TAB */}
      {activeSubTab === 'quizzes' && (
        <div id="teacher-quizzes-section" className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Banque des Quiz Interactifs</h2>
              <p className="text-xs text-slate-500 mt-1">Concevez des quiz interactifs de révision et suivez les scores instantanés obtenus par vos élèves.</p>
            </div>
            <button
              id="btn-trigger-quiz-modal"
              disabled={myCourses.length === 0}
              onClick={() => {
                setQuizQuestions([]);
                setQuizTitle('');
                setQuizDesc('');
                setQuizDuration(15);
                setQuizDueDate('');
                setQuizCourseId(myCourses[0]?.id || '');
                setQuizStep(1);
                setShowQuizModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-550 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Créer un Quiz</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* List of active quizzes */}
            <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-3xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Quiz Publiés</h3>
              
              {myQuizzes.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">Aucun quiz disponible pour vos cours.</p>
              ) : (
                <div className="space-y-3">
                  {myQuizzes.map(quiz => (
                    <div key={quiz.id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">
                          {quiz.questions.length} Questions
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Durée : {quiz.durationMinutes} min</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-850 text-xs">{quiz.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{quiz.courseTitle}</span>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-[10px] text-slate-500">
                        <span>Échéance : {new Date(quiz.dueDate).toLocaleDateString('fr-FR')}</span>
                        {quiz.submitted ? (
                          <span className="font-bold text-emerald-600">✓ Tentative effectuée</span>
                        ) : (
                          <span className="italic text-slate-400">Aucune tentative encore</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Results Panel */}
            <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-3xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Scores et Résultats des Élèves</h3>
              
              <div className="space-y-3">
                {myQuizzes.filter(q => q.submitted).length === 0 ? (
                  <div className="p-6 border border-slate-150 rounded-xl text-center space-y-1.5">
                    <Clock className="w-7 h-7 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 italic">En attente de tentatives d'étudiants sur vos quiz.</p>
                  </div>
                ) : (
                  myQuizzes.filter(q => q.submitted).map(quiz => (
                    <div key={quiz.id + '-res'} className="p-4 border border-slate-150 rounded-xl flex items-center justify-between bg-emerald-50/20">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{quiz.title}</h4>
                        <span className="text-[10px] text-slate-500 block">{quiz.courseTitle}</span>
                        <span className="text-[10px] font-mono text-slate-400 mt-1 block">Soumis par : Étudiant A</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-emerald-600 font-mono">
                          {quiz.score} / {quiz.questions.length}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-mono mt-0.5">Note de passage</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. MES ÉTUDIANTS SUB-TAB */}
      {activeSubTab === 'students' && (
        <div id="teacher-students-section" className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Progression et Assiduité des Étudiants</h2>
            <p className="text-xs text-slate-500 mt-1">Examinez le taux de réussite, les soumissions d'exercices et les fiches académiques de vos élèves inscrits.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side list of students */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 font-mono">Liste de Classe</h3>
                
                <div className="space-y-2">
                  {students.map(student => {
                    const isSelected = selectedStudentProg?.id === student.id;
                    return (
                      <button
                        key={student.id}
                        id={`btn-student-progress-${student.id}`}
                        onClick={() => setSelectedStudentProg(student)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${isSelected ? 'bg-blue-50 border-blue-400 text-blue-900' : 'bg-slate-50/50 hover:bg-slate-100/50 border-transparent text-slate-700'}`}
                      >
                        <div>
                          <span className="font-bold text-xs block">{student.name}</span>
                          <span className="text-[10px] font-mono text-slate-450 block mt-0.5">{student.studentId || 'UNIK-2025'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side Student detailed progression chart */}
            <div className="lg:col-span-2">
              {selectedStudentProg ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-xs text-blue-600 font-mono font-bold tracking-wide uppercase">{selectedStudentProg.department || 'Génie Informatique'}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedStudentProg.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">Matricule : {selectedStudentProg.studentId || 'UNIK-2025-0453'} | {selectedStudentProg.faculty || 'Faculté des Sciences'}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Assignments block for student */}
                    <div className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/30">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">Devoirs soumis</h4>
                      
                      <div className="space-y-2">
                        {myAssignments.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Aucun devoir à évaluer.</p>
                        ) : (
                          myAssignments.map(assign => {
                            // Assume if submitted, it was submitted by s1
                            const hasSubmitted = assign.submitted && selectedStudentProg.id === 's1';
                            return (
                              <div key={assign.id + '-prog'} className="text-xs flex justify-between items-center p-2.5 bg-white border border-slate-150 rounded-lg">
                                <span className="font-semibold text-slate-750 truncate max-w-[150px]">{assign.title}</span>
                                {hasSubmitted ? (
                                  <div className="text-right shrink-0">
                                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                                      Note : {assign.grade !== undefined ? `${assign.grade}/${assign.points}` : 'Non corrigé'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded shrink-0">À rendre</span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Quizzes block for student */}
                    <div className="border border-slate-150 rounded-xl p-4 space-y-3 bg-slate-50/30">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">Quiz réalisés</h4>
                      
                      <div className="space-y-2">
                        {myQuizzes.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Aucun quiz à évaluer.</p>
                        ) : (
                          myQuizzes.map(quiz => {
                            const hasFinished = quiz.submitted && selectedStudentProg.id === 's1';
                            return (
                              <div key={quiz.id + '-prog'} className="text-xs flex justify-between items-center p-2.5 bg-white border border-slate-150 rounded-lg">
                                <span className="font-semibold text-slate-750 truncate max-w-[150px]">{quiz.title}</span>
                                {hasFinished ? (
                                  <span className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                                    Score : {quiz.score}/{quiz.questions.length}
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded shrink-0">Incomplet</span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 h-64">
                  <Users className="w-8 h-8 text-slate-300" />
                  <div>
                    <span className="font-bold text-slate-700 block">Sélectionnez un étudiant</span>
                    <span className="text-xs text-slate-400 block mt-1">Cliquez sur un nom dans la colonne de gauche pour analyser ses notes détaillées, son assiduité et ses travaux académiques.</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}


      {/* MODAL 1: CRÉER UN COURS */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              id="close-course-modal"
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Créer une nouvelle Unité d'Enseignement (UE)</span>
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-slate-600 font-semibold mb-1">Code du cours</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    placeholder="POLY-201"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Titre de l'Unité</label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={e => setCourseTitle(e.target.value)}
                    placeholder="Algorithmique avancée"
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description pédagogique</label>
                <textarea
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="Objectifs d'apprentissage, syllabus abrégé et prérequis indispensables..."
                  rows={3}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Faculté rattachée</label>
                  <select
                    value={courseFaculty}
                    onChange={e => setCourseFaculty(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Sciences Appliquées & Polytechnique">Sciences Appliquées & Polytechnique</option>
                    <option value="Sciences Agronomiques">Sciences Agronomiques</option>
                    <option value="Sciences Économiques & Gestion">Sciences Économiques & Gestion</option>
                    <option value="Droit">Droit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Département académique</label>
                  <input
                    type="text"
                    value={courseDept}
                    onChange={e => setCourseDept(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Crédits d'évaluation (ECTS)</label>
                  <input
                    type="number"
                    value={courseCredits}
                    onChange={e => setCourseCredits(Number(e.target.value))}
                    min={1}
                    max={15}
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Promotion ciblée</label>
                  <input
                    type="text"
                    value={courseYear}
                    onChange={e => setCourseYear(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {courseSuccess && (
                <div className="text-[11px] font-mono text-emerald-600 bg-emerald-50 p-2.5 rounded-lg text-center font-bold">
                  ✓ Unité d'Enseignement créée avec succès dans Firestore !
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-550 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Créer le cours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 2: AJOUTER MODULE ET MATÉRIEL */}
      {selectedCourseForModule && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              id="close-module-modal"
              onClick={() => setSelectedCourseForModule(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Ajouter un module d'étude : {selectedCourseForModule.title}</span>
            </h3>

            <form onSubmit={handleAddModuleAndMaterial} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Titre du chapitre / module</label>
                <input
                  type="text"
                  value={moduleTitle}
                  onChange={e => setModuleTitle(e.target.value)}
                  placeholder="Chapitre 4 : Implémentation des arbres binaires"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">Soutien ou support didactique (Optionnel)</span>
                
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nom du fichier ou support</label>
                  <input
                    type="text"
                    value={materialTitle}
                    onChange={e => setMaterialTitle(e.target.value)}
                    placeholder="Support de Cours PDF - Arbres et tris"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Type de document</label>
                    <select
                      value={materialType}
                      onChange={e => setMaterialType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="pdf">Document PDF</option>
                      <option value="video">Vidéo d'apprentissage</option>
                      <option value="presentation">Slides de cours (PPT)</option>
                      <option value="audio">Enregistrement audio</option>
                      <option value="text">Fiche mémo / Code source</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Taille estimée du fichier</label>
                    <input
                      type="text"
                      value={materialSize}
                      onChange={e => setMaterialSize(e.target.value)}
                      placeholder="2.4 MB"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {moduleSuccess && (
                <div className="text-[11px] font-mono text-emerald-600 bg-emerald-50 p-2.5 rounded-lg text-center font-bold">
                  ✓ Module d'étude et support enregistrés dans Firestore !
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCourseForModule(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-550 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Ajouter le module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 3: CRÉER UN DEVOIR */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              id="close-assign-modal"
              onClick={() => setShowAssignModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Attribuer une évaluation (Travail Pratique / Maison)</span>
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Associer à un cours actif</label>
                <select
                  value={assignCourseId}
                  onChange={e => setAssignCourseId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  {myCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Titre de l'évaluation</label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={e => setAssignTitle(e.target.value)}
                  placeholder="TP 2 : Implémentation complète d'un arbre binaire"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Instructions d'évaluation (Énoncé)</label>
                <textarea
                  value={assignDesc}
                  onChange={e => setAssignDesc(e.target.value)}
                  placeholder="Expliquez en détail les contraintes techniques, les jalons attendus et le format de rendu attendu..."
                  rows={4}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date limite de soumission</label>
                  <input
                    type="datetime-local"
                    value={assignDueDate}
                    onChange={e => setAssignDueDate(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-850 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Note maximale (Barème)</label>
                  <input
                    type="number"
                    value={assignPoints}
                    onChange={e => setAssignPoints(Number(e.target.value))}
                    min={5}
                    max={100}
                    required
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-850 font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {assignSuccess && (
                <div className="text-[11px] font-mono text-emerald-600 bg-emerald-50 p-2.5 rounded-lg text-center font-bold">
                  ✓ Devoir créé et publié avec succès dans Firestore !
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-550 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Publier l'évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 4: CRÉER UN QUIZ */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-100 font-sans">
            <button
              id="close-quiz-modal"
              onClick={() => setShowQuizModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/25">
                <CheckSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Créer un Quiz d'Évaluation
                </h3>
                <p className="text-[11px] text-slate-400">Espace de conception interactive des quiz de la Plateforme d'Étude</p>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-3 gap-2 mb-6 relative">
              <button 
                type="button"
                onClick={() => setQuizStep(1)}
                className={`py-2 px-3 text-left rounded-xl transition-all border ${
                  quizStep === 1 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' 
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Étape 1</span>
                <span className="text-[11px]">Infos générales</span>
              </button>

              <button 
                type="button"
                disabled={!quizTitle}
                onClick={() => setQuizStep(2)}
                className={`py-2 px-3 text-left rounded-xl transition-all border ${
                  quizStep === 2 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' 
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Étape 2</span>
                <span className="text-[11px]">Questions ({quizQuestions.length})</span>
              </button>

              <button 
                type="button"
                disabled={quizQuestions.length === 0}
                onClick={() => setQuizStep(3)}
                className={`py-2 px-3 text-left rounded-xl transition-all border ${
                  quizStep === 3 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-bold' 
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">Étape 3</span>
                <span className="text-[11px]">Confirmation</span>
              </button>
            </div>

            {/* Step Content */}
            <div className="text-xs space-y-4">
              {/* STEP 1: GENERAL INFOS */}
              {quizStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Associer à un cours actif</label>
                    <select
                      value={quizCourseId}
                      onChange={e => setQuizCourseId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="" disabled>-- Sélectionner un de vos cours --</option>
                      {myCourses.map(c => (
                        <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Titre du quiz</label>
                    <input
                      type="text"
                      value={quizTitle}
                      onChange={e => setQuizTitle(e.target.value)}
                      placeholder="Quiz d'assimilation : Structures linéaires"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Description pédagogique et consignes</label>
                    <textarea
                      value={quizDesc}
                      onChange={e => setQuizDesc(e.target.value)}
                      placeholder="Ce quiz valide la lecture autonome du chapitre 1. Assurez-vous d'avoir bien étudié..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Durée accordée (Minutes)</label>
                      <input
                        type="number"
                        value={quizDuration}
                        onChange={e => setQuizDuration(Number(e.target.value))}
                        min={1}
                        max={180}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Date limite de soumission</label>
                      <input
                        type="datetime-local"
                        value={quizDueDate}
                        onChange={e => setQuizDueDate(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:border-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800 mt-6">
                    <button
                      type="button"
                      disabled={!quizTitle || !quizCourseId}
                      onClick={() => setQuizStep(2)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-550 disabled:bg-slate-850 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed animate-pulse"
                    >
                      <span>Suivant : Ajouter les questions</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: QUESTIONS CREATOR */}
              {quizStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl space-y-4">
                    <span className="font-bold text-blue-400 block text-xs tracking-wider uppercase">Nouvelle Question</span>
                    
                    <div>
                      <label className="block text-slate-350 font-semibold mb-1.5">Type de question</label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 font-sans text-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name="questionTypeRadio"
                            checked={currentQuestionType === 'mcq'}
                            onChange={() => setCurrentQuestionType('mcq')}
                            className="text-blue-500 focus:ring-0 bg-slate-950 border-slate-800"
                          />
                          <span>QCM (Choix Multiple)</span>
                        </label>
                        <label className="flex items-center gap-2 font-sans text-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name="questionTypeRadio"
                            checked={currentQuestionType === 'open'}
                            onChange={() => setCurrentQuestionType('open')}
                            className="text-blue-500 focus:ring-0 bg-slate-950 border-slate-800"
                          />
                          <span>Question Ouverte</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-350 font-semibold mb-1.5">Texte de la question</label>
                      <input
                        type="text"
                        value={currentQuestionText}
                        onChange={e => setCurrentQuestionText(e.target.value)}
                        placeholder="Ex : Quelle est la complexité temporelle du tri rapide dans le pire des cas ?"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    {currentQuestionType === 'mcq' && (
                      <div className="space-y-2.5">
                        <label className="block text-slate-350 font-semibold mb-1">Options de réponse (4 options) & Bonne réponse</label>
                        <div className="space-y-2">
                          {mcqOptions.map((opt, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <span className="text-[11px] font-mono text-slate-500 w-4 font-bold">{idx + 1}.</span>
                              <input
                                type="text"
                                value={opt}
                                onChange={e => {
                                  const updated = [...mcqOptions];
                                  updated[idx] = e.target.value;
                                  setMcqOptions(updated);
                                }}
                                placeholder={`Texte de l'option ${idx + 1}`}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => setCorrectOptionIdx(idx)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  correctOptionIdx === idx 
                                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50' 
                                    : 'bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800'
                                }`}
                              >
                                Bonne option
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!currentQuestionText || (currentQuestionType === 'mcq' && mcqOptions.some(o => !o))}
                      onClick={handleAddQuestionToConstruct}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-550 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter la question</span>
                    </button>
                  </div>

                  {/* List of Questions Added */}
                  <div className="space-y-2.5 pt-2">
                    <span className="font-bold text-slate-300 block text-xs">Questions ajoutées en temps réel ({quizQuestions.length})</span>
                    {quizQuestions.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic py-2 text-center bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">Aucune question n'a encore été ajoutée à ce quiz.</p>
                    ) : (
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {quizQuestions.map((q, idx) => (
                          <div key={q.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between gap-3 text-[11px]">
                            <div className="space-y-1">
                              <span className="font-semibold text-white block">Q{idx + 1} : {q.text}</span>
                              <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-slate-850 text-slate-400">
                                {q.type === 'mcq' ? 'QCM / MCQ' : 'Réponse Ouverte'}
                              </span>
                              {q.type === 'mcq' && q.options && (
                                <div className="mt-1 pl-2 border-l border-slate-800 space-y-0.5 text-[10px] text-slate-450">
                                  {q.options.map((opt, optIdx) => (
                                    <span key={optIdx} className={`block ${q.correctOptionIndex === optIdx ? 'text-emerald-400 font-medium' : ''}`}>
                                      {optIdx + 1}) {opt} {q.correctOptionIndex === optIdx ? '✓ (Réponse)' : ''}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setQuizQuestions(prev => prev.filter(item => item.id !== q.id))}
                              className="text-red-400 hover:text-red-300 text-[10px] font-bold bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-lg border border-red-500/20 transition-all shrink-0 cursor-pointer"
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-between pt-4 border-t border-slate-800 mt-6">
                    <button
                      type="button"
                      onClick={() => setQuizStep(1)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      disabled={quizQuestions.length === 0}
                      onClick={() => setQuizStep(3)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-550 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span>Confirmer et publier</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIRM AND DEPLOY */}
              {quizStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-950/60 p-5 border border-slate-800 rounded-xl space-y-4">
                    <span className="font-bold text-emerald-400 block text-xs tracking-wider uppercase">Résumé et Validation</span>
                    
                    <div className="space-y-2.5 text-xs text-slate-200">
                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Titre du quiz :</span>
                        <span className="font-bold text-white text-right">{quizTitle}</span>
                      </div>
                      
                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Cours cible :</span>
                        <span className="font-bold text-white text-right">
                          {courses.find(c => c.id === quizCourseId)?.title || 'Sélectionné'}
                        </span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Durée limite :</span>
                        <span className="font-bold text-white text-right font-mono text-emerald-400">{quizDuration} minutes</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-slate-850">
                        <span className="text-slate-400">Date limite de soumission :</span>
                        <span className="font-bold text-white text-right font-mono">
                          {quizDueDate ? new Date(quizDueDate).toLocaleString('fr-FR') : 'Non définie'}
                        </span>
                      </div>

                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Nombre de questions configurées :</span>
                        <span className="font-bold text-blue-400 text-right font-mono text-sm">{quizQuestions.length}</span>
                      </div>
                    </div>
                  </div>

                  {quizSuccess && (
                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800 p-3 rounded-xl text-center font-bold">
                      ✓ Le Quiz a été créé et déployé avec succès sur la Plateforme d'Étude !
                    </div>
                  )}

                  <div className="flex gap-2 justify-between pt-4 border-t border-slate-800 mt-6">
                    <button
                      type="button"
                      onClick={() => setQuizStep(2)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      disabled={quizQuestions.length === 0 || !quizTitle || !quizCourseId}
                      onClick={handlePublishQuiz}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-550 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Publier le Quiz</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
