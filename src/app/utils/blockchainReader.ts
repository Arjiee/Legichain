/**
 * Blockchain Data Reader
 * Fetches document data from Polygon Amoy blockchain
 */

import { readContract } from 'wagmi/actions';
import { wagmiConfig, LEGICHAIN_CONTRACT_ADDRESS } from '../config/web3Config';
import { parseAbi } from 'viem';
import { Document } from './documentData';

// LegiChainNFT Contract ABI for reading
const LEGICHAIN_READ_ABI = parseAbi([
  'function getDocument(uint256 tokenId) public view returns (tuple(string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified))',
  'function getTotalDocuments() public view returns (uint256)',
  'function getDocumentsByUploader(address uploader) public view returns (uint256[])',
  'function getDocumentsByBarangay(string barangay) public view returns (uint256[])',
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

/**
 * Check if blockchain is configured
 */
export function isBlockchainConfigured(): boolean {
  return LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}

/**
 * Get total number of documents on blockchain
 */
export async function getTotalBlockchainDocuments(): Promise<number> {
  if (!isBlockchainConfigured()) {
    throw new Error('Blockchain not configured');
  }

  try {
    const total = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getTotalDocuments',
    });

    return Number(total);
  } catch (error) {
    console.error('Error reading total documents from blockchain:', error);
    return 0;
  }
}

/**
 * Get document from blockchain by token ID
 */
export async function getBlockchainDocument(tokenId: number): Promise<BlockchainDocument | null> {
  if (!isBlockchainConfigured()) {
    return null;
  }

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
    console.error(`Error reading document ${tokenId} from blockchain:`, error);
    return null;
  }
}

/**
 * Get all documents from blockchain
 */
export async function getAllBlockchainDocuments(): Promise<BlockchainDocument[]> {
  if (!isBlockchainConfigured()) {
    return [];
  }

  try {
    const total = await getTotalBlockchainDocuments();
    const documents: BlockchainDocument[] = [];

    // Fetch all documents (token IDs start from 1)
    for (let i = 1; i <= total; i++) {
      const doc = await getBlockchainDocument(i);
      if (doc) {
        documents.push(doc);
      }
    }

    return documents;
  } catch (error) {
    console.error('Error fetching all blockchain documents:', error);
    return [];
  }
}

/**
 * Get documents by barangay from blockchain
 */
export async function getBlockchainDocumentsByBarangay(barangay: string): Promise<BlockchainDocument[]> {
  if (!isBlockchainConfigured()) {
    return [];
  }

  try {
    const tokenIds = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getDocumentsByBarangay',
      args: [barangay],
    });

    const documents: BlockchainDocument[] = [];

    for (const tokenId of tokenIds) {
      const doc = await getBlockchainDocument(Number(tokenId));
      if (doc) {
        documents.push(doc);
      }
    }

    return documents;
  } catch (error) {
    console.error(`Error fetching documents for barangay ${barangay}:`, error);
    return [];
  }
}

/**
 * Get documents by uploader address from blockchain
 */
export async function getBlockchainDocumentsByUploader(uploaderAddress: string): Promise<BlockchainDocument[]> {
  if (!isBlockchainConfigured()) {
    return [];
  }

  try {
    const tokenIds = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getDocumentsByUploader',
      args: [uploaderAddress as `0x${string}`],
    });

    const documents: BlockchainDocument[] = [];

    for (const tokenId of tokenIds) {
      const doc = await getBlockchainDocument(Number(tokenId));
      if (doc) {
        documents.push(doc);
      }
    }

    return documents;
  } catch (error) {
    console.error(`Error fetching documents for uploader ${uploaderAddress}:`, error);
    return [];
  }
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchIPFSMetadata(ipfsHash: string): Promise<any> {
  if (!ipfsHash) return null;

  try {
    // Remove ipfs:// prefix if present
    const hash = ipfsHash.replace('ipfs://', '');

    // Use public IPFS gateway
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch IPFS metadata: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching IPFS metadata:', error);
    return null;
  }
}

/**
 * Convert blockchain document to app Document format
 */
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
 * Get all documents with metadata from blockchain
 */
export async function getAllBlockchainDocumentsWithMetadata(): Promise<Document[]> {
  if (!isBlockchainConfigured()) {
    return [];
  }

  try {
    const blockchainDocs = await getAllBlockchainDocuments();
    const documents: Document[] = [];

    for (const bcDoc of blockchainDocs) {
      // Fetch metadata from IPFS
      const metadata = await fetchIPFSMetadata(bcDoc.ipfsHash);

      // Convert to app document format
      const appDoc = blockchainDocToAppDoc(bcDoc, metadata);
      documents.push(appDoc);
    }

    return documents;
  } catch (error) {
    console.error('Error fetching blockchain documents with metadata:', error);
    return [];
  }
}
