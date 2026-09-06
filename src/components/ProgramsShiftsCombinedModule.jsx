import React, { useState } from 'react';
import { 
  Layers, 
  Clock
} from 'lucide-react';
import ProgramsModule from './ProgramsModule';
import ShiftsModule from './ShiftsModule';

export default function ProgramsShiftsCombinedModule({
  programs = [],
  shifts = [],
  volunteers = [],
  onSavePrograms,
  onSaveShifts,
  onAssignVolunteer,
  onUnassignVolunteer,
  onOpenProfile,
  showToast
}) {
  const [activeMenu, setActiveMenu] = useState('programs'); // 'programs' vs 'shifts'

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Clean Top Underline Tab Bar (Programs vs Shifts) */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 text-xs font-semibold">
          
          {/* Tab 1: Programs */}
          <button
            onClick={() => setActiveMenu('programs')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 -mb-px transition-all ${
              activeMenu === 'programs'
                ? 'border-[#155e4b] text-[#155e4b] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Programs</span>
          </button>

          {/* Tab 2: Shifts */}
          <button
            onClick={() => setActiveMenu('shifts')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 -mb-px transition-all ${
              activeMenu === 'shifts'
                ? 'border-[#155e4b] text-[#155e4b] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Shifts</span>
          </button>

        </div>
      </div>

      {/* Main Content View */}
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
          shifts={shifts}
          onSaveShifts={onSaveShifts}
          showToast={showToast}
        />
      )}

    </div>
  );
}
