import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Download, 
  Plus, 
  Bell, 
  Grid, 
  RefreshCw,
  ChevronDown
} from 'lucide-react';

export default function TopBar({ 
  activeTab,
  setActiveTab,
  onResetData,
  searchTerm,
  setSearchTerm
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      
      {/* Search Input Box with Command K Badge matching Amanah CRM Header */}
      <div className="relative w-full max-w-md">
        <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          placeholder="Search volunteers, gifts, campaigns, tasks..."
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#155e4b] focus:bg-white transition-all font-medium"
        />
        <div className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 text-[10px] font-mono font-bold">
          ⌘K
        </div>
      </div>

      {/* Right Toolbar Controls matching Amanah CRM */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Reset Button */}
        <button
          type="button"
          onClick={onResetData}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          title="Reload initial seed volunteer data"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
          <span>Reset</span>
        </button>



        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden lg:block" />

        {/* User Profile Avatar matching mockup right top bar */}
        <div className="hidden lg:flex items-center gap-2 pl-1 cursor-pointer">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
              alt="User profile"
              className="h-8 w-8 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
              7
            </span>
          </div>
        </div>

      </div>

    </header>
  );
}
