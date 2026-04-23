import { readContract } from 'wagmi/actions';
import { wagmiConfig, LEGICHAIN_CONTRACT_ADDRESS, PINATA_CONFIG } from '../config/web3Config';
import { parseAbi } from 'viem';
import { Document } from './documentData';

const LEGICHAIN_READ_ABI = parseAbi([
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
    }) as any;

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

/**
 * Maps blockchain data to application-friendly format
 * CRITICAL: Ensures IDs match Supabase format for deduplication
 */
export function blockchainDocToAppDoc(blockchainDoc: BlockchainDocument, metadata?: any): any {
  // Use the database ID stored in metadata, or fallback to tokenId
  const unifiedId = metadata?.id || metadata?.documentId || blockchainDoc.tokenId.toString();

  return {
    ...metadata,
    id: unifiedId,
    documentId: metadata?.documentId || unifiedId,
    projectId: metadata?.projectId || null,
    
    // Cryptographic Proofs
    txHash: metadata?.txHash || '0x...',
    blockNumber: metadata?.blockNumber || '---',
    metadataCID: blockchainDoc.ipfsHash,
    
    // Source of Truth Data
    barangay: blockchainDoc.barangay,
    title: blockchainDoc.title,
    blockchainVerified: true,
    verificationStatus: 'Verified on Chain',
    
    // Record Classification
    type: metadata?.type || 'Ordinance',
    actionRecorded: 'Minted'
  };
}

export async function getAllBlockchainDocumentsWithMetadata(): Promise<any[]> {
  if (!isBlockchainConfigured()) return [];
  try {
    const total = await getTotalBlockchainDocuments();
    // Parallel fetching for performance
    const docPromises = Array.from({ length: total }, (_, i) => getBlockchainDocument(i + 1));
    const blockchainDocs = (await Promise.all(docPromises)).filter(Boolean) as BlockchainDocument[];

    const documents: any[] = [];
    for (const bcDoc of blockchainDocs) {
      const metadata = await fetchIPFSMetadata(bcDoc.ipfsHash);
      documents.push(blockchainDocToAppDoc(bcDoc, metadata));
    }
    return documents.reverse(); // Newest first
  } catch (error) {
    console.error('Error fetching registry:', error);
    return [];
  }
}