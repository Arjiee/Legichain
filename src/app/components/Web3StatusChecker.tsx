import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { LEGICHAIN_CONTRACT_ADDRESS, PINATA_CONFIG, validateWeb3Config } from '../config/web3Config';
import { polygonAmoy } from 'wagmi/chains';

export function Web3StatusChecker() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const config = validateWeb3Config();

  const StatusItem = ({
    label,
    status,
    message
  }: {
    label: string;
    status: 'success' | 'warning' | 'error';
    message: string;
  }) => {
    const Icon = status === 'success' ? CheckCircle2 : status === 'warning' ? AlertCircle : XCircle;
    const bgColor = status === 'success' ? 'bg-green-50' : status === 'warning' ? 'bg-amber-50' : 'bg-red-50';
    const textColor = status === 'success' ? 'text-green-700' : status === 'warning' ? 'text-amber-700' : 'text-red-700';
    const iconColor = status === 'success' ? 'text-green-600' : status === 'warning' ? 'text-amber-600' : 'text-red-600';

    return (
      <div className={`p-3 rounded-xl ${bgColor} flex items-start gap-3`}>
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div>
          <p className={`text-sm font-bold ${textColor}`}>{label}</p>
          <p className={`text-xs ${textColor} opacity-80`}>{message}</p>
        </div>
      </div>
    );
  };

  const contractConfigured = LEGICHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
  const pinataConfigured = !!PINATA_CONFIG.apiKey && !!PINATA_CONFIG.secretKey;
  const correctNetwork = chainId === polygonAmoy.id;
  const blockchainMode = contractConfigured && pinataConfigured && isConnected;

  return (
    <div className="p-6 bg-white rounded-2xl border-2 border-[#088395] space-y-4">
      <div>
        <h3 className="text-lg font-black text-[#1C1C1C] mb-1">Web3 Configuration Status</h3>
        <p className="text-xs text-gray-600">Current blockchain integration setup</p>
      </div>

      <div className="space-y-2">
        {/* Smart Contract */}
        <StatusItem
          label="Smart Contract"
          status={contractConfigured ? 'success' : 'warning'}
          message={
            contractConfigured
              ? `Deployed at ${LEGICHAIN_CONTRACT_ADDRESS.slice(0, 10)}...${LEGICHAIN_CONTRACT_ADDRESS.slice(-8)}`
              : 'Not deployed - using simulated mode. Deploy via Remix IDE to enable blockchain.'
          }
        />

        {/* Pinata IPFS */}
        <StatusItem
          label="IPFS Storage (Pinata)"
          status={pinataConfigured ? 'success' : 'warning'}
          message={
            pinataConfigured
              ? 'API keys configured - ready for IPFS uploads'
              : 'API keys not set - add VITE_PINATA_API_KEY and VITE_PINATA_SECRET_KEY to .env'
          }
        />

        {/* Wallet Connection */}
        <StatusItem
          label="Wallet Connection"
          status={isConnected ? 'success' : 'warning'}
          message={
            isConnected
              ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
              : 'Wallet not connected - click "Connect Wallet" to enable blockchain uploads'
          }
        />

        {/* Network */}
        {isConnected && (
          <StatusItem
            label="Network"
            status={correctNetwork ? 'success' : 'error'}
            message={
              correctNetwork
                ? 'Connected to Polygon Amoy Testnet'
                : 'Wrong network - please switch to Polygon Amoy in your wallet'
            }
          />
        )}

        {/* Current Mode */}
        <div className={`p-4 rounded-xl border-2 ${
          blockchainMode
            ? 'bg-[#EBF4F6] border-[#088395]'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              blockchainMode ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <p className="text-sm font-black text-gray-900">
              {blockchainMode ? '🚀 REAL BLOCKCHAIN MODE' : '🧪 SIMULATED MODE'}
            </p>
          </div>
          <p className="text-xs text-gray-700">
            {blockchainMode
              ? 'Documents will be uploaded to IPFS and minted on Polygon Amoy blockchain'
              : 'Documents will be saved to Supabase only. Complete the setup above to enable blockchain.'
            }
          </p>
        </div>
      </div>

      {!config.valid && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Setup Instructions:</p>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Deploy LegiChainNFT.sol via Remix IDE</li>
            <li>Get Pinata API keys from pinata.cloud</li>
            <li>Update .env file with contract address and API keys</li>
            <li>Restart dev server</li>
            <li>Connect wallet in navbar</li>
            <li>Switch to Polygon Amoy network</li>
          </ol>
          <p className="text-xs text-[#088395] font-bold mt-3">
            📖 See REMIX_DEPLOYMENT_GUIDE.md for detailed instructions
          </p>
        </div>
      )}
    </div>
  );
}
