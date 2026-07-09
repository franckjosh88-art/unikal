import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Pin, 
  Clock, 
  Tag, 
  User as UserIcon, 
  Trash2, 
  Edit3, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Filter, 
  Eye, 
  EyeOff,
  Send,
  Mail,
  Users
} from 'lucide-react';
import { Announcement, User } from '../types';

interface AnnouncementsViewProps {
  currentUser: User;
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => Promise<void>;
  onUpdateAnnouncement: (ann: Announcement) => Promise<void>;
  onDeleteAnnouncement: (announcementId: string) => Promise<void>;
  readAnnouncements: string[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export default function AnnouncementsView({
  currentUser,
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  readAnnouncements,
  onMarkAsRead,
  onMarkAllAsRead
}: AnnouncementsViewProps) {
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Académique');
  const [targetAudience, setTargetAudience] = useState('tous');
  const [isPinned, setIsPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Validation errors state
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  // Email Notification Logs for simulation & demonstration
  const [emailLogs, setEmailLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('announcement_email_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const saveEmailLog = (log: any) => {
    const updated = [log, ...emailLogs].slice(0, 50); // Keep last 50 logs
    setEmailLogs(updated);
    localStorage.setItem('announcement_email_logs', JSON.stringify(updated));
  };

  // Open form for editing
  const handleEditClick = (ann: Announcement) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setTargetAudience(ann.targetAudience);
    setIsPinned(ann.isPinned || false);
    setIsActive(ann.isActive !== false);
    setErrors({});
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('Académique');
    setTargetAudience('tous');
    setIsPinned(false);
    setIsActive(true);
    setEditingAnn(null);
    setErrors({});
    setShowForm(false);
  };

  // Form submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Le titre de l'annonce est requis.";
    }
    if (!content.trim()) {
      newErrors.content = "Le contenu détaillé de l'annonce est requis.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Check publication authorization
    const isApprovedTeacher = currentUser.role === 'teacher' && (currentUser.status === 'approved' || !currentUser.status);
    const isAdminUser = currentUser.role === 'admin';
    const canPublish = isAdminUser || isApprovedTeacher;

    if (!canPublish) {
      alert("Vous n'avez pas l'autorisation de publier des annonces.");
      return;
    }

    // Determine author role designation
    let authorRoleLabel: string = currentUser.role;
    if (currentUser.role === 'teacher') {
      authorRoleLabel = targetAudience !== 'tous' && targetAudience !== 'étudiants' 
        ? 'responsable_departement' 
        : 'enseignant';
    }

    const annData: Announcement = {
      id: editingAnn ? editingAnn.id : `ann_${Date.now()}`,
      title,
      content,
      category,
      authorId: editingAnn ? editingAnn.authorId : currentUser.id,
      authorName: editingAnn ? editingAnn.authorName : currentUser.name,
      authorRole: editingAnn ? editingAnn.authorRole : authorRoleLabel,
      targetAudience,
      createdAt: editingAnn ? editingAnn.createdAt : new Date().toISOString(),
      isPinned,
      isActive,
    };

    try {
      if (editingAnn) {
        await onUpdateAnnouncement(annData);
      } else {
        await onAddAnnouncement(annData);
        
        // Simulate Firebase Cloud Function email trigger (onCreate)
        const recipientCount = targetAudience === 'tous' 
          ? 3500 
          : targetAudience === 'étudiants' 
            ? 3200 
            : 180; // specific department/class

        const mockLog = {
          id: `email_log_${Date.now()}`,
          announcementId: annData.id,
          announcementTitle: annData.title,
          category: annData.category,
          targetAudience: annData.targetAudience,
          timestamp: new Date().toISOString(),
          recipientCount,
          status: 'success',
          sender: 'smtp.firebase-trigger@unikal.ac.cd',
          subject: `[ANONCE OFFICIELLE] ${annData.title}`
        };
        saveEmailLog(mockLog);
      }
      resetForm();
    } catch (err) {
      console.error("Erreur d'écriture de l'annonce :", err);
    }
  };

  // Delete announcement
  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.")) {
      try {
        await onDeleteAnnouncement(id);
      } catch (err) {
        console.error("Erreur de suppression :", err);
      }
    }
  };

  // Toggle Pinned Status
  const handleTogglePin = async (ann: Announcement) => {
    const updated = { ...ann, isPinned: !ann.isPinned };
    await onUpdateAnnouncement(updated);
  };

  // Toggle Active Status
  const handleToggleActive = async (ann: Announcement) => {
    const updated = { ...ann, isActive: ann.isActive === false };
    await onUpdateAnnouncement(updated);
  };

  // Helper: check if < 48 hours old
  const isNew = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    const now = new Date().getTime();
    return (now - created) < 48 * 60 * 60 * 1000;
  };

  // Filtering Logic
  const visibleAnnouncements = announcements.filter(ann => {
    // 1. Ownership & Active filtering
    const isAuthor = ann.authorId === currentUser.id;
    const isAdminUser = currentUser.role === 'admin';
    
    // Non-active announcements are only visible to authors and admins
    if (ann.isActive === false && !isAuthor && !isAdminUser) {
      return false;
    }

    // 2. Target Audience matching
    let matchesAudience = false;
    if (isAdminUser || isAuthor || currentUser.role === 'teacher') {
      matchesAudience = true; // Admins and teachers can see all announcements
    } else if (ann.targetAudience === 'tous') {
      matchesAudience = true;
    } else if (ann.targetAudience === 'étudiants' && currentUser.role === 'student') {
      matchesAudience = true;
    } else if (currentUser.role === 'student') {
      const userFaculty = currentUser.faculty;
      const userDept = currentUser.department;
      if (userFaculty && ann.targetAudience === userFaculty) matchesAudience = true;
      if (userDept && ann.targetAudience === userDept) matchesAudience = true;
    } else if (currentUser.role === 'parent') {
      matchesAudience = true; // Parents can read bulletins too
    }

    if (!matchesAudience) return false;

    // 3. Form Categories filter
    if (categoryFilter !== 'all' && ann.category !== categoryFilter) {
      return false;
    }

    // 4. Form Target Audience Filter
    if (audienceFilter !== 'all') {
      if (audienceFilter === 'tous' && ann.targetAudience !== 'tous') return false;
      if (audienceFilter === 'étudiants' && ann.targetAudience !== 'étudiants') return false;
      if (audienceFilter === 'specifique' && (ann.targetAudience === 'tous' || ann.targetAudience === 'étudiants')) return false;
    }

    return true;
  });

  // Sorting: Pinned first, then by date descending
  const sortedAnnouncements = [...visibleAnnouncements].sort((a, b) => {
    const aPinned = a.isPinned ? 1 : 0;
    const bPinned = b.isPinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Automatically mark visible announcements as read when viewing
  useEffect(() => {
    visibleAnnouncements.forEach(ann => {
      if (!readAnnouncements.includes(ann.id)) {
        onMarkAsRead(ann.id);
      }
    });
  }, [sortedAnnouncements, readAnnouncements]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Urgence':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Examens':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Inscriptions':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administration Académique';
      case 'responsable_departement':
        return 'Chef de Département';
      case 'teacher':
      case 'enseignant':
        return 'Enseignant Approuvé';
      default:
        return 'Membre UNIKAL';
    }
  };

  const isApprovedTeacher = currentUser.role === 'teacher' && (currentUser.status === 'approved' || !currentUser.status);
  const isAdminUser = currentUser.role === 'admin';
  const canPublish = isAdminUser || isApprovedTeacher;

  return (
    <div className="AnnouncementsView space-y-6">
      {/* Header card with quick actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Megaphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Annonces & Bulletins Académiques</h2>
            <p className="text-xs text-slate-500">
              Retrouvez les circulaires, plannings d'examens, alertes d'urgences et communications officielles de l'UNIKAL.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={onMarkAllAsRead}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Tout marquer comme lu
          </button>
          
          {canPublish && (
            <button
              onClick={() => {
                if (showForm) resetForm();
                else setShowForm(true);
              }}
              title="Ajouter une annonce"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 shadow-sm hover:scale-103 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une annonce</span>
            </button>
          )}
        </div>
      </div>

      {/* Form Modal Section */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto relative animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" />
                <span>{editingAnn ? "Modifier l'Annonce" : "Ajouter une nouvelle annonce académique"}</span>
              </h3>
              <button 
                onClick={resetForm} 
                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Titre de l'annonce *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Report des TFC - Faculté Polytechnique"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim() && errors.title) {
                        setErrors(prev => ({ ...prev, title: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2.5 bg-white border rounded-xl focus:outline-hidden focus:border-blue-500 transition-all font-sans text-xs ${
                      errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Catégorie *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 transition-all font-sans text-xs cursor-pointer"
                    >
                      <option value="Académique">Académique</option>
                      <option value="Examens">Examens</option>
                      <option value="Inscriptions">Inscriptions</option>
                      <option value="Urgence">Urgence</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cible *</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 transition-all font-sans text-xs cursor-pointer"
                    >
                      <option value="tous">Tous (Public)</option>
                      <option value="étudiants">Tous les Étudiants</option>
                      {/* Faculty targets */}
                      <option value="Sciences Appliquées & Polytechnique">Sciences Appliquées</option>
                      <option value="Sciences Économiques & Gestion">Sciences Éco</option>
                      <option value="Sciences Agronomiques">Agronomie</option>
                      {/* Department targets */}
                      <option value="Génie Informatique">Dépt Génie Informatique</option>
                      <option value="Gestion Financière">Dépt Gestion Financière</option>
                      <option value="Phytotechnie">Dépt Phytotechnie</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contenu détaillé *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Rédigez le texte complet de la communication officielle ici..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (e.target.value.trim() && errors.content) {
                      setErrors(prev => ({ ...prev, content: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2.5 bg-white border rounded-xl focus:outline-hidden focus:border-blue-500 transition-all font-sans text-xs ${
                    errors.content ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
                />
                {errors.content && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{errors.content}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 bg-slate-100/60 p-3 rounded-xl border border-slate-200/50">
                <label className="flex items-center gap-2 font-semibold text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Épingler en haut des annonces (Prioritaire)
                  </span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-blue-500" />
                    Activer immédiatement le bulletin
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center gap-1.5 hover:scale-103 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingAnn ? "Sauvegarder les modifications" : "Publier & Envoyer Notifications"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and Counters Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filters */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrer :</span>
            </span>
            <div className="flex gap-1.5">
              {['all', 'Académique', 'Examens', 'Inscriptions', 'Urgence'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Toutes' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience Filters for Admins & Teachers */}
          {(isAdminUser || isApprovedTeacher) && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 uppercase">Cible :</span>
              <div className="flex gap-1.5">
                {['all', 'tous', 'étudiants', 'specifique'].map((aud) => (
                  <button
                    key={aud}
                    onClick={() => setAudienceFilter(aud)}
                    className={`px-2.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                      audienceFilter === aud
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {aud === 'all' ? 'Tout' : aud === 'tous' ? 'Public' : aud === 'étudiants' ? 'Étudiants' : 'Faculté / Dépt'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-slate-500 font-medium">
          Affichage de <strong className="text-slate-800">{visibleAnnouncements.length}</strong> bulletin{visibleAnnouncements.length > 1 ? 's' : ''} académique{visibleAnnouncements.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Announcements Feed Grid */}
      {sortedAnnouncements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-3">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Aucune annonce trouvée</p>
          <p className="text-xs text-slate-400">Il n'y a pas de communications officielles correspondant à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedAnnouncements.map((ann) => {
            const isNewItem = isNew(ann.createdAt);
            const isAuthor = ann.authorId === currentUser.id;
            
            return (
              <div
                key={ann.id}
                id={`announcement-card-${ann.id}`}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                  ann.isPinned 
                    ? 'border-amber-200 bg-amber-50/5/30 hover:border-amber-300' 
                    : ann.isActive === false
                      ? 'border-slate-200 opacity-75'
                      : 'border-slate-100 hover:border-blue-150'
                }`}
              >
                {/* Top pinned / inactive banner */}
                {(ann.isPinned || ann.isActive === false) && (
                  <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    ann.isActive === false 
                      ? 'bg-slate-100 text-slate-600 border-b border-slate-200' 
                      : 'bg-amber-400/10 text-amber-700 border-b border-amber-100'
                  }`}>
                    {ann.isActive === false ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Bulletin Désactivé (Brouillon invisible pour les étudiants)</span>
                      </>
                    ) : (
                      <>
                        <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                        <span>Bulletin Épinglé (Important)</span>
                      </>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Category & Badge header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${getCategoryColor(ann.category)}`}>
                        {ann.category}
                      </span>

                      {ann.targetAudience && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Audience : {ann.targetAudience === 'tous' ? 'Tout UNIKAL' : ann.targetAudience === 'étudiants' ? 'Tous les Étudiants' : ann.targetAudience}</span>
                        </span>
                      )}

                      {isNewItem && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">
                          Nouveau
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(ann.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-950 tracking-tight leading-snug">
                      {ann.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                      {ann.content}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                        {ann.authorName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 leading-none">{ann.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5">{getRoleLabel(ann.authorRole)}</span>
                      </div>
                    </div>

                    {/* Editor actions (only owner or admin) */}
                    {(isAdminUser || isAuthor) && (
                      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 font-bold">
                        <button
                          onClick={() => handleTogglePin(ann)}
                          title={ann.isPinned ? "Désépingler l'annonce" : "Épingler l'annonce en haut"}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            ann.isPinned 
                              ? 'bg-amber-50 border-amber-200 text-amber-600' 
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-400'
                          }`}
                        >
                          <Pin className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleActive(ann)}
                          title={ann.isActive === false ? "Activer l'annonce" : "Désactiver l'annonce"}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            ann.isActive !== false 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                              : 'bg-rose-50 border-rose-200 text-rose-600'
                          }`}
                        >
                          {ann.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleEditClick(ann)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Modifier</span>
                        </button>

                        <button
                          onClick={() => handleDelete(ann.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cloud Function Email Trigger Simulator Console */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Console de Notification Email (Trigger Cloud Function)
            </h3>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black tracking-wider rounded font-mono uppercase">
            Active trigger
          </span>
        </div>

        <div className="text-xs text-slate-400 space-y-2">
          <p>
            Cette section simule le fonctionnement en arrière-plan d'une <strong className="text-white">Cloud Function Firebase (onCreate trigger)</strong> configurée pour écouter l'écriture de documents dans la collection <code className="bg-slate-950 px-1 py-0.5 rounded text-rose-400 text-[10px]">/announcements/{"{id}"}</code>.
          </p>
          <p>
            À chaque création d'annonce, les étudiants abonnés à la filière/département cible reçoivent instantanément un email formaté contenant le titre, la catégorie, un extrait et le lien d'accès.
          </p>
        </div>

        {/* List of Email logs */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {emailLogs.length === 0 ? (
            <div className="text-center py-6 text-slate-500 italic text-xs border border-dashed border-slate-800 rounded-xl">
              Aucun email n'a encore été envoyé. Publiez une nouvelle annonce pour déclencher le trigger de notification !
            </div>
          ) : (
            emailLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold">{log.subject}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-bold">
                    DELIVERED ✓
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-500">
                  <div>
                    <strong className="text-slate-400">Expéditeur:</strong> {log.sender}
                  </div>
                  <div>
                    <strong className="text-slate-400">Audience:</strong> {log.targetAudience}
                  </div>
                  <div>
                    <strong className="text-slate-400 font-bold text-amber-400">Destinataires:</strong> {log.recipientCount} étudiants
                  </div>
                  <div className="text-right">
                    {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
