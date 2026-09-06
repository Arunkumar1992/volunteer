import React, { useState, useRef } from 'react';
import { 
  SEED_PROGRAMS, 
  SHIFT_TYPES 
} from '../types';
import ToggleSwitch from './ToggleSwitch';
import { 
  checkIsMinor, 
  calculateAge 
} from '../utils/formatters';
import { 
  UserPlus, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Clock, 
  Lock, 
  Info,
  Send,
  CloudUpload,
  FileText,
  Copy,
  ExternalLink,
  Check,
  Share2,
  Trash2
} from 'lucide-react';

export default function IntakeForm({ 
  volunteers, 
  onSubmitIntake,
  programs = [],
  shifts = [],
  isExternalView = false,
  onToggleExternalView,
  showToast
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    dateOfBirth: '2009-05-15',
    guardianName: '',
    guardianContact: '',
    guardianConsentGiven: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalNotes: '',
    programPreferences: [],
    shiftAvailability: [],
    uploadedFile: null
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [submittedExternal, setSubmittedExternal] = useState(false);

  // File upload state & handlers
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      uploadedFile: {
        name: file.name,
        size: file.size,
        type: file.type || 'Document'
      }
    }));
    if (showToast) {
      showToast('File Attached', `Selected file "${file.name}" for application.`, 'success');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, uploadedFile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (showToast) {
      showToast('File Removed', 'Attachment removed.', 'info');
    }
  };

  const age = calculateAge(formData.dateOfBirth);
  const isMinor = checkIsMinor(formData.dateOfBirth);

  // Dynamic enabled programs list
  const availablePrograms = (programs && programs.length > 0 ? programs : SEED_PROGRAMS).filter(p => p.enabled ?? true);
  
  // Dynamic enabled shift types list
  const availableShifts = (shifts && shifts.length > 0 ? shifts : SHIFT_TYPES.map(s => ({ id: s, name: s, enabled: true })))
    .filter(s => typeof s === 'string' ? true : (s.enabled ?? true))
    .map(s => typeof s === 'string' ? s : s.name);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProgram = (progId) => {
    setFormData(prev => {
      const exists = prev.programPreferences.includes(progId);
      return {
        ...prev,
        programPreferences: exists
          ? prev.programPreferences.filter(id => id !== progId)
          : [...prev.programPreferences, progId]
      };
    });
  };

  const toggleShift = (shiftName) => {
    setFormData(prev => {
      const exists = prev.shiftAvailability.includes(shiftName);
      return {
        ...prev,
        shiftAvailability: exists
          ? prev.shiftAvailability.filter(s => s !== shiftName)
          : [...prev.shiftAvailability, shiftName]
      };
    });
  };

  const handleCopyShareLink = () => {
    const shareableUrl = `${window.location.origin}${window.location.pathname}?external=true`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    if (showToast) {
      showToast('Form Link Copied', 'Public volunteer application link copied to clipboard.', 'success');
    }
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitIntake(formData);
    
    if (isExternalView) {
      setSubmittedExternal(true);
    }

    // Reset form after submit
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      school: '',
      dateOfBirth: '2009-05-15',
      guardianName: '',
      guardianContact: '',
      guardianConsentGiven: false,
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      medicalNotes: '',
      programPreferences: [],
      shiftAvailability: []
    });
  };

  if (submittedExternal) {
    return (
      <div className="max-w-2xl mx-auto py-14 px-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-scale-up my-6">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300 shadow-xs">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Application Submitted!</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            Thank you for applying to volunteer with <strong>Kids Innovative STEAM Education</strong>. Your application has been received and our volunteer coordinator will review your information shortly.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setSubmittedExternal(false)}
            className="px-6 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold transition-all shadow-sm"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  const handleOpenPublicForm = () => {
    const shareableUrl = `${window.location.origin}${window.location.pathname}?external=true`;
    window.open(shareableUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Admin External Share Action Toolbar (Only shown in admin view) */}
      {!isExternalView && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#155e4b] uppercase tracking-wider block mb-1">
              External Share Portal
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Share Volunteer Application Form
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Share this external link with applicants to load the standalone application form without CRM admin controls.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 shadow-2xs active:scale-95"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-600" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Form Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenPublicForm}
              className="px-4 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-2xs active:scale-95"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Public Form Only</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#155e4b] uppercase tracking-wider block mb-1">
              {isExternalView ? 'Kids Innovative STEAM Education' : 'Public Application Portal'}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isExternalView ? 'Volunteer Application Form' : 'Add New Applicant Data'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Fill out the volunteer applicant details, school information, program preferences, and guardian consent below.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card Container matching exact Mockup styling */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Section 1: Applicant Data (Strictly 2 fields per row) */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Applicant Data
            </h3>
            <span className="text-xs text-slate-400 font-medium">Personal details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Input applicant firstname"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Input applicant lastname"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1.5 ${
                formData.email && !formData.email.includes('@') ? 'text-rose-600' : 'text-slate-700'
              }`}>
                Email address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Input applicant email (e.g. jenny@example.com)"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all font-medium shadow-2xs focus:outline-none ${
                    formData.email && !formData.email.includes('@')
                      ? 'bg-rose-50/40 border-2 border-rose-500 text-rose-900 placeholder:text-rose-300 focus:ring-4 focus:ring-rose-500/10'
                      : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b]'
                  }`}
                />
                {formData.email && !formData.email.includes('@') && (
                  <AlertCircle className="h-4 w-4 text-rose-500 absolute right-3.5 top-3" />
                )}
              </div>
              {formData.email && !formData.email.includes('@') && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                  The email field must be a valid email address.
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Telephone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Input phone number"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">School / Organization *</label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                placeholder="Input school currently attending"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Calculated Age: <strong className="text-slate-900">{age} years old</strong></span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                  isMinor ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-purple-50 text-purple-900 border-purple-300'
                }`}>
                  {isMinor ? 'Minor' : 'Adult'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Guardian Info for Minors (Strictly 2 fields per row) */}
        {isMinor && (
          <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-amber-600" />
              Parent / Guardian Consent & Contact Information (Required for Minors Under 18)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Guardian Full Name *</label>
                <input
                  type="text"
                  required={isMinor}
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange('guardianName', e.target.value)}
                  placeholder="Input guardian full name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Guardian Contact & Relationship *</label>
                <input
                  type="text"
                  required={isMinor}
                  value={formData.guardianContact}
                  onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                  placeholder="e.g. (604) 555-0199 (Father)"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-medium shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <ToggleSwitch
                checked={formData.guardianConsentGiven}
                onChange={(val) => handleInputChange('guardianConsentGiven', val)}
                size="sm"
              />
              <span className="text-xs text-slate-800 font-semibold cursor-pointer" onClick={() => handleInputChange('guardianConsentGiven', !formData.guardianConsentGiven)}>
                Parent/Guardian Approval Confirmed for Application
              </span>
            </div>
          </div>
        )}

        {/* Section 3: Program Preferences (Strictly 2 options per row) */}
        <div className="space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Program Preferences
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Select one or more programs you wish to support:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availablePrograms.map(prog => {
              const isSelected = formData.programPreferences.includes(prog.id);
              return (
                <div
                  key={prog.id}
                  onClick={() => toggleProgram(prog.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-[#e6f4f1] border-[#155e4b] text-slate-900 shadow-2xs ring-1 ring-[#155e4b]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">{prog.topic}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">{prog.location}</div>
                    <div className="text-[10px] text-[#155e4b] font-mono font-bold mt-1">{prog.dates}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-slate-300 text-[#155e4b] focus:ring-[#155e4b] mt-1"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Shift Availability (Strictly 2 options per row) */}
        <div className="space-y-3">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Preferred Shift Availability
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Select all shift categories fitting your schedule:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableShifts.map(shift => {
              const isSelected = formData.shiftAvailability.includes(shift);
              return (
                <button
                  type="button"
                  key={shift}
                  onClick={() => toggleShift(shift)}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#e6f4f1] text-[#155e4b] border-[#155e4b] shadow-2xs ring-1 ring-[#155e4b]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span>{shift}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 rounded border-slate-300 text-[#155e4b] focus:ring-[#155e4b]"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Emergency & Health (Strictly 2 fields per row) */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Emergency Contact & Health Notes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Emergency Contact Name *</label>
              <input
                type="text"
                required
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                placeholder="Input contact name"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Emergency Phone *</label>
              <input
                type="tel"
                required
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                placeholder="Input contact phone"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Relationship *</label>
              <input
                type="text"
                required
                value={formData.emergencyContactRelationship}
                onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                placeholder="e.g. Parent"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Medical Concerns / Allergies (Optional)</label>
              <input
                type="text"
                value={formData.medicalNotes}
                onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                placeholder="Input medical accommodations or dietary restrictions"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Document, Resume & Waiver Upload */}
        <div className="space-y-3">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Document, Resume & Waiver Upload (Optional)
            </h3>
            <span className="text-xs text-slate-400 font-medium">PDF, DOCX, PNG, JPG</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          />

          {!formData.uploadedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#155e4b] bg-emerald-50/60 scale-[1.01]'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <CloudUpload className="h-8 w-8 text-[#155e4b] mx-auto mb-2 opacity-80" />
              <div className="text-xs sm:text-sm font-bold text-[#155e4b]">
                Click to browse files <span className="text-slate-500 font-normal">or drag and drop file here</span>
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-1 font-mono">
                Maximal file size: 10 MB (PDF, DOCX, JPG, PNG format)
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-[#155e4b] shadow-2xs">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{formData.uploadedFile.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Attached ✓
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Size: {formatFileSize(formData.uploadedFile.size)} • Type: {formData.uploadedFile.type || 'Document'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove attached file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Form Actions (Matching bottom checkout submit button in reference image) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                school: '',
                dateOfBirth: '2009-05-15',
                guardianName: '',
                guardianContact: '',
                guardianConsentGiven: false,
                emergencyContactName: '',
                emergencyContactPhone: '',
                emergencyContactRelationship: '',
                medicalNotes: '',
                programPreferences: [],
                shiftAvailability: []
              });
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-all"
          >
            Clear Fields
          </button>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs sm:text-sm font-extrabold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Application</span>
          </button>
        </div>

      </form>
    </div>
  );
}
