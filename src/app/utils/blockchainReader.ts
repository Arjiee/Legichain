/**
 * Blockchain Data Reader - HIGH PERFORMANCE
 * Fetches light pointers from Polygon and "hydrates" data from IPFS.
 * Optimized for minimal gas consumption and maximum fetch speed.
 */

import { readContract } from 'wagmi/actions';
import { 
  wagmiConfig, 
  LEGICHAIN_CONTRACT_ADDRESS, 
  PINATA_CONFIG 
} from '../config/web3Config';
import { parseAbi } from 'viem';

// LegiChainNFT Contract ABI
const LEGICHAIN_READ_ABI = parseAbi([
  'function getDocument(uint256 tokenId) view returns ((string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified))',
  'function getTotalDocuments() view returns (uint256)',
  'function getDocumentsByUploader(address uploader) view returns (uint256[])',
  'function getDocumentsByBarangay(string barangay) view returns (uint256[])',
]);

export interface BlockchainDocument {
  tokenId: number;
  title: string;
  ipfsHash: string;      // This is the Metadata CID
  uploadedBy: string;
  timestamp: number;
  barangay: string;
  verified: boolean;
  txHash?: string;       // Captured from metadata
  blockNumber?: string;  // Captured from metadata
}

export function isBlockchainConfigured(): boolean {
  return LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}

/**
 * Get the current registry size
 */
export async function getTotalBlockchainDocuments(): Promise<number> {
  if (!isBlockchainConfigured()) throw new Error('Blockchain not configured');

  try {
    const total = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getTotalDocuments',
    });
    return Number(total);
  } catch (error) {
    console.error('Error reading total documents:', error);
    return 0;
  }
}

/**
 * Fetch a single lean record from the blockchain
 */
export async function getBlockchainDocument(tokenId: number): Promise<BlockchainDocument | null> {
  if (!isBlockchainConfigured()) return null;

  try {
    const doc = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getDocument',
      args: [BigInt(tokenId)],
    });

    return {
      tokenId,
      title: doc.title,
      ipfsHash: doc.ipfsHash, // This is your Metadata CID (IPFS Hash)
      uploadedBy: doc.uploadedBy,
      timestamp: Number(doc.timestamp),
      barangay: doc.barangay,
      verified: doc.verified,
    };
  } catch (error) {
    console.error(`❌ Error decoding document ${tokenId}:`, error);
    return null;
  }
}

/**
 * Resolve "Fat" metadata from IPFS (Cost: $0 Gas)
 */
export async function fetchIPFSMetadata(ipfsHash: string): Promise<any> {
  if (!ipfsHash) return null;

  try {
    const hash = ipfsHash.replace('ipfs://', '');
    const response = await fetch(`${PINATA_CONFIG.gateway}${hash}`);
    if (!response.ok) throw new Error(`IPFS Gateway Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Failed to resolve IPFS metadata:', error);
    return null;
  }
}

/**
 * Merge Blockchain proof with IPFS data and explicitly map required fields
 */
export function blockchainDocToAppDoc(blockchainDoc: BlockchainDocument, metadata?: any): any {
  // Common data for both Projects and Documents
  const baseData = {
    ...metadata,
    id: blockchainDoc.tokenId.toString(),
    tokenId: blockchainDoc.tokenId,
    // REQUIRED DATA: Displayed in Explorer and Details
    txHash: metadata?.txHash || '0x...', 
    blockNumber: metadata?.blockNumber || '---', 
    metadataCID: blockchainDoc.ipfsHash, // Metadata CID (IPFS Hash)
    blockHeight: metadata?.blockNumber || '---',
    
    barangay: blockchainDoc.barangay,
    title: blockchainDoc.title,
    blockchainVerified: true,
    verificationStatus: 'Verified on Chain',
  };

  if (metadata?.type === 'Project') {
    return {
      ...baseData,
      type: 'Project',
      projectTitle: blockchainDoc.title,
    };
  }

  // Logic for Ordinance Ledger
  const date = new Date(blockchainDoc.timestamp * 1000);
  return {
    ...baseData,
    documentId: `BC-${blockchainDoc.tokenId}`,
    type: metadata?.type || 'Ordinance',
    datePublished: date.toISOString().split('T')[0],
    publishedBy: `${blockchainDoc.uploadedBy.slice(0, 6)}...${blockchainDoc.uploadedBy.slice(-4)}`,
    status: metadata?.status || 'Active',
    blockchainStatus: blockchainDoc.verified ? 'Verified' : 'Pending',
    description: metadata?.description || '',
  };
}

/**
 * "Full Throttle" Parallel Fetching Logic
 */
export async function getAllBlockchainDocumentsWithMetadata(): Promise<any[]> {
  if (!isBlockchainConfigured()) return [];

  try {
    const total = await getTotalBlockchainDocuments();
    if (total === 0) return [];
    
    // 1. Fetch all blockchain pointers in parallel
    const docPromises = Array.from({ length: total }, (_, i) => getBlockchainDocument(i + 1));
    const blockchainDocs = (await Promise.all(docPromises)).filter(Boolean) as BlockchainDocument[];

    // 2. Fetch all IPFS metadata files in parallel
    const hydratedDocs = await Promise.all(blockchainDocs.map(async (bcDoc) => {
      const metadata = await fetchIPFSMetadata(bcDoc.ipfsHash);
      return blockchainDocToAppDoc(bcDoc, metadata);
    }));

    return hydratedDocs.reverse(); // Newest records at the top
  } catch (error) {
    console.error('Error fetching live blockchain registry:', error);
    return [];
  }
}