import React, { useState } from 'react';
import { 
  Layers, 
  Clock, 
  Sparkles, 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Users, 
  Search, 
  Info,
  CheckCircle2,
  Globe,
  AlertTriangle
} from 'lucide-react';
import ProgramsModule from './ProgramsModule';
import ShiftsModule from './ShiftsModule';

export default function ProgramsShiftsCombinedModule({
  programs,
  shifts,
  volunteers,
  onSavePrograms,
  onSaveShifts,
  onAssignVolunteer,
  onUnassignVolunteer,
  onOpenProfile,
  showToast
}) {
  const [activeMenu, setActiveMenu] = useState('programs'); // 'programs' vs 'shifts'

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top-Level Menu Header for Programs & Shifts Module */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold mb-1">
              <Layers className="h-3.5 w-3.5" />
              Setup & Configuration Module
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-none">
              Programs & Shifts
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Switch between Programs management and Company Shifts configuration below.
            </p>
          </div>
        </div>

        {/* 2 Prominent Top-Level Menu Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          
          {/* Top-Level Menu 1: Programs */}
          <button
            onClick={() => setActiveMenu('programs')}
            className={`p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMenu === 'programs'
                ? 'bg-white text-teal-900 border border-teal-300 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Layers className={`h-4 w-4 ${activeMenu === 'programs' ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>Programs ({programs.length})</span>
          </button>

          {/* Top-Level Menu 2: Shifts */}
          <button
            onClick={() => setActiveMenu('shifts')}
            className={`p-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMenu === 'shifts'
                ? 'bg-white text-teal-900 border border-teal-300 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Clock className={`h-4 w-4 ${activeMenu === 'shifts' ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>Shifts ({shifts.length})</span>
          </button>

        </div>

      </div>

      {/* Top-Level Menu View Content */}
      {activeMenu === 'programs' ? (
        <ProgramsModule
          programs={programs}
          volunteers={volunteers}
          onSavePrograms={onSavePrograms}
          onOpenProfile={onOpenProfile}
          showToast={showToast}
        />
      ) : (
        <ShiftsModule
          volunteers={volunteers}
          programs={programs}
          shifts={shifts}
          onSaveShifts={onSaveShifts}
          onAssignVolunteer={onAssignVolunteer}
          onUnassignVolunteer={onUnassignVolunteer}
          onOpenProfile={onOpenProfile}
          showToast={showToast}
        />
      )}

    </div>
  );
}
