// Enhanced Document Data for Admin Panel
import { SAMPLE_ORDINANCES, SAMPLE_VIOLATIONS } from './ordinanceData';

export interface Document {
  id: string;
  documentId: string; // Human-readable ID like DOC-2024-001
  type: 'Ordinance' | 'Resolution' | 'Executive Order' | 'Bids & Awards' | 'Financial Aid';
  title: string;
  barangay: string;
  datePublished: string;
  publishedBy: string;
  status: 'Active' | 'Archived' | 'Draft' | 'Under Review';
  blockchainStatus: 'Verified' | 'Pending' | 'Not Verified';
  violationCount: number;
  description: string;
  fullContent?: string;
  attachedFiles?: string[];
  txHash?: string;
  block?: string;
  verifiedBy?: string;
  verificationTimestamp?: string;
  lastModified?: string;
  ordinanceNumber?: string;
  effectivityDate?: string;
  tags?: string[];
}

// Generate comprehensive document data from ordinances
export const DOCUMENTS: Document[] = SAMPLE_ORDINANCES.map((ordinance, index) => {
  const violationCount = SAMPLE_VIOLATIONS.filter(v => v.ordinanceId === ordinance.id).length;
  
  const publishedByList = [
    'Admin Juan Reyes',
    'Admin Maria Santos',
    'Admin Pedro Cruz',
    'Admin Lisa Ramos',
    'Admin Carlos Torres',
    'Admin Ana Garcia',
    'Admin Roberto Mendoza',
    'Admin Sofia Ramirez'
  ];

  const verifiedByList = [
    'System Administrator',
    'Blockchain Verifier',
    'Admin Officer',
    'Chief Administrator'
  ];

  // Determine document type based on ordinance title
  let docType: Document['type'] = 'Ordinance';
  if (ordinance.title.toLowerCase().includes('resolution')) {
    docType = 'Resolution';
  } else if (ordinance.title.toLowerCase().includes('executive')) {
    docType = 'Executive Order';
  } else if (ordinance.title.toLowerCase().includes('bid') || ordinance.title.toLowerCase().includes('procurement')) {
    docType = 'Bids & Awards';
  } else if (ordinance.title.toLowerCase().includes('financial') || ordinance.title.toLowerCase().includes('aid')) {
    docType = 'Financial Aid';
  }

  const hasBlockchain = ordinance.txHash && ordinance.block;
  const blockchainStatus: Document['blockchainStatus'] = 
    hasBlockchain ? (Math.random() > 0.95 ? 'Pending' : 'Verified') : 'Not Verified';

  // Safe date parsing
  const parseDate = (dateStr: string): Date => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const enactedDate = parseDate(ordinance.dateEnacted);
  const verificationDate = new Date(enactedDate.getTime() + 86400000); // +1 day
  const modifiedDate = new Date(enactedDate.getTime() + Math.random() * 30 * 86400000); // +0-30 days

  return {
    id: ordinance.id,
    documentId: `DOC-2024-${String(index + 1).padStart(3, '0')}`,
    type: docType,
    title: ordinance.title,
    barangay: ordinance.barangay,
    datePublished: ordinance.dateEnacted,
    publishedBy: publishedByList[Math.floor(Math.random() * publishedByList.length)],
    status: ordinance.status === 'Active' ? 'Active' : 
            ordinance.status === 'Updated' ? 'Active' : 
            ordinance.status === 'Archived' ? 'Archived' : 'Active',
    blockchainStatus,
    violationCount,
    description: ordinance.description,
    fullContent: generateFullContent(ordinance.title, ordinance.description),
    attachedFiles: generateAttachedFiles(),
    txHash: ordinance.txHash,
    block: ordinance.block,
    verifiedBy: hasBlockchain ? verifiedByList[Math.floor(Math.random() * verifiedByList.length)] : undefined,
    verificationTimestamp: hasBlockchain ? verificationDate.toISOString() : undefined,
    lastModified: ordinance.status === 'Updated' ? modifiedDate.toISOString() : ordinance.dateEnacted,
    ordinanceNumber: ordinance.ordinanceNumber,
    effectivityDate: ordinance.effectivityDate,
    tags: generateTags(ordinance.title, ordinance.description)
  };
});

function generateFullContent(title: string, description: string): string {
  return `
# ${title}

## WHEREAS

Pursuant to the powers vested in the Sangguniang Barangay under the Local Government Code of 1991, and in consideration of the welfare and public interest of all residents within the barangay jurisdiction;

## SECTION 1: PURPOSE AND INTENT

${description}

This ordinance is enacted to ensure the proper governance, safety, and welfare of all residents within the barangay. The provisions herein shall be enforced in accordance with existing national and local laws.

## SECTION 2: SCOPE AND COVERAGE

This ordinance shall apply to all residents, visitors, and entities operating within the territorial jurisdiction of the barangay. All concerned parties are hereby notified and required to comply with the provisions stated herein.

## SECTION 3: IMPLEMENTATION

The Barangay Council, through its designated officers and personnel, shall be responsible for the implementation and enforcement of this ordinance. Necessary coordination with other government agencies shall be undertaken as needed.

## SECTION 4: PENALTIES

Any violation of the provisions of this ordinance shall be subject to penalties as prescribed by law and local regulations. Fines and sanctions may be imposed depending on the severity and frequency of violations.

## SECTION 5: EFFECTIVITY

This ordinance shall take effect fifteen (15) days after its publication in accordance with law.

ENACTED this ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.

---

**CERTIFIED TRUE COPY**
Barangay Secretary
  `.trim();
}

function generateAttachedFiles(): string[] {
  const fileTypes = [
    'Signed_Ordinance_Copy.pdf',
    'Supporting_Documents.pdf',
    'Barangay_Resolution.pdf',
    'Impact_Assessment.pdf',
    'Public_Consultation_Report.pdf'
  ];
  
  const numFiles = Math.floor(Math.random() * 3) + 1; // 1-3 files
  return fileTypes.slice(0, numFiles);
}

function generateTags(title: string, description: string): string[] {
  const allTags = [
    'Public Safety',
    'Environmental Protection',
    'Traffic Management',
    'Waste Management',
    'Community Development',
    'Public Health',
    'Animal Welfare',
    'Business Regulation',
    'Noise Control',
    'Building Permits',
    'Zoning',
    'Youth Welfare',
    'Senior Citizens',
    'Disaster Risk Reduction',
    'Public Order'
  ];

  const text = (title + ' ' + description).toLowerCase();
  const tags: string[] = [];

  // Add relevant tags based on content
  if (text.includes('noise') || text.includes('sound')) tags.push('Noise Control');
  if (text.includes('waste') || text.includes('garbage') || text.includes('trash')) tags.push('Waste Management');
  if (text.includes('traffic') || text.includes('vehicle') || text.includes('parking')) tags.push('Traffic Management');
  if (text.includes('health') || text.includes('sanitation')) tags.push('Public Health');
  if (text.includes('business') || text.includes('vendor') || text.includes('permit')) tags.push('Business Regulation');
  if (text.includes('animal') || text.includes('pet') || text.includes('dog')) tags.push('Animal Welfare');
  if (text.includes('safety') || text.includes('security')) tags.push('Public Safety');
  if (text.includes('environment') || text.includes('green') || text.includes('tree')) tags.push('Environmental Protection');
  if (text.includes('disaster') || text.includes('emergency')) tags.push('Disaster Risk Reduction');
  if (text.includes('senior') || text.includes('elderly')) tags.push('Senior Citizens');
  if (text.includes('youth') || text.includes('children')) tags.push('Youth Welfare');

  // Add random tags if less than 2
  while (tags.length < 2) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }

  return tags.slice(0, 3); // Max 3 tags
}

// Helper functions
export const getDocumentById = (id: string) => {
  return DOCUMENTS.find(doc => doc.id === id || doc.documentId === id);
};

export const getDocumentsByBarangay = (barangay: string) => {
  return DOCUMENTS.filter(doc => doc.barangay === barangay);
};

export const getDocumentsByType = (type: Document['type']) => {
  return DOCUMENTS.filter(doc => doc.type === type);
};

export const getDocumentsByStatus = (status: Document['status']) => {
  return DOCUMENTS.filter(doc => doc.status === status);
};

export const getDocumentsByBlockchainStatus = (blockchainStatus: Document['blockchainStatus']) => {
  return DOCUMENTS.filter(doc => doc.blockchainStatus === blockchainStatus);
};

export const getDocumentStats = () => {
  return {
    total: DOCUMENTS.length,
    active: DOCUMENTS.filter(d => d.status === 'Active').length,
    archived: DOCUMENTS.filter(d => d.status === 'Archived').length,
    verified: DOCUMENTS.filter(d => d.blockchainStatus === 'Verified').length,
    pending: DOCUMENTS.filter(d => d.blockchainStatus === 'Pending').length,
    notVerified: DOCUMENTS.filter(d => d.blockchainStatus === 'Not Verified').length,
    withViolations: DOCUMENTS.filter(d => d.violationCount > 0).length
  };
};

export const searchDocuments = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  return DOCUMENTS.filter(doc => 
    doc.documentId.toLowerCase().includes(term) ||
    doc.title.toLowerCase().includes(term) ||
    doc.barangay.toLowerCase().includes(term) ||
    doc.description.toLowerCase().includes(term) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(term))
  );
};