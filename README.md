# Kids Innovative — Volunteer Pipeline Tracker

A modern, high-contrast React & Tailwind CSS web application demo designed for **Kids Innovative**, a STEAM-education non-profit running after-school programs and summer camps for kids ages 5–14.

The app tracks volunteers (mostly high-school students) through a multi-stage pipeline from initial application intake to active shift assignment and background check clearance.

---

## ✨ Modules & Features

1. **Kanban Pipeline Board (`Pipeline`)**:
   - 9 pipeline stages: *Applied*, *Screening*, *Background Check*, *Onboarding*, *Training*, *Shadowing*, *Active*, *Assigned*, *Inactive*.
   - Drag-and-drop / 1-click stage progression with Bigin CRM typography and micro-cards.

2. **Dynamic Program Calendar & Shift Assigner (`Calendar`)**:
   - Dynamic month & year navigation for any camp season.
   - Flags unstaffed camp dates and matches eligible, non-double-booked active volunteers.

3. **Dedicated STEAM Programs Catalog (`Programs`)**:
   - Dedicated catalog view to add, edit, disable, or delete STEAM programs & camps.
   - Expandable inline roster showing assigned volunteers and interested applicants per program.

4. **Dedicated Volunteer Shifts & Attendance (`Shifts`)**:
   - Company-wide global shift category configurations.
   - Shift roster dashboard with unstaffed alerts and 1-click quick-assign modals.

5. **Volunteer Directory (`Directory`)**:
   - Searchable table roster with school badges, minor status (<18), and background clearance indicators.

6. **Background Check & Compliance Tracker (`BG Checks`)**:
   - Monitors pending, cleared, and expiring background check records.

7. **Analytics Dashboard (`Dashboard`)**:
   - Key statistics, retention dates, minor breakdown, and unstaffed shift alerts.

8. **Public Application Intake Form (`Apply Form`)**:
   - Smart deduplication by email for returning volunteers vs new applicants.
   - Dynamic parent/guardian consent section for minor applicants (<18).

---

## 🚀 Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run local dev server:
   ```bash
   npm run dev
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🔒 Data & Persistence
- Demo prototype using `localStorage` (`kids_innovative_volunteer_data_v1`).
- Includes Instructor Mode vs Admin Mode privacy toggle to restrict sensitive medical fields.
- Reset Demo Data button reloads seed records at any time.
