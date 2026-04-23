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
import { Document } from './documentData';

// LegiChainNFT Contract ABI
// Fixed Tuple syntax to match the Document struct in LegiChainNFT.sol
const LEGICHAIN_READ_ABI = parseAbi([
  'function getDocument(uint256 tokenId) view returns ((string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified))',
  'function getTotalDocuments() view returns (uint256)',
  'function getDocumentsByUploader(address uploader) view returns (uint256[])',
  'function getDocumentsByBarangay(string barangay) view returns (uint256[])',
]);

export interface BlockchainDocument {
  tokenId: number;
  title: string;
  ipfsHash: string;
  uploadedBy: string;
  timestamp: number;
  barangay: string;
  verified: boolean;
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
      ipfsHash: doc.ipfsHash,
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
    // Using the Pinata gateway configured in web3Config
    const response = await fetch(`${PINATA_CONFIG.gateway}${hash}`);
    if (!response.ok) throw new Error(`IPFS Gateway Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Failed to resolve IPFS metadata:', error);
    return null;
  }
}

/**
 * Merge Blockchain proof with IPFS data
 */
export function blockchainDocToAppDoc(blockchainDoc: BlockchainDocument, metadata?: any): any {
  // Logic for Project Monitoring Dashboard
  if (metadata?.type === 'Project') {
    return {
      ...metadata,
      id: blockchainDoc.tokenId.toString(),
      blockchainVerified: true,
      verificationStatus: 'Verified on Chain',
      txHash: metadata.txHash || '',
      barangay: blockchainDoc.barangay, // Chain is source of truth for barangay
      title: blockchainDoc.title       // Chain is source of truth for title
    };
  }

  // Logic for Ordinance Ledger
  const date = new Date(blockchainDoc.timestamp * 1000);
  return {
    id: blockchainDoc.tokenId.toString(),
    documentId: `BC-${blockchainDoc.tokenId}`,
    type: metadata?.type || 'Ordinance',
    title: blockchainDoc.title,
    barangay: blockchainDoc.barangay,
    datePublished: date.toISOString().split('T')[0],
    publishedBy: `${blockchainDoc.uploadedBy.slice(0, 6)}...${blockchainDoc.uploadedBy.slice(-4)}`,
    status: metadata?.status || 'Active',
    blockchainStatus: blockchainDoc.verified ? 'Verified' : 'Pending',
    description: metadata?.description || '',
    ordinanceNumber: metadata?.ordinanceNumber || '',
    effectivityDate: metadata?.effectivityDate || '',
  };
}

/**
 * "Full Throttle" Parallel Fetching Logic
 * Fetches all pointers from Blockchain AND all metadata from IPFS in parallel.
 */
export async function getAllBlockchainDocumentsWithMetadata(): Promise<any[]> {
  if (!isBlockchainConfigured()) return [];

  try {
    const total = await getTotalBlockchainDocuments();
    if (total === 0) return [];
    
    // 1. Fetch all blockchain pointers in parallel
    const docPromises = Array.from({ length: total }, (_, i) => getBlockchainDocument(i + 1));
    const blockchainDocs = (await Promise.all(docPromises)).filter(Boolean) as BlockchainDocument[];

    // 2. Fetch all IPFS metadata files in parallel (Maximum speed)
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