import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  UserCheck, 
  AlertTriangle, 
  Sparkles, 
  Info,
  Layers
} from 'lucide-react';
import { SEED_PROGRAMS } from '../types';
import SidePanelAssign from './SidePanelAssign';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarView({ 
  volunteers, 
  onAssignVolunteer, 
  onUnassignVolunteer, 
  onOpenProfile,
  programs = [],
  shifts = []
}) {
  // Current month/year state (Default to July 2026: year=2026, monthIndex=6)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(6); // 6 = July (0-indexed)
  
  // Dynamic list of active programs
  const programList = (programs && programs.length > 0 ? programs : SEED_PROGRAMS).filter(p => p.enabled ?? true);

  // Side Panel state
  const [selectedPanel, setSelectedPanel] = useState(null); // { program, date }

  // Format month key: e.g. "2026-07"
  const currentMonthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
  const currentMonthLabel = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;

  // Calculate dynamic days in selected month and starting offset
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const startDayOffset = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sunday

  // Build grid days array for selected month
  const totalSlots = Math.ceil((daysInMonth + startDayOffset) / 7) * 7;
  const daysArray = [];
  
  for (let i = 0; i < totalSlots; i++) {
    const dayNumber = i - startDayOffset + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      daysArray.push({
        dayNumber,
        formattedDate,
        isCurrentMonth: true
      });
    } else {
      daysArray.push({
        dayNumber: null,
        formattedDate: null,
        isCurrentMonth: false
      });
    }
  }

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // Get programs running in this selected month
  const activePrograms = programList.filter(prog => {
    if (!prog.startDate && !prog.endDate) return false;
    const startMonth = prog.startDate ? prog.startDate.substring(0, 7) : '';
    const endMonth = prog.endDate ? prog.endDate.substring(0, 7) : '';
    return startMonth === currentMonthKey || endMonth === currentMonthKey;
  });

  // Calculate unstaffed programs count for selected month
  const unstaffedDatesCount = daysArray.reduce((acc, day) => {
    if (!day.formattedDate) return acc;
    const progsOnDay = programList.filter(p => day.formattedDate >= p.startDate && day.formattedDate <= p.endDate);
    const unstaffedOnDay = progsOnDay.filter(p => {
      const assigned = volunteers.filter(v => 
        v.programAssignments && v.programAssignments.some(a => a.programId === p.id && a.assignedDate === day.formattedDate)
      );
      return assigned.length === 0;
    });
    return acc + unstaffedOnDay.length;
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Calendar Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              Shift Roster View
            </span>
            <span className="text-xs text-slate-500 font-medium font-mono">{currentMonthKey}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-teal-600" />
            Shift Roster Calendar
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
            Shift Roster view for assigning volunteers to dates & shifts. Click any program date card to open the shift assignment panel and schedule available volunteers.
          </p>
        </div>

        {/* Dynamic Month Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {unstaffedDatesCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>{unstaffedDatesCount} Unstaffed Shifts</span>
            </div>
          )}

          {/* Month Stepper Controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Month & Year Selector */}
            <div className="px-3 text-xs font-extrabold text-slate-800 font-mono">
              {currentMonthLabel}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Direct Month Quick Selectors */}
          <select
            value={`${selectedYear}-${selectedMonth}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-').map(Number);
              setSelectedYear(y);
              setSelectedMonth(m);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="2026-4">May 2026</option>
            <option value="2026-5">June 2026</option>
            <option value="2026-6">July 2026</option>
            <option value="2026-7">August 2026</option>
            <option value="2026-8">September 2026</option>
            <option value="2026-9">October 2026</option>
            <option value="2026-10">November 2026</option>
            <option value="2026-11">December 2026</option>
            <option value="2027-0">January 2027</option>
          </select>
        </div>
      </div>

      {/* Main Grid Calendar */}
      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-lg bg-white">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-white">
          {daysArray.map((day, idx) => {
            if (!day.isCurrentMonth) {
              return (
                <div key={idx} className="min-h-[120px] bg-slate-50/60 p-2 opacity-40 select-none">
                  <span className="text-xs text-slate-400 font-mono"></span>
                </div>
              );
            }

            // Find programs running on this date
            const programsOnDay = programList.filter(prog => 
              day.formattedDate >= prog.startDate && day.formattedDate <= prog.endDate
            );

            return (
              <div key={idx} className="min-h-[130px] p-2 bg-white hover:bg-slate-50 transition-colors flex flex-col justify-between group">
                
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    programsOnDay.length > 0 ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'text-slate-400'
                  }`}>
                    {day.dayNumber}
                  </span>
                  {programsOnDay.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {programsOnDay.length} {programsOnDay.length === 1 ? 'Program' : 'Programs'}
                    </span>
                  )}
                </div>

                {/* Program Cards on Day */}
                <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[140px] pr-0.5">
                  {programsOnDay.map(prog => {
                    // Check volunteer assignments on this program & day
                    const assignedList = volunteers.filter(v => 
                      v.programAssignments && v.programAssignments.some(a => 
                        a.programId === prog.id && a.assignedDate === day.formattedDate
                      )
                    );

                    const isUnstaffed = assignedList.length === 0;

                    return (
                      <button
                        key={prog.id}
                        onClick={() => setSelectedPanel({ program: prog, date: day.formattedDate })}
                        className={`w-full text-left p-1.5 rounded-lg border transition-all hover:scale-[1.02] shadow-sm relative group/btn ${prog.color || 'bg-teal-50 border-teal-200 text-teal-900'}`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold leading-snug">
                          <span className="truncate pr-1">{prog.topic}</span>
                          {isUnstaffed ? (
                            <span className="px-1 py-0.2 rounded text-[9px] bg-rose-100 text-rose-800 border border-rose-300 font-bold shrink-0">
                              Unstaffed
                            </span>
                          ) : (
                            <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-0.5 shrink-0">
                              <UserCheck className="h-2.5 w-2.5" />
                              {assignedList.length}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-600 truncate mt-0.5 flex items-center gap-1 font-medium">
                          <MapPin className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                          <span className="truncate">{prog.location}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Program Reference Legend for Selected Month */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs text-slate-700 bg-white">
        <span className="font-bold text-slate-800 flex items-center gap-1">
          <Layers className="h-4 w-4 text-teal-600" />
          Active Programs in {currentMonthLabel} ({activePrograms.length}):
        </span>
        {activePrograms.length === 0 ? (
          <span className="text-slate-500 italic">No programs scheduled for {currentMonthLabel}. Add new programs in Programs & Shifts setup!</span>
        ) : (
          activePrograms.map(p => (
            <div key={p.id} className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${p.color || 'bg-teal-50 border-teal-200 text-teal-900'}`}>
              <span className="font-bold">{p.topic}</span> — {p.location} ({p.dates})
            </div>
          ))
        )}
      </div>

      {/* Side Panel Assigner Modal */}
      {selectedPanel && (
        <SidePanelAssign
          program={selectedPanel.program}
          selectedDate={selectedPanel.date}
          volunteers={volunteers}
          shifts={shifts}
          onClose={() => setSelectedPanel(null)}
          onAssignVolunteer={onAssignVolunteer}
          onUnassignVolunteer={onUnassignVolunteer}
          onOpenProfile={onOpenProfile}
        />
      )}

    </div>
  );
}
