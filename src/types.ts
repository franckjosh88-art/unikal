/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  faculty?: string;
  department?: string;
  studentId?: string; // For parents tracking students, or for student records
  status?: 'pending' | 'approved' | 'rejected';
  matricule?: string;
  specialty?: string;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'presentation' | 'audio' | 'text';
  url: string;
  size?: string;
  duration?: string;
  downloaded?: boolean; // Simulated local availability
}

export interface CourseModule {
  id: string;
  title: string;
  materials: CourseMaterial[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  faculty: string;
  department: string;
  academicYear: string;
  credits: number;
  teacherId: string;
  teacherName: string;
  modules: CourseModule[];
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  submitted?: boolean;
  submissionDate?: string;
  submissionText?: string;
  submissionFile?: string;
  grade?: number;
  gradeFeedback?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'mcq' | 'open';
  options?: string[]; // For MCQ
  correctOptionIndex?: number; // For MCQ auto-correction
}

export interface Quiz {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: QuizQuestion[];
  dueDate: string;
  submitted?: boolean;
  score?: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  type: 'livre' | 'tfc' | 'memoire' | 'revue';
  year: number;
  institution: string; // e.g. "Université de Kalemie (UNIKAL)"
  faculty: string;
  size: string;
  downloadsCount: number;
  downloaded?: boolean;
}

export interface ForumPost {
  id: string;
  topicId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  likes: number;
  replies: ForumPostReply[];
}

export interface ForumPostReply {
  id: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: 'cours' | 'partage' | 'admin' | 'autre';
  courseId?: string;
  authorName: string;
  createdAt: string;
  repliesCount: number;
  viewsCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  content: string;
  createdAt: string;
  read?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Académique' | 'Examens' | 'Inscriptions' | 'Urgence' | string;
  authorId: string;
  authorName: string;
  authorRole: 'admin' | 'teacher' | 'responsable_departement' | string;
  targetAudience: 'tous' | 'étudiants' | string;
  createdAt: string;
  isPinned?: boolean;
  isActive?: boolean;
  scope?: 'all' | 'faculty' | 'department';
  targetUnit?: string;
}

export interface ParentStudentLog {
  studentName: string;
  studentId: string;
  attendanceRate: number; // e.g. 94 %
  recentGradeAverage: number; // e.g. 16/20
  recentActivity: string[];
}
