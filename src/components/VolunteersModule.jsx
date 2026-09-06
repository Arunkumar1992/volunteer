import React, { useState } from 'react';
import { 
  Users, 
  Kanban, 
  List, 
  Sparkles, 
  Filter, 
  Search, 
  UserPlus,
  UserCheck,
  AlertTriangle,
  Award,
  Download,
  Plus,
  ChevronDown,
  Table as TableIcon,
  Clock,
  Layers
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import VolunteerList from './VolunteerList';

export default function VolunteersModule({
  volunteers,
  onUpdateStage,
  onOpenProfile,
  setActiveTab
}) {
  const [viewMode, setViewMode] = useState('board'); // 'board' (Kanban) vs 'table' (Directory)
  const [segmentFilter, setSegmentFilter] = useState('All'); // 'All', 'Active', 'Applied', 'Onboarding', 'Minor'

  const totalVolunteersCount = volunteers.length;
  const activeCount = volunteers.filter(v => v.stage === 'Active' || v.stage === 'Assigned').length;
  const appliedCount = volunteers.filter(v => v.stage === 'Applied' || v.stage === 'Screening').length;
  const onboardingCount = volunteers.filter(v => v.stage === 'Onboarding' || v.stage === 'Training' || v.stage === 'Shadowing').length;
  const minorCount = volunteers.filter(v => v.isMinor).length;
  const pendingBgCheckCount = volunteers.filter(v => v.backgroundCheck?.status === 'pending').length;

  // Filter volunteers based on segment
  const segmentedVolunteers = volunteers.filter(v => {
    if (segmentFilter === 'Active') return v.stage === 'Active' || v.stage === 'Assigned';
    if (segmentFilter === 'Applied') return v.stage === 'Applied' || v.stage === 'Screening';
    if (segmentFilter === 'Onboarding') return v.stage === 'Onboarding' || v.stage === 'Training' || v.stage === 'Shadowing';
    if (segmentFilter === 'Minor') return v.isMinor;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Module Title Header matching Tasks Mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <span>Workspace</span>
            <span>›</span>
            <span className="text-slate-800 font-bold">Volunteers</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Volunteers</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Keep track of your volunteer pipeline, shifts, and background checks all in one place.
          </p>
        </div>

        {/* Action Buttons matching Tasks board top right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('intake')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-[#155e4b] text-white hover:bg-[#0f4b3c] transition-all shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric Card 1: Total Volunteers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Users className="h-4 w-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ↑ 3.2% vs last quarter
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Total volunteers</span>
            <span className="text-2xl font-black text-slate-900 leading-tight block">{totalVolunteersCount}</span>
          </div>
        </div>

        {/* Metric Card 2: Active this year */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <UserCheck className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round((activeCount / totalVolunteersCount) * 100)}% retention
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Active this year</span>
            <span className="text-2xl font-black text-slate-900 leading-tight block">{activeCount}</span>
          </div>
        </div>

        {/* Metric Card 3: Pending Clearance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Award className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-700">
              Background check
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Pending clearance</span>
            <span className="text-2xl font-black text-slate-900 leading-tight block">{pendingBgCheckCount}</span>
          </div>
        </div>

        {/* Metric Card 4: Needs Outreach */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
              Needs outreach
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">Applied & pending</span>
            <span className="text-2xl font-black text-slate-900 leading-tight block">{appliedCount}</span>
          </div>
        </div>

      </div>

      {/* View Switcher Tabs Bar matching exact Tasks Board Mockup */}
      <div className="border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        
        {/* Board / Table View Switcher Tabs matching Mockup */}
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setViewMode('board')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-all ${
              viewMode === 'board'
                ? 'border-[#155e4b] text-[#155e4b] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Kanban className="h-4 w-4" />
            <span>Board</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`py-2.5 px-4 flex items-center gap-2 border-b-2 transition-all ${
              viewMode === 'table'
                ? 'border-[#155e4b] text-[#155e4b] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <TableIcon className="h-4 w-4" />
            <span>Table</span>
          </button>
        </div>

        {/* Segment Filter Pills on the right */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold scrollbar-none pb-2 sm:pb-0">
          {[
            { id: 'All', label: 'All', count: totalVolunteersCount },
            { id: 'Active', label: 'Active', count: activeCount },
            { id: 'Applied', label: 'Applied', count: appliedCount },
            { id: 'Minor', label: 'Minor', count: minorCount },
          ].map((tab) => {
            const isActive = segmentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSegmentFilter(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#155e4b] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main View Mode Content */}
      {viewMode === 'board' ? (
        <KanbanBoard
          volunteers={segmentedVolunteers}
          onUpdateStage={onUpdateStage}
          onOpenProfile={onOpenProfile}
        />
      ) : (
        <VolunteerList
          volunteers={segmentedVolunteers}
          onOpenProfile={onOpenProfile}
        />
      )}

    </div>
  );
}
