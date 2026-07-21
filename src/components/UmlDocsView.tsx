/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileCode, 
  Map, 
  Database, 
  Cpu, 
  BookMarked,
  Info,
  Layers,
  CheckCircle,
  HelpCircle,
  Smartphone
} from 'lucide-react';

export default function UmlDocsView() {
  const [activeSubView, setActiveSubView] = useState<'architecture' | 'uml' | 'database' | 'deploy'>('architecture');

  return (
    <div id="uml-docs-view" className="space-y-6 text-sm font-sans text-slate-350">
      
      {/* View Header */}
      <div id="uml-header-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-emerald-450 shrink-0" />
            Livrables Techniques & Spécifications UML
          </h1>
          <p className="text-sm text-slate-400">Consultez l'architecture, les diagrammes de bases de données, les cas d'utilisation UML et le guide d'ingénierie RDC.</p>
        </div>

        {/* Local category selector */}
        <div id="uml-tab-picker" className="inline-flex bg-slate-850 rounded-xl p-1 shrink-0 border border-slate-755">
          <button
            id="uml-tab-arch-btn"
            onClick={() => setActiveSubView('architecture')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeSubView === 'architecture' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-205 hover:text-white'}`}
          >
            Architecture
          </button>
          <button
            id="uml-tab-uml-btn"
            onClick={() => setActiveSubView('uml')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeSubView === 'uml' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-205 hover:text-white'}`}
          >
            Diagrammes UML
          </button>
          <button
            id="uml-tab-db-btn"
            onClick={() => setActiveSubView('database')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeSubView === 'database' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-205 hover:text-white'}`}
          >
            Base de Données (MCD)
          </button>
          <button
            id="uml-tab-deploy-btn"
            onClick={() => setActiveSubView('deploy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeSubView === 'deploy' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-205 hover:text-white'}`}
          >
            Déploiement Tanganyika
          </button>
        </div>
      </div>

      {/* Pane 1: Architecture layout block */}
      {activeSubView === 'architecture' && (
        <section id="doc-architecture-pane" className="space-y-6">
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Architecture Globale Alignée Tanganyika (RDC)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pour résoudre l'instabilité de courant et la faiblesse du signal mobile (Réseau faible Edge/3G/H+) à Kalemie ou Manono, l'architecture du portail du Lycée Amani repose sur un paradigme de <strong>synchronisation locale différée (Database Queueing)</strong>.
            </p>

            {/* Architecture schema layout block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-705 flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase">1. Client Mobile (Flutter/Dart)</span>
                <p className="text-[11.5px] leading-relaxed">Persiste l'entièreté des cours et exercices dans une base SQLite relationnelle cryptée locale. Un gestionnaire de file d'attente (Sync-Queue) intercepte les requêtes réseau et les met en cache quand le réseau Tanganyika s'interrompt.</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-705 flex flex-col gap-2">
                <span className="text-xs font-bold text-sky-450 font-mono uppercase">2. Passerelle API (Node.js/Express)</span>
                <p className="text-[11.5px] leading-relaxed">Fournit des routes REST légères, hautement compressées en GZIP, assurant le transport optimisé. S'intègre avec Gemini SDK server-side afin d'extraire des fiches de révisions condensées de faible volume.</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-xl border border-slate-705 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-500 font-mono uppercase">3. Durable Storage (Firebase/Auth)</span>
                <p className="text-[11.5px] leading-relaxed">Authentifie les utilisateurs en RDC de manière unifiée et stocke les documents dans Firestore. Des règles sécurisées certifient que les parents ne voient que la copie de leur progéniture.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pane 2: UML Use Cases & Classes diagrams representation */}
      {activeSubView === 'uml' && (
        <section id="doc-uml-pane" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Map className="w-4 h-4 text-emerald-400" />
              Cas d'Utilisation UML (Roles Workflows)
            </h3>
            <div className="space-y-3 prose text-xs leading-relaxed max-w-none text-slate-350 bg-slate-800 p-4 border border-slate-705 rounded-xl font-mono">
              <p className="font-bold text-emerald-400">🎯 ACTEURS & FONCTIONS :</p>
              <ul className="space-y-1.5 list-disc pl-4">
                <li><strong>Étudiant :</strong> Se connecter (Auth) → Consulter Cours téléchargés → Prendre les Quiz auto-évalués → Rendre Devoirs → Chat Tuteur IA.</li>
                <li><strong>Enseignant :</strong> Diffuser Annonces facultés → Insérer syllabus de cours → Créer des Quiz par IA Gemini → Noter et commenter les devoirs remis.</li>
                <li><strong>Parent :</strong> Consulter moyenne académique → Suivre l'assiduité → Contacter les professeurs par chat.</li>
                <li><strong>Administrateur :</strong> Créer des profils académiques → Gérer les universités et métriques globales.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Diagramme de Séquence de Résumé IA
            </h3>
            <div className="p-4 bg-slate-800 border border-slate-705 font-mono text-[10.5px] rounded-xl text-emerald-350 space-y-1.5 leading-relaxed">
              <div>[Étudiant] --- (Clic Résumé IA) ---&gt; [Client React/Mobile]</div>
              <div>[Client React] --- (POST /api/ai/summarize) ---&gt; [Backend Express]</div>
              <div>[Backend Express] --- (Query generateContent) ---&gt; [Gemini 3.5 API]</div>
              <div className="text-white font-bold">[Gemini API] --- (Renvoie format Markdown) ---&gt; [Backend]</div>
              <div>[Backend Express] --- (Formate & Comprime JSON) ---&gt; [Client React]</div>
              <div>[Client React] --- (Actualise l'affichage HTML/CSS) ---&gt; [Étudiant]</div>
            </div>
          </div>
        </section>
      )}

      {/* Pane 3: Database conceptually entities mapping representation */}
      {activeSubView === 'database' && (
        <section id="doc-database-pane" className="space-y-6">
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              Schéma Entités-Associations (MCD / MLD)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">Le schéma du Lycée Amani repose sur des entités fortement normalisées, supportant des exports fluides entre PostgreSQL et Firestore NoSQL.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 font-mono text-xs">
              
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-705 space-y-2">
                <span className="font-bold text-white block border-b border-slate-700 pb-1">👤 Users (Comptes)</span>
                <p className="text-[10px] space-y-1 block">
                  <span className="text-emerald-450 font-bold">id (PK UUID)</span><br />
                  <span>name (VARCHAR)</span><br />
                  <span>email (VARCHAR)</span><br />
                  <span>role (student|teacher|parent|admin)</span><br />
                  <span>faculty (VARCHAR)</span>
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-705 space-y-2">
                <span className="font-bold text-white block border-b border-slate-700 pb-1">📚 Courses</span>
                <p className="text-[10px] space-y-1 block">
                  <span className="text-emerald-455 font-bold">id (PK UUID)</span><br />
                  <span>code (VARCHAR)</span><br />
                  <span>title (VARCHAR)</span><br />
                  <span>description (TEXT)</span><br />
                  <span className="text-sky-400">teacherId (FK)</span><br />
                  <span>credits (INT)</span>
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-705 space-y-2">
                <span className="font-bold text-white block border-b border-slate-700 pb-1">📝 Assignments</span>
                <p className="text-[10px] space-y-1 block">
                  <span className="text-emerald-455 font-bold">id (PK)</span><br />
                  <span className="text-sky-400">courseId (FK)</span><br />
                  <span>title (VARCHAR)</span><br />
                  <span>points (INT)</span><br />
                  <span>submitted (BOOL)</span><br />
                  <span>grade (INT DEFAULT NULL)</span>
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-705 space-y-2">
                <span className="font-bold text-white block border-b border-slate-700 pb-1">🎓 Quizzes</span>
                <p className="text-[10px] space-y-1 block">
                  <span className="text-emerald-455 font-bold">id (PK)</span><br />
                  <span className="text-sky-400">courseId (FK)</span><br />
                  <span>title (VARCHAR)</span><br />
                  <span>durationMinutes (INT)</span><br />
                  <span>questions (JSONB ARRAY)</span>
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Pane 4: Tanganyika low signal & smartphone deployment guidelines */}
      {activeSubView === 'deploy' && (
        <section id="doc-deploy-pane" className="space-y-4">
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              Spécifications de déploiement en RDC
            </h2>
            <div className="h-0.5 bg-slate-850 border-t border-slate-800"></div>
            
            <ul className="space-y-3.5 text-sm leading-relaxed font-sans text-slate-300">
              <li className="flex gap-2.5 items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white">Consulter via clé USB locale :</span>
                  <span className="block text-xs text-slate-400 mt-1">
                    Les fichiers PDF scolaires et fiches d'exercices peuvent être importés localement à la volée sur smartphone de nos élèves sans utiliser de réseau mobile, par simple branchement d'une clé USB compatible OTG (On-The-Go) ou transfert en Bluetooth partagé.
                  </span>
                </div>
              </li>
              <li className="flex gap-2.5 items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white">Compression maximale des données :</span>
                  <span className="block text-xs text-slate-400 mt-1">
                    Les réponses de l'API REST de Node.js sont compressées mécaniquement et toutes les images sont formidablement converties en SVG vectoriel léger pour économiser la consommation de crédits internet mobiles des élèves au Tanganyika.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </section>
      )}

    </div>
  );
}
