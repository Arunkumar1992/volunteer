import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Plus, 
  AlertCircle, 
  Clock, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  UserX 
} from 'lucide-react';
import { SHIFT_TYPES } from '../types';
import { checkIsMinor, calculateAge } from '../utils/formatters';

export default function SidePanelAssign({
  program,
  selectedDate,
  volunteers,
  onClose,
  onAssignVolunteer,
  onUnassignVolunteer,
  onOpenProfile,
  shifts = []
}) {
  const availableShifts = (shifts && shifts.length > 0 ? shifts : SHIFT_TYPES.map(s => ({ id: s, name: s, enabled: true })))
    .filter(s => typeof s === 'string' ? true : (s.enabled ?? true))
    .map(s => typeof s === 'string' ? s : s.name);

  const [activeShift, setActiveShift] = useState(availableShifts[0] || SHIFT_TYPES[0]);

  if (!program || !selectedDate) return null;

  // Filter volunteers currently assigned to this program, date, and shift
  const assignedVolunteers = volunteers.filter(v => 
    v.programAssignments && v.programAssignments.some(a => 
      a.programId === program.id && 
      a.assignedDate === selectedDate && 
      (a.shift === activeShift || !a.shift)
    )
  );

  // Filter eligible shortlist volunteers
  const eligibleVolunteers = volunteers.filter(v => {
    // Stage check: Active or Assigned
    if (v.stage !== 'Active' && v.stage !== 'Assigned') return false;

    // Shift availability match
    if (!v.shiftAvailability || !v.shiftAvailability.includes(activeShift)) return false;

    // Check if double-booked on this date and shift
    const isDoubleBooked = v.programAssignments && v.programAssignments.some(a => 
      a.assignedDate === selectedDate && a.shift === activeShift
    );
    if (isDoubleBooked) return false;

    return true;
  });

  // Sort eligible shortlist: prioritize volunteers who expressed preference for this program
  const sortedShortlist = [...eligibleVolunteers].sort((a, b) => {
    const aPref = a.programPreferences && a.programPreferences.includes(program.id);
    const bPref = b.programPreferences && b.programPreferences.includes(program.id);
    if (aPref && !bPref) return -1;
    if (!aPref && bPref) return 1;
    return 0;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-slide-left">
      
      {/* Side Panel Header */}
      <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Shift Scheduling
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">{selectedDate}</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">{program.title}</h3>
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-teal-600" />
              {program.location}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Topic: {program.topic}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Shift Type Tabs */}
      <div className="p-4 bg-white border-b border-slate-200">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Select Shift Type
        </label>
        <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
          {availableShifts.map(shift => {
            const countForShift = volunteers.filter(v => 
              v.programAssignments && v.programAssignments.some(a => 
                a.programId === program.id && 
                a.assignedDate === selectedDate && 
                a.shift === shift
              )
            ).length;

            return (
              <button
                key={shift}
                onClick={() => setActiveShift(shift)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeShift === shift
                    ? 'bg-teal-50 text-teal-800 border border-teal-300 shadow-sm font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className={`h-3.5 w-3.5 ${activeShift === shift ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{shift}</span>
                </div>
                {countForShift > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                    {countForShift} Assigned
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                    Unstaffed
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
        
        {/* Section 1: Assigned Volunteers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              Assigned Volunteers ({assignedVolunteers.length})
            </h4>
            {assignedVolunteers.length === 0 && (
              <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <AlertCircle className="h-3 w-3" />
                Shift Unstaffed
              </span>
            )}
          </div>

          {assignedVolunteers.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white text-center shadow-sm">
              <p className="text-xs font-medium text-slate-600">No volunteers assigned to this shift yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">Select an eligible volunteer from the shortlist below to assign.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assignedVolunteers.map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-xs">
                      {v.firstName[0]}{v.lastName[0]}
                    </div>
                    <div>
                      <button
                        onClick={() => onOpenProfile(v)}
                        className="text-xs font-bold text-slate-900 hover:text-teal-700 hover:underline text-left block"
                      >
                        {v.firstName} {v.lastName}
                      </button>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5 font-medium">
                        <span>{v.school}</span>
                        <span>•</span>
                        <span>{checkIsMinor(v.dateOfBirth) ? `Minor (${calculateAge(v.dateOfBirth)}y)` : `Adult (${calculateAge(v.dateOfBirth)}y)`}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onUnassignVolunteer(v.id, program.id, activeShift, selectedDate)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                    title="Remove assignment"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    Unassign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Eligible Shortlist Volunteers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Eligible Volunteers ({sortedShortlist.length})
            </h4>
            <span className="text-[11px] font-semibold text-slate-500">Active • Matching Shift</span>
          </div>

          {sortedShortlist.length === 0 ? (
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-center shadow-sm">
              <p className="text-xs font-medium text-slate-600">No active volunteers currently available for this shift.</p>
              <p className="text-[11px] text-slate-500 mt-1">Check availability settings or onboarding status in the directory.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedShortlist.map(v => {
                const isPreferredProgram = v.programPreferences && v.programPreferences.includes(program.id);
                return (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-800 text-xs">
                        {v.firstName[0]}{v.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenProfile(v)}
                            className="text-xs font-bold text-slate-900 hover:text-teal-700 hover:underline text-left"
                          >
                            {v.firstName} {v.lastName}
                          </button>
                          {isPreferredProgram && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                              ★ Preferred
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5 font-medium">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3 text-slate-500" />
                            {v.school}
                          </span>
                          <span>•</span>
                          <span>{checkIsMinor(v.dateOfBirth) ? `Minor (${calculateAge(v.dateOfBirth)}y)` : `Adult (${calculateAge(v.dateOfBirth)}y)`}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onAssignVolunteer(v.id, program.id, activeShift, selectedDate)}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Assign
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
