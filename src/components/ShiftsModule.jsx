import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  Search,
  X
} from 'lucide-react';
import { SHIFT_TYPES } from '../types';

export default function ShiftsModule({
  shifts = [],
  onSaveShifts,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Enabled', 'Disabled'
  const [showAddForm, setShowAddForm] = useState(false);
  const [newShiftName, setNewShiftName] = useState('');

  const shiftList = (shifts && shifts.length > 0 ? shifts : SHIFT_TYPES.map(s => ({ id: s, name: s, enabled: true })));

  // Filter shifts based on search and status
  const filteredShifts = shiftList.filter(shift => {
    const shiftName = typeof shift === 'string' ? shift : shift.name;
    const isEnabled = typeof shift === 'string' ? true : (shift.enabled ?? true);

    if (statusFilter === 'Enabled' && !isEnabled) return false;
    if (statusFilter === 'Disabled' && isEnabled) return false;

    if (searchTerm.trim()) {
      return shiftName.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return true;
  });

  const totalShifts = shiftList.length;
  const enabledCount = shiftList.filter(s => typeof s === 'string' ? true : (s.enabled ?? true)).length;
  const disabledCount = totalShifts - enabledCount;

  // Add New Global Shift Type
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
    setShowAddForm(false);
    if (showToast) showToast('Global Shift Added', `Added company shift "${newShiftObj.name}".`, 'success');
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
    if (showToast) showToast('Global Shift Updated', 'Toggled shift availability.', 'info');
  };

  const handleDeleteShiftType = (shiftId) => {
    const updated = shiftList.filter(s => (typeof s === 'string' ? s : s.id) !== shiftId);
    onSaveShifts(updated);
    if (showToast) showToast('Global Shift Deleted', 'Removed shift category.', 'info');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Search & Action Toolbar matching Programs tab exactly */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search configured shifts by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filter Buttons & Action Button: Add Shift */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'All' ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalShifts})
            </button>
            <button
              onClick={() => setStatusFilter('Enabled')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Enabled' ? 'bg-white text-emerald-800 border border-emerald-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Enabled ({enabledCount})
            </button>
            <button
              onClick={() => setStatusFilter('Disabled')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'Disabled' ? 'bg-white text-slate-800 border border-slate-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disabled ({disabledCount})
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Shift</span>
          </button>

        </div>

      </div>

      {/* Add New Company Shift Form Dropdown (when Add Shift clicked) */}
      {showAddForm && (
        <form onSubmit={handleAddShiftType} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-[#155e4b]" />
              Add New Company Shift Type
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              required
              value={newShiftName}
              onChange={(e) => setNewShiftName(e.target.value)}
              placeholder="e.g. Evening Wrap-up (3:30–5:30pm)"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155e4b]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="h-4 w-4" />
              Save Shift
            </button>
          </div>
        </form>
      )}

      {/* Configured Shift Types Grid matching Programs Catalog Cards */}
      <div className="space-y-4">
        {filteredShifts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Clock className="h-10 w-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-slate-800">No shifts match search criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or adding a new shift slot.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShifts.map((shift, idx) => {
              const shiftName = typeof shift === 'string' ? shift : shift.name;
              const shiftId = typeof shift === 'string' ? `shift-${idx}` : shift.id;
              const isEnabled = typeof shift === 'string' ? true : (shift.enabled ?? true);

              return (
                <div
                  key={shiftId}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs hover:shadow-md space-y-4 ${
                    isEnabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Top Row: Shift Name & Controls */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#e6f4f1] text-[#155e4b] shrink-0">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-900 border border-indigo-200">
                          Global Shift
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-tight">
                          {shiftName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Enable / Disable Toggle Pill */}
                      <button
                        onClick={() => handleToggleShiftType(shiftId)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
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

                  {/* Subtext info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Applies across all volunteer registration intake forms</span>
                    <span className="font-bold text-[#155e4b]">Company-Wide Active</span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
