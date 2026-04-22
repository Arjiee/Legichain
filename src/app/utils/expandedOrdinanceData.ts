// Expanded Ordinance and Violation Data - 50 Ordinances with Random Violations

import { Ordinance, ViolationRecord } from './ordinanceData';

// Only 5 Poblacion Barangays (Scope Limited)
const GMA_BARANGAYS = [
  "Poblacion 1",
  "Poblacion 2",
  "Poblacion 3",
  "Poblacion 4",
  "Poblacion 5"
];

// Categories
const CATEGORIES = [
  "Environmental",
  "Public Safety",
  "Health",
  "Traffic",
  "Community Order",
  "Business Regulation"
];

// Ordinance templates
const ORDINANCE_TEMPLATES = [
  { title: "Waste Segregation Ordinance", category: "Environmental", description: "Mandatory waste segregation at source for all households and establishments." },
  { title: "Anti-Littering Ordinance", category: "Environmental", description: "Prohibition of littering in all public spaces with corresponding penalties." },
  { title: "Curfew for Minors", category: "Public Safety", description: "Minors below 18 years old must be home by 10:00 PM unless accompanied by guardian." },
  { title: "Anti-Noise Ordinance", category: "Community Order", description: "Regulation of excessive noise from 10:00 PM to 6:00 AM in residential areas." },
  { title: "No Smoking in Public Areas", category: "Health", description: "Designated smoking areas only in public spaces." },
  { title: "Illegal Parking Regulation", category: "Traffic", description: "Strict enforcement of no-parking zones and proper vehicle placement." },
  { title: "Street Vending Regulation", category: "Business Regulation", description: "Designated areas and time schedules for street vendors." },
  { title: "Public Cleanliness Ordinance", category: "Environmental", description: "Mandatory cleanliness standards for public and private properties." },
  { title: "Road Obstruction Ordinance", category: "Traffic", description: "Prohibition of any obstruction on roads and sidewalks." },
  { title: "Health Protocol Compliance", category: "Health", description: "Mandatory compliance with public health standards and protocols." }
];

// Violation types
const VIOLATION_TYPES: Record<string, string[]> = {
  "Waste Segregation Ordinance": ["Improper waste segregation", "Mixed waste disposal", "Failure to compost"],
  "Anti-Littering Ordinance": ["Public littering", "Illegal dumping", "Throwing trash in waterways"],
  "Curfew for Minors": ["Minor outside curfew hours", "Unaccompanied minor after 10 PM"],
  "Anti-Noise Ordinance": ["Excessive noise after 10 PM", "Loud music during quiet hours", "Construction noise violation"],
  "No Smoking in Public Areas": ["Smoking in public area", "Smoking in enclosed space", "Smoking near children"],
  "Illegal Parking Regulation": ["Illegal street parking", "Blocking emergency lane", "Parking on sidewalk"],
  "Street Vending Regulation": ["Unauthorized street vending", "Vending in prohibited zone", "Operating without permit"],
  "Public Cleanliness Ordinance": ["Unclean property", "Unsanitary conditions", "Failure to maintain premises"],
  "Road Obstruction Ordinance": ["Obstructing road", "Blocking sidewalk", "Unauthorized structure on road"],
  "Health Protocol Compliance": ["No face mask", "Violating social distancing", "Non-compliance with health standards"]
};

// Generate 50 ordinances
export const EXPANDED_ORDINANCES: Ordinance[] = Array.from({ length: 50 }, (_, i) => {
  const id = `ORD-${String(i + 1).padStart(3, '0')}`;
  const barangay = GMA_BARANGAYS[i % GMA_BARANGAYS.length];
  const template = ORDINANCE_TEMPLATES[i % ORDINANCE_TEMPLATES.length];
  const monthsAgo = Math.floor(Math.random() * 36) + 1; // 1-36 months ago
  const year = 2024 - Math.floor(monthsAgo / 12);
  const month = 12 - (monthsAgo % 12);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const timesEnforced = Math.floor(Math.random() * 100) + 30;
  const violationsRecorded = Math.floor(timesEnforced * (0.3 + Math.random() * 0.5));
  
  const status: 'Active' | 'Updated' | 'Archived' = 
    Math.random() > 0.9 ? 'Archived' : 
    Math.random() > 0.7 ? 'Updated' : 'Active';
  
  const txHash = `0x${Math.random().toString(16).substring(2, 34).toUpperCase().padEnd(32, '0')}`;
  const block = String(1245000 + Math.floor(Math.random() * 2000));
  
  return {
    id,
    barangay,
    title: template.title,
    category: template.category,
    dateImplemented: `${months[month]} ${year}`,
    timesEnforced,
    violationsRecorded,
    status,
    description: template.description,
    txHash,
    block
  };
});

// Generate random violations for each ordinance
export const EXPANDED_VIOLATIONS: ViolationRecord[] = [];

let violationId = 1;
EXPANDED_ORDINANCES.forEach(ordinance => {
  // Generate 2-8 random violations per ordinance
  const numViolations = Math.floor(Math.random() * 7) + 2;
  
  for (let i = 0; i < numViolations; i++) {
    const violationTypes = VIOLATION_TYPES[ordinance.title] || ["General violation"];
    const violationType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
    
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateOfViolation = date.toISOString().split('T')[0];
    
    const statuses: Array<'Pending' | 'Warning Issued' | 'Resolved'> = ['Pending', 'Warning Issued', 'Resolved'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const officers = [
      "Officer Smith", "Officer Johnson", "Officer Brown", "Officer Davis",
      "Officer Wilson", "Officer Moore", "Officer Taylor", "Officer Anderson",
      "Officer Thomas", "Officer Jackson", "Officer White", "Officer Harris",
      "Officer Martin", "Officer Thompson", "Officer Garcia", "Officer Martinez",
      "Officer Robinson", "Officer Clark", "Officer Lewis", "Officer Rodriguez"
    ];
    const recordedBy = officers[Math.floor(Math.random() * officers.length)];
    
    const txHash = `0x${Math.random().toString(16).substring(2, 34).toUpperCase().padEnd(32, '0')}`;
    const block = String(1245000 + Math.floor(Math.random() * 2000));
    
    const verificationStatus: 'Verified' | 'Pending' | 'Failed' = 
      Math.random() > 0.95 ? 'Failed' :
      Math.random() > 0.85 ? 'Pending' : 'Verified';
    
    EXPANDED_VIOLATIONS.push({
      id: `VR-${String(violationId++).padStart(3, '0')}`,
      ordinanceId: ordinance.id,
      ordinanceViolated: ordinance.title,
      barangay: ordinance.barangay,
      violationType,
      dateOfViolation,
      status,
      recordedBy,
      txHash,
      block,
      verificationStatus
    });
  }
});

// Export helper functions
export const getViolationsForOrdinance = (ordinanceId: string) => {
  return EXPANDED_VIOLATIONS.filter(v => v.ordinanceId === ordinanceId);
};

export const getOrdinanceWithRealViolations = (ordinance: Ordinance) => {
  const violations = getViolationsForOrdinance(ordinance.id);
  return {
    ...ordinance,
    violationsRecorded: violations.length
  };
};

export const getAllOrdinancesWithRealViolations = () => {
  return EXPANDED_ORDINANCES.map(ord => getOrdinanceWithRealViolations(ord));
};