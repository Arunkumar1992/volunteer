import React, { useState } from 'react';
import { 
  SEED_PROGRAMS, 
  SHIFT_TYPES 
} from '../types';
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
  FileText
} from 'lucide-react';

export default function IntakeForm({ 
  volunteers, 
  onSubmitIntake,
  programs = [],
  shifts = []
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
    shiftAvailability: []
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitIntake(formData);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner matching Mockup Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#155e4b] uppercase tracking-wider block mb-1">
              Public Application Portal
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Add New Applicant Data
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
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Applicant Data</span>
            <span className="text-xs text-slate-400 font-normal">Personal details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Input applicant firstname"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Input applicant lastname"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Input applicant email"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Telephone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Input phone number"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">School / Organization *</label>
              <input
                type="text"
                required
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
                placeholder="Input school currently attending"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Calculated Age: <strong className="text-slate-900">{age} years old</strong></span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
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
          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-amber-600" />
              Parent / Guardian Consent & Contact Information (Required for Minors Under 18)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Full Name *</label>
                <input
                  type="text"
                  required={isMinor}
                  value={formData.guardianName}
                  onChange={(e) => handleInputChange('guardianName', e.target.value)}
                  placeholder="Input guardian full name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Guardian Contact & Relationship *</label>
                <input
                  type="text"
                  required={isMinor}
                  value={formData.guardianContact}
                  onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                  placeholder="e.g. (604) 555-0199 (Father)"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="intakeGuardianConsent"
                checked={formData.guardianConsentGiven}
                onChange={(e) => handleInputChange('guardianConsentGiven', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#155e4b] focus:ring-[#155e4b]"
              />
              <label htmlFor="intakeGuardianConsent" className="text-xs text-slate-800 font-semibold">
                I confirm that my parent/guardian approves my application to volunteer with Kids Innovative.
              </label>
            </div>
          </div>
        )}

        {/* Section 3: Program Preferences (Strictly 2 options per row) */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Program Preferences
          </h3>
          <p className="text-xs text-slate-500 font-medium">Select one or more programs you wish to support:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availablePrograms.map(prog => {
              const isSelected = formData.programPreferences.includes(prog.id);
              return (
                <div
                  key={prog.id}
                  onClick={() => toggleProgram(prog.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-[#e6f4f1] border-[#155e4b] text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{prog.topic}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{prog.location}</div>
                    <div className="text-[10px] text-[#155e4b] font-mono font-bold mt-0.5">{prog.dates}</div>
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
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Preferred Shift Availability
          </h3>
          <p className="text-xs text-slate-500 font-medium">Select all shift categories fitting your schedule:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableShifts.map(shift => {
              const isSelected = formData.shiftAvailability.includes(shift);
              return (
                <button
                  type="button"
                  key={shift}
                  onClick={() => toggleShift(shift)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#e6f4f1] text-[#155e4b] border-[#155e4b] shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Emergency Contact & Health Notes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Contact Name *</label>
              <input
                type="text"
                required
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                placeholder="Input contact name"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Phone *</label>
              <input
                type="tel"
                required
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                placeholder="Input contact phone"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Relationship *</label>
              <input
                type="text"
                required
                value={formData.emergencyContactRelationship}
                onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                placeholder="e.g. Parent"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Medical Concerns / Allergies (Optional)</label>
              <input
                type="text"
                value={formData.medicalNotes}
                onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                placeholder="Input medical accommodations or dietary restrictions"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:border-[#155e4b] transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Document & Portfolio Dropzone */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Document & Waiver Upload (Optional)
          </h3>

          <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
            <CloudUpload className="h-8 w-8 text-[#155e4b] mx-auto mb-2 opacity-80" />
            <div className="text-xs font-bold text-[#155e4b]">
              Click to upload file <span className="text-slate-500 font-normal">or drag and drop file here</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Maximal file size: 10 MB (PDF, JPG, PNG format)
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-7 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Save Application</span>
          </button>
        </div>

      </form>
    </div>
  );
}
