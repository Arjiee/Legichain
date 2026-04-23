/**
 * Blockchain Data Reader - FIXED
 * Fetches document data from Polygon Amoy blockchain + IPFS Metadata
 */

import { readContract } from 'wagmi/actions';
import { 
  wagmiConfig, 
  LEGICHAIN_CONTRACT_ADDRESS, 
  PINATA_CONFIG 
} from '../config/web3Config';
import { parseAbi } from 'viem';
import { Document } from './documentData';

// LegiChainNFT Contract ABI for reading
const LEGICHAIN_READ_ABI = parseAbi([
  // 1. Remove 'tuple' from returns
  // 2. Remove 'public' visibility (only 'view' is needed)
  'function getDocument(uint256 tokenId) view returns (string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified)',
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
  metadataUri?: string;
}

export function isBlockchainConfigured(): boolean {
  return LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}

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
      title: doc[0],
      ipfsHash: doc[1],
      uploadedBy: doc[2],
      timestamp: Number(doc[3]),
      barangay: doc[4],
      verified: doc[5],
    };
  } catch (error) {
    console.error(`Error reading document ${tokenId}:`, error);
    return null;
  }
}

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

export function blockchainDocToAppDoc(blockchainDoc: BlockchainDocument, metadata?: any): Document {
  const date = new Date(blockchainDoc.timestamp * 1000);
  return {
    id: blockchainDoc.tokenId.toString(),
    documentId: `BC-${blockchainDoc.tokenId}`,
    type: metadata?.type || 'Ordinance',
    title: blockchainDoc.title,
    barangay: blockchainDoc.barangay,
    datePublished: date.toISOString().split('T')[0],
    publishedBy: metadata?.publishedBy || `${blockchainDoc.uploadedBy.slice(0, 6)}...${blockchainDoc.uploadedBy.slice(-4)}`,
    status: metadata?.status || 'Active',
    blockchainStatus: blockchainDoc.verified ? 'Verified' : 'Pending',
    violationCount: 0,
    description: metadata?.description || '',
    ordinanceNumber: metadata?.ordinanceNumber || '',
    effectivityDate: metadata?.effectivityDate || '',
  };
}

/**
 * Unified Full-Throttle Fetcher
 */
export async function getAllBlockchainDocumentsWithMetadata(): Promise<Document[]> {
  if (!isBlockchainConfigured()) return [];

  try {
    const total = await getTotalBlockchainDocuments();
    
    // Fetch all structures in parallel
    const docPromises = Array.from({ length: total }, (_, i) => getBlockchainDocument(i + 1));
    const blockchainDocs = (await Promise.all(docPromises)).filter(Boolean) as BlockchainDocument[];

    const documents: Document[] = [];
    for (const bcDoc of blockchainDocs) {
      const metadata = await fetchIPFSMetadata(bcDoc.ipfsHash);
      documents.push(blockchainDocToAppDoc(bcDoc, metadata));
    }

    return documents.reverse(); // Newest first
  } catch (error) {
    console.error('Error fetching live blockchain registry:', error);
    return [];
  }
}
