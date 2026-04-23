import { readContract } from 'wagmi/actions';
import { wagmiConfig, LEGICHAIN_CONTRACT_ADDRESS, PINATA_CONFIG } from '../config/web3Config';
import { parseAbi } from 'viem';

/**
 * ABI SYNCHRONIZATION:
 * Matches the 'struct Document' in LegiChainNFT.sol exactly:
 * 1. title, 2. ipfsHash, 3. uploadedBy, 4. timestamp, 5. barangay, 6. verified
 * The double parentheses indicate a Struct (Tuple) return.
 */
const LEGICHAIN_READ_ABI = parseAbi([
  'function getDocument(uint256 tokenId) view returns ((string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified))',
  'function getTotalDocuments() view returns (uint256)',
]);

export interface BlockchainDocument {
  tokenId: number;
  title: string;
  ipfsHash: string;
  uploadedBy: string;
  timestamp: bigint;
  barangay: string;
  verified: boolean;
}

export function isBlockchainConfigured(): boolean {
  return LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
}

export async function getTotalBlockchainDocuments(): Promise<number> {
  if (!isBlockchainConfigured()) return 0;
  try {
    const total = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getTotalDocuments',
    });
    return Number(total);
  } catch (error) {
    return 0;
  }
}

/**
 * Fetches data for a specific Token ID and maps it to the BlockchainDocument interface
 */
export async function getBlockchainDocument(tokenId: number): Promise<BlockchainDocument | null> {
  if (!isBlockchainConfigured()) return null;
  try {
    const result = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getDocument',
      args: [BigInt(tokenId)],
    }) as any;

    return {
      tokenId,
      title: result.title || result[0],
      ipfsHash: result.ipfsHash || result[1],
      uploadedBy: result.uploadedBy || result[2],
      timestamp: BigInt(result.timestamp || result[3]),
      barangay: result.barangay || result[4],
      verified: result.verified || result[5],
    };
  } catch (error) {
    console.error(`❌ Blockchain ID ${tokenId} Sync Error:`, error);
    return null;
  }
}

/**
 * Fetches JSON metadata from IPFS via the Pinata Gateway
 */
export async function fetchIPFSMetadata(ipfsHash: string): Promise<any> {
  if (!ipfsHash) return null;
  try {
    const hash = ipfsHash.replace('ipfs://', '');
    const response = await fetch(`${PINATA_CONFIG.gateway}${hash}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

export function blockchainDocToAppDoc(blockchainDoc: BlockchainDocument, metadata?: any): any {
  // 1. Identify the CID
  const cid = blockchainDoc.ipfsHash || metadata?.documentHash || metadata?.metadataCID;

  // 2. Resolve Image (supports all aliases found in your logs)
  const img = metadata?.images || metadata?.documentImage || metadata?.image || metadata?.file || metadata?.documentHash;

  return {
    ...metadata,
    // Use numeric fallbacks for ID to support "Latest on Top" sorting
    id: metadata?.id || blockchainDoc.tokenId.toString(),
    documentId: metadata?.documentId || `LEG-${blockchainDoc.tokenId}`,
    tokenId: blockchainDoc.tokenId,
    
    // Property Aliasing
    images: img,
    documentImage: img,
    
    // 3. TRANSACTION HASH
    // We leave this as is from metadata; if the reader can't find it, 
    // it returns undefined/null so the merge doesn't overwrite Supabase.
    txHash: metadata?.txHash || (blockchainDoc as any).txHash,
    
    // 4. STATUS FORCING
    blockchainVerified: true,
    blockchainStatus: 'Verified', 
    verificationStatus: 'Verified on Chain',
    
    metadataCID: cid, 
    barangay: blockchainDoc.barangay,
    title: blockchainDoc.title,
    datePublished: metadata?.datePublished || new Date(Number(blockchainDoc.timestamp) * 1000).toLocaleDateString(),
    type: metadata?.type || 'Ordinance'
  };
}

/**
 * Orchestrator: Fetches all blockchain records and hydrates them with metadata
 */
export async function getAllBlockchainDocumentsWithMetadata(): Promise<any[]> {
  if (!isBlockchainConfigured()) return [];
  try {
    const total = await getTotalBlockchainDocuments();
    if (total === 0) return [];

    // Fetch all records in parallel
    const docPromises = Array.from({ length: total }, (_, i) => getBlockchainDocument(i + 1));
    const blockchainDocs = (await Promise.all(docPromises)).filter(Boolean) as BlockchainDocument[];

    const documents: any[] = [];
    for (const bcDoc of blockchainDocs) {
      try {
        const metadata = await fetchIPFSMetadata(bcDoc.ipfsHash);
        documents.push(blockchainDocToAppDoc(bcDoc, metadata));
      } catch (err) {
        // Push the record even if IPFS is slow or fails
        documents.push(blockchainDocToAppDoc(bcDoc, null));
      }
    }
    
    // Sort by Token ID descending (Latest on Top) for initial state
    return documents.sort((a, b) => b.tokenId - a.tokenId);
  } catch (error) {
    console.error("Critical Sync Failure:", error);
    return [];
  }
}