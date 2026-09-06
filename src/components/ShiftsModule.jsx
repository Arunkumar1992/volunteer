import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Search, 
  UserCheck, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  MapPin, 
  CheckCircle2, 
  UserX, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Layers,
  Check,
  X,
  PlusCircle,
  Filter,
  UserPlus,
  Building2,
  Globe,
  Info,
  List
} from 'lucide-react';
import { SHIFT_TYPES, SEED_PROGRAMS } from '../types';
import { checkIsMinor, calculateAge } from '../utils/formatters';
import GoogleCalendarView from './GoogleCalendarView';

export default function ShiftsModule({
  volunteers,
  programs = [],
  shifts = [],
  onSaveShifts,
  onAssignVolunteer,
  onUnassignVolunteer,
  onOpenProfile,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' vs 'roster' vs 'config'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Assigned', 'Unstaffed'
  const [programFilter, setProgramFilter] = useState('All');
  
  // Quick Assign Modal state
  const [assignModal, setAssignModal] = useState(null); // { program, date, shift }

  // New Shift Type Form State
  const [newShiftName, setNewShiftName] = useState('');

  const programList = (programs && programs.length > 0 ? programs : SEED_PROGRAMS).filter(p => p.enabled ?? true);
  const shiftList = (shifts && shifts.length > 0 ? shifts : SHIFT_TYPES.map(s => ({ id: s, name: s, enabled: true })));

  // Generate flat list of all shift instances across programs & dates
  const allShiftInstances = [];

  programList.forEach(prog => {
    // Generate dates between startDate and endDate
    if (!prog.startDate || !prog.endDate) return;

    const start = new Date(prog.startDate);
    const end = new Date(prog.endDate);
    const curr = new Date(start);

    while (curr <= end) {
      const formattedDate = curr.toISOString().split('T')[0];
      
      // Add entry for each enabled global shift type
      shiftList.filter(s => typeof s === 'string' ? true : (s.enabled ?? true)).forEach(s => {
        const shiftName = typeof s === 'string' ? s : s.name;
        
        // Find volunteers assigned to this program, date, and shift
        const assignedVols = volunteers.filter(v => 
          v.programAssignments && v.programAssignments.some(a => 
            a.programId === prog.id && 
            a.assignedDate === formattedDate && 
            (a.shift === shiftName || !a.shift)
          )
        );

        allShiftInstances.push({
          id: `${prog.id}-${formattedDate}-${shiftName}`,
          program: prog,
          date: formattedDate,
          shiftName,
          assignedVolunteers: assignedVols,
          isUnstaffed: assignedVols.length === 0
        });
      });

      curr.setDate(curr.getDate() + 1);
    }
  });

  // Filter shift instances
  const filteredShiftInstances = allShiftInstances.filter(item => {
    // Status filter
    if (statusFilter === 'Assigned' && item.isUnstaffed) return false;
    if (statusFilter === 'Unstaffed' && !item.isUnstaffed) return false;

    // Program filter
    if (programFilter !== 'All' && item.program.id !== programFilter) return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchProg = item.program.topic.toLowerCase().includes(q) || item.program.location.toLowerCase().includes(q);
      const matchShift = item.shiftName.toLowerCase().includes(q);
      const matchDate = item.date.includes(q);
      const matchVol = item.assignedVolunteers.some(v => `${v.firstName} ${v.lastName}`.toLowerCase().includes(q));
      return matchProg || matchShift || matchDate || matchVol;
    }

    return true;
  });

  // KPI Statistics
  const totalShiftSlots = allShiftInstances.length;
  const unstaffedSlotsCount = allShiftInstances.filter(i => i.isUnstaffed).length;
  const staffedSlotsCount = totalShiftSlots - unstaffedSlotsCount;
  const activeShiftTypesCount = shiftList.filter(s => typeof s === 'string' ? true : (s.enabled ?? true)).length;

  // Handlers for Global Company Shift Types Config
  const handleAddShiftType = (e) => {
    e.preventDefault();
    if (!newShiftName.trim()) return;

    const newShiftObj = {
      id: `shift-${Date.now()}`,
      name: newShiftName.trim(),
      enabled: true
    };

    const updated = [...shiftList, newShiftObj];
    onSaveShifts(updated);
    setNewShiftName('');
    if (showToast) showToast('Global Shift Added', `Added company-wide shift "${newShiftObj.name}".`, 'success');
  };

  const handleToggleShiftType = (shiftId) => {
    const updated = shiftList.map(s => {
      const sId = typeof s === 'string' ? s : s.id;
      if (sId === shiftId) {
        return typeof s === 'string' ? { id: s, name: s, enabled: false } : { ...s, enabled: !s.enabled };
      }
      return s;
    });
    onSaveShifts(updated);
    if (showToast) showToast('Global Shift Updated', 'Toggled company shift availability status.', 'info');
  };

  const handleDeleteShiftType = (shiftId) => {
    const updated = shiftList.filter(s => (typeof s === 'string' ? s : s.id) !== shiftId);
    onSaveShifts(updated);
    if (showToast) showToast('Global Shift Deleted', 'Removed shift category.', 'info');
  };

  // Helper to find eligible volunteers for quick assign modal
  const getEligibleVolunteersForShift = (programId, date, shiftName) => {
    return volunteers.filter(v => {
      // Stage check
      if (v.stage !== 'Active' && v.stage !== 'Assigned') return false;
      // Shift match
      if (!v.shiftAvailability || !v.shiftAvailability.includes(shiftName)) return false;
      // Double booking check
      const isDoubleBooked = v.programAssignments && v.programAssignments.some(a => 
        a.assignedDate === date && a.shift === shiftName
      );
      if (isDoubleBooked) return false;
      return true;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f4f1] text-[#155e4b] border border-teal-200 text-xs font-bold mb-1">
            <Globe className="h-3.5 w-3.5" />
            Company Global Shift System
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Shifts & Calendar Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl font-medium">
            Manage volunteer shift calendars, daily attendance rosters, unstaffed alert slots, and global shift rules.
          </p>
        </div>

        {/* Tab switcher: Google Calendar vs List Roster vs Shift Config */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'calendar' ? 'bg-white text-[#155e4b] border border-slate-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Google Calendar
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'roster' ? 'bg-white text-[#155e4b] border border-slate-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            List Roster ({totalShiftSlots})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'config' ? 'bg-white text-[#155e4b] border border-slate-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Shift Config ({activeShiftTypesCount})
          </button>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Shift Slots</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalShiftSlots}</span>
          <span className="text-[10px] text-slate-400 font-semibold">Across Active Calendar Dates</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Staffed Shifts</span>
          <span className="text-2xl font-black text-emerald-700 mt-0.5 block">{staffedSlotsCount}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Volunteers Scheduled ✓</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Unstaffed Shifts</span>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">{unstaffedSlotsCount}</span>
          <span className="text-[10px] text-rose-600 font-semibold">Needs Volunteer Assignment</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Global Shift Categories</span>
          <span className="text-2xl font-black text-[#155e4b] mt-0.5 block">{activeShiftTypesCount}</span>
          <span className="text-[10px] text-[#155e4b] font-semibold">Company-Wide Configured</span>
        </div>
      </div>

      {/* TAB 0: GOOGLE CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <GoogleCalendarView
          volunteers={volunteers}
          programs={programList}
          shifts={shiftList}
          onAssignVolunteer={onAssignVolunteer}
          onUnassignVolunteer={onUnassignVolunteer}
          onOpenProfile={onOpenProfile}
        />
      )}

      {/* TAB 1: SHIFT ROSTER & ASSIGNMENTS */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search shifts, dates, programs, volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#155e4b]"
              >
                <option value="All">All Programs</option>
                {programList.map(p => (
                  <option key={p.id} value={p.id}>{p.topic}</option>
                ))}
              </select>

              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setStatusFilter('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'All' ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({allShiftInstances.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Staffed')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'Staffed' ? 'bg-white text-emerald-800 border border-emerald-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Staffed ({staffedSlotsCount})
                </button>
                <button
                  onClick={() => setStatusFilter('Unstaffed')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === 'Unstaffed' ? 'bg-white text-rose-800 border border-rose-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unstaffed ({unstaffedSlotsCount})
                </button>
              </div>
            </div>

          </div>

          {/* Shift Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-200">
              {filteredShiftInstances.length === 0 ? (
                <div className="p-12 text-center">
                  <Clock className="h-10 w-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <h3 className="text-base font-bold text-slate-800">No shifts match filters</h3>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or program selector.</p>
                </div>
              ) : (
                filteredShiftInstances.map(instance => (
                  <div key={instance.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left Details */}
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block font-mono">
                          {new Date(instance.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-sm font-extrabold text-slate-900 block font-mono">
                          {new Date(instance.date + 'T00:00:00').getDate()}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono block">
                          {new Date(instance.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${instance.program.color || 'bg-teal-50 border-teal-200 text-teal-900'}`}>
                            {instance.program.topic}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{instance.program.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-semibold">
                          <Clock className="h-3.5 w-3.5 text-[#155e4b] shrink-0" />
                          <span>{instance.shiftName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Assignment Action / Badge */}
                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      {instance.isUnstaffed ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                            Unstaffed
                          </span>
                          <button
                            onClick={() => setAssignModal(instance)}
                            className="px-3 py-1.5 rounded-lg bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Assign
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          {instance.assignedVolunteers.map(v => (
                            <div key={v.id} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                              <span 
                                onClick={() => onOpenProfile && onOpenProfile(v)} 
                                className="hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                {v.firstName} {v.lastName}
                              </span>
                              <button
                                onClick={() => onUnassignVolunteer(v.id, instance.program.id, instance.shiftName, instance.date)}
                                className="p-0.5 rounded hover:bg-emerald-200 text-emerald-700 ml-1"
                                title="Unassign volunteer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPANY GLOBAL SHIFT CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          
          {/* Add New Company Shift Type Form */}
          <form onSubmit={handleAddShiftType} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-[#155e4b]" />
              Add New Company Global Shift Type
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newShiftName}
                onChange={(e) => setNewShiftName(e.target.value)}
                placeholder="e.g. Evening Wrap-up (3:30–5:30pm)"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155e4b]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add Global Shift
              </button>
            </div>
          </form>

          {/* Configured Company Global Shift Types List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Company Global Shift Configurations ({shiftList.length})
            </h3>

            <div className="space-y-2">
              {shiftList.map((shift, idx) => {
                const shiftName = typeof shift === 'string' ? shift : shift.name;
                const shiftId = typeof shift === 'string' ? `shift-${idx}` : shift.id;
                const isEnabled = typeof shift === 'string' ? true : (shift.enabled ?? true);

                return (
                  <div 
                    key={shiftId} 
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isEnabled 
                        ? 'bg-white border-slate-200 shadow-2xs' 
                        : 'bg-slate-100 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{shiftName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">Company-wide global shift option</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => handleToggleShiftType(shiftId)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          isEnabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}
                      >
                        {isEnabled ? 'Enabled ✓' : 'Disabled ✗'}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteShiftType(shiftId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete shift type"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Quick Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#155e4b] font-mono">{assignModal.date}</span>
                <h3 className="text-base font-extrabold text-slate-900">{assignModal.program.topic}</h3>
                <p className="text-xs text-slate-500 font-medium">{assignModal.shiftName}</p>
              </div>
              <button
                onClick={() => setAssignModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Eligible Volunteers ({getEligibleVolunteersForShift(assignModal.program.id, assignModal.date, assignModal.shiftName).length})
              </h4>

              {getEligibleVolunteersForShift(assignModal.program.id, assignModal.date, assignModal.shiftName).length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 text-center bg-slate-50 rounded-xl border border-slate-200">
                  No active cleared volunteers currently available for this shift.
                </p>
              ) : (
                getEligibleVolunteersForShift(assignModal.program.id, assignModal.date, assignModal.shiftName).map(v => (
                  <div key={v.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 font-bold text-xs text-slate-800 flex items-center justify-center border border-slate-300">
                        {v.firstName[0]}{v.lastName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{v.firstName} {v.lastName}</div>
                        <div className="text-[10px] text-slate-500">{v.school} • {v.stage}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onAssignVolunteer(v.id, assignModal.program.id, assignModal.shiftName, assignModal.date);
                        setAssignModal(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Assign
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setAssignModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
