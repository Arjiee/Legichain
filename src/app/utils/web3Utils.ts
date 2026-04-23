/**
 * Web3 Utility Functions
 * Optimized for Gas Efficiency: Fat data stays on IPFS, Lean pointers go to Blockchain.
 * Enhanced to capture Confirmation Blocks and override Amoy Gas Floors.
 */

import { PINATA_CONFIG, wagmiConfig } from '../config/web3Config';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { parseAbi, parseGwei } from 'viem'; // Added parseGwei for gas fixes
import { Document } from './documentData';
import { BarangayProject } from './projectData';

// LegiChainNFT Contract ABI
const LEGICHAIN_ABI = parseAbi([
  'function mintDocument(string title, string metadataURI, string ipfsHash, string barangay) public returns (uint256)',
  'function verifyDocument(uint256 tokenId) public',
  'function getDocument(uint256 tokenId) public view returns (string title, string ipfsHash, address uploadedBy, uint256 timestamp, string barangay, bool verified)',
]);

/**
 * Upload images/files to IPFS - Costs $0 Gas
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
      name: `LegiChain-Asset-${Date.now()}`,
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

    if (!response.ok) throw new Error('IPFS Asset Upload Failed');
    const result = await response.json();
    return result.IpfsHash; 
  } catch (error) {
    console.error('❌ IPFS upload failed:', error);
    throw error;
  }
}

/**
 * Upload Fat Metadata to IPFS - Costs $0 Gas
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

  if (!response.ok) throw new Error('Failed to pin Metadata to IPFS');
  const result = await response.json();
  return result.IpfsHash; 
}

/**
 * Mint NFT on Polygon Amoy - GAS OPTIMIZED & DATA RICH
 * Returns both txHash and blockNumber for the Explorer
 */
export async function mintNFTOnPolygon(
  title: string,
  metadataUri: string, 
  barangay: string,
  contractAddress: `0x${string}`
): Promise<{ txHash: string; blockNumber: string }> {
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Contract address not configured');
  }

  // To minimize gas, we pass only lean pointers.
  // We explicitly set gas prices to meet Polygon Amoy's 25 Gwei floor.
  const hash = await writeContract(wagmiConfig as any, {
    address: contractAddress,
    abi: LEGICHAIN_ABI,
    functionName: 'mintDocument',
    args: [
      title.substring(0, 32), 
      `ipfs://${metadataUri}`, 
      metadataUri, 
      barangay
    ],
    // FIXED: Explicit gas overrides for Amoy Testnet
    maxPriorityFeePerGas: parseGwei('30'), 
    maxFeePerGas: parseGwei('35'),
  });

  // Capture the receipt to get the confirmation block
  const receipt = await waitForTransactionReceipt(wagmiConfig as any, { hash });
  
  return { 
    txHash: receipt.transactionHash, 
    blockNumber: receipt.blockNumber.toString() 
  };
}

/**
 * Optimized Document Upload Flow
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
      pinataMetadata: { name: `Doc-${documentData.documentId}` }
    }),
  });

  const result = await response.json();
  return result.IpfsHash;
}

/**
 * Orchestrates the full flow: Asset -> Metadata -> Blockchain
 */
export async function completeWeb3Upload(
  documentData: Partial<Document>,
  tags: string[],
  imageFiles: File[],
  contractAddress: `0x${string}`,
  onProgress: (step: 'ipfs' | 'metadata' | 'minting') => void
): Promise<{ imagesHash: string; documentHash: string; txHash: string; blockNumber: string }> {
  
  onProgress('ipfs');
  const imagesHash = await uploadImagesToIPFS(imageFiles);

  onProgress('metadata');
  const documentHash = await uploadDocumentDataToIPFS(documentData, tags, imagesHash);

  onProgress('minting');
  const { txHash, blockNumber } = await mintNFTOnPolygon(
    documentData.title || 'Untitled',
    documentHash,
    documentData.barangay || '',
    contractAddress
  );

  return { imagesHash, documentHash, txHash, blockNumber };
}

export function getIPFSUrl(hash: string): string {
  if (!hash) return '';
  return `${PINATA_CONFIG.gateway}${hash.replace('ipfs://', '')}`;
}