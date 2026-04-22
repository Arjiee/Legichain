/**
 * Web3 Configuration for LegiChain
 * Polygon Amoy Testnet + IPFS Storage via Pinata
 *
 * SETUP INSTRUCTIONS:
 * 1. Deploy LegiChainNFT.sol via Remix IDE (see REMIX_DEPLOYMENT_GUIDE.md)
 * 2. Get Pinata API Keys: https://app.pinata.cloud/developers/api-keys
 * 3. Get WalletConnect Project ID: https://cloud.walletconnect.com
 * 4. Get Polygon Amoy POL: https://faucet.polygon.technology/
 * 5. Add environment variables to .env:
 *    VITE_CONTRACT_ADDRESS=0x... (from Remix deployment)
 *    VITE_PINATA_API_KEY=your_api_key
 *    VITE_PINATA_SECRET_KEY=your_secret_key
 *    VITE_WALLETCONNECT_PROJECT_ID=your_project_id
 */

import { http, createConfig } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Polygon Amoy Testnet Configuration
export const POLYGON_AMOY_CHAIN = polygonAmoy;

// RainbowKit + Wagmi Configuration
export const wagmiConfig = getDefaultConfig({
  appName: 'LegiChain - Barangay Project Monitoring',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'dd3c8c1c9df5c51e920d56d9fde6f2cd', // Default fallback project ID
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(import.meta.env.VITE_POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology'),
  },
  ssr: false,
});

// Smart Contract Address (Deployed via Remix IDE)
export const LEGICHAIN_CONTRACT_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x0000000000000000000000000000000000000000' as `0x${string}`;

// Pinata Configuration for IPFS Storage
export const PINATA_CONFIG = {
  apiKey: import.meta.env.VITE_PINATA_API_KEY || '',
  secretKey: import.meta.env.VITE_PINATA_SECRET_KEY || '',
  gateway: 'https://gateway.pinata.cloud/ipfs/',
};

// Metadata Standard for OpenSea Compatibility (ERC-721)
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI format: ipfs://QmHash...
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

/**
 * Create OpenSea-compatible NFT metadata
 */
export const createNFTMetadata = (
  title: string,
  tags: string[],
  ipfsHash: string,
  fileCount: number
): NFTMetadata => ({
  name: title,
  description: `LegiChain Barangay Document - ${fileCount} file(s) uploaded to IPFS`,
  image: `ipfs://${ipfsHash}`,
  external_url: `${PINATA_CONFIG.gateway}${ipfsHash}`,
  attributes: [
    ...tags.map(tag => ({
      trait_type: 'Category',
      value: tag,
    })),
    {
      trait_type: 'File Count',
      value: fileCount.toString(),
    },
    {
      trait_type: 'Upload Date',
      value: new Date().toISOString().split('T')[0],
    },
  ],
});

/**
 * Validate environment configuration
 */
export const validateWeb3Config = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!PINATA_CONFIG.apiKey) {
    errors.push('VITE_PINATA_API_KEY not set in .env');
  }
  if (!PINATA_CONFIG.secretKey) {
    errors.push('VITE_PINATA_SECRET_KEY not set in .env');
  }
  if (!wagmiConfig.chains[0]) {
    errors.push('Wagmi chain configuration invalid');
  }
  if (LEGICHAIN_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    errors.push('VITE_CONTRACT_ADDRESS not set - deploy contract via Remix first');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
