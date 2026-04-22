// Blockchain Transaction Data for GMA Cavite System

import { SAMPLE_ORDINANCES, SAMPLE_VIOLATIONS } from './ordinanceData';

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: string;
  previousBlockHash: string;
  smartContractAddress: string;
  ordinanceId?: string;
  barangay: string;
  violationCaseId?: string;
  recordType: 'Ordinance Record' | 'Violation Case';
  actionRecorded: 'Created' | 'Updated' | 'Verified' | 'Archived';
  timestamp: string;
  recordedBy: string;
  verificationStatus: 'Verified' | 'Pending' | 'Failed';
  ordinanceTitle?: string;
  violationType?: string;
  gasUsed?: string;
  gasPrice?: string;
}

// Smart Contract Address for GMA Blockchain
const SMART_CONTRACT_ADDRESS = '0xA1B2C3D4E5F6789012345678901234567890ABCD';

// Generate blockchain transactions from ordinances
const ordinanceTransactions: BlockchainTransaction[] = SAMPLE_ORDINANCES.map((ordinance, index) => {
  const daysAgo = Math.floor(Math.random() * 180) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const timestamp = date.toISOString();

  const admins = [
    'Admin Juan Reyes',
    'Admin Maria Santos',
    'Admin Pedro Cruz',
    'Admin Lisa Ramos',
    'Admin Carlos Torres',
    'Admin Ana Garcia',
    'Admin Roberto Mendoza',
    'Admin Sofia Ramirez'
  ];

  const actions: Array<'Created' | 'Updated' | 'Verified'> = 
    ordinance.status === 'Archived' ? ['Archived'] :
    ordinance.status === 'Updated' ? ['Updated'] : ['Created'];

  const action = actions[0];

  return {
    txHash: ordinance.txHash || `0x${Math.random().toString(16).substring(2, 34).toUpperCase().padEnd(32, '0')}`,
    blockNumber: ordinance.block || String(1245000 + index),
    previousBlockHash: `0x${Math.random().toString(16).substring(2, 34).toUpperCase().padEnd(32, '0')}`,
    smartContractAddress: SMART_CONTRACT_ADDRESS,
    ordinanceId: ordinance.id,
    barangay: ordinance.barangay,
    recordType: 'Ordinance Record',
    actionRecorded: action,
    timestamp,
    recordedBy: admins[Math.floor(Math.random() * admins.length)],
    verificationStatus: Math.random() > 0.95 ? 'Pending' : 'Verified',
    ordinanceTitle: ordinance.title,
    gasUsed: String(Math.floor(Math.random() * 50000) + 21000),
    gasPrice: (Math.random() * 20 + 10).toFixed(2)
  };
});

// Generate blockchain transactions from violations
const violationTransactions: BlockchainTransaction[] = SAMPLE_VIOLATIONS.map((violation, index) => {
  const date = new Date(violation.dateOfViolation);
  const timestamp = date.toISOString();

  const officers = [
    'Officer Smith',
    'Officer Johnson',
    'Officer Brown',
    'Officer Davis',
    'Officer Wilson',
    'Officer Moore',
    'Officer Taylor',
    'Officer Anderson'
  ];

  return {
    txHash: violation.txHash,
    blockNumber: violation.block,
    previousBlockHash: `0x${Math.random().toString(16).substring(2, 34).toUpperCase().padEnd(32, '0')}`,
    smartContractAddress: SMART_CONTRACT_ADDRESS,
    ordinanceId: violation.ordinanceId,
    barangay: violation.barangay,
    violationCaseId: violation.id,
    recordType: 'Violation Case',
    actionRecorded: 'Created',
    timestamp,
    recordedBy: violation.recordedBy,
    verificationStatus: violation.verificationStatus,
    ordinanceTitle: violation.ordinanceViolated,
    violationType: violation.violationType,
    gasUsed: String(Math.floor(Math.random() * 30000) + 21000),
    gasPrice: (Math.random() * 20 + 10).toFixed(2)
  };
});

// Combine and sort by block number (descending)
export const BLOCKCHAIN_TRANSACTIONS: BlockchainTransaction[] = [
  ...ordinanceTransactions,
  ...violationTransactions
].sort((a, b) => parseInt(b.blockNumber) - parseInt(a.blockNumber));

// Statistics
export const getBlockchainStats = () => {
  const totalTransactions = BLOCKCHAIN_TRANSACTIONS.length;
  const verifiedRecords = BLOCKCHAIN_TRANSACTIONS.filter(tx => tx.verificationStatus === 'Verified').length;
  const ordinanceRecords = BLOCKCHAIN_TRANSACTIONS.filter(tx => tx.recordType === 'Ordinance Record').length;
  const violationRecords = BLOCKCHAIN_TRANSACTIONS.filter(tx => tx.recordType === 'Violation Case').length;
  const latestBlock = BLOCKCHAIN_TRANSACTIONS.length > 0 
    ? Math.max(...BLOCKCHAIN_TRANSACTIONS.map(tx => parseInt(tx.blockNumber)))
    : 0;

  return {
    totalTransactions,
    verifiedRecords,
    ordinanceRecords,
    violationRecords,
    latestBlock
  };
};

// Get transaction by hash
export const getTransactionByHash = (txHash: string) => {
  return BLOCKCHAIN_TRANSACTIONS.find(tx => tx.txHash === txHash);
};

// Get transactions by ordinance ID
export const getTransactionsByOrdinanceId = (ordinanceId: string) => {
  return BLOCKCHAIN_TRANSACTIONS.filter(tx => tx.ordinanceId === ordinanceId);
};

// Get transactions by barangay
export const getTransactionsByBarangay = (barangay: string) => {
  return BLOCKCHAIN_TRANSACTIONS.filter(tx => tx.barangay === barangay);
};
