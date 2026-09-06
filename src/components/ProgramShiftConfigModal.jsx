import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Settings, 
  Calendar, 
  Clock, 
  Check, 
  Sparkles,
  Save,
  AlertCircle
} from 'lucide-react';

export default function ProgramShiftConfigModal({
  programs,
  shifts,
  onSavePrograms,
  onSaveShifts,
  onClose,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('programs'); // 'programs' vs 'shifts'
  
  // Program List Local State
  const [programList, setProgramList] = useState([...programs]);
  // New Program Form State
  const [newProgTopic, setNewProgTopic] = useState('');
  const [newProgLocation, setNewProgLocation] = useState('');
  const [newProgDates, setNewProgDates] = useState('');
  const [newProgStartDate, setNewProgStartDate] = useState('2026-07-06');
  const [newProgEndDate, setNewProgEndDate] = useState('2026-07-10');
  const [newProgColor, setNewProgColor] = useState('bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100');

  // Shift List Local State
  const [shiftList, setShiftList] = useState([...shifts]);
  // New Shift Form State
  const [newShiftName, setNewShiftName] = useState('');

  // PROGRAM HANDLERS
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

  // SHIFT HANDLERS
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

  // Save changes
  const handleSaveAll = () => {
    onSavePrograms(programList);
    onSaveShifts(shiftList);
    if (showToast) showToast('Configuration Saved', 'Updated program preferences & shift availability settings.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
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
                ? 'border-teal-600 text-teal-800 bg-teal-50/50'
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
                ? 'border-teal-600 text-teal-800 bg-teal-50/50'
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
              
              {/* Add New Program Form */}
              <form onSubmit={handleAddProgram} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-teal-600" />
                  Add New STEAM Program / Camp Option
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Topic / Topic Name *</label>
                    <input
                      type="text"
                      required
                      value={newProgTopic}
                      onChange={(e) => setNewProgTopic(e.target.value)}
                      placeholder="e.g. Robotics & AI"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">School / Location *</label>
                    <input
                      type="text"
                      required
                      value={newProgLocation}
                      onChange={(e) => setNewProgLocation(e.target.value)}
                      placeholder="e.g. James Park Elementary"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Display Dates String</label>
                    <input
                      type="text"
                      value={newProgDates}
                      onChange={(e) => setNewProgDates(e.target.value)}
                      placeholder="e.g. July 20–24"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Start Date</label>
                      <input
                        type="date"
                        value={newProgStartDate}
                        onChange={(e) => setNewProgStartDate(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">End Date</label>
                      <input
                        type="date"
                        value={newProgEndDate}
                        onChange={(e) => setNewProgEndDate(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
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
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
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
                        <button
                          type="button"
                          onClick={() => handleToggleProgram(prog.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
                            prog.enabled
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-200 text-slate-600 border-slate-300'
                          }`}
                          title="Toggle enabled status for public intake form and shortlist"
                        >
                          {prog.enabled ? 'Enabled ✓' : 'Disabled ✗'}
                        </button>

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
              <form onSubmit={handleAddShift} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-teal-600" />
                  Add New Shift Availability Type
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newShiftName}
                    onChange={(e) => setNewShiftName(e.target.value)}
                    placeholder="e.g. Evening Wrap-up (3:30–5:30pm)"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
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
                          <Clock className="h-4 w-4 text-teal-600 shrink-0" />
                          <span className="text-xs font-bold text-slate-900">{shiftName}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Enable/Disable Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleShift(shiftId)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
                              isEnabled
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-slate-200 text-slate-600 border-slate-300'
                            }`}
                            title="Toggle enabled status"
                          >
                            {isEnabled ? 'Enabled ✓' : 'Disabled ✗'}
                          </button>

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
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
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
