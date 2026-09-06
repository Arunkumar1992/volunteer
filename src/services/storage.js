import { checkIsMinor } from '../utils/formatters';

const STORAGE_KEY = 'kids_innovative_volunteer_data_v1';
const PROGRAMS_KEY = 'kids_innovative_programs_v1';
const SHIFTS_KEY = 'kids_innovative_shifts_v1';

export const INITIAL_PROGRAMS = [
  {
    id: "prog-1",
    title: "Microbit — James Park Elementary",
    dates: "July 6–10",
    startDate: "2026-07-06",
    endDate: "2026-07-10",
    location: "James Park Elementary",
    topic: "Microbit",
    color: "bg-teal-50 border-teal-200 text-teal-900 hover:bg-teal-100",
    enabled: true
  },
  {
    id: "prog-2",
    title: "Arts & Crafts — James Park Elementary",
    dates: "July 13–17",
    startDate: "2026-07-13",
    endDate: "2026-07-17",
    location: "James Park Elementary",
    topic: "Arts & Crafts",
    color: "bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100",
    enabled: true
  },
  {
    id: "prog-3",
    title: "Coding/STEM — James Park Elementary",
    dates: "July 13–17",
    startDate: "2026-07-13",
    endDate: "2026-07-17",
    location: "James Park Elementary",
    topic: "Coding/STEM",
    color: "bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100",
    enabled: true
  },
  {
    id: "prog-4",
    title: "STEM — Minnekhada Middle School",
    dates: "July 13–17",
    startDate: "2026-07-13",
    endDate: "2026-07-17",
    location: "Minnekhada Middle School",
    topic: "STEM",
    color: "bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100",
    enabled: true
  },
  {
    id: "prog-5",
    title: "STEM — James Park Elementary",
    dates: "July 20–24",
    startDate: "2026-07-20",
    endDate: "2026-07-24",
    location: "James Park Elementary",
    topic: "STEM",
    color: "bg-cyan-50 border-cyan-200 text-cyan-900 hover:bg-cyan-100",
    enabled: true
  },
  {
    id: "prog-6",
    title: "Coding — James Park Elementary",
    dates: "July 27–31",
    startDate: "2026-07-27",
    endDate: "2026-07-31",
    location: "James Park Elementary",
    topic: "Coding",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100",
    enabled: true
  },
  {
    id: "prog-7",
    title: "Outdoor Camp — Lions Park, Port Coquitlam",
    dates: "July 27–31",
    startDate: "2026-07-27",
    endDate: "2026-07-31",
    location: "Lions Park, Port Coquitlam",
    topic: "Outdoor Camp",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100",
    enabled: true
  },
  {
    id: "prog-8",
    title: "Macrame — James Park Elementary",
    dates: "Aug 4–7",
    startDate: "2026-08-04",
    endDate: "2026-08-07",
    location: "James Park Elementary",
    topic: "Macrame",
    color: "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100",
    enabled: true
  },
  {
    id: "prog-9",
    title: "Sewing — James Park Elementary",
    dates: "Aug 10–15",
    startDate: "2026-08-10",
    endDate: "2026-08-15",
    location: "James Park Elementary",
    topic: "Sewing",
    color: "bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100",
    enabled: true
  },
  {
    id: "prog-10",
    title: "Outdoor Camp — Lions Park, Port Coquitlam",
    dates: "Aug 17–21",
    startDate: "2026-08-17",
    endDate: "2026-08-21",
    location: "Lions Park, Port Coquitlam",
    topic: "Outdoor Camp",
    color: "bg-lime-50 border-lime-200 text-lime-900 hover:bg-lime-100",
    enabled: true
  }
];

export const INITIAL_SHIFTS = [
  { id: "shift-1", name: "Full camp day (9am–3pm)", enabled: true },
  { id: "shift-2", name: "Pick up/drop off (8:00–10:00am & 2:30–4:00pm)", enabled: true },
  { id: "shift-3", name: "Lunch/break coverage (11:00am–1:30pm)", enabled: true },
  { id: "shift-4", name: "Half day morning (8:45am–12:30pm)", enabled: true },
  { id: "shift-5", name: "Half day afternoon (12:30–3:45pm)", enabled: true }
];

export const INITIAL_VOLUNTEERS = [
  {
    id: "vol-1",
    firstName: "Maya",
    lastName: "Lin",
    email: "maya.lin@example.com",
    phone: "(604) 555-0142",
    school: "Riverside Secondary",
    dateOfBirth: "2009-04-12",
    isMinor: true,
    guardianName: "David Lin",
    guardianContact: "(604) 555-0199 (Father)",
    guardianConsentGiven: true,
    emergencyContactName: "David Lin",
    emergencyContactPhone: "(604) 555-0199",
    emergencyContactRelationship: "Father",
    medicalNotes: "Asthma — carries rescue inhaler (Ventolin) in personal bag.",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-05-10",
      expiryDate: "2027-05-10"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-06-01",
    shadowingSessions: [
      { id: "shad-1", date: "2026-06-15", program: "Microbit intro workshop", supervisorApproved: true }
    ],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Half day morning (8:45am–12:30pm)"
    ],
    programPreferences: ["prog-1", "prog-3", "prog-6"],
    programAssignments: [
      { id: "asgn-1", programId: "prog-1", shift: "Full camp day (9am–3pm)", assignedDate: "2026-07-06" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2026-07-01T14:30:00Z"
  },
  {
    id: "vol-2",
    firstName: "Ethan",
    lastName: "Vance",
    email: "ethan.vance@example.com",
    phone: "(604) 555-0218",
    school: "Terry Fox Secondary",
    dateOfBirth: "2008-11-22",
    isMinor: true,
    guardianName: "Sarah Vance",
    guardianContact: "(604) 555-0200 (Mother)",
    guardianConsentGiven: true,
    emergencyContactName: "Sarah Vance",
    emergencyContactPhone: "(604) 555-0200",
    emergencyContactRelationship: "Mother",
    medicalNotes: "No known allergies or medical conditions.",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-04-15",
      expiryDate: "2027-04-15"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-05-20",
    shadowingSessions: [
      { id: "shad-2", date: "2026-06-10", program: "Crafts studio prep", supervisorApproved: true }
    ],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Lunch/break coverage (11:00am–1:30pm)"
    ],
    programPreferences: ["prog-2", "prog-8", "prog-9"],
    programAssignments: [
      { id: "asgn-2", programId: "prog-8", shift: "Full camp day (9am–3pm)", assignedDate: "2026-08-04" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-03-10T11:00:00Z",
    updatedAt: "2026-06-10T09:15:00Z"
  },
  {
    id: "vol-3",
    firstName: "Chloe",
    lastName: "Zhang",
    email: "chloe.zhang@sfu.ca",
    phone: "(778) 555-0931",
    school: "Simon Fraser University",
    dateOfBirth: "2007-06-18",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Ken Zhang",
    emergencyContactPhone: "(778) 555-0900",
    emergencyContactRelationship: "Brother",
    medicalNotes: "Severe peanut allergy — EpiPen carried.",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-06-20",
      expiryDate: "2027-06-20"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-06-25",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Pick up/drop off (8:00–10:00am & 2:30–4:00pm)"
    ],
    programPreferences: ["prog-4", "prog-5", "prog-7"],
    programAssignments: [
      { id: "asgn-3", programId: "prog-7", shift: "Full camp day (9am–3pm)", assignedDate: "2026-07-27" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-06-01T08:30:00Z",
    updatedAt: "2026-06-25T16:45:00Z"
  },
  {
    id: "vol-4",
    firstName: "Alex",
    lastName: "Chen",
    email: "alex.chen@example.com",
    phone: "(604) 555-0377",
    school: "Pinetree Secondary",
    dateOfBirth: "2009-08-30",
    isMinor: true,
    guardianName: "Wei Chen",
    guardianContact: "(604) 555-0300 (Father)",
    guardianConsentGiven: true,
    emergencyContactName: "Wei Chen",
    emergencyContactPhone: "(604) 555-0300",
    emergencyContactRelationship: "Father",
    medicalNotes: "None",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-05-01",
      expiryDate: "2027-05-01"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-05-28",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Half day afternoon (12:30–3:45pm)"
    ],
    programPreferences: ["prog-1", "prog-3", "prog-6"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-04-02T13:20:00Z",
    updatedAt: "2026-05-28T11:00:00Z"
  },
  {
    id: "vol-5",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.j@example.com",
    phone: "(604) 555-0812",
    school: "Heritage Woods Secondary",
    dateOfBirth: "2010-02-14",
    isMinor: true,
    guardianName: "Mark Jenkins",
    guardianContact: "(604) 555-0800 (Father)",
    guardianConsentGiven: true,
    emergencyContactName: "Laura Jenkins",
    emergencyContactPhone: "(604) 555-0801",
    emergencyContactRelationship: "Mother",
    medicalNotes: "Lactose intolerant.",
    stage: "Background Check",
    backgroundCheck: {
      status: "pending",
      clearedDate: null,
      expiryDate: null
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: false,
    trainingDate: null,
    shadowingSessions: [],
    shiftAvailability: [
      "Half day morning (8:45am–12:30pm)"
    ],
    programPreferences: ["prog-2", "prog-8"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-06-10T14:10:00Z",
    updatedAt: "2026-06-12T09:00:00Z"
  },
  {
    id: "vol-6",
    firstName: "Liam",
    lastName: "O'Connor",
    email: "liam.oc@ubc.ca",
    phone: "(604) 555-0455",
    school: "University of British Columbia",
    dateOfBirth: "2006-03-05",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Patrick O'Connor",
    emergencyContactPhone: "(604) 555-0400",
    emergencyContactRelationship: "Father",
    medicalNotes: "Needs access to water/shade during outdoor sessions due to sun sensitivity.",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2025-09-15",
      expiryDate: "2026-09-15"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2025-09-20",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Lunch/break coverage (11:00am–1:30pm)"
    ],
    programPreferences: ["prog-7", "prog-10"],
    programAssignments: [
      { id: "asgn-6", programId: "prog-10", shift: "Full camp day (9am–3pm)", assignedDate: "2026-08-17" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-09-01T09:00:00Z",
    updatedAt: "2026-07-02T15:10:00Z"
  },
  {
    id: "vol-7",
    firstName: "Noah",
    lastName: "Patel",
    email: "noah.patel@example.com",
    phone: "(604) 555-0988",
    school: "Centennial Secondary",
    dateOfBirth: "2009-12-01",
    isMinor: true,
    guardianName: "Priya Patel",
    guardianContact: "(604) 555-0900 (Mother)",
    guardianConsentGiven: true,
    emergencyContactName: "Priya Patel",
    emergencyContactPhone: "(604) 555-0900",
    emergencyContactRelationship: "Mother",
    medicalNotes: "None",
    stage: "Training",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-03-10",
      expiryDate: "2027-03-10"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: false,
    trainingDate: null,
    shadowingSessions: [],
    shiftAvailability: [
      "Lunch/break coverage (11:00am–1:30pm)",
      "Half day morning (8:45am–12:30pm)"
    ],
    programPreferences: ["prog-3", "prog-5"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-02-15T11:45:00Z",
    updatedAt: "2026-03-10T16:20:00Z"
  },
  {
    id: "vol-8",
    firstName: "Emma",
    lastName: "Watson",
    email: "emma.watson@douglas.ca",
    phone: "(778) 555-0611",
    school: "Douglas College",
    dateOfBirth: "2008-01-25",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Carol Watson",
    emergencyContactPhone: "(778) 555-0600",
    emergencyContactRelationship: "Mother",
    medicalNotes: "Type 1 Diabetes — monitors blood glucose.",
    stage: "Shadowing",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2025-08-10",
      expiryDate: "2026-08-10"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-05-15",
    shadowingSessions: [
      { id: "shad-8", date: "2026-06-02", program: "Arts studio co-facilitation", supervisorApproved: true }
    ],
    shiftAvailability: [
      "Half day afternoon (12:30–3:45pm)"
    ],
    programPreferences: ["prog-8", "prog-9"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2026-06-02T17:00:00Z"
  },
  {
    id: "vol-9",
    firstName: "Lucas",
    lastName: "Rivera",
    email: "lucas.r@example.com",
    phone: "(604) 555-0722",
    school: "Port Moody Secondary",
    dateOfBirth: "2010-05-19",
    isMinor: true,
    guardianName: "Carlos Rivera",
    guardianContact: "(604) 555-0700 (Father)",
    guardianConsentGiven: true,
    emergencyContactName: "Carlos Rivera",
    emergencyContactPhone: "(604) 555-0700",
    emergencyContactRelationship: "Father",
    medicalNotes: "None",
    stage: "Screening",
    backgroundCheck: {
      status: "pending",
      clearedDate: null,
      expiryDate: null
    },
    onboardingChecklist: {
      agreementSigned: false,
      emergencyContactOnFile: true,
      consentFormSigned: false
    },
    trainingCompleted: false,
    trainingDate: null,
    shadowingSessions: [],
    shiftAvailability: [
      "Pick up/drop off (8:00–10:00am & 2:30–4:00pm)"
    ],
    programPreferences: ["prog-1", "prog-4"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-06-20T09:30:00Z",
    updatedAt: "2026-06-21T10:00:00Z"
  },
  {
    id: "vol-10",
    firstName: "Sophia",
    lastName: "Kim",
    email: "sophia.kim@example.com",
    phone: "(604) 555-0166",
    school: "Gleneagle Secondary",
    dateOfBirth: "2009-10-10",
    isMinor: true,
    guardianName: "Min-Jun Kim",
    guardianContact: "(604) 555-0100 (Father)",
    guardianConsentGiven: true,
    emergencyContactName: "Min-Jun Kim",
    emergencyContactPhone: "(604) 555-0100",
    emergencyContactRelationship: "Father",
    medicalNotes: "None",
    stage: "Onboarding",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-02-15",
      expiryDate: "2027-02-15"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: false
    },
    trainingCompleted: false,
    trainingDate: null,
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)"
    ],
    programPreferences: ["prog-2", "prog-9"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-01-20T14:00:00Z",
    updatedAt: "2026-02-15T11:10:00Z"
  },
  {
    id: "vol-11",
    firstName: "Daniel",
    lastName: "Park",
    email: "daniel.park@bcit.ca",
    phone: "(778) 555-0844",
    school: "BCIT",
    dateOfBirth: "2007-01-08",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Hyeon Park",
    emergencyContactPhone: "(778) 555-0800",
    emergencyContactRelationship: "Father",
    medicalNotes: "None",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-06-01",
      expiryDate: "2027-06-01"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-06-05",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Half day morning (8:45am–12:30pm)"
    ],
    programPreferences: ["prog-1", "prog-3", "prog-6"],
    programAssignments: [
      { id: "asgn-11", programId: "prog-3", shift: "Full camp day (9am–3pm)", assignedDate: "2026-07-13" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-05-15T12:00:00Z",
    updatedAt: "2026-07-02T10:00:00Z"
  },
  {
    id: "vol-12",
    firstName: "Olivia",
    lastName: "Bennett",
    email: "olivia.b@example.com",
    phone: "(604) 555-0499",
    school: "Minnekhada Middle School",
    dateOfBirth: "2011-03-30",
    isMinor: true,
    guardianName: "Rachel Bennett",
    guardianContact: "(604) 555-0400 (Mother)",
    guardianConsentGiven: true,
    emergencyContactName: "Rachel Bennett",
    emergencyContactPhone: "(604) 555-0400",
    emergencyContactRelationship: "Mother",
    medicalNotes: "Bee sting allergy.",
    stage: "Applied",
    backgroundCheck: {
      status: "pending",
      clearedDate: null,
      expiryDate: null
    },
    onboardingChecklist: {
      agreementSigned: false,
      emergencyContactOnFile: false,
      consentFormSigned: false
    },
    trainingCompleted: false,
    trainingDate: null,
    shadowingSessions: [],
    shiftAvailability: [
      "Half day morning (8:45am–12:30pm)"
    ],
    programPreferences: ["prog-2", "prog-8"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-06-28T16:30:00Z",
    updatedAt: "2026-06-28T16:30:00Z"
  },
  {
    id: "vol-13",
    firstName: "James",
    lastName: "Wilson",
    email: "james.w@example.com",
    phone: "(604) 555-0322",
    school: "Terry Fox Secondary",
    dateOfBirth: "2008-09-14",
    isMinor: true,
    guardianName: "Robert Wilson",
    guardianContact: "(604) 555-0300 (Father)",
    guardianConsentGiven: true,
    emergencyContactName: "Robert Wilson",
    emergencyContactPhone: "(604) 555-0300",
    emergencyContactRelationship: "Father",
    medicalNotes: "None",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-04-20",
      expiryDate: "2027-04-20"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-05-10",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Pick up/drop off (8:00–10:00am & 2:30–4:00pm)"
    ],
    programPreferences: ["prog-5", "prog-7", "prog-10"],
    programAssignments: [
      { id: "asgn-13", programId: "prog-5", shift: "Full camp day (9am–3pm)", assignedDate: "2026-07-20" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-03-20T10:15:00Z",
    updatedAt: "2026-07-01T11:00:00Z"
  },
  {
    id: "vol-14",
    firstName: "Isabella",
    lastName: "Rossi",
    email: "bella.rossi@sfu.ca",
    phone: "(778) 555-0299",
    school: "Simon Fraser University",
    dateOfBirth: "2006-11-04",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Marco Rossi",
    emergencyContactPhone: "(778) 555-0200",
    emergencyContactRelationship: "Father",
    medicalNotes: "None",
    stage: "Assigned",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-01-30",
      expiryDate: "2027-01-30"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-02-15",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)"
    ],
    programPreferences: ["prog-4", "prog-5"],
    programAssignments: [
      { id: "asgn-14", programId: "prog-4", shift: "Full camp day (9am–3pm)", assignedDate: "2026-07-14" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-04-10T09:00:00Z",
    updatedAt: "2026-07-02T14:00:00Z"
  },
  {
    id: "vol-15",
    firstName: "Caleb",
    lastName: "Foster",
    email: "caleb.f@example.com",
    phone: "(604) 555-0744",
    school: "Riverside Secondary",
    dateOfBirth: "2009-07-22",
    isMinor: true,
    guardianName: "Diane Foster",
    guardianContact: "(604) 555-0700 (Mother)",
    guardianConsentGiven: true,
    emergencyContactName: "Diane Foster",
    emergencyContactPhone: "(604) 555-0700",
    emergencyContactRelationship: "Mother",
    medicalNotes: "Wears glasses; needs front seating during instructional demos.",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2025-09-20",
      expiryDate: "2026-09-20"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2025-10-01",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Half day afternoon (12:30–3:45pm)"
    ],
    programPreferences: ["prog-8", "prog-9", "prog-10"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-09-01T15:00:00Z",
    updatedAt: "2026-06-15T12:00:00Z"
  },
  {
    id: "vol-16",
    firstName: "Grace",
    lastName: "Taylor",
    email: "grace.t@example.com",
    phone: "(604) 555-0188",
    school: "Coquitlam College",
    dateOfBirth: "2008-04-03",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Evelyn Taylor",
    emergencyContactPhone: "(604) 555-0100",
    emergencyContactRelationship: "Mother",
    medicalNotes: "None",
    stage: "Inactive",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2025-05-01",
      expiryDate: "2026-05-01"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2025-05-15",
    shadowingSessions: [],
    shiftAvailability: [
      "Half day morning (8:45am–12:30pm)"
    ],
    programPreferences: ["prog-2"],
    programAssignments: [],
    dataRetentionDate: "2027-09-01",
    isReturning: false,
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2026-01-10T11:00:00Z"
  },
  {
    id: "vol-17",
    firstName: "Samuel",
    lastName: "Jackson",
    email: "sam.j@example.com",
    phone: "(604) 555-0633",
    school: "Kwayhquitlum Middle School",
    dateOfBirth: "2010-09-09",
    isMinor: true,
    guardianName: "Tanya Jackson",
    guardianContact: "(604) 555-0600 (Mother)",
    guardianConsentGiven: true,
    emergencyContactName: "Tanya Jackson",
    emergencyContactPhone: "(604) 555-0600",
    emergencyContactRelationship: "Mother",
    medicalNotes: "None",
    stage: "Applied",
    backgroundCheck: {
      status: "pending",
      clearedDate: null,
      expiryDate: null
    },
    onboardingChecklist: {
      agreementSigned: false,
      emergencyContactOnFile: true,
      consentFormSigned: false
    },
    trainingCompleted: false,
    trainingDate: null,
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)"
    ],
    programPreferences: ["prog-1", "prog-6"],
    programAssignments: [],
    dataRetentionDate: "2028-09-01",
    isReturning: false,
    createdAt: "2026-07-01T18:00:00Z",
    updatedAt: "2026-07-01T18:00:00Z"
  },
  {
    id: "vol-18",
    firstName: "Ava",
    lastName: "Martinez",
    email: "ava.martinez@douglas.ca",
    phone: "(778) 555-0911",
    school: "Douglas College",
    dateOfBirth: "2007-12-15",
    isMinor: false,
    guardianName: "",
    guardianContact: "",
    guardianConsentGiven: false,
    emergencyContactName: "Jose Martinez",
    emergencyContactPhone: "(778) 555-0900",
    emergencyContactRelationship: "Father",
    medicalNotes: "Mild asthma — has inhaler.",
    stage: "Active",
    backgroundCheck: {
      status: "cleared",
      clearedDate: "2026-05-15",
      expiryDate: "2027-05-15"
    },
    onboardingChecklist: {
      agreementSigned: true,
      emergencyContactOnFile: true,
      consentFormSigned: true
    },
    trainingCompleted: true,
    trainingDate: "2026-06-01",
    shadowingSessions: [],
    shiftAvailability: [
      "Full camp day (9am–3pm)",
      "Lunch/break coverage (11:00am–1:30pm)"
    ],
    programPreferences: ["prog-3", "prog-6", "prog-7"],
    programAssignments: [
      { id: "asgn-18", programId: "prog-6", shift: "Full camp day (9am–3pm)", assignedDate: "2026-07-27" }
    ],
    dataRetentionDate: "2028-09-01",
    isReturning: true,
    createdAt: "2025-05-10T11:00:00Z",
    updatedAt: "2026-07-02T09:30:00Z"
  }
];

export function getStoredVolunteers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VOLUNTEERS));
      return INITIAL_VOLUNTEERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VOLUNTEERS));
      return INITIAL_VOLUNTEERS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading localStorage volunteer data:', e);
    return INITIAL_VOLUNTEERS;
  }
}

export function saveStoredVolunteers(volunteers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteers));
  } catch (e) {
    console.error('Error saving volunteer data:', e);
  }
}

export function getStoredPrograms() {
  try {
    const raw = localStorage.getItem(PROGRAMS_KEY);
    if (!raw) {
      localStorage.setItem(PROGRAMS_KEY, JSON.stringify(INITIAL_PROGRAMS));
      return INITIAL_PROGRAMS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_PROGRAMS;
  } catch (e) {
    console.error('Error reading stored programs:', e);
    return INITIAL_PROGRAMS;
  }
}

export function saveStoredPrograms(programs) {
  try {
    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
  } catch (e) {
    console.error('Error saving programs:', e);
  }
}

export function getStoredShifts() {
  try {
    const raw = localStorage.getItem(SHIFTS_KEY);
    if (!raw) {
      localStorage.setItem(SHIFTS_KEY, JSON.stringify(INITIAL_SHIFTS));
      return INITIAL_SHIFTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SHIFTS;
  } catch (e) {
    console.error('Error reading stored shifts:', e);
    return INITIAL_SHIFTS;
  }
}

export function saveStoredShifts(shifts) {
  try {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
  } catch (e) {
    console.error('Error saving shifts:', e);
  }
}

export function resetStoredVolunteers() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VOLUNTEERS));
    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(INITIAL_PROGRAMS));
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(INITIAL_SHIFTS));
    return INITIAL_VOLUNTEERS;
  } catch (e) {
    console.error('Error resetting volunteer data:', e);
    return INITIAL_VOLUNTEERS;
  }
}
