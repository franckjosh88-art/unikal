/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Search, 
  Plus, 
  X, 
  Check, 
  Edit2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface StudentAccountViewProps {
  onLogout: () => void;
}

export default function StudentAccountView({ onLogout }: StudentAccountViewProps) {
  // State for interactive features
  const [studentName, setStudentName] = useState('JOSUE FRANK');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('JOSUE FRANK');

  // Modals for interactive feel
  const [showClassModal, setShowClassModal] = useState(false);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Download simulation states
  const [downloadingMarksheet, setDownloadingMarksheet] = useState(false);
  const [downloadingPayments, setDownloadingPayments] = useState(false);

  // Requests state
  const [requestDetails, setRequestDetails] = useState('');
  const [requestsList, setRequestsList] = useState([
    { id: 'REQ-01', type: 'Academic Transcript', status: 'Approved', date: '2026-05-12' },
    { id: 'REQ-02', type: 'Internship Recommendation Letter', status: 'Pending', date: '2026-07-14' }
  ]);

  const availableClasses = [
    { code: 'IT-301', title: 'Computer Networks & Security', teacher: 'Prof. Jean Bosco Kabulo' },
    { code: 'IT-304', title: 'Database Management Systems II', teacher: 'Prof. Charles Mulindwa' },
    { code: 'IT-310', title: 'Advanced Web Applications', teacher: 'Dr. Josué Frank' }
  ];

  const recentClasses = [
    { title: 'Level II - Semester 1 - Networking Fundamentals', date: 'Yesterday' },
    { title: 'Level II - Semester 1 - Introduction to Algorithms', date: '3 days ago' }
  ];

  const invoices = [
    { id: 'INV-2026-004', desc: 'Academic Year 2025-2026 Tuition Fee', amount: '$1,200', status: 'Paid' },
    { id: 'INV-2026-005', desc: 'Laboratory Practical Materials', amount: '$150', status: 'Paid' }
  ];

  const examSchedule = [
    { code: 'IT-301', title: 'Computer Networks & Security', date: 'Monday, July 20, 2026', time: '09:00 - 12:00', room: 'Room 104', teacher: 'Prof. Jean Bosco Kabulo' },
    { code: 'IT-304', title: 'Database Management Systems II', date: 'Wednesday, July 22, 2026', time: '14:00 - 17:00', room: 'Lab II', teacher: 'Prof. Charles Mulindwa' },
    { code: 'IT-310', title: 'Advanced Web Applications', date: 'Friday, July 24, 2026', time: '09:00 - 12:00', room: 'Auditorium A', teacher: 'Dr. Josué Frank' }
  ];

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setStudentName(nameInput.toUpperCase());
    }
    setIsEditingName(false);
  };

  const simulateDownload = (type: 'marksheet' | 'payments') => {
    const isM = type === 'marksheet';
    if (isM) setDownloadingMarksheet(true);
    else setDownloadingPayments(true);

    setTimeout(() => {
      if (isM) setDownloadingMarksheet(false);
      else setDownloadingPayments(false);

      const title = isM ? "CONSOLIDATED MARKSHEET" : "PAYMENTS REPORT";
      const content = `UNIVERSITY OF LAY ADVENTISTS OF KIGALI (UNILAK)\n${title}\n\nStudent Name: ${studentName}\nStudent ID: 25451/2024\nFaculty: Computing and Information Sciences\n\nGenerated on: July 16, 2026\nStatus: Official Academic Document`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type === 'marksheet' ? 'Consolidated_Marksheet' : 'Payments_Report'}_25451_2024.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }, 1200);
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDetails.trim()) return;
    const newReq = {
      id: `REQ-${Math.floor(Math.random() * 90) + 10}`,
      type: requestDetails,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setRequestsList([newReq, ...requestsList]);
    setRequestDetails('');
    setShowRequestModal(false);
  };

  return (
    <div id="student-account-workspace" className="bg-[#ebf1fa] min-h-screen p-4 md:p-6 text-slate-900 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* ================= HEADER BANNER ================= */}
        <div id="unilak-exact-header" className="bg-white rounded-md overflow-hidden shadow-sm border border-[#c3d1e4] flex flex-col md:flex-row items-stretch">
          
          {/* Left Part: White background, Logo & Title */}
          <div className="bg-white px-5 py-4 flex items-center gap-4 flex-1 md:flex-none md:w-[60%]">
            
            {/* UNILAK Circular Logo - Exact Replica */}
            <div className="w-16 h-16 rounded-full bg-[#1a3a8a] border-2 border-white shadow-md flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-14 h-14">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#2563eb" strokeWidth="2" />
                <circle cx="50" cy="50" r="42" fill="#0f2963" />
                
                {/* Shield shape inner */}
                <path d="M50 20 C25 20 20 40 20 55 C20 75 50 85 50 85 C50 85 80 75 80 55 C80 40 75 20 50 20 Z" fill="#0f2963" stroke="white" strokeWidth="2" />
                
                {/* Diagonal strip */}
                <path d="M22 55 L78 55" stroke="white" strokeWidth="2" />
                
                {/* Small text in logo */}
                <text x="50" y="44" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">UNILAK</text>
                <text x="50" y="72" textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="bold" fontFamily="sans-serif">SINCE 1997</text>
              </svg>
            </div>

            {/* University Title */}
            <div>
              <h1 className="text-[#0e2e5c] text-lg md:text-xl font-extrabold tracking-wide uppercase leading-tight">
                UNIVERSITY OF LAY ADVENTISTS OF KIGALI
              </h1>
            </div>

          </div>

          {/* Right Part: Blue background, "Student Account" centered */}
          <div className="bg-[#5c8ef2] flex-1 flex items-center justify-center py-4 md:py-0 px-6 min-h-[70px]">
            <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-normal tracking-wide font-sans">
              Student Account
            </h2>
          </div>

        </div>

        {/* ================= GRID LAYOUT ================= */}
        <div id="student-grid-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ============ COLUMN 1 (LEFT) ============ */}
          <div id="panel-student-profile" className="bg-white border border-[#c3d1e4] rounded-md shadow-sm p-6 flex flex-col items-center">
            
            {/* Circular profile picture with the specific cyan-blue thick border */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-[#2196f3] overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces" 
                  alt="Student portrait" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Student ID */}
            <h3 className="text-2xl font-bold text-slate-800 mt-5 tracking-tight font-sans">
              25451/2024
            </h3>

            {/* Student Name with small Edit icon */}
            <div className="flex items-center gap-2 mt-1">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input 
                    type="text" 
                    value={nameInput} 
                    onChange={(e) => setNameInput(e.target.value)}
                    className="border border-[#2196f3] rounded px-2 py-0.5 text-sm font-bold uppercase focus:outline-none bg-slate-50"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditingName(false)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-[#6c757d] font-bold text-sm tracking-wide uppercase">
                    {studentName}
                  </span>
                  <button 
                    onClick={() => { setNameInput(studentName); setIsEditingName(true); }}
                    className="text-[#2196f3] hover:text-blue-700 p-0.5 rounded transition-colors"
                    title="Edit Name"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Campus Info */}
            <span className="text-[#a0aab5] font-semibold text-xs tracking-wide mt-1.5">
              KIGALI Campus
            </span>

            {/* Logout Button */}
            <button 
              onClick={onLogout}
              className="mt-5 bg-[#007bff] hover:bg-[#0069d9] text-white font-bold text-xs py-2 px-5 rounded flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              {/* Arrow out of box icon like the picture */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>

            {/* Academic Details list exactly formatted as in screenshot */}
            <div className="w-full mt-6 space-y-4 border-t border-slate-150 pt-5 text-left text-xs text-slate-800 font-sans">
              
              {/* Faculty */}
              <div className="space-y-1">
                <span className="block font-bold text-slate-900 uppercase">Faculty</span>
                <p className="text-slate-500 font-semibold leading-relaxed">
                  Computing and Information Sciences
                </p>
              </div>

              <div className="h-[1px] bg-slate-150 w-full"></div>

              {/* Programme */}
              <div className="space-y-1">
                <span className="block font-bold text-slate-900 uppercase">Programme</span>
                <p className="text-slate-500 font-semibold leading-relaxed">
                  Bachelor of Science in Information Technology, Option of Networking
                </p>
              </div>

              <div className="h-[1px] bg-slate-150 w-full"></div>

              {/* Option */}
              <div className="flex items-center justify-between py-1">
                <span className="font-bold text-slate-900 uppercase">Option</span>
                <span className="text-slate-500 font-semibold">IT-Networking</span>
              </div>

            </div>

          </div>

          {/* ============ COLUMN 2 (RIGHT) ============ */}
          <div id="panel-student-cards" className="lg:col-span-2 space-y-6">
            
            {/* 1. MY CLASS CARD */}
            <div id="block-my-class" className="bg-white border border-[#c3d1e4] rounded-md shadow-sm p-6 pt-8 relative">
              
              {/* Tab Badge */}
              <div className="absolute -top-3 left-4 bg-[#1e73be] text-white text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                My Class
              </div>

              {/* Available Class Green Button */}
              <button 
                onClick={() => setShowClassModal(true)}
                className="w-full bg-[#28a745] hover:bg-[#218838] text-white text-sm font-bold py-2.5 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                {/* Search / Magnifying Glass icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                View Available Class
              </button>

              <div className="h-[1px] bg-slate-150 w-full my-4"></div>

              {/* Recently Accessed Yellow Button */}
              <button 
                onClick={() => setShowRecentModal(true)}
                className="w-full bg-[#ffc107] hover:bg-[#e0a800] text-slate-900 text-sm font-bold py-2.5 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                {/* Clock history circular arrow icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-black stroke-[2.5]">
                  <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 1 .57-8.38l5.67-5.67" />
                </svg>
                Recently Accessed Classes
                {/* Pointer finger icon */}
                <span className="text-sm font-normal">👉</span>
              </button>

            </div>

            {/* 2. INVOICES CARD */}
            <div id="block-invoices" className="bg-white border border-[#c3d1e4] rounded-md shadow-sm p-6 pt-8 relative flex items-center">
              
              {/* Tab Badge */}
              <div className="absolute -top-3 left-4 bg-[#1e73be] text-white text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Invoices
              </div>

              {/* Yellow Square Plus Button */}
              <button 
                onClick={() => setShowInvoicesModal(true)}
                className="bg-[#ffc107] hover:bg-[#e0a800] text-slate-900 border border-slate-300 rounded p-2 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title="View Invoices"
              >
                <Plus className="w-5 h-5 text-black stroke-[3]" />
              </button>

            </div>

            {/* 3. SPLIT CARD FOR DOWNLOADS */}
            <div id="block-downloads" className="bg-white border border-[#c3d1e4] rounded-md shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Consolidated Marksheet Subpanel */}
              <div className="flex flex-col items-center justify-center p-4">
                
                {/* Specific blue download icon design */}
                <div className="w-12 h-12 text-[#2a75d3] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-current stroke-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>

                <h4 className="text-slate-800 font-bold text-sm tracking-tight text-center mb-4">
                  Consolidated Marksheet
                </h4>

                <button 
                  onClick={() => simulateDownload('marksheet')}
                  disabled={downloadingMarksheet}
                  className="bg-white hover:bg-slate-50 text-[#007bff] border border-[#007bff] hover:border-[#0056b3] hover:text-[#0056b3] font-bold text-xs py-1.5 px-4 rounded flex items-center gap-2 transition-all cursor-pointer shadow-sm uppercase"
                >
                  {downloadingMarksheet ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#007bff] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                  {downloadingMarksheet ? 'Downloading...' : 'DOWNLOAD'}
                </button>

              </div>

              {/* Payments Report Subpanel */}
              <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-slate-150">
                
                {/* Specific blue download icon design */}
                <div className="w-12 h-12 text-[#2a75d3] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-none stroke-current stroke-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>

                <h4 className="text-slate-800 font-bold text-sm tracking-tight text-center mb-4">
                  Payments Report
                </h4>

                <button 
                  onClick={() => simulateDownload('payments')}
                  disabled={downloadingPayments}
                  className="bg-white hover:bg-slate-50 text-[#007bff] border border-[#007bff] hover:border-[#0056b3] hover:text-[#0056b3] font-bold text-xs py-1.5 px-4 rounded flex items-center gap-2 transition-all cursor-pointer shadow-sm uppercase"
                >
                  {downloadingPayments ? (
                    <span className="w-3.5 h-3.5 border-2 border-[#007bff] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                  {downloadingPayments ? 'Downloading...' : 'DOWNLOAD'}
                </button>

              </div>

            </div>

            {/* Calendrier des Examens Card */}
            <div id="block-exams" className="bg-white border border-[#c3d1e4] rounded-md shadow-sm p-6 pt-8 relative flex flex-col gap-4">
              
              {/* Tab Badge */}
              <div className="absolute -top-3 left-4 bg-[#1e73be] text-white text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Calendrier des Examens
              </div>

              {/* Exam list matching layout and style of other cards */}
              <div className="divide-y divide-slate-100 text-xs">
                {examSchedule.map((exam, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold bg-[#1a3a8a]/10 text-[#1a3a8a] px-1.5 py-0.5 rounded text-[10px]">
                          {exam.code}
                        </span>
                        <h5 className="font-bold text-slate-800">{exam.title}</h5>
                      </div>
                      <p className="text-slate-500 font-semibold text-[11px]">Enseignant : {exam.teacher}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:text-right shrink-0">
                      <div className="bg-[#ebf1fa] border border-[#c3d1e4] px-2 py-1 rounded flex items-center gap-1.5 text-[11px]">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-[#1e73be] stroke-2 shrink-0">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="font-semibold text-[#1e73be]">{exam.date}</span>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-200 px-2 py-1 rounded flex items-center gap-1 text-slate-600 text-[11px]">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2 shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="font-mono font-medium">{exam.time}</span>
                      </div>

                      <span className="bg-[#28a745]/10 text-[#28a745] font-bold px-2 py-1 rounded border border-[#28a745]/20 font-mono text-[10px]">
                        {exam.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* 4. REQUESTS CARD */}
            <div id="block-requests" className="bg-white border border-[#c3d1e4] rounded-md shadow-sm p-6 pt-8 relative flex items-center">
              
              {/* Tab Badge */}
              <div className="absolute -top-3 left-4 bg-[#1e73be] text-white text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Requests
              </div>

              {/* Yellow Request Button */}
              <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-[#ffc107] hover:bg-[#e0a800] text-slate-900 font-bold py-1.5 px-4 rounded flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-sm"
              >
                <span className="text-sm font-bold">+</span>
                Request
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ==================== INTERACTIVE MODALS ==================== */}
      <AnimatePresence>
        
        {/* Modal for View Available Class */}
        {showClassModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-md shadow-xl w-full max-w-lg overflow-hidden border border-[#c3d1e4]"
            >
              <header className="bg-[#1a3a8a] text-white p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider">Available Classes</h3>
                <button onClick={() => setShowClassModal(false)} className="text-white hover:bg-white/10 p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </header>
              <div className="p-6 space-y-4">
                <div className="space-y-2.5">
                  {availableClasses.map((cl, idx) => (
                    <div key={idx} className="p-3 bg-[#ebf1fa]/40 border border-slate-200 rounded flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-[#1a3a8a]/10 text-[#1a3a8a] px-1.5 py-0.5 rounded">
                            {cl.code}
                          </span>
                          <span className="font-bold text-slate-800">
                            {cl.title}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">{cl.teacher}</p>
                      </div>
                      <button 
                        onClick={() => {
                          alert(`Curriculum entry requested for ${cl.title}`);
                          setShowClassModal(false);
                        }} 
                        className="bg-[#28a745] text-white font-bold py-1 px-3 rounded text-xs hover:bg-[#218838]"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal for Recently Accessed Classes */}
        {showRecentModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-md shadow-xl w-full max-w-md overflow-hidden border border-[#c3d1e4]"
            >
              <header className="bg-[#ffc107] text-slate-900 p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider">Recently Accessed Classes</h3>
                <button onClick={() => setShowRecentModal(false)} className="text-slate-900 hover:bg-black/5 p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </header>
              <div className="p-6 space-y-3">
                {recentClasses.map((rc, idx) => (
                  <div key={idx} className="p-3 bg-[#ebf1fa]/40 border border-slate-150 rounded flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{rc.title}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{rc.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal for Invoices List */}
        {showInvoicesModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-md shadow-xl w-full max-w-xl overflow-hidden border border-[#c3d1e4]"
            >
              <header className="bg-[#1a3a8a] text-white p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider">Fee Invoices</h3>
                <button onClick={() => setShowInvoicesModal(false)} className="text-white hover:bg-white/10 p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </header>
              <div className="p-6 space-y-3">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="p-3 bg-[#ebf1fa]/40 border border-slate-200 rounded flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{inv.desc}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{inv.id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-800">{inv.amount}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal for Requests */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-md shadow-xl w-full max-w-lg overflow-hidden border border-[#c3d1e4]"
            >
              <header className="bg-[#1a3a8a] text-white p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider">Submit Request</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-white hover:bg-white/10 p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </header>
              <div className="p-6 space-y-4">
                <form onSubmit={handleAddRequest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Request Topic / Document Title</label>
                    <input 
                      type="text" 
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      placeholder="e.g. Consolidated Academic Transcript, Recommendation Letter..."
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-[#2196f3]"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#ffc107] hover:bg-[#e0a800] text-slate-900 font-bold py-2 rounded text-xs transition-colors"
                  >
                    Submit Administrative Request
                  </button>
                </form>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Historic Submissions</h4>
                  <div className="space-y-2">
                    {requestsList.map((req, idx) => (
                      <div key={idx} className="p-3 bg-[#ebf1fa]/40 border border-slate-150 rounded flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{req.type}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{req.date} · {req.id}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.status === 'Approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
