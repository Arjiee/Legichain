// Barangay Project Data for GMA Cavite - Poblacion 1-5 Only

export type ProjectCategory = 
  | 'Infrastructure & Physical Improvement'
  | 'Health, Sanitation, and Environment'
  | 'Safety, Order, and Social Services'
  | 'Livelihood, Education, and Agriculture';

export type ProjectStatus = 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';

export type FundingSource = 
  | 'Barangay Fund'
  | 'LGU'
  | 'National Government'
  | 'NGO'
  | 'Mixed Funding';

export type UtilizationStatus = 'Not Started' | 'Partially Utilized' | 'Fully Utilized';

export interface ProjectFinancials {
  totalApprovedBudget: number;
  fundingSource: FundingSource;
  amountReleased: number;
  amountUtilized: number;
  remainingBalance: number;
  utilizationStatus: UtilizationStatus;
  proofOfExpenditure: string[];
  lastUpdated: string;
}

export interface BarangayProject {
  id: string;
  projectId: string;
  barangay: string;
  projectTitle: string;
  category: ProjectCategory;
  description: string;
  location: string;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  projectStatus: ProjectStatus;
  implementingOffice: string;
  beneficiaries: string;
  totalBeneficiaries?: number;
  
  // Financial Information
  financials: ProjectFinancials;
  
  // Blockchain Verification
  blockchainVerified: boolean;
  txHash: string;
  block: string;
  timestamp: string;
  fromAddress: string;
  toAddress: string;
  documentHash: string;
  verificationStatus: 'Verified on Chain' | 'Pending' | 'Failed';
  
  // Supporting Documents
  supportingDocs: string[];
  datePublished: string;
  lastUpdated?: string;
}

// Sample Barangay Projects for Poblacion 1-5
export const SAMPLE_PROJECTS: BarangayProject[] = [
  {
    id: '1',
    projectId: 'PROJ-2024-001',
    barangay: 'Poblacion 1',
    projectTitle: 'Installation of Solar Streetlights',
    category: 'Infrastructure & Physical Improvement',
    description: 'Installation of 25 solar-powered LED streetlights along major roads to improve nighttime visibility and community safety.',
    location: 'Major roads in Poblacion 1',
    startDate: '2024-01-15',
    expectedCompletionDate: '2024-03-20',
    actualCompletionDate: '2024-03-20',
    projectStatus: 'Completed',
    implementingOffice: 'Barangay Engineering Office',
    beneficiaries: 'All residents of Poblacion 1',
    totalBeneficiaries: 1200,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 350000,
      fundingSource: 'Barangay Fund',
      amountReleased: 350000,
      amountUtilized: 350000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'March 25, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    block: '15234890',
    timestamp: '2024-03-25T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Project Plan', 'Photos', 'Completion Report'],
    datePublished: 'January 10, 2024',
    lastUpdated: 'March 25, 2024'
  },
  {
    id: '2',
    projectId: 'PROJ-2024-002',
    barangay: 'Poblacion 2',
    projectTitle: 'Barangay Health Center Improvement',
    category: 'Health, Sanitation, and Environment',
    description: 'Renovation and upgrading of the barangay health center including new medical equipment, air conditioning, and waiting area expansion.',
    location: 'Barangay Health Center, Poblacion 2',
    startDate: '2024-02-01',
    expectedCompletionDate: '2024-05-30',
    actualCompletionDate: '2024-05-30',
    projectStatus: 'Ongoing',
    implementingOffice: 'Barangay Health Office',
    beneficiaries: 'All residents, especially mothers and children',
    totalBeneficiaries: 1500,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 800000,
      fundingSource: 'LGU',
      amountReleased: 800000,
      amountUtilized: 800000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'May 30, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    block: '15235100',
    timestamp: '2024-05-30T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Project Proposal', 'Budget Plan', 'Progress Photos'],
    datePublished: 'January 25, 2024'
  },
  {
    id: '3',
    projectId: 'PROJ-2024-003',
    barangay: 'Poblacion 3',
    projectTitle: 'Purchase of Patrol Vehicle',
    category: 'Safety, Order, and Social Services',
    description: 'Acquisition of one (1) motorcycle for barangay tanod patrol operations to enhance peace and order services.',
    location: 'Barangay Hall, Poblacion 3',
    startDate: '2024-03-01',
    expectedCompletionDate: '2024-04-15',
    actualCompletionDate: '2024-04-15',
    projectStatus: 'Completed',
    implementingOffice: 'Barangay Peace and Order Committee',
    beneficiaries: 'Entire barangay community',
    totalBeneficiaries: 1100,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 95000,
      fundingSource: 'Barangay Fund',
      amountReleased: 95000,
      amountUtilized: 95000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'April 20, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    block: '15235500',
    timestamp: '2024-04-20T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Purchase Order', 'Vehicle Photos', 'Acceptance Report'],
    datePublished: 'February 20, 2024',
    lastUpdated: 'April 20, 2024'
  },
  {
    id: '4',
    projectId: 'PROJ-2024-004',
    barangay: 'Poblacion 4',
    projectTitle: 'Skills Development Training - Sewing and Baking',
    category: 'Livelihood, Education, and Agriculture',
    description: 'Two-week skills training program for unemployed residents and housewives covering basic sewing and baking skills with starter kits provided.',
    location: 'Barangay Hall, Poblacion 4',
    startDate: '2024-04-10',
    expectedCompletionDate: '2024-04-25',
    actualCompletionDate: '2024-04-25',
    projectStatus: 'Completed',
    implementingOffice: 'Barangay Livelihood Office',
    beneficiaries: 'Unemployed residents and housewives',
    totalBeneficiaries: 45,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 120000,
      fundingSource: 'National Government',
      amountReleased: 120000,
      amountUtilized: 120000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'April 30, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    block: '15236000',
    timestamp: '2024-04-30T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Training Module', 'Participants List', 'Certificate Photos'],
    datePublished: 'March 15, 2024',
    lastUpdated: 'April 30, 2024'
  },
  {
    id: '5',
    projectId: 'PROJ-2024-005',
    barangay: 'Poblacion 5',
    projectTitle: 'Construction of Public Waiting Shed',
    category: 'Infrastructure & Physical Improvement',
    description: 'Construction of a covered waiting shed near the barangay hall to provide shelter for commuters and residents.',
    location: 'Near Barangay Hall, Poblacion 5',
    startDate: '2024-03-15',
    expectedCompletionDate: '2024-06-30',
    actualCompletionDate: '2024-06-30',
    projectStatus: 'Ongoing',
    implementingOffice: 'Barangay Engineering Office',
    beneficiaries: 'Daily commuters and residents',
    totalBeneficiaries: 800,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 180000,
      fundingSource: 'Mixed Funding',
      amountReleased: 180000,
      amountUtilized: 180000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'June 30, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    block: '15236200',
    timestamp: '2024-06-30T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Architectural Plan', 'Construction Photos'],
    datePublished: 'March 01, 2024'
  },
  {
    id: '6',
    projectId: 'PROJ-2024-006',
    barangay: 'Poblacion 1',
    projectTitle: 'Feeding Program for Undernourished Children',
    category: 'Health, Sanitation, and Environment',
    description: '120-day feeding program providing nutritious meals to identified malnourished children aged 0-5 years old.',
    location: 'Barangay Hall, Poblacion 1',
    startDate: '2024-05-01',
    expectedCompletionDate: '2024-08-31',
    actualCompletionDate: '2024-08-31',
    projectStatus: 'Ongoing',
    implementingOffice: 'Barangay Nutrition Office',
    beneficiaries: 'Undernourished children 0-5 years old',
    totalBeneficiaries: 38,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 250000,
      fundingSource: 'LGU',
      amountReleased: 250000,
      amountUtilized: 250000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'August 31, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    block: '15236800',
    timestamp: '2024-08-31T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Nutrition Survey', 'Menu Plan', 'Progress Monitoring'],
    datePublished: 'April 15, 2024'
  },
  {
    id: '7',
    projectId: 'PROJ-2024-007',
    barangay: 'Poblacion 2',
    projectTitle: 'Installation of CCTVs',
    category: 'Safety, Order, and Social Services',
    description: 'Installation of 8 CCTV cameras in strategic locations to monitor and enhance community security.',
    location: 'Strategic locations in Poblacion 2',
    startDate: '2024-02-15',
    expectedCompletionDate: '2024-03-30',
    actualCompletionDate: '2024-03-30',
    projectStatus: 'Completed',
    implementingOffice: 'Barangay Peace and Order Committee',
    beneficiaries: 'All residents of Poblacion 2',
    totalBeneficiaries: 1500,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 420000,
      fundingSource: 'Barangay Fund',
      amountReleased: 420000,
      amountUtilized: 420000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'April 05, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    block: '15237100',
    timestamp: '2024-04-05T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Installation Plan', 'Site Photos', 'System Documentation'],
    datePublished: 'February 01, 2024',
    lastUpdated: 'April 05, 2024'
  },
  {
    id: '8',
    projectId: 'PROJ-2024-008',
    barangay: 'Poblacion 3',
    projectTitle: 'Community Vegetable Garden Project',
    category: 'Livelihood, Education, and Agriculture',
    description: 'Establishment of a 200 sqm community garden with training on organic vegetable production and distribution of seedlings.',
    location: 'Community Garden, Poblacion 3',
    startDate: '2024-04-01',
    expectedCompletionDate: '2024-12-31',
    actualCompletionDate: '2024-12-31',
    projectStatus: 'Ongoing',
    implementingOffice: 'Barangay Agriculture Office',
    beneficiaries: 'Participating households',
    totalBeneficiaries: 25,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 85000,
      fundingSource: 'NGO',
      amountReleased: 85000,
      amountUtilized: 85000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'December 31, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    block: '15237400',
    timestamp: '2024-12-31T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Project Proposal', 'Training Module', 'Garden Layout'],
    datePublished: 'March 20, 2024'
  },
  {
    id: '9',
    projectId: 'PROJ-2024-009',
    barangay: 'Poblacion 4',
    projectTitle: 'Barangay Hall Renovation',
    category: 'Infrastructure & Physical Improvement',
    description: 'Major renovation of the barangay hall including roof repair, painting, office partitioning, and electrical rewiring.',
    location: 'Barangay Hall, Poblacion 4',
    startDate: '2024-06-01',
    expectedCompletionDate: '2024-09-30',
    actualCompletionDate: '2024-09-30',
    projectStatus: 'Planned',
    implementingOffice: 'Barangay Engineering Office',
    beneficiaries: 'Barangay officials and transacting residents',
    totalBeneficiaries: 0,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 650000,
      fundingSource: 'LGU',
      amountReleased: 0,
      amountUtilized: 0,
      remainingBalance: 650000,
      utilizationStatus: 'Not Started',
      proofOfExpenditure: [],
      lastUpdated: 'May 10, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    block: '15237900',
    timestamp: '2024-05-10T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0x90abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Architectural Plan', 'Budget Estimate'],
    datePublished: 'May 10, 2024'
  },
  {
    id: '10',
    projectId: 'PROJ-2024-010',
    barangay: 'Poblacion 5',
    projectTitle: 'Mass Vaccination Program',
    category: 'Health, Sanitation, and Environment',
    description: 'Free immunization program for children and senior citizens including flu vaccine, pneumonia vaccine, and routine immunizations.',
    location: 'Barangay Hall, Poblacion 5',
    startDate: '2024-03-10',
    expectedCompletionDate: '2024-03-12',
    actualCompletionDate: '2024-03-12',
    projectStatus: 'Completed',
    implementingOffice: 'Barangay Health Office',
    beneficiaries: 'Children and senior citizens',
    totalBeneficiaries: 320,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 75000,
      fundingSource: 'National Government',
      amountReleased: 75000,
      amountUtilized: 75000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'March 15, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789',
    block: '15238200',
    timestamp: '2024-03-15T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef123456789',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Medical Records', 'Vaccination Cards', 'Event Photos'],
    datePublished: 'February 28, 2024',
    lastUpdated: 'March 15, 2024'
  },
  {
    id: '11',
    projectId: 'PROJ-2024-011',
    barangay: 'Poblacion 1',
    projectTitle: 'Disaster Preparedness Training',
    category: 'Safety, Order, and Social Services',
    description: 'Comprehensive disaster risk reduction training including first aid, evacuation procedures, and emergency response protocols.',
    location: 'Barangay Hall, Poblacion 1',
    startDate: '2024-05-15',
    expectedCompletionDate: '2024-05-17',
    actualCompletionDate: '2024-05-17',
    projectStatus: 'Planned',
    implementingOffice: 'Barangay Disaster Risk Reduction Office',
    beneficiaries: 'Volunteer responders and community leaders',
    totalBeneficiaries: 0,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 45000,
      fundingSource: 'Barangay Fund',
      amountReleased: 0,
      amountUtilized: 0,
      remainingBalance: 45000,
      utilizationStatus: 'Not Started',
      proofOfExpenditure: [],
      lastUpdated: 'May 01, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    block: '15238600',
    timestamp: '2024-05-01T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Training Module', 'Participants List'],
    datePublished: 'May 01, 2024'
  },
  {
    id: '12',
    projectId: 'PROJ-2024-012',
    barangay: 'Poblacion 2',
    projectTitle: 'Rehabilitation of Small Farm-to-Market Road',
    category: 'Infrastructure & Physical Improvement',
    description: 'Concreting and improvement of 150-meter farm-to-market access road to facilitate agricultural product transport.',
    location: 'Farm-to-Market Road, Poblacion 2',
    startDate: '2024-07-01',
    expectedCompletionDate: '2024-10-31',
    actualCompletionDate: '2024-10-31',
    projectStatus: 'Planned',
    implementingOffice: 'Barangay Engineering Office',
    beneficiaries: 'Farmers and agricultural producers',
    totalBeneficiaries: 0,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 950000,
      fundingSource: 'National Government',
      amountReleased: 0,
      amountUtilized: 0,
      remainingBalance: 950000,
      utilizationStatus: 'Not Started',
      proofOfExpenditure: [],
      lastUpdated: 'May 20, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901',
    block: '15239000',
    timestamp: '2024-05-20T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678901',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Engineering Plan', 'Budget Proposal'],
    datePublished: 'May 20, 2024'
  },
  {
    id: '13',
    projectId: 'PROJ-2024-013',
    barangay: 'Poblacion 3',
    projectTitle: 'Tree Planting Activity',
    category: 'Health, Sanitation, and Environment',
    description: 'Community-wide tree planting program targeting 500 indigenous and fruit-bearing trees in identified vacant lots.',
    location: 'Vacant Lots, Poblacion 3',
    startDate: '2024-06-05',
    expectedCompletionDate: '2024-06-05',
    actualCompletionDate: '2024-06-05',
    projectStatus: 'Planned',
    implementingOffice: 'Barangay Environment Office',
    beneficiaries: 'Entire community',
    totalBeneficiaries: 0,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 35000,
      fundingSource: 'NGO',
      amountReleased: 0,
      amountUtilized: 0,
      remainingBalance: 35000,
      utilizationStatus: 'Not Started',
      proofOfExpenditure: [],
      lastUpdated: 'May 15, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef123456789012',
    block: '15239300',
    timestamp: '2024-05-15T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef123456789012',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Activity Plan', 'Seedling List'],
    datePublished: 'May 15, 2024'
  },
  {
    id: '14',
    projectId: 'PROJ-2024-014',
    barangay: 'Poblacion 4',
    projectTitle: 'Senior Citizen Center Improvement',
    category: 'Safety, Order, and Social Services',
    description: 'Renovation and upgrading of senior citizen center including furniture replacement, ventilation improvement, and recreational equipment.',
    location: 'Senior Citizen Center, Poblacion 4',
    startDate: '2024-05-20',
    expectedCompletionDate: '2024-07-15',
    actualCompletionDate: '2024-07-15',
    projectStatus: 'Ongoing',
    implementingOffice: 'Office of Senior Citizens Affairs',
    beneficiaries: 'Senior citizens of Poblacion 4',
    totalBeneficiaries: 180,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 220000,
      fundingSource: 'LGU',
      amountReleased: 220000,
      amountUtilized: 220000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'July 15, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890123',
    block: '15239700',
    timestamp: '2024-07-15T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890123',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Renovation Plan', 'Progress Photos'],
    datePublished: 'May 05, 2024'
  },
  {
    id: '15',
    projectId: 'PROJ-2024-015',
    barangay: 'Poblacion 5',
    projectTitle: 'Small Livelihood Project Seed Capital',
    category: 'Livelihood, Education, and Agriculture',
    description: 'Financial assistance program providing seed capital (₱5,000-₱10,000) to qualified beneficiaries for micro-business startups.',
    location: 'Barangay Hall, Poblacion 5',
    startDate: '2024-04-01',
    expectedCompletionDate: '2024-12-31',
    actualCompletionDate: '2024-12-31',
    projectStatus: 'Ongoing',
    implementingOffice: 'Barangay Livelihood Office',
    beneficiaries: 'Qualified low-income families',
    totalBeneficiaries: 35,
    
    // Financial Information
    financials: {
      totalApprovedBudget: 300000,
      fundingSource: 'Mixed Funding',
      amountReleased: 300000,
      amountUtilized: 300000,
      remainingBalance: 0,
      utilizationStatus: 'Fully Utilized',
      proofOfExpenditure: ['Invoice', 'Receipt'],
      lastUpdated: 'December 31, 2024'
    },
    
    // Blockchain Verification
    blockchainVerified: true,
    txHash: '0xf1234567890abcdef1234567890abcdef1234567890abcdef12345678901234',
    block: '15240100',
    timestamp: '2024-12-31T10:00:00Z',
    fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
    toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
    documentHash: '0xf1234567890abcdef1234567890abcdef1234567890abcdef12345678901234',
    verificationStatus: 'Verified on Chain',
    
    // Supporting Documents
    supportingDocs: ['Program Guidelines', 'Application Forms', 'Beneficiary List'],
    datePublished: 'March 25, 2024'
  }
];

// Project Statistics
export const getProjectStats = () => {
  const total = SAMPLE_PROJECTS.length;
  const active = SAMPLE_PROJECTS.filter(p => p.projectStatus === 'Ongoing').length;
  const completed = SAMPLE_PROJECTS.filter(p => p.projectStatus === 'Completed').length;
  const planned = SAMPLE_PROJECTS.filter(p => p.projectStatus === 'Planned').length;
  const verified = SAMPLE_PROJECTS.filter(p => p.blockchainVerified).length;

  const byCategory = {
    infrastructure: SAMPLE_PROJECTS.filter(p => p.category === 'Infrastructure & Physical Improvement').length,
    health: SAMPLE_PROJECTS.filter(p => p.category === 'Health, Sanitation, and Environment').length,
    safety: SAMPLE_PROJECTS.filter(p => p.category === 'Safety, Order, and Social Services').length,
    livelihood: SAMPLE_PROJECTS.filter(p => p.category === 'Livelihood, Education, and Agriculture').length
  };

  const totalBudget = SAMPLE_PROJECTS.reduce((sum, p) => sum + p.financials.totalApprovedBudget, 0);
  const totalBeneficiaries = SAMPLE_PROJECTS.reduce((sum, p) => sum + (p.totalBeneficiaries || 0), 0);

  return {
    total,
    active,
    completed,
    planned,
    verified,
    byCategory,
    totalBudget,
    totalBeneficiaries
  };
};