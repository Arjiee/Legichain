// Ordinance and Violation Data for GMA Cavite

import { EXPANDED_ORDINANCES, EXPANDED_VIOLATIONS } from './expandedOrdinanceData';

export interface Ordinance {
  id: string;
  barangay: string;
  title: string;
  category: string;
  dateImplemented: string;
  timesEnforced: number;
  violationsRecorded: number;
  status: 'Active' | 'Updated' | 'Archived';
  txHash?: string;
  block?: string;
  description?: string;
}

export interface ViolationRecord {
  id: string;
  ordinanceId: string;
  ordinanceViolated: string;
  barangay: string;
  violationType: string;
  dateOfViolation: string;
  status: 'Pending' | 'Warning Issued' | 'Resolved';
  recordedBy: string;
  txHash: string;
  block: string;
  verificationStatus: 'Verified' | 'Pending' | 'Failed';
}

// Export expanded data as main data
export const SAMPLE_ORDINANCES: Ordinance[] = EXPANDED_ORDINANCES;
export const SAMPLE_VIOLATIONS: ViolationRecord[] = EXPANDED_VIOLATIONS;

// Analytics helper functions
export const getOrdinancesByBarangay = (barangay: string, ordinances: Ordinance[]) => {
  if (barangay === "all") return ordinances;
  return ordinances.filter(o => o.barangay === barangay);
};

export const getViolationsByBarangay = (barangay: string, violations: ViolationRecord[]) => {
  if (barangay === "all") return violations;
  return violations.filter(v => v.barangay === barangay);
};

export const getOrdinanceCategories = (ordinances: Ordinance[]) => {
  const categories = ordinances.reduce((acc, ord) => {
    acc[ord.category] = (acc[ord.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

export const getMostViolatedOrdinances = (violations: ViolationRecord[]) => {
  const violationCount = violations.reduce((acc, v) => {
    acc[v.ordinanceViolated] = (acc[v.ordinanceViolated] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(violationCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

export const getViolationsByBarangayStats = (violations: ViolationRecord[]) => {
  const barangayCount = violations.reduce((acc, v) => {
    acc[v.barangay] = (acc[v.barangay] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(barangayCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Get violations count for a specific ordinance
export const getViolationsForOrdinance = (ordinanceId: string, violations: ViolationRecord[]) => {
  // Match by ordinance ID or title
  const ordinance = SAMPLE_ORDINANCES.find(o => o.id === ordinanceId);
  if (!ordinance) return 0;
  
  return violations.filter(v => 
    v.ordinanceViolated.toLowerCase().includes(ordinance.title.toLowerCase()) ||
    v.ordinanceViolated.toLowerCase() === ordinance.title.toLowerCase()
  ).length;
};

// Get enhanced ordinance with real-time violation count
export const getOrdinanceWithViolations = (ordinance: Ordinance, violations: ViolationRecord[]) => {
  const violationCount = getViolationsForOrdinance(ordinance.id, violations);
  return {
    ...ordinance,
    violationsRecorded: violationCount
  };
};

// Get all ordinances with real-time violation counts
export const getAllOrdinancesWithViolations = (violations: ViolationRecord[]) => {
  return SAMPLE_ORDINANCES.map(ord => getOrdinanceWithViolations(ord, violations));
};