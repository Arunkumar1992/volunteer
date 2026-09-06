import React, { useState } from 'react';
import { 
  PIPELINE_STAGES, 
  SHIFT_TYPES, 
  SEED_PROGRAMS 
} from '../types';
import { 
  checkIsMinor, 
  calculateAge, 
  getBackgroundCheckStatusInfo, 
  getStageBadgeClass,
  formatDate
} from '../utils/formatters';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  UserCheck, 
  Eye, 
  GraduationCap, 
  Phone, 
  Mail, 
  Sparkles,
  ChevronRight,
  Send,
  MoreVertical,
  CheckSquare,
  Square,
  Paperclip,
  FileText
} from 'lucide-react';

export default function VolunteerList({ 
  volunteers, 
  onOpenProfile 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All'); // All, Minor, Adult
  const [selectedRows, setSelectedRows] = useState([]);

  // Avatar color palette generator matching Amanah CRM table
  const AVATAR_COLORS = [
    'bg-emerald-800 text-white',
    'bg-teal-800 text-white',
    'bg-amber-700 text-white',
    'bg-cyan-800 text-white',
    'bg-[#155e4b] text-white',
    'bg-indigo-800 text-white',
    'bg-purple-800 text-white',
    'bg-rose-800 text-white'
  ];

  const getAvatarColor = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

  // Filter logic
  const filteredVolunteers = volunteers.filter((vol) => {
    // Search matching
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      vol.firstName.toLowerCase().includes(searchLower) ||
      vol.lastName.toLowerCase().includes(searchLower) ||
      vol.email.toLowerCase().includes(searchLower) ||
      vol.school.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Stage filter
    if (stageFilter !== 'All' && vol.stage !== stageFilter) return false;

    // Program filter
    if (programFilter !== 'All' && (!vol.programPreferences || !vol.programPreferences.includes(programFilter))) return false;

    // Age filter
    const isMinor = checkIsMinor(vol.dateOfBirth);
    if (ageFilter === 'Minor' && !isMinor) return false;
    if (ageFilter === 'Adult' && isMinor) return false;

    return true;
  });

  const toggleSelectRow = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredVolunteers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredVolunteers.map(v => v.id));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Filter and Search Toolbar matching Amanah CRM mockup */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] transition-all font-medium shadow-2xs"
          />
        </div>

        {/* Filter Dropdowns matching mockup pills */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] shadow-2xs transition-all"
          >
            <option value="All">All Stages</option>
            {PIPELINE_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] shadow-2xs transition-all"
          >
            <option value="All">All Programs</option>
            {SEED_PROGRAMS.map(p => (
              <option key={p.id} value={p.id}>{p.topic}</option>
            ))}
          </select>

          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#155e4b]/10 focus:border-[#155e4b] shadow-2xs transition-all"
          >
            <option value="All">All Ages</option>
            <option value="Minor">Minor</option>
            <option value="Adult">Adult</option>
          </select>

        </div>

      </div>

      {/* Roster Data Table matching Amanah CRM screenshot */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-mono">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length > 0 && selectedRows.length === filteredVolunteers.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-[#155e4b] focus:ring-[#155e4b]"
                  />
                </th>
                <th className="py-3 px-4">VOLUNTEER</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">SCHOOL / SEGMENT</th>
                <th className="py-3 px-4">HOURS SERVED</th>
                <th className="py-3 px-4">SHIFTS</th>
                <th className="py-3 px-4">LAST ACTIVE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500 font-medium">
                    No volunteer records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol, idx) => {
                  const isMinor = checkIsMinor(vol.dateOfBirth);
                  const isSelected = selectedRows.includes(vol.id);
                  const avatarBg = getAvatarColor(idx);

                  // Mock hours & shifts count for demo aesthetics
                  const shiftCount = vol.programAssignments ? vol.programAssignments.length + 2 : 2;
                  const hoursServed = shiftCount * 4;

                  return (
                    <tr
                      key={vol.id}
                      onClick={() => onOpenProfile(vol)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(vol.id)}
                          className="rounded border-slate-300 text-[#155e4b] focus:ring-[#155e4b]"
                        />
                      </td>

                      {/* Volunteer Name & Email with Circular Initial Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full ${avatarBg} font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                            {vol.firstName[0]}{vol.lastName[0]}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight hover:text-[#155e4b] transition-colors flex items-center gap-1.5">
                              <span>{vol.firstName} {vol.lastName}</span>
                              {vol.uploadedFile && (
                                <span className="p-0.5 rounded bg-emerald-50 text-[#155e4b] border border-emerald-200" title={`Attached File: ${vol.uploadedFile.name}`}>
                                  <Paperclip className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-normal">
                              {vol.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge matching Amanah CRM pill style */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isMinor
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-purple-50 text-purple-900 border-purple-300'
                        }`}>
                          {isMinor ? 'Minor' : 'Adult'}
                        </span>
                      </td>

                      {/* Status Badge matching Amanah CRM pill style */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 w-max ${
                          vol.stage === 'Active' || vol.stage === 'Assigned'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : vol.stage === 'Applied'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            vol.stage === 'Active' || vol.stage === 'Assigned' ? 'bg-emerald-600' : 'bg-amber-600'
                          }`} />
                          {vol.stage}
                        </span>
                      </td>

                      {/* School / Segment */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {vol.school}
                      </td>

                      {/* Hours Served */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {hoursServed} hrs
                      </td>

                      {/* Shifts Count */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {shiftCount}
                      </td>

                      {/* Last Active Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        2026-06-15
                      </td>

                      {/* Quick Action Icons matching Amanah CRM mockup right column */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenProfile(vol)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onOpenProfile(vol)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Send Message"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenProfile(vol)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
