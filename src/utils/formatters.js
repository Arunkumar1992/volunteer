/**
  * Calculate age dynamically from Date of Birth.
  * Uses 2026-09-01 as the current operational season date baseline.
  */
export function calculateAge(dobString) {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const refDate = new Date('2026-09-01'); // Current reference season date
  let age = refDate.getFullYear() - dob.getFullYear();
  const monthDiff = refDate.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function checkIsMinor(dobString) {
  return calculateAge(dobString) < 18;
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getBackgroundCheckStatusInfo(bgCheck) {
  if (!bgCheck || !bgCheck.status) {
    return { label: 'Pending', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300', isExpired: false, isExpiringSoon: false };
  }

  if (bgCheck.status === 'pending') {
    return { label: 'Pending', badgeClass: 'bg-amber-50 text-amber-800 border-amber-300', isExpired: false, isExpiringSoon: false };
  }

  if (bgCheck.status === 'failed') {
    return { label: 'Failed', badgeClass: 'bg-rose-50 text-rose-800 border-rose-300', isExpired: false, isExpiringSoon: false };
  }

  if (bgCheck.status === 'cleared') {
    if (!bgCheck.expiryDate) {
      return { label: 'Cleared', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300', isExpired: false, isExpiringSoon: false };
    }

    const expiry = new Date(bgCheck.expiryDate);
    const refDate = new Date('2026-09-01');
    const diffDays = Math.ceil((expiry - refDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { label: `EXPIRED (${Math.abs(diffDays)}d ago)`, badgeClass: 'bg-red-100 text-red-800 border-red-400 font-semibold animate-pulse', isExpired: true, isExpiringSoon: false };
    } else if (diffDays <= 30) {
      return { label: `Expiring Soon (${diffDays}d)`, badgeClass: 'bg-amber-100 text-amber-900 border-amber-400 font-semibold', isExpired: false, isExpiringSoon: true };
    } else {
      return { label: 'Cleared', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300', isExpired: false, isExpiringSoon: false };
    }
  }

  return { label: 'Unknown', badgeClass: 'bg-slate-100 text-slate-700 border-slate-300', isExpired: false, isExpiringSoon: false };
}

export function getStageBadgeClass(stage) {
  switch (stage) {
    case 'Applied': return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'Screening': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'Background Check': return 'bg-amber-50 text-amber-900 border-amber-200';
    case 'Onboarding': return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    case 'Training': return 'bg-teal-50 text-teal-800 border-teal-200';
    case 'Shadowing': return 'bg-violet-50 text-violet-800 border-violet-200';
    case 'Active': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Assigned': return 'bg-pink-50 text-pink-800 border-pink-200';
    case 'Inactive': return 'bg-slate-100 text-slate-700 border-slate-300';
    default: return 'bg-slate-100 text-slate-700 border-slate-300';
  }
}
