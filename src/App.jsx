import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import NotificationToast from './components/NotificationToast';
import CalendarView from './components/CalendarView';
import VolunteerProfileModal from './components/VolunteerProfileModal';
import IntakeForm from './components/IntakeForm';
import ProgramShiftConfigModal from './components/ProgramShiftConfigModal';
import VolunteersModule from './components/VolunteersModule';
import ProgramsShiftsCombinedModule from './components/ProgramsShiftsCombinedModule';

import { 
  getStoredVolunteers, 
  saveStoredVolunteers, 
  resetStoredVolunteers,
  getStoredPrograms,
  saveStoredPrograms,
  getStoredShifts,
  saveStoredShifts
} from './services/storage';
import { checkIsMinor } from './utils/formatters';

export default function App() {
  const [volunteers, setVolunteers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [shifts, setShifts] = useState([]);

  const [activeTab, setActiveTab] = useState('volunteers'); // 'volunteers' is default landing screen
  const [userRole] = useState('admin'); // Always full Admin access
  const [toast, setToast] = useState(null);
  const [selectedProfileVol, setSelectedProfileVol] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // External Shareable Form Mode detection
  const [isExternalView, setIsExternalView] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('external') === 'true' || urlParams.get('form') === 'external';
    }
    return false;
  });

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');

  // Initial Data Load
  useEffect(() => {
    const loadedVolunteers = getStoredVolunteers();
    const loadedPrograms = getStoredPrograms();
    const loadedShifts = getStoredShifts();
    
    setVolunteers(loadedVolunteers);
    setPrograms(loadedPrograms);
    setShifts(loadedShifts);
  }, []);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
  };

  // Helper to persist volunteer state & localStorage
  const updateVolunteersState = (newVolunteers) => {
    setVolunteers(newVolunteers);
    saveStoredVolunteers(newVolunteers);
  };

  // Helper to persist programs & localStorage
  const handleSavePrograms = (newPrograms) => {
    setPrograms(newPrograms);
    saveStoredPrograms(newPrograms);
  };

  // Helper to persist shifts & localStorage
  const handleSaveShifts = (newShifts) => {
    setShifts(newShifts);
    saveStoredShifts(newShifts);
  };

  // Reset Demo Data
  const handleResetData = () => {
    const freshData = resetStoredVolunteers();
    const freshPrograms = getStoredPrograms();
    const freshShifts = getStoredShifts();
    
    setVolunteers(freshData);
    setPrograms(freshPrograms);
    setShifts(freshShifts);
    showToast('Demo Data Reset', 'Loaded initial seed volunteers, program preferences, and shift availability.', 'info');
  };

  // Stage Update Handler
  const handleUpdateStage = (volunteerId, newStage) => {
    const updated = volunteers.map(v => {
      if (v.id === volunteerId) {
        return {
          ...v,
          stage: newStage,
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });
    updateVolunteersState(updated);
    showToast('Stage Updated', `Moved volunteer to "${newStage}" stage.`, 'success');
  };

  // 1-Click Shift Assignment Handler (From Side Panel or Shifts Module)
  const handleAssignVolunteer = (volunteerId, programId, shift, date) => {
    const targetVol = volunteers.find(v => v.id === volunteerId);
    if (!targetVol) return;

    const existingAssignments = targetVol.programAssignments || [];
    const newAssignment = {
      id: `asgn-${Date.now()}`,
      programId,
      shift,
      assignedDate: date
    };

    const updatedVolunteers = volunteers.map(v => {
      if (v.id === volunteerId) {
        const nextStage = v.stage === 'Active' ? 'Assigned' : v.stage;
        return {
          ...v,
          stage: nextStage,
          programAssignments: [...existingAssignments, newAssignment],
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });

    updateVolunteersState(updatedVolunteers);
    showToast('Volunteer Assigned', `Assigned ${targetVol.firstName} ${targetVol.lastName} to shift on ${date}.`, 'success');
  };

  // Unassign Volunteer Shift
  const handleUnassignVolunteer = (volunteerId, programId, shift, date) => {
    const targetVol = volunteers.find(v => v.id === volunteerId);
    if (!targetVol) return;

    const updatedVolunteers = volunteers.map(v => {
      if (v.id === volunteerId) {
        const filteredAssignments = (v.programAssignments || []).filter(a => 
          !(a.programId === programId && a.assignedDate === date && (a.shift === shift || !a.shift))
        );
        return {
          ...v,
          programAssignments: filteredAssignments,
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });

    updateVolunteersState(updatedVolunteers);
    showToast('Assignment Removed', `Removed ${targetVol.firstName} ${targetVol.lastName} from shift on ${date}.`, 'info');
  };

  // Save Volunteer Profile
  const handleSaveVolunteer = (updatedVol) => {
    const updatedVolunteers = volunteers.map(v => v.id === updatedVol.id ? updatedVol : v);
    updateVolunteersState(updatedVolunteers);
    setSelectedProfileVol(null);
    showToast('Profile Saved', `Updated records for ${updatedVol.firstName} ${updatedVol.lastName}.`, 'success');
  };

  // New Volunteer Intake Submission (With Smart Deduplication)
  const handleSubmitIntake = (intakeData) => {
    const existingIndex = volunteers.findIndex(v => v.email.toLowerCase().trim() === intakeData.email.toLowerCase().trim());

    if (existingIndex >= 0) {
      // Returning Volunteer Update
      const existing = volunteers[existingIndex];
      const updatedReturning = {
        ...existing,
        firstName: intakeData.firstName || existing.firstName,
        lastName: intakeData.lastName || existing.lastName,
        phone: intakeData.phone || existing.phone,
        school: intakeData.school || existing.school,
        dateOfBirth: intakeData.dateOfBirth || existing.dateOfBirth,
        isMinor: checkIsMinor(intakeData.dateOfBirth || existing.dateOfBirth),
        guardianName: intakeData.guardianName || existing.guardianName,
        guardianContact: intakeData.guardianContact || existing.guardianContact,
        guardianConsentGiven: intakeData.guardianConsentGiven ?? existing.guardianConsentGiven,
        emergencyContactName: intakeData.emergencyContactName || existing.emergencyContactName,
        emergencyContactPhone: intakeData.emergencyContactPhone || existing.emergencyContactPhone,
        emergencyContactRelationship: intakeData.emergencyContactRelationship || existing.emergencyContactRelationship,
        medicalNotes: intakeData.medicalNotes ? `${existing.medicalNotes || ''} [Updated: ${intakeData.medicalNotes}]` : existing.medicalNotes,
        programPreferences: Array.from(new Set([...(existing.programPreferences || []), ...(intakeData.programPreferences || [])])),
        shiftAvailability: Array.from(new Set([...(existing.shiftAvailability || []), ...(intakeData.shiftAvailability || [])])),
        isReturning: true,
        updatedAt: new Date().toISOString()
      };

      const updatedVolunteers = [...volunteers];
      updatedVolunteers[existingIndex] = updatedReturning;
      updateVolunteersState(updatedVolunteers);
      showToast('Returning Volunteer Updated', `Matched email ${intakeData.email}. Preferences and profile updated for ${updatedReturning.firstName}!`, 'success');

    } else {
      // Brand New Volunteer Record
      const newId = `vol-${Date.now()}`;
      const isMinor = checkIsMinor(intakeData.dateOfBirth);

      const newRecord = {
        id: newId,
        firstName: intakeData.firstName,
        lastName: intakeData.lastName,
        email: intakeData.email,
        phone: intakeData.phone,
        school: intakeData.school,
        dateOfBirth: intakeData.dateOfBirth,
        isMinor,
        guardianName: isMinor ? intakeData.guardianName : '',
        guardianContact: isMinor ? intakeData.guardianContact : '',
        guardianConsentGiven: isMinor ? intakeData.guardianConsentGiven : false,
        emergencyContactName: intakeData.emergencyContactName,
        emergencyContactPhone: intakeData.emergencyContactPhone,
        emergencyContactRelationship: intakeData.emergencyContactRelationship,
        medicalNotes: intakeData.medicalNotes || 'None',
        stage: 'Applied',
        backgroundCheck: {
          status: 'pending',
          clearedDate: null,
          expiryDate: null
        },
        onboardingChecklist: {
          agreementSigned: false,
          emergencyContactOnFile: true,
          consentFormSigned: isMinor ? intakeData.guardianConsentGiven : true
        },
        trainingCompleted: false,
        trainingDate: null,
        shadowingSessions: [],
        shiftAvailability: intakeData.shiftAvailability || [],
        programPreferences: intakeData.programPreferences || [],
        programAssignments: [],
        dataRetentionDate: '2028-09-01',
        isReturning: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedVolunteers = [newRecord, ...volunteers];
      updateVolunteersState(updatedVolunteers);
      showToast('Application Submitted', `Welcome ${newRecord.firstName}! Added to pipeline in "Applied" stage.`, 'success');
    }

    if (!isExternalView) {
      setActiveTab('volunteers'); // Switch to Volunteers module in CRM mode
    }
  };

  // Render Public Standalone External Application Portal Mode
  if (isExternalView) {
    return (
      <div className="min-h-screen bg-[#f8fafb] text-slate-900 font-sans p-4 sm:p-8 flex flex-col items-center justify-start antialiased">
        
        {/* Top Header Bar for External Application Form */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#155e4b] text-white flex items-center justify-center font-black text-lg shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight">Kids Innovative</h1>
              <p className="text-xs text-[#155e4b] font-bold">Public Volunteer Application Portal</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg font-mono">
            PUBLIC APPLICATION FORM
          </span>
        </div>

        {/* Standalone Volunteer Application Form Only */}
        <div className="w-full max-w-4xl">
          <IntakeForm
            volunteers={volunteers}
            programs={programs}
            shifts={shifts}
            onSubmitIntake={handleSubmitIntake}
            isExternalView={true}
            showToast={showToast}
          />
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Kids Innovative STEAM Education Non-Profit • Public Volunteer Application Portal</p>
        </footer>

        {/* Notification Toast */}
        <NotificationToast
          toast={toast}
          onClose={() => setToast(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] text-slate-900 flex font-sans antialiased">
      
      {/* Left Vertical Navigation Sidebar matching Amanah CRM */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        volunteerCount={volunteers.length}
      />

      {/* Main Right Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar matching Amanah CRM search & action bar */}
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onResetData={handleResetData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          
          {/* Volunteers Module (Contains Kanban View & List Directory View) */}
          {(activeTab === 'volunteers' || activeTab === 'board' || activeTab === 'list') && (
            <VolunteersModule
              volunteers={volunteers}
              onUpdateStage={handleUpdateStage}
              onOpenProfile={(vol) => setSelectedProfileVol(vol)}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Shift Roster Calendar View */}
          {activeTab === 'calendar' && (
            <CalendarView
              volunteers={volunteers}
              programs={programs}
              shifts={shifts}
              onAssignVolunteer={handleAssignVolunteer}
              onUnassignVolunteer={handleUnassignVolunteer}
              onOpenProfile={(vol) => setSelectedProfileVol(vol)}
            />
          )}

          {/* Single Combined Programs & Shifts Setup Module */}
          {(activeTab === 'program_shifts' || activeTab === 'programs' || activeTab === 'shifts') && (
            <ProgramsShiftsCombinedModule
              programs={programs}
              shifts={shifts}
              volunteers={volunteers}
              onSavePrograms={handleSavePrograms}
              onSaveShifts={handleSaveShifts}
              onAssignVolunteer={handleAssignVolunteer}
              onUnassignVolunteer={handleUnassignVolunteer}
              onOpenProfile={(vol) => setSelectedProfileVol(vol)}
              showToast={showToast}
            />
          )}

          {/* Volunteer Intake Form */}
          {activeTab === 'intake' && (
            <IntakeForm
              volunteers={volunteers}
              programs={programs}
              shifts={shifts}
              onSubmitIntake={handleSubmitIntake}
              isExternalView={false}
              onToggleExternalView={(val) => setIsExternalView(val)}
              showToast={showToast}
            />
          )}

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 font-medium">
          <p>Kids Innovative STEAM Education Non-Profit • Volunteer Pipeline Tracker Demo Prototype</p>
        </footer>

      </div>

      {/* Volunteer Profile Detail Modal */}
      {selectedProfileVol && (
        <VolunteerProfileModal
          volunteer={selectedProfileVol}
          userRole={userRole}
          programs={programs}
          shifts={shifts}
          onClose={() => setSelectedProfileVol(null)}
          onSaveVolunteer={handleSaveVolunteer}
        />
      )}

      {/* Admin Program & Shift Configuration Modal */}
      {isConfigModalOpen && (
        <ProgramShiftConfigModal
          programs={programs}
          shifts={shifts}
          onSavePrograms={handleSavePrograms}
          onSaveShifts={handleSaveShifts}
          onClose={() => setIsConfigModalOpen(false)}
          showToast={showToast}
        />
      )}

      {/* Toast Notification Alert */}
      <NotificationToast
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}
