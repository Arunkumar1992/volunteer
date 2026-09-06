import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Settings, 
  Calendar, 
  Clock, 
  Check, 
  Save,
  Edit3,
  Layers,
  MapPin,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const COLOR_OPTIONS = [
  { name: 'Teal', class: 'bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100' },
  { name: 'Pink', class: 'bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100' },
  { name: 'Blue', class: 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100' },
  { name: 'Purple', class: 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100' },
  { name: 'Cyan', class: 'bg-cyan-50 border-cyan-200 text-cyan-900 hover:bg-cyan-100' },
  { name: 'Indigo', class: 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100' },
  { name: 'Emerald', class: 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100' },
  { name: 'Amber', class: 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100' },
  { name: 'Rose', class: 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100' },
];

export default function ProgramShiftConfigModal({
  program,
  programs = [],
  shifts = [],
  onSaveProgram,
  onSavePrograms,
  onSaveShifts,
  onClose,
  showToast
}) {
  // If onSaveProgram is passed or program prop is provided (even if null for Add), render Single Program mode
  const isSingleProgramMode = Boolean(onSaveProgram || (program !== undefined && !onSavePrograms));

  // --- Single Program Mode Form State ---
  const [topic, setTopic] = useState(program?.topic || '');
  const [location, setLocation] = useState(program?.location || '');
  const [dates, setDates] = useState(program?.dates || '');
  const [startDate, setStartDate] = useState(program?.startDate || '2026-07-06');
  const [endDate, setEndDate] = useState(program?.endDate || '2026-07-10');
  const [color, setColor] = useState(program?.color || COLOR_OPTIONS[0].class);
  const [enabled, setEnabled] = useState(program?.enabled ?? true);

  // --- Batch Admin Config Mode State ---
  const [activeTab, setActiveTab] = useState('programs');
  const [programList, setProgramList] = useState(Array.isArray(programs) ? [...programs] : []);
  const [shiftList, setShiftList] = useState(Array.isArray(shifts) ? [...shifts] : []);

  // Batch Form State
  const [newProgTopic, setNewProgTopic] = useState('');
  const [newProgLocation, setNewProgLocation] = useState('');
  const [newProgDates, setNewProgDates] = useState('');
  const [newProgStartDate, setNewProgStartDate] = useState('2026-07-06');
  const [newProgEndDate, setNewProgEndDate] = useState('2026-07-10');
  const [newProgColor, setNewProgColor] = useState(COLOR_OPTIONS[0].class);
  const [newShiftName, setNewShiftName] = useState('');

  // -------------------------------------------------------------
  // Single Program Save Handler
  // -------------------------------------------------------------
  const handleSingleSave = (e) => {
    e.preventDefault();
    if (!topic.trim() || !location.trim()) return;

    const savedProg = {
      id: program?.id || `prog-${Date.now()}`,
      title: `${topic.trim()} — ${location.trim()}`,
      topic: topic.trim(),
      location: location.trim(),
      dates: dates.trim() || 'Summer 2026',
      startDate: startDate,
      endDate: endDate,
      color: color,
      enabled: enabled
    };

    if (onSaveProgram) {
      onSaveProgram(savedProg);
    } else {
      if (onClose) onClose();
    }
  };

  // -------------------------------------------------------------
  // Batch Program Handlers
  // -------------------------------------------------------------
  const handleToggleProgram = (progId) => {
    const updated = programList.map(p => p.id === progId ? { ...p, enabled: !p.enabled } : p);
    setProgramList(updated);
  };

  const handleDeleteProgram = (progId) => {
    const updated = programList.filter(p => p.id !== progId);
    setProgramList(updated);
  };

  const handleAddProgram = (e) => {
    e.preventDefault();
    if (!newProgTopic.trim() || !newProgLocation.trim()) return;

    const newProg = {
      id: `prog-${Date.now()}`,
      title: `${newProgTopic} — ${newProgLocation}`,
      topic: newProgTopic.trim(),
      location: newProgLocation.trim(),
      dates: newProgDates.trim() || 'July 6–10',
      startDate: newProgStartDate,
      endDate: newProgEndDate,
      color: newProgColor,
      enabled: true
    };

    const updated = [...programList, newProg];
    setProgramList(updated);
    setNewProgTopic('');
    setNewProgLocation('');
    setNewProgDates('');
    if (showToast) showToast('Program Added', `Added "${newProg.topic}" to configurable options.`, 'success');
  };

  // -------------------------------------------------------------
  // Batch Shift Handlers
  // -------------------------------------------------------------
  const handleToggleShift = (shiftId) => {
    const updated = shiftList.map(s => s.id === shiftId ? { ...s, enabled: !s.enabled } : s);
    setShiftList(updated);
  };

  const handleDeleteShift = (shiftId) => {
    const updated = shiftList.filter(s => s.id !== shiftId);
    setShiftList(updated);
  };

  const handleAddShift = (e) => {
    e.preventDefault();
    if (!newShiftName.trim()) return;

    const newShift = {
      id: `shift-${Date.now()}`,
      name: newShiftName.trim(),
      enabled: true
    };

    const updated = [...shiftList, newShift];
    setShiftList(updated);
    setNewShiftName('');
    if (showToast) showToast('Shift Added', `Added shift type "${newShift.name}".`, 'success');
  };

  const handleSaveAllBatch = () => {
    if (onSavePrograms) onSavePrograms(programList);
    if (onSaveShifts) onSaveShifts(shiftList);
    if (showToast) showToast('Configuration Saved', 'Updated program preferences & shift availability settings.', 'success');
    if (onClose) onClose();
  };

  // =============================================================
  // RENDER: Single Program Add / Edit Modal Mode
  // =============================================================
  if (isSingleProgramMode) {
    const isEditMode = Boolean(program?.id);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
          
          {/* Modal Header */}
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#155e4b]/10 border border-[#155e4b]/20 text-[#155e4b]">
                {isEditMode ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isEditMode ? 'Edit Program Offering' : 'Add New STEAM Program'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isEditMode ? 'Update topic, venue location, schedule dates, and badge theme.' : 'Create a new program offering for volunteer intake & roster management.'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSingleSave} className="p-6 sm:p-8 space-y-6">
            
            {/* Row 1: Topic & Location (Strictly 2 fields per row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Topic / Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Robotics & AI"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  School / Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. James Park Elementary"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>
            </div>

            {/* Row 2: Display Dates & Status (Strictly 2 fields per row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Display Dates Label
                </label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="e.g. July 6–10"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Visibility Status
                </label>
                <div className="py-2 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span className="text-xs font-bold text-slate-800">{enabled ? 'Active in Intake Form' : 'Hidden from Form'}</span>
                  <ToggleSwitch
                    checked={enabled}
                    onChange={(val) => setEnabled(val)}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Start Date & End Date (Strictly 2 fields per row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                />
              </div>
            </div>

            {/* Row 4: Badge Color Palette */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Badge Color Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setColor(opt.class)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${opt.class} ${
                      color === opt.class ? 'ring-2 ring-[#155e4b] ring-offset-1 scale-105 shadow-2xs' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {color === opt.class && <Check className="h-3.5 w-3.5" />}
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Preview Card Badge</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${color}`}>
                  {topic || 'Program Topic'}
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  {location || 'Location'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  • {dates || 'Dates'}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
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
                <span>{isEditMode ? 'Save Changes' : 'Create Program'}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    );
  }

  // =============================================================
  // RENDER: Batch Admin Configuration Center (programs + shifts)
  // =============================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[#155e4b]">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Admin Configuration Center
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Add, delete, enable or disable Program Preferences and Preferred Shift Availability options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-white border-b border-slate-200 flex space-x-2">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'programs'
                ? 'border-[#155e4b] text-[#155e4b] bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Program Preferences ({programList.length})
          </button>

          <button
            onClick={() => setActiveTab('shifts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'shifts'
                ? 'border-[#155e4b] text-[#155e4b] bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="h-4 w-4" />
            Shift Availability Types ({shiftList.length})
          </button>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          
          {/* TAB 1: PROGRAMS CONFIGURATION */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              
              {/* Add New Program Form (Strictly 2 fields per row) */}
              <form onSubmit={handleAddProgram} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-[#155e4b]" />
                  Add New STEAM Program / Camp Option
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Topic / Topic Name *</label>
                    <input
                      type="text"
                      required
                      value={newProgTopic}
                      onChange={(e) => setNewProgTopic(e.target.value)}
                      placeholder="e.g. Robotics & AI"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">School / Location *</label>
                    <input
                      type="text"
                      required
                      value={newProgLocation}
                      onChange={(e) => setNewProgLocation(e.target.value)}
                      placeholder="e.g. James Park Elementary"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">Display Dates String</label>
                    <input
                      type="text"
                      value={newProgDates}
                      onChange={(e) => setNewProgDates(e.target.value)}
                      placeholder="e.g. July 20–24"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">Start Date</label>
                      <input
                        type="date"
                        value={newProgStartDate}
                        onChange={(e) => setNewProgStartDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">End Date</label>
                      <input
                        type="date"
                        value={newProgEndDate}
                        onChange={(e) => setNewProgEndDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add Program Option
                  </button>
                </div>
              </form>

              {/* Configured Program List */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Configured Program Options ({programList.length})
                </h4>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {programList.map(prog => (
                    <div 
                      key={prog.id} 
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        prog.enabled 
                          ? 'bg-white border-slate-200 shadow-2xs' 
                          : 'bg-slate-100 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 rounded-md text-xs font-bold border ${prog.color || 'bg-teal-50 border-teal-200 text-teal-900'}`}>
                          {prog.topic}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{prog.location}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{prog.dates} ({prog.startDate} to {prog.endDate})</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Enable/Disable Switch */}
                        <ToggleSwitch
                          checked={prog.enabled}
                          onChange={() => handleToggleProgram(prog.id)}
                          size="sm"
                          label={prog.enabled ? 'Enabled' : 'Disabled'}
                        />

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProgram(prog.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete program option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SHIFT AVAILABILITY CONFIGURATION */}
          {activeTab === 'shifts' && (
            <div className="space-y-6">
              
              {/* Add New Shift Type Form */}
              <form onSubmit={handleAddShift} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-[#155e4b]" />
                  Add New Shift Availability Type
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newShiftName}
                    onChange={(e) => setNewShiftName(e.target.value)}
                    placeholder="e.g. Evening Wrap-up (3:30–5:30pm)"
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Shift Type
                  </button>
                </div>
              </form>

              {/* Configured Shift Types List */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Configured Shift Availability Types ({shiftList.length})
                </h4>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {shiftList.map((shift, idx) => {
                    const shiftName = typeof shift === 'string' ? shift : shift.name;
                    const shiftId = typeof shift === 'string' ? `shift-${idx}` : shift.id;
                    const isEnabled = typeof shift === 'string' ? true : (shift.enabled ?? true);

                    return (
                      <div 
                        key={shiftId} 
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isEnabled 
                            ? 'bg-white border-slate-200 shadow-2xs' 
                            : 'bg-slate-100 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#155e4b] shrink-0" />
                          <span className="text-xs font-bold text-slate-900">{shiftName}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Enable/Disable Switch */}
                          <ToggleSwitch
                            checked={isEnabled}
                            onChange={() => handleToggleShift(shiftId)}
                            size="sm"
                            label={isEnabled ? 'Enabled' : 'Disabled'}
                          />

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteShift(shiftId)}
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

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-medium">
            Changes persist immediately to local database for all forms & assigners.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAllBatch}
              className="px-6 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
