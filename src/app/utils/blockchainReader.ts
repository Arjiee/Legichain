import { readContract } from 'wagmi/actions';
import { wagmiConfig, LEGICHAIN_CONTRACT_ADDRESS, PINATA_CONFIG } from '../config/web3Config';
import { parseAbi } from 'viem';

/**
 * ABI SYNCHRONIZATION:
 * Must match the 'struct Document' in your Solidity file exactly.
 * The double parentheses signify a Struct (Tuple) return.
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

export async function getBlockchainDocument(tokenId: number): Promise<BlockchainDocument | null> {
  if (!isBlockchainConfigured()) return null;
  try {
    // result will be the Struct/Tuple from Solidity
    const result = await readContract(wagmiConfig as any, {
      address: LEGICHAIN_CONTRACT_ADDRESS,
      abi: LEGICHAIN_READ_ABI,
      functionName: 'getDocument',
      args: [BigInt(tokenId)],
    }) as any;

    // Mapping based on your Solidity Struct order
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
  // 1. Identify the CID (This is the "Content CID")
  const cid = blockchainDoc.ipfsHash || metadata?.documentHash;

  return {
    ...metadata, // This pulls txHash and documentImage from your Supabase/JSON data
    id: metadata?.id || `LEG-${blockchainDoc.tokenId}`,
    documentId: metadata?.documentId || `LEG-${blockchainDoc.tokenId}`,
    
    // 2. IMAGE RESOLUTION
    // Try every possible key where the Image CID might be hiding
    documentImage: metadata?.documentImage || metadata?.image || metadata?.file || metadata?.documentHash,
    
    // 3. TRANSACTION HASH
    // Pull from metadata (Supabase) because it's not in the 'struct Document'
    txHash: metadata?.txHash || (blockchainDoc as any).txHash || '0x...',
    
    // 4. BLOCKCHAIN PROOF
    metadataCID: cid, 
    barangay: blockchainDoc.barangay,
    title: blockchainDoc.title,
    blockchainVerified: true,
    verificationStatus: 'Verified on Chain',
    datePublished: metadata?.datePublished || new Date(Number(blockchainDoc.timestamp) * 1000).toLocaleDateString(),
  };
}

export async function getAllBlockchainDocumentsWithMetadata(): Promise<any[]> {
  if (!isBlockchainConfigured()) return [];
  try {
    const total = await getTotalBlockchainDocuments();
    if (total === 0) return [];

    const docPromises = Array.from({ length: total }, (_, i) => getBlockchainDocument(i + 1));
    const blockchainDocs = (await Promise.all(docPromises)).filter(Boolean) as BlockchainDocument[];

    const documents: any[] = [];
    for (const bcDoc of blockchainDocs) {
      try {
        const metadata = await fetchIPFSMetadata(bcDoc.ipfsHash);
        documents.push(blockchainDocToAppDoc(bcDoc, metadata));
      } catch (err) {
        documents.push(blockchainDocToAppDoc(bcDoc, null));
      }
    }
    
    // Newest Token ID first
    return documents.sort((a, b) => b.tokenId - a.tokenId);
  } catch (error) {
    console.error("Critical Sync Failure:", error);
    return [];
  }
}