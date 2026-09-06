import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  Lock, 
  RefreshCw, 
  Search, 
  Filter 
} from 'lucide-react';
import { 
  getBackgroundCheckStatusInfo, 
  formatDate 
} from '../utils/formatters';

export default function BackgroundCheckTracker({ 
  volunteers, 
  userRole, 
  setUserRole, 
  onSaveVolunteer, 
  onOpenProfile 
}) {
  const [filterStatus, setFilterStatus] = useState('All'); // All, ExpiringSoon, Expired, Pending, Cleared
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVolId, setEditingVolId] = useState(null);
  const [editFields, setEditFields] = useState({ status: 'cleared', clearedDate: '', expiryDate: '' });

  // Filter volunteers
  const filteredVolunteers = volunteers.filter(vol => {
    const bgInfo = getBackgroundCheckStatusInfo(vol.backgroundCheck);

    const searchLower = searchTerm.toLowerCase();
    const nameMatch = `${vol.firstName} ${vol.lastName}`.toLowerCase().includes(searchLower);
    if (!nameMatch) return false;

    if (filterStatus === 'ExpiringSoon') return bgInfo.isExpiringSoon;
    if (filterStatus === 'Expired') return bgInfo.isExpired;
    if (filterStatus === 'Pending') return vol.backgroundCheck?.status === 'pending';
    if (filterStatus === 'Cleared') return vol.backgroundCheck?.status === 'cleared' && !bgInfo.isExpired && !bgInfo.isExpiringSoon;

    return true;
  });

  // Calculate stats
  const totalExpiringSoon = volunteers.filter(v => getBackgroundCheckStatusInfo(v.backgroundCheck).isExpiringSoon).length;
  const totalExpired = volunteers.filter(v => getBackgroundCheckStatusInfo(v.backgroundCheck).isExpired).length;
  const totalPending = volunteers.filter(v => v.backgroundCheck?.status === 'pending').length;

  const handleStartEdit = (vol) => {
    setEditingVolId(vol.id);
    setEditFields({
      status: vol.backgroundCheck?.status || 'pending',
      clearedDate: vol.backgroundCheck?.clearedDate || '2026-09-01',
      expiryDate: vol.backgroundCheck?.expiryDate || '2027-09-01'
    });
  };

  const handleSaveEdit = (vol) => {
    const updated = {
      ...vol,
      backgroundCheck: {
        ...editFields
      },
      updatedAt: new Date().toISOString()
    };
    onSaveVolunteer(updated);
    setEditingVolId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
              Admin Compliance Tracker
            </span>
            <span className="text-xs text-slate-500 font-medium">Strictly Status & Expiry Dates Only</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-600" />
            Background Check Verification Tracker
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Monitors police background checks and vulnerable sector screening expiry. Visually flags checks expiring within 30 days (yellow alert) or already expired (red alert). No medical or personal fields are displayed.
          </p>
        </div>

        {/* Role Notice */}
        {userRole === 'instructor' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Lock className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 block">Instructor View Active</span>
              <button
                onClick={() => setUserRole('admin')}
                className="text-teal-700 hover:underline font-bold"
              >
                Switch to Admin Mode for full clearance renewal tools
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Expiring Soon (&le; 30 Days)</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{totalExpiringSoon}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Expired Background Checks</div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{totalExpired}</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white shadow-sm">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Pending Checks</div>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">{totalPending}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Toolbar Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by volunteer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 font-medium shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'All', label: 'All Checks' },
            { id: 'ExpiringSoon', label: 'Expiring Soon (30d)' },
            { id: 'Expired', label: 'Expired' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Cleared', label: 'Valid Cleared' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-purple-50 text-purple-800 border border-purple-300 font-bold shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Volunteer Name</th>
                <th className="py-3.5 px-4">Pipeline Stage</th>
                <th className="py-3.5 px-4">Check Status</th>
                <th className="py-3.5 px-4">Cleared Date</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-right">Admin Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                    No background check records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map(vol => {
                  const bgInfo = getBackgroundCheckStatusInfo(vol.backgroundCheck);
                  const isEditing = editingVolId === vol.id;

                  return (
                    <tr key={vol.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <button
                          onClick={() => onOpenProfile(vol)}
                          className="hover:text-teal-700 hover:underline text-left"
                        >
                          {vol.firstName} {vol.lastName}
                        </button>
                      </td>

                      {/* Stage */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {vol.stage}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <select
                            value={editFields.status}
                            onChange={(e) => setEditFields({ ...editFields, status: e.target.value })}
                            className="bg-white text-slate-900 border border-slate-300 rounded p-1 text-xs font-medium"
                          >
                            <option value="pending">Pending</option>
                            <option value="cleared">Cleared</option>
                            <option value="failed">Failed</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${bgInfo.badgeClass}`}>
                            {bgInfo.label}
                          </span>
                        )}
                      </td>

                      {/* Cleared Date */}
                      <td className="py-3.5 px-4 text-slate-700 font-mono font-medium">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editFields.clearedDate}
                            onChange={(e) => setEditFields({ ...editFields, clearedDate: e.target.value })}
                            className="bg-white text-slate-900 border border-slate-300 rounded p-1 text-xs font-medium"
                          />
                        ) : (
                          formatDate(vol.backgroundCheck?.clearedDate)
                        )}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3.5 px-4 font-mono font-medium">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editFields.expiryDate}
                            onChange={(e) => setEditFields({ ...editFields, expiryDate: e.target.value })}
                            className="bg-white text-slate-900 border border-slate-300 rounded p-1 text-xs font-medium"
                          />
                        ) : (
                          <span className={bgInfo.isExpired ? 'text-red-700 font-bold' : bgInfo.isExpiringSoon ? 'text-amber-800 font-bold' : 'text-slate-700'}>
                            {formatDate(vol.backgroundCheck?.expiryDate)}
                          </span>
                        )}
                      </td>

                      {/* Renewal Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(vol)}
                            className="px-3 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-sm"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(vol)}
                            disabled={userRole === 'instructor'}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                              userRole === 'instructor'
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-sm'
                            }`}
                          >
                            <RefreshCw className="h-3 w-3 text-purple-600" />
                            Update Date
                          </button>
                        )}
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
