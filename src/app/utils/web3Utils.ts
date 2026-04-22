/**
 * Web3 Utility Functions
 * Real implementation for IPFS upload and Polygon Amoy minting
 * Works with custom LegiChainNFT contract deployed via Remix IDE
 */

import { PINATA_CONFIG } from '../config/web3Config';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { wagmiConfig } from '../config/web3Config';
import { parseAbi } from 'viem';
import { Document } from './documentData';

// LegiChainNFT Contract ABI
const LEGICHAIN_ABI = parseAbi([
  'function mintDocument(string title, string metadataURI, string ipfsHash, string barangay) public returns (uint256)',
  'function verifyDocument(uint256 tokenId) public',
  'function getDocument(uint256 tokenId) public view returns (string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified)',
  'function getTotalDocuments() public view returns (uint256)',
  'function getDocumentsByUploader(address uploader) public view returns (uint256[])',
  'function getDocumentsByBarangay(string barangay) public view returns (uint256[])',
]);

/**
 * Upload images to IPFS via Pinata REST API
 * Using fetch to avoid Node.js stream issues in the browser
 */
export async function uploadImagesToIPFS(files: File[]): Promise<string> {
  if (files.length === 0) return '';

  if (!PINATA_CONFIG.apiKey || !PINATA_CONFIG.secretKey) {
    throw new Error('Pinata API keys missing in .env');
  }

  try {
    const formData = new FormData();

    // Handle single or multiple files
    if (files.length === 1) {
      formData.append('file', files[0]);
    } else {
      // For multiple files, we create a directory structure
      files.forEach((file) => {
        formData.append('file', file, `images/${file.name}`);
      });
    }

    const metadata = JSON.stringify({
      name: files.length === 1 
        ? `LegiChain-Image-${Date.now()}-${files[0].name}` 
        : `LegiChain-Images-${Date.now()}`,
    });
    formData.append('pinataMetadata', metadata);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_CONFIG.apiKey,
        pinata_secret_api_key: PINATA_CONFIG.secretKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IPFS Upload Failed: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Images pinned to IPFS:', result.IpfsHash);
    return result.IpfsHash;

  } catch (error) {
    console.error('❌ IPFS image upload failed:', error);
    throw error;
  }
}

/**
 * Upload complete document data to IPFS as JSON
 */
export async function uploadDocumentDataToIPFS(
  documentData: Partial<Document>,
  tags: string[],
  imagesHash: string
): Promise<string> {
  if (!PINATA_CONFIG.apiKey || !PINATA_CONFIG.secretKey) {
    throw new Error('Pinata API keys not configured');
  }

  const metadata = {
    title: documentData.title || '',
    type: documentData.type || 'Ordinance',
    barangay: documentData.barangay || '',
    description: documentData.description || '',
    documentId: documentData.documentId || '',
    ordinanceNumber: documentData.ordinanceNumber || '',
    datePublished: documentData.datePublished || '',
    effectivityDate: documentData.effectivityDate || '',
    status: documentData.status || 'Active',
    publishedBy: documentData.publishedBy || '',
    tags: tags,
    images: imagesHash ? `ipfs://${imagesHash}` : '',
    imagesHash: imagesHash,
    uploadTimestamp: Date.now(),
    version: '1.0',
    attributes: [
      { trait_type: 'Document Type', value: documentData.type || 'Ordinance' },
      { trait_type: 'Barangay', value: documentData.barangay || '' },
      { trait_type: 'Status', value: documentData.status || 'Active' },
      ...tags.map(tag => ({ trait_type: 'Category', value: tag })),
    ],
  };

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_CONFIG.apiKey,
        pinata_secret_api_key: PINATA_CONFIG.secretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `LegiChain-Doc-${documentData.documentId || Date.now()}`,
        }
      }),
    });

    if (!response.ok) throw new Error('Failed to pin JSON to IPFS');

    const result = await response.json();
    console.log('✅ Document JSON pinned:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ Document JSON upload failed:', error);
    throw error;
  }
}

/**
 * Mint NFT on Polygon Amoy
 */
export async function mintNFTOnPolygon(
  title: string,
  metadataUri: string,
  barangay: string,
  contractAddress: `0x${string}`
): Promise<string> {
  if (!contractAddress || contractAddress.length < 42) {
    throw new Error('Invalid or missing Contract Address');
  }

  try {
    const hash = await writeContract(wagmiConfig as any, {
      address: contractAddress,
      abi: LEGICHAIN_ABI,
      functionName: 'mintDocument',
      args: [title, `ipfs://${metadataUri}`, metadataUri, barangay],
    });

    const receipt = await waitForTransactionReceipt(wagmiConfig as any, { hash });
    console.log('✅ NFT Minted:', receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error('❌ Minting failed:', error);
    throw error;
  }
}

/**
 * Complete Web3 upload flow
 */
export async function completeWeb3Upload(
  documentData: Partial<Document>,
  tags: string[],
  imageFiles: File[],
  contractAddress: `0x${string}`,
  onProgress: (step: 'ipfs' | 'metadata' | 'minting') => void
): Promise<{ imagesHash: string; documentHash: string; txHash: string }> {
  
  onProgress('ipfs');
  const imagesHash = await uploadImagesToIPFS(imageFiles);

  onProgress('metadata');
  const documentHash = await uploadDocumentDataToIPFS(documentData, tags, imagesHash);

  onProgress('minting');
  const txHash = await mintNFTOnPolygon(
    documentData.title || 'Untitled Document',
    documentHash,
    documentData.barangay || '',
    contractAddress
  );

  return { imagesHash, documentHash, txHash };
}

export function getIPFSUrl(hash: string): string {
  if (!hash) return '';
  const cleanHash = hash.replace('ipfs://', '');
  return `${PINATA_CONFIG.gateway}${cleanHash}`;
}