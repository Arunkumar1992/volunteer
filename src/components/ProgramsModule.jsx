import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  UserCheck, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  X,
  Save,
  Check
} from 'lucide-react';

export default function ProgramsModule({
  programs,
  volunteers,
  onSavePrograms,
  onOpenProfile,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Enabled', 'Disabled'
  const [expandedProgId, setExpandedProgId] = useState(null); // Accordion expand for roster
  
  // Modal state for Add/Edit
  const [modalState, setModalState] = useState({ isOpen: false, isEdit: false, prog: null });
  const [formTopic, setFormTopic] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDates, setFormDates] = useState('');
  const [formStartDate, setFormStartDate] = useState('2026-07-06');
  const [formEndDate, setFormEndDate] = useState('2026-07-10');
  const [formColor, setFormColor] = useState('bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100');

  // Filtered programs
  const filteredPrograms = programs.filter(prog => {
    // Status check
    if (statusFilter === 'Enabled' && !prog.enabled) return false;
    if (statusFilter === 'Disabled' && prog.enabled) return false;

    // Search check
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTopic = prog.topic.toLowerCase().includes(q);
      const matchLoc = prog.location.toLowerCase().includes(q);
      const matchDates = prog.dates.toLowerCase().includes(q);
      return matchTopic || matchLoc || matchDates;
    }
    return true;
  });

  // Calculate statistics
  const totalPrograms = programs.length;
  const enabledProgramsCount = programs.filter(p => p.enabled ?? true).length;
  const disabledProgramsCount = totalPrograms - enabledProgramsCount;

  // Handlers for Add/Edit Modal
  const handleOpenAddModal = () => {
    setFormTopic('');
    setFormLocation('');
    setFormDates('');
    setFormStartDate('2026-07-06');
    setFormEndDate('2026-07-10');
    setFormColor('bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100');
    setModalState({ isOpen: true, isEdit: false, prog: null });
  };

  const handleOpenEditModal = (prog) => {
    setFormTopic(prog.topic);
    setFormLocation(prog.location);
    setFormDates(prog.dates);
    setFormStartDate(prog.startDate || '2026-07-06');
    setFormEndDate(prog.endDate || '2026-07-10');
    setFormColor(prog.color || 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100');
    setModalState({ isOpen: true, isEdit: true, prog });
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formTopic.trim() || !formLocation.trim()) return;

    if (modalState.isEdit && modalState.prog) {
      // Edit existing program
      const updated = programs.map(p => {
        if (p.id === modalState.prog.id) {
          return {
            ...p,
            topic: formTopic.trim(),
            location: formLocation.trim(),
            dates: formDates.trim() || p.dates,
            startDate: formStartDate,
            endDate: formEndDate,
            color: formColor,
            title: `${formTopic.trim()} — ${formLocation.trim()}`
          };
        }
        return p;
      });
      onSavePrograms(updated);
      if (showToast) showToast('Program Saved', `Updated details for "${formTopic}".`, 'success');
    } else {
      // Add new program
      const newProg = {
        id: `prog-${Date.now()}`,
        title: `${formTopic.trim()} — ${formLocation.trim()}`,
        topic: formTopic.trim(),
        location: formLocation.trim(),
        dates: formDates.trim() || 'July 6–10',
        startDate: formStartDate,
        endDate: formEndDate,
        color: formColor,
        enabled: true
      };
      onSavePrograms([...programs, newProg]);
      if (showToast) showToast('Program Created', `Added new program "${newProg.topic}".`, 'success');
    }

    setModalState({ isOpen: false, isEdit: false, prog: null });
  };

  // Toggle Enabled Switch
  const handleToggleEnabled = (progId) => {
    const updated = programs.map(p => p.id === progId ? { ...p, enabled: !(p.enabled ?? true) } : p);
    onSavePrograms(updated);
    const target = programs.find(p => p.id === progId);
    if (showToast && target) {
      const statusText = !(target.enabled ?? true) ? 'Enabled' : 'Disabled';
      showToast('Program Status Updated', `Set "${target.topic}" to ${statusText}.`, 'info');
    }
  };

  // Delete Program
  const handleDeleteProgram = (progId) => {
    const target = programs.find(p => p.id === progId);
    const updated = programs.filter(p => p.id !== progId);
    onSavePrograms(updated);
    if (showToast && target) showToast('Program Deleted', `Deleted "${target.topic}".`, 'info');
  };

  const COLOR_OPTIONS = [
    { label: 'Teal Green', value: 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100' },
    { label: 'Pink Crafts', value: 'bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100' },
    { label: 'Blue Coding', value: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100' },
    { label: 'Purple STEM', value: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100' },
    { label: 'Cyan Science', value: 'bg-cyan-50 border-cyan-200 text-cyan-900 hover:bg-cyan-100' },
    { label: 'Indigo Tech', value: 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100' },
    { label: 'Emerald Outdoor', value: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100' },
    { label: 'Amber Studio', value: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100' },
    { label: 'Rose Sewing', value: 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100' },
    { label: 'Lime Nature', value: 'bg-lime-50 border-lime-200 text-lime-900 hover:bg-lime-100' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Module Top Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-1">
            <Layers className="h-3.5 w-3.5" />
            Programs Management
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Programs & Camps Catalog
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl font-medium">
            Manage programs, locations, schedules, and monitor volunteer roster assignments per program.
          </p>
        </div>

        {/* Action Button: Add New Program */}
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Program</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Programs</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{totalPrograms}</span>
          <span className="text-[10px] text-slate-400 font-semibold">Configured Catalog</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Active (Enabled)</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block">{enabledProgramsCount}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Visible to Applicants</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Inactive (Disabled)</span>
          <span className="text-2xl font-extrabold text-slate-500 mt-0.5 block">{disabledProgramsCount}</span>
          <span className="text-[10px] text-slate-400 font-semibold">Hidden from Forms</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Total Volunteers</span>
          <span className="text-2xl font-extrabold text-teal-700 mt-0.5 block">{volunteers.length}</span>
          <span className="text-[10px] text-teal-600 font-semibold">In Pipeline Pool</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search programs by topic, location, dates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600">Status:</span>
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'All' ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalPrograms})
            </button>
            <button
              onClick={() => setStatusFilter('Enabled')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Enabled' ? 'bg-white text-emerald-800 border border-emerald-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enabled ({enabledProgramsCount})
            </button>
            <button
              onClick={() => setStatusFilter('Disabled')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Disabled' ? 'bg-white text-slate-800 border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disabled ({disabledProgramsCount})
            </button>
          </div>
        </div>

      </div>

      {/* Programs List Grid */}
      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 bg-white">
            <Layers className="h-10 w-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-slate-800">No programs match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or click "+ Add New Program" to create one.</p>
          </div>
        ) : (
          filteredPrograms.map(prog => {
            const isEnabled = prog.enabled ?? true;
            const isExpanded = expandedProgId === prog.id;

            // Volunteers assigned to shifts for this program
            const assignedVolunteers = volunteers.filter(v => 
              v.programAssignments && v.programAssignments.some(a => a.programId === prog.id)
            );

            // Volunteers who selected this program in preferences
            const interestedVolunteers = volunteers.filter(v => 
              v.programPreferences && v.programPreferences.includes(prog.id)
            );

            return (
              <div 
                key={prog.id} 
                className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                  isEnabled ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                
                {/* Main Card Content */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Column: Topic Badge & Details */}
                  <div className="flex items-start gap-3">
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border shrink-0 ${prog.color || 'bg-teal-50 border-teal-200 text-teal-900'}`}>
                      {prog.topic}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900">{prog.location}</h3>
                        {!isEnabled && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-bold border border-slate-300">
                            Disabled ✗
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5 text-teal-600" />
                          {prog.dates} ({prog.startDate} to {prog.endDate})
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-500">ID: {prog.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Volunteers Stats */}
                  <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0">
                    <div className="text-center">
                      <span className="text-xs text-slate-500 font-semibold block">Shift Assigned</span>
                      <span className="text-sm font-extrabold text-emerald-700">{assignedVolunteers.length} Vols</span>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-300" />
                    <div className="text-center">
                      <span className="text-xs text-slate-500 font-semibold block">Interested</span>
                      <span className="text-sm font-extrabold text-teal-700">{interestedVolunteers.length} Vols</span>
                    </div>
                  </div>

                  {/* Right Column: Actions (Enable Switch, Roster Expand, Edit, Delete) */}
                  <div className="flex items-center gap-2 justify-end">
                    
                    {/* Roster Expand Toggle */}
                    <button
                      onClick={() => setExpandedProgId(isExpanded ? null : prog.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all ${
                        isExpanded
                          ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      <Users className="h-3.5 w-3.5 text-teal-600" />
                      <span>Roster ({assignedVolunteers.length})</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>

                    {/* Enable / Disable Toggle Switch */}
                    <button
                      onClick={() => handleToggleEnabled(prog.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isEnabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                      }`}
                      title="Toggle visibility in intake form and shift assigner"
                    >
                      {isEnabled ? 'Enabled ✓' : 'Disabled ✗'}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEditModal(prog)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="Edit program details"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteProgram(prog.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                      title="Delete program"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>

                {/* Inline Roster Breakdown Accordion */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4 animate-fade-in">
                    
                    {/* Section A: Assigned Volunteers */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4 text-emerald-600" />
                        Shift Assigned Volunteers ({assignedVolunteers.length})
                      </h4>

                      {assignedVolunteers.length === 0 ? (
                        <p className="text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-slate-200">
                          No volunteers currently assigned to shifts in this program.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {assignedVolunteers.map(v => (
                            <div 
                              key={v.id}
                              onClick={() => onOpenProfile && onOpenProfile(v)}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                                  {v.firstName[0]}{v.lastName[0]}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900">{v.firstName} {v.lastName}</div>
                                  <div className="text-[10px] text-slate-500">{v.school}</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-teal-700">View →</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section B: Interested Applicant Volunteers */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-teal-600" />
                        Expressed Intake Preference ({interestedVolunteers.length})
                      </h4>

                      {interestedVolunteers.length === 0 ? (
                        <p className="text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-slate-200">
                          No applicants selected this program in their intake form preferences yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {interestedVolunteers.map(v => (
                            <div 
                              key={v.id}
                              onClick={() => onOpenProfile && onOpenProfile(v)}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                                  {v.firstName[0]}{v.lastName[0]}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900">{v.firstName} {v.lastName}</div>
                                  <div className="text-[10px] text-slate-500">{v.stage} • {v.school}</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-teal-700">View →</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Program Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {modalState.isEdit ? 'Edit Program Details' : 'Add New Program'}
              </h3>
              <button
                onClick={() => setModalState({ isOpen: false, isEdit: false, prog: null })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Topic / Course Name *</label>
                <input
                  type="text"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. Microbit & Sensors Workshop"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">School / Location *</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. James Park Elementary"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Display Dates String</label>
                <input
                  type="text"
                  value={formDates}
                  onChange={(e) => setFormDates(e.target.value)}
                  placeholder="e.g. July 6–10"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Color Theme Badge</label>
                <select
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
                >
                  {COLOR_OPTIONS.map(opt => (
                    <option key={opt.label} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalState({ isOpen: false, isEdit: false, prog: null })}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-teal-700 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  Save Program
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
