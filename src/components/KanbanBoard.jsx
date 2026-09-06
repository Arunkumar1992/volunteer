import React, { useState } from 'react';
import { 
  PIPELINE_STAGES, 
  SEED_PROGRAMS 
} from '../types';
import { 
  checkIsMinor, 
  calculateAge, 
  getBackgroundCheckStatusInfo,
  getStageBadgeClass
} from '../utils/formatters';
import { 
  Crown,
  GraduationCap, 
  GripVertical,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Plus,
  MoreHorizontal,
  Mail,
  Phone
} from 'lucide-react';

export default function KanbanBoard({ 
  volunteers, 
  onUpdateStage, 
  onOpenProfile 
}) {
  const [draggedVolunteerId, setDraggedVolunteerId] = useState(null);

  // Handle Drag & Drop
  const handleDragStart = (e, volunteerId) => {
    e.dataTransfer.setData('text/plain', volunteerId);
    setDraggedVolunteerId(volunteerId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const volunteerId = e.dataTransfer.getData('text/plain') || draggedVolunteerId;
    if (volunteerId) {
      onUpdateStage(volunteerId, targetStage);
    }
    setDraggedVolunteerId(null);
  };

  // Stage dot colors matching mockup
  const STAGE_DOT_COLORS = {
    'Applied': 'bg-amber-500 text-amber-800 bg-amber-50 border-amber-200',
    'Screening': 'bg-sky-500 text-sky-800 bg-sky-50 border-sky-200',
    'Background Check': 'bg-purple-500 text-purple-800 bg-purple-50 border-purple-200',
    'Onboarding': 'bg-indigo-500 text-indigo-800 bg-indigo-50 border-indigo-200',
    'Training': 'bg-[#155e4b] text-[#155e4b] bg-emerald-50 border-emerald-200',
    'Shadowing': 'bg-teal-500 text-teal-800 bg-teal-50 border-teal-200',
    'Active': 'bg-emerald-600 text-emerald-900 bg-emerald-50 border-emerald-300',
    'Assigned': 'bg-blue-600 text-blue-900 bg-blue-50 border-blue-200',
    'Inactive': 'bg-slate-400 text-slate-700 bg-slate-100 border-slate-300'
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Horizontal Scrollable Kanban Board Columns Container */}
      <div className="flex space-x-4 overflow-x-auto pb-6 pt-1 scrollbar-thin">
        {PIPELINE_STAGES.map((stage) => {
          const stageVolunteers = volunteers.filter(v => v.stage === stage);
          const dotColorClass = STAGE_DOT_COLORS[stage] || 'bg-slate-400 text-slate-700 bg-slate-100 border-slate-300';
          const dotOnly = dotColorClass.split(' ')[0];

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
              className="flex-shrink-0 w-72 sm:w-80 bg-slate-100/70 rounded-2xl border border-slate-200/80 flex flex-col min-h-[600px] p-3 shadow-2xs"
            >
              {/* Column Header matching Tasks mockup layout */}
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${dotOnly}`} />
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                    {stage}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold font-mono">
                    {stageVolunteers.length}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <button className="p-1 rounded hover:bg-slate-200 hover:text-slate-700 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-slate-200 hover:text-slate-700 transition-colors">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Volunteer Cards List using Real Volunteer Data */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-0.5">
                {stageVolunteers.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-300 bg-white/50 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-medium">
                    No volunteers in {stage}
                  </div>
                ) : (
                  stageVolunteers.map((vol) => {
                    const isMinor = checkIsMinor(vol.dateOfBirth);
                    const bgCheckInfo = getBackgroundCheckStatusInfo(vol.backgroundCheck);

                    return (
                      <div
                        key={vol.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, vol.id)}
                        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#155e4b] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-2.5"
                      >
                        
                        {/* Title: Volunteer Full Name & Action Menu */}
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => onOpenProfile(vol)}
                            className="font-black text-sm text-slate-900 hover:text-[#155e4b] text-left leading-tight transition-colors block"
                          >
                            {vol.firstName} {vol.lastName}
                          </button>
                          <button onClick={() => onOpenProfile(vol)} className="text-slate-300 hover:text-slate-600 transition-colors p-0.5 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        {/* School row with crown icon */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                          <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{vol.school}</span>
                        </div>

                        {/* Email contact row */}
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {vol.email}
                        </div>

                        {/* Real Compliance & Training Badges */}
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${bgCheckInfo.badgeClass}`}>
                            BG: {bgCheckInfo.label}
                          </span>

                          {vol.trainingCompleted ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                              Trained
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300 font-medium">
                              Untrained
                            </span>
                          )}

                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                            isMinor
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-purple-50 text-purple-900 border-purple-300'
                          }`}>
                            {isMinor ? 'Minor' : 'Adult'}
                          </span>
                        </div>

                        {/* Footer Stage Selector Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="h-6 w-6 rounded-full bg-[#155e4b] text-white font-extrabold text-[10px] flex items-center justify-center shadow-2xs">
                            {((vol.firstName || '')[0] || '').toUpperCase()}{((vol.lastName || '')[0] || '').toUpperCase() || 'V'}
                          </div>

                          {/* Stage dropdown selector labeled as Stage: */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] font-bold text-slate-600 font-sans">Stage:</span>
                            <select
                              value={vol.stage}
                              onChange={(e) => onUpdateStage(vol.id, e.target.value)}
                              className="text-[10px] bg-white text-slate-900 border border-slate-200 rounded-lg px-2 py-0.5 focus:ring-2 focus:ring-[#155e4b]/20 focus:border-[#155e4b] focus:outline-none font-bold shadow-2xs"
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
