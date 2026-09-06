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
  Layers,
  Clock
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
  // Current month/year/day state (Default to August 2026: year=2026, monthIndex=7, dayNum=15)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(7); // 7 = August (0-indexed)
  const [selectedDayNum, setSelectedDayNum] = useState(15);
  const [weekIndex, setWeekIndex] = useState(1); // 0-indexed week offset of month
  const [calendarViewMode, setCalendarViewMode] = useState('Month'); // 'Month', 'Week', 'Day'
  
  // Dynamic list of active programs
  const programList = (programs && programs.length > 0 ? programs : SEED_PROGRAMS).filter(p => p.enabled ?? true);

  // Side Panel state
  const [selectedPanel, setSelectedPanel] = useState(null); // { program, date }

  // Format month key: e.g. "2026-08"
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

  // Calculate weeks array for Week view
  const weeksList = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeksList.push(daysArray.slice(i, i + 7));
  }

  // Stepper navigation handlers based on active view mode
  const handlePrev = () => {
    if (calendarViewMode === 'Month') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(prev => prev - 1);
      } else {
        setSelectedMonth(prev => prev - 1);
      }
    } else if (calendarViewMode === 'Week') {
      if (weekIndex > 0) {
        setWeekIndex(prev => prev - 1);
      } else if (selectedMonth > 0) {
        setSelectedMonth(prev => prev - 1);
        setWeekIndex(3);
      }
    } else if (calendarViewMode === 'Day') {
      if (selectedDayNum > 1) {
        setSelectedDayNum(prev => prev - 1);
      } else if (selectedMonth > 0) {
        setSelectedMonth(prev => prev - 1);
        const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
        setSelectedDayNum(prevMonthDays);
      }
    }
  };

  const handleNext = () => {
    if (calendarViewMode === 'Month') {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(prev => prev + 1);
      } else {
        setSelectedMonth(prev => prev + 1);
      }
    } else if (calendarViewMode === 'Week') {
      if (weekIndex < weeksList.length - 1) {
        setWeekIndex(prev => prev + 1);
      } else if (selectedMonth < 11) {
        setSelectedMonth(prev => prev + 1);
        setWeekIndex(0);
      }
    } else if (calendarViewMode === 'Day') {
      if (selectedDayNum < daysInMonth) {
        setSelectedDayNum(prev => prev + 1);
      } else if (selectedMonth < 11) {
        setSelectedMonth(prev => prev + 1);
        setSelectedDayNum(1);
      }
    }
  };

  // Header Title text based on active view mode
  const getHeaderTitle = () => {
    if (calendarViewMode === 'Month') {
      return currentMonthLabel;
    }
    if (calendarViewMode === 'Week') {
      const activeWeek = weeksList[weekIndex] || weeksList[0] || [];
      const validDays = activeWeek.filter(d => d.dayNumber !== null);
      if (validDays.length > 0) {
        const startDay = validDays[0].dayNumber;
        const endDay = validDays[validDays.length - 1].dayNumber;
        return `${MONTH_NAMES[selectedMonth]} ${startDay} – ${endDay}, ${selectedYear}`;
      }
      return currentMonthLabel;
    }
    if (calendarViewMode === 'Day') {
      return `${MONTH_NAMES[selectedMonth]} ${selectedDayNum}, ${selectedYear}`;
    }
    return currentMonthLabel;
  };

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

  // Active view days
  const currentWeekDays = weeksList[weekIndex] || weeksList[0] || [];
  const selectedDayFormatted = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDayNum).padStart(2, '0')}`;

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      
      {/* Calendar Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Left: Unstaffed Alert Badge */}
        <div className="flex items-center gap-2">
          {unstaffedDatesCount > 0 ? (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>{unstaffedDatesCount} Unstaffed Shifts</span>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-700 font-mono">
              View: {getHeaderTitle()}
            </span>
          )}
        </div>

        {/* Right: Date Stepper & View Switcher (Replaces duplicate month dropdown) */}
        <div className="flex items-center gap-3">
          
          {/* Stepper Controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Stepper Label */}
            <div className="px-3.5 text-xs font-extrabold text-slate-800 font-mono min-w-36 text-center">
              {getHeaderTitle()}
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* View Mode Pill Switcher (Single clean view filter) */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
            {['Month', 'Week', 'Day'].map(v => (
              <button
                key={v}
                onClick={() => setCalendarViewMode(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  calendarViewMode === v
                    ? 'bg-[#155e4b] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* MONTH VIEW */}
      {calendarViewMode === 'Month' && (
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-3 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-white">
            {daysArray.map((day, idx) => {
              if (!day.isCurrentMonth) {
                return (
                  <div key={idx} className="min-h-[120px] bg-slate-50/60 p-2 opacity-40 select-none">
                    <span className="text-xs text-slate-400 font-mono"></span>
                  </div>
                );
              }

              const programsOnDay = programList.filter(prog => 
                day.formattedDate >= prog.startDate && day.formattedDate <= prog.endDate
              );

              return (
                <div key={idx} className="min-h-[130px] p-2 bg-white hover:bg-slate-50 transition-colors flex flex-col justify-between group">
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

                  <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[140px] pr-0.5">
                    {programsOnDay.map(prog => {
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
      )}

      {/* WEEK VIEW */}
      {calendarViewMode === 'Week' && (
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
          <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-3 text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-200 bg-white min-h-[420px]">
            {currentWeekDays.map((day, idx) => {
              if (!day || !day.isCurrentMonth) {
                return (
                  <div key={idx} className="bg-slate-50/60 p-3 opacity-40 select-none">
                    <span className="text-xs text-slate-400 font-mono">N/A</span>
                  </div>
                );
              }

              const programsOnDay = programList.filter(prog => 
                day.formattedDate >= prog.startDate && day.formattedDate <= prog.endDate
              );

              return (
                <div key={idx} className="p-3 bg-white hover:bg-slate-50/60 transition-colors flex flex-col justify-start">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-sm font-extrabold font-mono text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {programsOnDay.length} shifts
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {programsOnDay.map(prog => {
                      const assignedList = volunteers.filter(v => 
                        v.programAssignments && v.programAssignments.some(a => 
                          a.programId === prog.id && a.assignedDate === day.formattedDate
                        )
                      );
                      const isUnstaffed = assignedList.length === 0;

                      return (
                        <div
                          key={prog.id}
                          onClick={() => setSelectedPanel({ program: prog, date: day.formattedDate })}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${
                            isUnstaffed
                              ? 'bg-rose-50 border-rose-200 text-rose-950 border-l-4 border-l-rose-500'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-950 border-l-4 border-l-emerald-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="truncate pr-1">{prog.topic}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                              isUnstaffed ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                            }`}>
                              {isUnstaffed ? 'UNSTAFFED' : `${assignedList.length} Vol`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-semibold truncate flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500 shrink-0" />
                            <span>{prog.shift}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{prog.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {calendarViewMode === 'Day' && (
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Day Schedule Overview
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {getHeaderTitle()}
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 font-mono">
              Date Code: {selectedDayFormatted}
            </div>
          </div>

          {/* List of Programs on this Single Day */}
          {(() => {
            const dayPrograms = programList.filter(prog => 
              selectedDayFormatted >= prog.startDate && selectedDayFormatted <= prog.endDate
            );

            if (dayPrograms.length === 0) {
              return (
                <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold">No programs or shifts scheduled for this day.</p>
                  <p className="text-xs text-slate-400 mt-1">Use the date navigation buttons above to view other dates.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {dayPrograms.map(prog => {
                  const assignedList = volunteers.filter(v => 
                    v.programAssignments && v.programAssignments.some(a => 
                      a.programId === prog.id && a.assignedDate === selectedDayFormatted
                    )
                  );
                  const isUnstaffed = assignedList.length === 0;

                  return (
                    <div
                      key={prog.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isUnstaffed 
                          ? 'bg-rose-50/40 border-rose-200' 
                          : 'bg-emerald-50/40 border-emerald-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isUnstaffed ? 'bg-rose-600 text-white' : 'bg-[#155e4b] text-white'}`}>
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-900">{prog.topic}</h3>
                            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-[#155e4b]" />
                                {prog.shift}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-[#155e4b]" />
                                {prog.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${
                            isUnstaffed 
                              ? 'bg-rose-100 text-rose-900 border-rose-300' 
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}>
                            {isUnstaffed ? '⚠️ UNSTAFFED SHIFT' : `✓ STAFFED (${assignedList.length} Volunteers)`}
                          </span>

                          <button
                            onClick={() => setSelectedPanel({ program: prog, date: selectedDayFormatted })}
                            className="px-4 py-2 rounded-xl bg-[#155e4b] hover:bg-[#114b3c] text-white text-xs font-bold shadow-2xs transition-all"
                          >
                            Manage Shift Roster →
                          </button>
                        </div>
                      </div>

                      {/* Assigned Volunteer list */}
                      <div className="pt-3 border-t border-slate-200/60 mt-3">
                        <span className="text-xs font-extrabold text-slate-700 block mb-2 font-mono">
                          Assigned Roster:
                        </span>
                        {assignedList.length === 0 ? (
                          <p className="text-xs text-rose-700 font-medium">No volunteers assigned to this shift yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {assignedList.map(v => (
                              <div key={v.id} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-800">
                                <div className="h-5 w-5 rounded-full bg-[#155e4b] text-white text-[10px] flex items-center justify-center font-mono">
                                  {v.firstName[0]}
                                </div>
                                <span>{v.firstName} {v.lastName}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

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
