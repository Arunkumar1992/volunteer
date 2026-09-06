import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  X,
  UserPlus
} from 'lucide-react';

export default function GoogleCalendarView({
  volunteers,
  programs = [],
  shifts = [],
  onAssignVolunteer,
  onUnassignVolunteer,
  onOpenProfile
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [viewType, setViewType] = useState('Month'); // 'Month', 'Week', 'Day', 'Schedule'
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Month & Year calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Calendar Days Grid for current month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      dateStr: new Date(year, month - 1, daysInPrevMonth - i).toISOString().split('T')[0],
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dateStr = dateObj.toISOString().split('T')[0];
    calendarDays.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: d === 15 && month === 8 && year === 2026 // Highlight Sept 15 demo
    });
  }

  // Next month leading days to complete grid cells
  const totalGridCells = calendarDays.length > 35 ? 42 : 35;
  const remainingCells = totalGridCells - calendarDays.length;
  for (let d = 1; d <= remainingCells; d++) {
    calendarDays.push({
      dateStr: new Date(year, month + 1, d).toISOString().split('T')[0],
      dayNum: d,
      isCurrentMonth: false
    });
  }

  // Match shifts & programs for each calendar day
  const getEventsForDate = (dateStr) => {
    const events = [];

    programs.forEach(prog => {
      if (!prog.startDate || !prog.endDate) return;
      if (dateStr >= prog.startDate && dateStr <= prog.endDate) {
        // Add shifts
        const enabledShifts = shifts.filter(s => typeof s === 'string' ? true : (s.enabled ?? true));
        enabledShifts.forEach(s => {
          const shiftName = typeof s === 'string' ? s : s.name;
          
          // Find assigned volunteers
          const assignedVols = volunteers.filter(v => 
            v.programAssignments && v.programAssignments.some(a => 
              a.programId === prog.id && 
              a.assignedDate === dateStr && 
              (a.shift === shiftName || !a.shift)
            )
          );

          events.push({
            id: `${prog.id}-${dateStr}-${shiftName}`,
            program: prog,
            dateStr,
            shiftName,
            assignedVolunteers: assignedVols,
            isStaffed: assignedVols.length > 0
          });
        });
      }
    });

    return events;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in flex flex-col font-sans">
      
      {/* Google Calendar Style Top Action Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        
        {/* Left: Navigation & Month Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            Today
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 min-w-44">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* Staffed vs Unstaffed Color Status Legend Bar */}
        <div className="flex items-center gap-3">
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Status Colors:</span>
            
            {/* Staffed Color Chip */}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[11px] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Staffed (Covered)
            </span>

            {/* Unstaffed Color Chip */}
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-extrabold text-[11px] flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              Unstaffed (Needs Vol)
            </span>
          </div>

          {/* Month / Week / Day Tab Selector */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
            {['Month', 'Week', 'Day', 'Schedule'].map(v => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewType === v
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Weekday Header Row (Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider text-center py-2.5 font-mono">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Google Calendar Month Grid Cells */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200 min-h-[580px] bg-slate-100/40">
        {calendarDays.map((day, idx) => {
          const events = getEventsForDate(day.dateStr);

          return (
            <div
              key={idx}
              className={`p-1.5 min-h-[110px] flex flex-col justify-start transition-colors ${
                day.isCurrentMonth ? 'bg-white' : 'bg-slate-50/70 text-slate-300'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1 px-1">
                <span
                  className={`text-xs font-extrabold h-6 w-6 rounded-full flex items-center justify-center font-mono ${
                    day.isToday
                      ? 'bg-[#155e4b] text-white shadow-2xs'
                      : day.isCurrentMonth
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {day.dayNum}
                </span>

                {events.length > 0 && (
                  <span className="text-[9px] font-mono text-slate-400 font-bold">
                    {events.length} shift{events.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Shift Events Pills with Distinct Color Coding for Staffed (Green) vs Unstaffed (Red) */}
              <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-none">
                {events.map(ev => {
                  const isStaffed = ev.isStaffed;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${
                        isStaffed
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300 border-l-4 border-l-emerald-600 font-extrabold'
                          : 'bg-rose-100 text-rose-950 border-rose-300 border-l-4 border-l-rose-600 font-extrabold'
                      }`}
                    >
                      <div className="text-[10px] font-extrabold truncate leading-tight flex items-center justify-between">
                        <span className="truncate">{ev.program.topic}</span>
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isStaffed ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </div>
                      <div className="text-[9px] text-slate-600 font-semibold truncate flex items-center gap-1 mt-0.5">
                        <Clock className="h-2.5 w-2.5 shrink-0" />
                        <span>{ev.shiftName.split(' ')[0]}</span>
                        {isStaffed ? (
                          <span className="text-emerald-800 font-extrabold font-mono">({ev.assignedVolunteers.length} Vol)</span>
                        ) : (
                          <span className="text-rose-700 font-black">UNSTAFFED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Google Calendar Style Event Detail Modal Popover */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl text-white ${selectedEvent.isStaffed ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                      {selectedEvent.dateStr}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold ${
                      selectedEvent.isStaffed
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {selectedEvent.isStaffed ? 'STAFFED ✓' : 'UNSTAFFED ✗'}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedEvent.program.topic}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Clock className="h-4 w-4 text-[#155e4b]" />
                <span>Shift Category: <strong>{selectedEvent.shiftName}</strong></span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <MapPin className="h-4 w-4 text-[#155e4b]" />
                <span>Location: <strong>{selectedEvent.program.location}</strong></span>
              </div>

              {/* Assigned Volunteers Roster */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Assigned Volunteers ({selectedEvent.assignedVolunteers.length})
                </h4>

                {selectedEvent.assignedVolunteers.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>This shift is currently unstaffed. Assign an active volunteer from the Shift Roster!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedEvent.assignedVolunteers.map(v => (
                      <div key={v.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-[#155e4b] text-white font-bold text-xs flex items-center justify-center">
                            {v.firstName[0]}{v.lastName[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{v.firstName} {v.lastName}</div>
                            <div className="text-[10px] text-slate-500">{v.school}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onUnassignVolunteer(v.id, selectedEvent.program.id, selectedEvent.shiftName, selectedEvent.dateStr);
                            setSelectedEvent(null);
                          }}
                          className="text-[11px] text-rose-600 font-bold hover:underline"
                        >
                          Unassign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300"
              >
                Close Calendar Event
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
