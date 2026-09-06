import React from 'react';
import { 
  Calendar, 
  Users, 
  UserPlus, 
  Sparkles,
  Layers,
  ChevronDown,
  ChevronsUpDown,
  Building2,
  FileText,
  BarChart3,
  Clock
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, volunteerCount = 18 }) {
  
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'volunteers', label: 'Volunteers', icon: Users },
        { id: 'calendar', label: 'Volunteer Shifts', icon: Calendar },
        { id: 'program_shifts', label: 'Programs', icon: Layers },
      ]
    },
    {
      title: 'APPLICATION FORMS',
      items: [
        { id: 'intake', label: 'Volunteer Form', icon: UserPlus },
      ]
    }
  ];

  return (
    <aside className="w-56 md:w-60 bg-white border-r border-slate-200/90 text-slate-700 flex flex-col justify-between py-4 px-3 shrink-0 z-30 min-h-screen">
      
      <div>
        {/* Brand Header matching Amanah CRM screenshot */}
        <div className="flex items-center justify-between pb-5 mb-4 border-b border-slate-100 px-1 cursor-pointer" onClick={() => setActiveTab('volunteers')}>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#155e4b] text-white flex items-center justify-center font-black text-sm shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-xs font-bold text-slate-900 leading-tight">Kids Innovative</h1>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">Volunteer CRM</p>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
        </div>

        {/* Grouped Navigation List */}
        <div className="space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <h3 className="px-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-1.5 font-mono">
                {section.title}
              </h3>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id 
                    || (activeTab === 'board' && item.id === 'volunteers') 
                    || (activeTab === 'list' && item.id === 'volunteers')
                    || (activeTab === 'programs' && item.id === 'program_shifts')
                    || (activeTab === 'shifts' && item.id === 'program_shifts');

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#e6f4f1] text-[#155e4b] font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${isActive ? 'text-[#155e4b]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          isActive ? 'bg-[#155e4b] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer Goal Card matching bottom-left card in Amanah CRM mockup */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 mt-6">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-800">Volunteer Goal</span>
          <span className="text-[10px] text-slate-500 font-mono font-medium">18 / 25</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#155e4b] rounded-full w-[72%]" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
          <span>72% reached</span>
          <span className="text-[#155e4b] font-bold cursor-pointer hover:underline">View details</span>
        </div>
      </div>

    </aside>
  );
}
