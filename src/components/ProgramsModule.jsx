import React, { useState } from 'react';
import { 
  Layers, 
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
  Users,
  Check,
  X,
  PlusCircle,
  Eye
} from 'lucide-react';
import { SEED_PROGRAMS, SHIFT_TYPES } from '../types';
import ProgramShiftConfigModal from './ProgramShiftConfigModal';

export default function ProgramsModule({
  programs = [],
  volunteers = [],
  onSavePrograms,
  onOpenProfile,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Enabled', 'Disabled'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null); // null for Add, prog object for Edit

  const programList = programs && programs.length > 0 ? programs : SEED_PROGRAMS;

  // Filter programs based on search and status
  const filteredPrograms = programList.filter(prog => {
    // Status filter
    const isEnabled = prog.enabled ?? true;
    if (statusFilter === 'Enabled' && !isEnabled) return false;
    if (statusFilter === 'Disabled' && isEnabled) return false;

    // Search term filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTopic = prog.topic.toLowerCase().includes(q);
      const matchLoc = prog.location.toLowerCase().includes(q);
      const matchDates = prog.dates ? prog.dates.toLowerCase().includes(q) : false;
      return matchTopic || matchLoc || matchDates;
    }

    return true;
  });

  // KPI Statistics
  const totalPrograms = programList.length;
  const enabledProgramsCount = programList.filter(p => p.enabled ?? true).length;
  const disabledProgramsCount = totalPrograms - enabledProgramsCount;

  // Handlers for Add/Edit Modal
  const handleOpenAddModal = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prog) => {
    setEditingProgram(prog);
    setIsModalOpen(true);
  };

  const handleSaveProgramModal = (savedProg) => {
    let updated;
    const exists = programList.some(p => p.id === savedProg.id);
    if (exists) {
      updated = programList.map(p => p.id === savedProg.id ? savedProg : p);
    } else {
      updated = [savedProg, ...programList];
    }
    onSavePrograms(updated);
    setIsModalOpen(false);
    if (showToast) {
      showToast(
        exists ? 'Program Updated' : 'Program Created',
        `Successfully saved program "${savedProg.topic}".`,
        'success'
      );
    }
  };

  const handleToggleProgramStatus = (progId) => {
    const updated = programList.map(p => {
      if (p.id === progId) {
        return { ...p, enabled: !(p.enabled ?? true) };
      }
      return p;
    });
    onSavePrograms(updated);
    if (showToast) {
      showToast('Status Updated', 'Toggled program visibility for volunteer intake form.', 'info');
    }
  };

  const handleDeleteProgram = (progId) => {
    const updated = programList.filter(p => p.id !== progId);
    onSavePrograms(updated);
    if (showToast) {
      showToast('Program Deleted', 'Removed program from catalog.', 'info');
    }
  };

  // Helper to count volunteers assigned to a program
  const getAssignedVolunteers = (progId) => {
    return volunteers.filter(v => 
      v.programAssignments && v.programAssignments.some(a => a.programId === progId)
    );
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Search & Action Toolbar starting directly with Search & Add Program */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search programs by topic, location, dates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filter Buttons & Action Button: Add New Program */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
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

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#155e4b] hover:bg-[#0f4b3c] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Program</span>
          </button>

        </div>

      </div>

      {/* Programs Catalog Roster Table / List */}
      <div className="space-y-4">
        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Layers className="h-10 w-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-base font-bold text-slate-800">No programs match search criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or adding a new program offering.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map((prog) => {
              const isEnabled = prog.enabled ?? true;
              const assignedVols = getAssignedVolunteers(prog.id);

              return (
                <div
                  key={prog.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-2xs hover:shadow-md space-y-4 ${
                    isEnabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  {/* Top Row: Topic & Status Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${prog.color || 'bg-teal-50 text-teal-900 border-teal-200'}`}>
                        {prog.location}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-tight">
                        {prog.topic}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Enabled / Disabled Toggle Pill */}
                      <button
                        onClick={() => handleToggleProgramStatus(prog.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                          isEnabled
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}
                      >
                        {isEnabled ? 'Enabled ✓' : 'Disabled ✗'}
                      </button>

                      {/* Edit Program */}
                      <button
                        onClick={() => handleOpenEditModal(prog)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Configure program settings & shifts"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      {/* Delete Program */}
                      <button
                        onClick={() => handleDeleteProgram(prog.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete program"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dates & Shift Times */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Dates Schedule</span>
                      <span className="font-bold text-slate-800 font-mono text-[11px] block truncate">
                        {prog.dates || 'Summer 2026'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Shifts Available</span>
                      <span className="font-bold text-slate-800 text-[11px] block truncate">
                        {prog.shifts ? prog.shifts.length : 2} Shift Slots
                      </span>
                    </div>
                  </div>

                  {/* Assigned Volunteers Summary */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-[#155e4b]" />
                      <span className="text-xs font-bold text-slate-700">
                        {assignedVols.length} Volunteer{assignedVols.length === 1 ? '' : 's'} Assigned
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Program Modal */}
      {isModalOpen && (
        <ProgramShiftConfigModal
          program={editingProgram}
          onClose={() => setIsModalOpen(false)}
          onSaveProgram={handleSaveProgramModal}
          allVolunteers={volunteers}
        />
      )}

    </div>
  );
}
