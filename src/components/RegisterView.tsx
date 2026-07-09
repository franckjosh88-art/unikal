import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  auth, 
  db 
} from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  X, 
  FileText, 
  AlertCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { User, UserRole } from '../types';

interface RegisterViewProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function RegisterView({ onClose, onAuthSuccess }: RegisterViewProps) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [registerRole, setRegisterRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [faculty, setFaculty] = useState('Sciences Appliquées & Polytechnique');
  const [department, setDepartment] = useState('Génie Informatique');

  // Student specific
  const [studentId, setStudentId] = useState('');

  // Teacher specific
  const [matricule, setMatricule] = useState('');
  const [specialty, setSpecialty] = useState('');

  const FACULTIES_DEPTS = [
    {
      faculty: 'Sciences Appliquées & Polytechnique',
      departments: ['Génie Informatique', 'Génie Civil', 'Génie Électrique', 'Mines et Métallurgie']
    },
    {
      faculty: 'Sciences Économiques & Gestion',
      departments: ['Gestion Financière', 'Économie Publique', 'Économie de Développement', 'Marketing']
    },
    {
      faculty: 'Sciences Agronomiques',
      departments: ['Phytotechnie', 'Zootechnie', 'Économie Agricole']
    },
    {
      faculty: 'Droit',
      departments: ['Droit Public', 'Droit Privé', 'Droit Économique']
    },
    {
      faculty: 'Médecine & Santé Publique',
      departments: ['Médecine Générale', 'Santé Communautaire', 'Nutrition']
    }
  ];

  const activeFacultyDepts = FACULTIES_DEPTS.find(f => f.faculty === faculty)?.departments || [];

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFaculty = e.target.value;
    setFaculty(selectedFaculty);
    const depts = FACULTIES_DEPTS.find(f => f.faculty === selectedFaculty)?.departments || [];
    if (depts.length > 0) {
      setDepartment(depts[0]);
    }
  };

  const validateInstitutionalEmail = (emailStr: string): boolean => {
    const suffix = emailStr.toLowerCase().split('@')[1];
    return suffix && (
      suffix.endsWith('.edu') || 
      suffix.endsWith('unik.cd') || 
      suffix.endsWith('unikal.edu') || 
      suffix.endsWith('isp-kalemie.edu') ||
      suffix.includes('kalemie')
    );
  };

  const handleDemoLogin = (role: 'student' | 'teacher') => {
    const mockUser = role === 'teacher'
      ? { id: 't1', name: 'Professeur A', email: 'professeur.a@unik.edu', role: 'teacher' as const, faculty: 'Sciences Appliquées & Polytechnique', department: 'Génie Informatique' }
      : { id: 's1', name: 'Étudiant A', email: 'etudiant.a@unik.edu', role: 'student' as const, faculty: 'Sciences Appliquées & Polytechnique', department: 'Génie Informatique', studentId: 'UNIK-2025-0453' };

    onAuthSuccess(mockUser);
    onClose();
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs requis.");
      setLoading(false);
      return;
    }

    if (isLoginMode) {
      // HANDLE LOGIN
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // Fetch user from firestore to make sure profile is correct
        const { getDoc, doc } = await import('firebase/firestore');
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = { id: uid, ...userDocSnap.data() } as User;
          onAuthSuccess(userData);
          onClose();
        } else {
          // Fallback if auth exists but no profile document
          const fallbackUser: User = {
            id: uid,
            name: userCredential.user.displayName || email.split('@')[0],
            email: userCredential.user.email || email,
            role: 'student',
            faculty,
            department,
            status: 'approved'
          };
          await setDoc(userDocRef, fallbackUser);
          onAuthSuccess(fallbackUser);
          onClose();
        }
      } catch (err: any) {
        console.error("Login error:", err);
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError("Identifiants incorrects. Veuillez vérifier votre email institutionnel et votre mot de passe.");
        } else if (err.code === 'auth/operation-not-allowed') {
          setError("auth/operation-not-allowed");
        } else {
          setError(err.message || "Une erreur est survenue lors de la connexion.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      // HANDLE REGISTER
      if (!name) {
        setError("Le nom complet est obligatoire.");
        setLoading(false);
        return;
      }

      // Check institutional email format
      if (!validateInstitutionalEmail(email)) {
        setError("Veuillez utiliser un email institutionnel valide pour l'Université de Kalemie (ex: @unik.edu, @unikal.edu, @isp-kalemie.edu etc.)");
        setLoading(false);
        return;
      }

      if (registerRole === 'student' && !studentId) {
        setError("Le numéro d'étudiant est requis (ex: UNIK-2025-XXXX).");
        setLoading(false);
        return;
      }

      if (registerRole === 'teacher' && !matricule) {
        setError("Le numéro de matricule de professeur est requis.");
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const userDocRef = doc(db, 'users', uid);
        const newProfile: User = {
          id: uid,
          name,
          email,
          role: registerRole,
          faculty,
          department,
          status: registerRole === 'teacher' ? 'pending' : 'approved',
          ...(registerRole === 'student' ? { studentId } : { matricule, specialty })
        };

        await setDoc(userDocRef, newProfile);

        if (registerRole === 'teacher') {
          setSuccessMessage("Votre compte enseignant a été créé avec succès ! Cependant, votre accès est en attente de validation par l'administration d'UNIKAL E-Learning. Vous serez notifié dès son approbation.");
          // Clear credentials so they can see the message
          setName('');
          setEmail('');
          setPassword('');
          setStudentId('');
          setMatricule('');
          setSpecialty('');
        } else {
          setSuccessMessage("Compte étudiant créé avec succès ! Connexion automatique...");
          setTimeout(() => {
            onAuthSuccess(newProfile);
            onClose();
          }, 1500);
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        if (err.code === 'auth/email-already-in-use') {
          setError("Cet email institutionnel est déjà associé à un compte existant.");
        } else if (err.code === 'auth/weak-password') {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
        } else if (err.code === 'auth/operation-not-allowed') {
          setError("auth/operation-not-allowed");
        } else {
          setError(err.message || "Une erreur s'est produite lors de la création de votre compte.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-900/35 to-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span className="font-extrabold text-white text-md tracking-tight">UNIKAL E-Learning</span>
          </div>
          <p className="text-xs text-slate-400">
            Portail académique de l'Université de Kalemie
          </p>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(false);
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                !isLoginMode 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              S'inscrire
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(true);
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                isLoginMode 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Se Connecter
            </button>
          </div>

          {/* Registration Role Switcher (only in Register mode) */}
          {!isLoginMode && !successMessage && (
            <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 border border-slate-850 rounded-xl">
              <button
                type="button"
                onClick={() => setRegisterRole('student')}
                className={`py-2 text-center text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  registerRole === 'student'
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Étudiant</span>
              </button>
              <button
                type="button"
                onClick={() => setRegisterRole('teacher')}
                className={`py-2 text-center text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  registerRole === 'teacher'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Enseignant</span>
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {error && error === "auth/operation-not-allowed" ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl flex flex-col gap-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">Fournisseur d'authentification désactivé</h4>
                  <p className="mt-1 text-amber-400/90 text-[11px]">
                    L'authentification par email/mot de passe n'est pas activée par défaut dans votre projet Firebase.
                  </p>
                </div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <span className="font-bold text-slate-200 block border-b border-slate-800 pb-1">Comment l'activer dans la Console Firebase :</span>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Ouvrez la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Console Firebase</a> de votre projet.</li>
                  <li>Allez dans le menu <strong className="text-slate-300">Authentication</strong> (colonne de gauche).</li>
                  <li>Sélectionnez l'onglet <strong className="text-slate-300">Sign-in method</strong> (en haut).</li>
                  <li>Cliquez sur <strong className="text-slate-300">Ajouter un fournisseur</strong> (ou modifier l'existant), puis choisissez <strong className="text-slate-300">Adresse e-mail/Mot de passe</strong>.</li>
                  <li>Activez le premier interrupteur (<strong className="text-slate-300">Adresse e-mail/Mot de passe</strong>) et cliquez sur <strong className="text-slate-300">Enregistrer</strong>.</li>
                </ol>
              </div>
              <div className="border-t border-amber-500/15 pt-3 mt-1">
                <span className="block text-[11px] font-bold text-amber-300 mb-2">Pas envie de configurer Firebase maintenant ? Connectez-vous en un clic :</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('student')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-550 text-white rounded-xl text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Mode Démo (Étudiant)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('teacher')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Mode Démo (Enseignant)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl space-y-2 text-xs">
              <div className="flex items-start gap-2.5 font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{registerRole === 'teacher' ? 'Inscription soumise !' : 'Compte créé !'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-7">{successMessage}</p>
              {registerRole === 'teacher' && (
                <div className="mt-3 pt-3 border-t border-emerald-500/15 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(true);
                      setSuccessMessage(null);
                    }}
                    className="px-4 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition-all"
                  >
                    Aller à la connexion
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Forms */}
          {!successMessage && (
            <form onSubmit={handleAuthAction} className="space-y-4">
              
              {/* Full Name (Register Only) */}
              {!isLoginMode && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Nom Complet</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex : Justin Banza Kilonda"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">
                  {isLoginMode ? 'Email Institutionnel' : 'Email de l\'Université (@unik.edu...)'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={registerRole === 'teacher' && !isLoginMode ? "Ex: j.banza@unik.edu" : "Ex: etudiant@unik.edu"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {!isLoginMode && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Doit être une adresse académique de l'Université de Kalemie ou de l'ISP Kalemie.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Mot de Passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Register Specific Fields */}
              {!isLoginMode && (
                <>
                  {/* Faculty & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Faculté</label>
                      <select
                        value={faculty}
                        onChange={handleFacultyChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                      >
                        {FACULTIES_DEPTS.map((f, i) => (
                          <option key={i} value={f.faculty}>{f.faculty}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Département</label>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                      >
                        {activeFacultyDepts.map((d, i) => (
                          <option key={i} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Student Specific Fields */}
                  {registerRole === 'student' && (
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Numéro Matricule Étudiant</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={studentId}
                          onChange={e => setStudentId(e.target.value)}
                          placeholder="Ex : UNIK-2025-0842"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Teacher Specific Fields */}
                  {registerRole === 'teacher' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Matricule Enseignant</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={matricule}
                            onChange={e => setMatricule(e.target.value)}
                            placeholder="Ex : PROF-UNIKAL-904"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Spécialité / Matières</label>
                        <div className="relative">
                          <Award className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={specialty}
                            onChange={e => setSpecialty(e.target.value)}
                            placeholder="Ex : Réseaux, Algorithmique"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pending Validation warning for teachers */}
                  {registerRole === 'teacher' && (
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2 text-[11px] text-slate-400 leading-normal">
                      <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Note :</strong> Les profils d'enseignants s'enregistrent avec le statut <strong>En attente (pending)</strong>. L'accès à la création de cours et aux fonctionnalités d'évaluation requiert la validation d'un administrateur académique.
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-550 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-xs transition-all shadow-md mt-6 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></span>
                ) : isLoginMode ? (
                  'Se Connecter'
                ) : (
                  `S'inscrire comme ${registerRole === 'teacher' ? 'Enseignant' : 'Étudiant'}`
                )}
              </button>

              <div className="relative my-4 flex py-1.5 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Ou</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('student')}
                  className="w-full py-2.5 bg-slate-800/50 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Tester en Mode Démo (Étudiant)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('teacher')}
                  className="w-full py-2.5 bg-slate-800/50 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Tester en Mode Démo (Enseignant)</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
