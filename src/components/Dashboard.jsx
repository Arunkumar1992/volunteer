import React from 'react';
import { 
  PIPELINE_STAGES, 
  SEED_PROGRAMS 
} from '../types';
import { 
  checkIsMinor, 
  getBackgroundCheckStatusInfo 
} from '../utils/formatters';
import { 
  Users, 
  UserCheck, 
  ShieldAlert, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  HeartHandshake,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ 
  volunteers, 
  setActiveTab, 
  onOpenProfile 
}) {
  const totalVolunteers = volunteers.length;

  // Pipeline stages breakdown
  const stageCounts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = volunteers.filter(v => v.stage === stage).length;
    return acc;
  }, {});

  // Active & Assigned count
  const activeCount = volunteers.filter(v => v.stage === 'Active' || v.stage === 'Assigned').length;

  // Minor vs Adult breakdown
  const minorCount = volunteers.filter(v => checkIsMinor(v.dateOfBirth)).length;
  const adultCount = totalVolunteers - minorCount;
  const minorPercentage = totalVolunteers > 0 ? Math.round((minorCount / totalVolunteers) * 100) : 0;

  // Returning vs New breakdown
  const returningCount = volunteers.filter(v => v.isReturning).length;
  const newCount = totalVolunteers - returningCount;

  // Background check status counts
  const expiringSoonCount = volunteers.filter(v => getBackgroundCheckStatusInfo(v.backgroundCheck).isExpiringSoon).length;
  const expiredCount = volunteers.filter(v => getBackgroundCheckStatusInfo(v.backgroundCheck).isExpired).length;

  // Program interest counts
  const programStats = SEED_PROGRAMS.map(prog => {
    const interested = volunteers.filter(v => v.programPreferences && v.programPreferences.includes(prog.id)).length;
    const assigned = volunteers.filter(v => 
      v.programAssignments && v.programAssignments.some(a => a.programId === prog.id)
    ).length;
    return {
      ...prog,
      interested,
      assigned
    };
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              Executive Overview
            </span>
            <span className="text-xs text-slate-500 font-medium">Summer 2026 Season Metrics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-teal-600" />
            Volunteer Pipeline Analytics
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Real-time pipeline metrics, age distribution, background check compliance, and program staffing ratios.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('calendar')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all self-start md:self-auto"
        >
          <Calendar className="h-4 w-4" />
          Open Calendar Assigner
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Volunteers */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Volunteers</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalVolunteers}</div>
          <div className="text-[11px] text-teal-700 mt-1 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Active Season Database
          </div>
        </div>

        {/* Card 2: Active & Assigned */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ready for Duty</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Active / Assigned Stages
          </div>
        </div>

        {/* Card 3: Minors vs Adults */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Minors (&lt;18) vs Adults</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <HeartHandshake className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800 mt-2">{minorCount} <span className="text-xs text-slate-500 font-medium">/ {adultCount} adult</span></div>
          <div className="text-[11px] text-amber-800 mt-1 font-bold">
            {minorPercentage}% High School Students
          </div>
        </div>

        {/* Card 4: Returning Volunteers */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Returning vs New</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-800 mt-2">{returningCount} <span className="text-xs text-slate-500 font-medium">returning</span></div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {newCount} New Applicants
          </div>
        </div>

        {/* Card 5: BG Check Alerts */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">BG Checks Action</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 mt-2">{expiredCount + expiringSoonCount}</div>
          <div className="text-[11px] text-rose-700 mt-1 font-bold">
            {expiredCount} Expired • {expiringSoonCount} Expiring 30d
          </div>
        </div>

      </div>

      {/* Grid: Funnel & Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pipeline Funnel Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="h-4 w-4 text-teal-600" />
              Pipeline Stage Funnel Distribution
            </h3>
            <button
              onClick={() => setActiveTab('board')}
              className="text-xs text-teal-700 hover:underline flex items-center gap-0.5 font-bold"
            >
              Open Board <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {PIPELINE_STAGES.map(stage => {
              const count = stageCounts[stage] || 0;
              const percent = totalVolunteers > 0 ? Math.round((count / totalVolunteers) * 100) : 0;
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{stage}</span>
                    <span className="font-mono font-semibold text-slate-600">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program Staffing Coverage */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              Program Interest vs Assigned Staffing
            </h3>
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-amber-700 hover:underline flex items-center gap-0.5 font-bold"
            >
              Calendar View <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {programStats.map(prog => (
              <div key={prog.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">{prog.topic} ({prog.location})</span>
                  <span className="text-[10px] text-teal-700 font-mono font-bold">{prog.dates}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Interested Volunteers: <strong className="text-slate-900 font-bold">{prog.interested}</strong></span>
                  <span>Currently Assigned: <strong className="text-emerald-700 font-bold">{prog.assigned}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
