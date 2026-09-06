import React from 'react';
import { 
  Calendar, 
  Kanban, 
  Users, 
  ShieldAlert, 
  BarChart3, 
  UserPlus, 
  RotateCcw, 
  ShieldCheck, 
  Eye, 
  Sparkles 
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  setUserRole, 
  onResetData 
}) {
  const tabs = [
    { id: 'calendar', label: 'Calendar & Scheduling', icon: Calendar },
    { id: 'board', label: 'Pipeline Board', icon: Kanban },
    { id: 'list', label: 'Volunteer Directory', icon: Users },
    { id: 'bgcheck', label: 'Background Checks', icon: ShieldAlert, adminOnly: false },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'intake', label: 'New Volunteer Form', icon: UserPlus },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with branding, role toggle, and reset */}
        <div className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 p-0.5 shadow-md">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Kids Innovative
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Volunteer Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500">STEAM Education Programs & Camps • Ages 5–14</p>
            </div>
          </div>

          {/* Right Action Bar: Role Switcher & Reset Button */}
          <div className="flex items-center gap-3">
            
            {/* Role Simulation Switcher */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setUserRole('instructor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'instructor'
                    ? 'bg-white text-emerald-800 border border-emerald-300 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Instructor Mode: Restricts sensitive medical notes and detailed background checks"
              >
                <Eye className="h-3.5 w-3.5" />
                Instructor Mode
              </button>
              <button
                type="button"
                onClick={() => setUserRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  userRole === 'admin'
                    ? 'bg-white text-purple-800 border border-purple-300 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Admin Mode: Full access to medical notes, background details, and exports"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Mode
              </button>
            </div>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all shadow-sm active:scale-95"
              title="Reload initial seed volunteer data into localStorage"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>

          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
