/**
 * Web3 Utility Functions
 * Real implementation for IPFS upload and Polygon Amoy minting
 */

import { PINATA_CONFIG, wagmiConfig } from '../config/web3Config';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { parseAbi } from 'viem';
import { Document } from './documentData';
import { BarangayProject } from './projectData';

// LegiChainNFT Contract ABI
const LEGICHAIN_ABI = parseAbi([
  'function mintDocument(string title, string metadataURI, string ipfsHash, string barangay) public returns (uint256)',
  'function verifyDocument(uint256 tokenId) public',
  'function getDocument(uint256 tokenId) public view returns (string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified)',
]);

/**
 * Upload images to IPFS via Pinata REST API
 */
export async function uploadImagesToIPFS(files: File[]): Promise<string> {
  if (files.length === 0) return '';
  if (!PINATA_CONFIG.apiKey || !PINATA_CONFIG.secretKey) {
    throw new Error('Pinata API keys missing in .env');
  }

  try {
    const formData = new FormData();
    if (files.length === 1) {
      formData.append('file', files[0]);
    } else {
      files.forEach((file) => {
        formData.append('file', file, `images/${file.name}`);
      });
    }

    const metadata = JSON.stringify({
      name: `LegiChain-Upload-${Date.now()}`,
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

    if (!response.ok) throw new Error('IPFS Image Upload Failed');
    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('❌ IPFS image upload failed:', error);
    throw error;
  }
}

/**
 * Upload standard document data (Ordinances/Resolutions) to IPFS
 */
export async function uploadDocumentDataToIPFS(
  documentData: Partial<Document>,
  tags: string[],
  imagesHash: string
): Promise<string> {
  const metadata = {
    ...documentData,
    type: documentData.type || 'Ordinance',
    tags,
    images: imagesHash ? `ipfs://${imagesHash}` : '',
    uploadTimestamp: Date.now(),
    version: '1.0'
  };

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_CONFIG.apiKey,
      pinata_secret_api_key: PINATA_CONFIG.secretKey,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: `Doc-${documentData.documentId || Date.now()}` }
    }),
  });

  if (!response.ok) throw new Error('Failed to pin Document JSON to IPFS');
  const result = await response.json();
  return result.IpfsHash;
}

/**
 * Upload Barangay Project metadata to IPFS
 */
export async function uploadProjectToIPFS(
  project: BarangayProject,
  imagesHash: string = ''
): Promise<string> {
  const metadata = {
    ...project,
    type: 'Project',
    images: imagesHash ? `ipfs://${imagesHash}` : '',
    uploadTimestamp: Date.now(),
  };

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: PINATA_CONFIG.apiKey,
      pinata_secret_api_key: PINATA_CONFIG.secretKey,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: { name: `Project-${project.projectId}` }
    }),
  });

  if (!response.ok) throw new Error('Failed to pin Project JSON to IPFS');
  const result = await response.json();
  return result.IpfsHash;
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
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Contract address not configured');
  }

  const hash = await writeContract(wagmiConfig as any, {
    address: contractAddress,
    abi: LEGICHAIN_ABI,
    functionName: 'mintDocument',
    args: [title, `ipfs://${metadataUri}`, metadataUri, barangay],
  });

  const receipt = await waitForTransactionReceipt(wagmiConfig as any, { hash });
  return receipt.transactionHash;
}

/**
 * Complete Web3 upload flow - RESTORED
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
    documentData.title || 'Untitled',
    documentHash,
    documentData.barangay || '',
    contractAddress
  );

  return { imagesHash, documentHash, txHash };
}

export function getIPFSUrl(hash: string): string {
  if (!hash) return '';
  return `https://gateway.pinata.cloud/ipfs/${hash.replace('ipfs://', '')}`;
}