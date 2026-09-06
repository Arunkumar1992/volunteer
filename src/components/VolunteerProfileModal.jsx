import React, { useState, useEffect } from 'react';
import { 
  X, 
  Eye, 
  ShieldCheck, 
  Download, 
  Save, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Clock, 
  ShieldAlert, 
  FileText, 
  UserCheck, 
  GraduationCap, 
  HeartHandshake, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { PIPELINE_STAGES, SHIFT_TYPES, SEED_PROGRAMS } from '../types';
import { checkIsMinor, calculateAge, formatDate, getBackgroundCheckStatusInfo } from '../utils/formatters';
import ToggleSwitch from './ToggleSwitch';

export default function VolunteerProfileModal({
  volunteer,
  onClose,
  onSaveVolunteer,
  programs = [],
  shifts = []
}) {
  const [formData, setFormData] = useState({ ...volunteer });

  const availablePrograms = programs && programs.length > 0 ? programs : SEED_PROGRAMS;
  const availableShifts = shifts && shifts.length > 0 ? shifts.map(s => typeof s === 'string' ? s : s.name) : SHIFT_TYPES;

  useEffect(() => {
    setFormData({ ...volunteer });
  }, [volunteer]);

  if (!volunteer) return null;

  const age = calculateAge(formData.dateOfBirth);
  const isMinor = checkIsMinor(formData.dateOfBirth);
  const bgInfo = getBackgroundCheckStatusInfo(formData.backgroundCheck);

  // Handle Field Changes
  const handleChange = (field, value) => {
    let updated = { ...formData, [field]: value, updatedAt: new Date().toISOString() };
    
    // If DOB changed, recompute minor
    if (field === 'dateOfBirth') {
      const newMinor = checkIsMinor(value);
      updated.isMinor = newMinor;
    }

    setFormData(updated);
  };

  // Toggle Program Preference
  const toggleProgramPref = (progId) => {
    const current = formData.programPreferences || [];
    const exists = current.includes(progId);
    const updated = exists ? current.filter(id => id !== progId) : [...current, progId];
    handleChange('programPreferences', updated);
  };

  // Toggle Shift Availability
  const toggleShiftAvail = (shiftName) => {
    const current = formData.shiftAvailability || [];
    const exists = current.includes(shiftName);
    const updated = exists ? current.filter(s => s !== shiftName) : [...current, shiftName];
    handleChange('shiftAvailability', updated);
  };

  // Handle Nested Background Check updates
  const handleBgChange = (subField, value) => {
    setFormData({
      ...formData,
      backgroundCheck: {
        ...formData.backgroundCheck,
        [subField]: value
      },
      updatedAt: new Date().toISOString()
    });
  };

  // Handle Save
  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveVolunteer(formData);
  };

  // Export Data JSON Download
  const handleExportData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `volunteer_${formData.id}_data_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#155e4b] to-emerald-700 p-0.5 shadow-md shrink-0">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center font-extrabold text-[#155e4b] text-lg">
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Edit Volunteer Record — {formData.firstName} {formData.lastName}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isMinor ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-purple-50 text-purple-900 border-purple-300'
                }`}>
                  {isMinor ? 'Minor' : 'Adult'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                ID: {formData.id} • Registered {formatDate(formData.createdAt)}
              </p>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center gap-2">
            
            {/* Export Data Button */}
            <button
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-all shadow-2xs"
              title="Download volunteer data export JSON"
            >
              <Download className="h-3.5 w-3.5 text-[#155e4b]" />
              Export Record
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 bg-white">
          
          {/* Section 1: Basic Information (2 fields per row) */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <User className="h-4 w-4 text-[#155e4b]" />
                Personal & School Information
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Applicant contact</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
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
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Input applicant lastname"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Input applicant email"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Telephone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Input phone number"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">School / Educational Institution *</label>
                <input
                  type="text"
                  required
                  value={formData.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  placeholder="Input school name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pipeline Stage & Background Check (2 fields per row) */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#155e4b]" />
                Pipeline Stage & Compliance Verification
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Clearance & status</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Pipeline Stage Status</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-semibold shadow-2xs"
                >
                  {PIPELINE_STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Background Check Outcome</label>
                <select
                  value={formData.backgroundCheck?.status || 'pending'}
                  onChange={(e) => handleBgChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-semibold shadow-2xs"
                >
                  <option value="pending">Pending Screening</option>
                  <option value="cleared">Cleared ✓</option>
                  <option value="failed">Failed / Rejected ✗</option>
                  <option value="expired">Expired Check</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Cleared Date</label>
                <input
                  type="date"
                  value={formData.backgroundCheck?.clearedDate || ''}
                  onChange={(e) => handleBgChange('clearedDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Expiry Date (2 Year Cycle)</label>
                <input
                  type="date"
                  value={formData.backgroundCheck?.expiryDate || ''}
                  onChange={(e) => handleBgChange('expiryDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Orientation & Training Status</label>
                <div className="py-2.5 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span className="text-xs font-bold text-slate-800">
                    {formData.trainingCompleted ? 'Completed STEAM Orientation & Shadowing ✓' : 'Training Orientation Pending'}
                  </span>
                  <ToggleSwitch
                    checked={formData.trainingCompleted ?? false}
                    onChange={(val) => handleChange('trainingCompleted', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Minor & Guardian Details (2 fields per row) */}
          {isMinor && (
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
              <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4 text-amber-600" />
                Minor Applicant Guardian Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Parent / Guardian Full Name</label>
                  <input
                    type="text"
                    value={formData.guardianName || ''}
                    onChange={(e) => handleChange('guardianName', e.target.value)}
                    placeholder="Input guardian name"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Guardian Contact & Relationship</label>
                  <input
                    type="text"
                    value={formData.guardianContact || ''}
                    onChange={(e) => handleChange('guardianContact', e.target.value)}
                    placeholder="e.g. 604-555-0199 (Mother)"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-800">
                    {formData.guardianConsentGiven ? 'Parent / Guardian Consent Approved ✓' : 'Guardian Consent Pending'}
                  </span>
                  <ToggleSwitch
                    checked={formData.guardianConsentGiven ?? false}
                    onChange={(val) => handleChange('guardianConsentGiven', val)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Emergency Contacts (Strictly 2 fields per row) */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#155e4b]" />
                Emergency Contact Information
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Emergency notification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Contact Name</label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  placeholder="Input emergency contact name"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                  placeholder="Input emergency contact phone"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Relationship to Applicant</label>
                <input
                  type="text"
                  value={formData.emergencyContactRelationship || ''}
                  onChange={(e) => handleChange('emergencyContactRelationship', e.target.value)}
                  placeholder="e.g. Parent, Sibling, Relative"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Medical Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#155e4b]" />
              Medical Notes & Dietary Restrictions
            </label>
            <textarea
              rows="3"
              value={formData.medicalNotes || ''}
              onChange={(e) => handleChange('medicalNotes', e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
              placeholder="Record allergies, medical conditions, or dietary restrictions..."
            />
          </div>

          {/* Section 6: Preferences & Shift Availability */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Program Preferences</label>
              <div className="flex flex-wrap gap-2">
                {availablePrograms.map(prog => {
                  const isSelected = (formData.programPreferences || []).includes(prog.id);
                  return (
                    <button
                      type="button"
                      key={prog.id}
                      onClick={() => toggleProgramPref(prog.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {prog.topic} {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Shift Availability</label>
              <div className="flex flex-wrap gap-2">
                {availableShifts.map(shift => {
                  const isSelected = (formData.shiftAvailability || []).filter(s => typeof s === 'string' ? true : s.enabled).includes(shift);
                  return (
                    <button
                      type="button"
                      key={shift}
                      onClick={() => toggleShiftAvail(shift)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {shift} {isSelected ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit / Cancel Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Record
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
