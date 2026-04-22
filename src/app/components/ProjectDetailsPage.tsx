import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  Briefcase,
  DollarSign,
  FileText,
  ShieldCheck,
  TrendingUp,
  Clock,
  ExternalLink,
  Hash,
  Database,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarangayProject } from '../utils/projectData';

interface ProjectDetailsPageProps {
  project: BarangayProject;
  onBack: () => void;
}

export function ProjectDetailsPage({ project, onBack }: ProjectDetailsPageProps) {
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infrastructure & Physical Improvement': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Health, Sanitation, and Environment': return 'bg-green-100 text-green-700 border-green-200';
      case 'Safety, Order, and Social Services': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Livelihood, Education, and Agriculture': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Ongoing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planned': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUtilizationColor = (status: string) => {
    switch (status) {
      case 'Fully Utilized': return 'text-emerald-600';
      case 'Partially Utilized': return 'text-amber-600';
      case 'Not Started': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const utilizationPercentage = project.financials.totalApprovedBudget > 0 
    ? (project.financials.amountUtilized / project.financials.totalApprovedBudget) * 100 
    : 0;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-[#09637E]/60 hover:text-[#09637E] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 overflow-hidden">
        <div className="p-8 md:p-12 border-b border-gray-50 bg-[#EBF4F6]/30">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm font-mono text-[#088395] font-bold bg-white px-4 py-2 rounded-full border border-[#088395]/20">
              {project.projectId}
            </span>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(project.projectStatus)}`}>
              {project.projectStatus}
            </span>
            {project.blockchainVerified && (
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verified on Chain
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[#1C1C1C] mb-6">
            {project.projectTitle}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#088395]" />
              <span className="font-bold">{project.barangay}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#088395]" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#088395]" />
              <span>{project.implementingOffice}</span>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="p-8 md:p-12">
          <h3 className="text-lg font-bold text-[#1C1C1C] mb-4">Project Description</h3>
          <p className="text-gray-600 leading-relaxed font-medium">{project.description}</p>
        </div>
      </div>

      {/* Basic Project Information */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 p-8 md:p-12">
        <h3 className="text-xl font-bold text-[#1C1C1C] mb-8 flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#088395]" />
          Basic Project Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoField label="Start Date" value={formatDate(project.startDate)} icon={<Calendar className="w-5 h-5" />} />
          <InfoField label="Expected Completion" value={formatDate(project.expectedCompletionDate)} icon={<Clock className="w-5 h-5" />} />
          {project.actualCompletionDate && (
            <InfoField label="Actual Completion" value={formatDate(project.actualCompletionDate)} icon={<CheckCircle2 className="w-5 h-5" />} />
          )}
          <InfoField label="Beneficiaries" value={project.beneficiaries} icon={<Users className="w-5 h-5" />} />
          {project.totalBeneficiaries && project.totalBeneficiaries > 0 && (
            <InfoField label="Total Beneficiaries" value={project.totalBeneficiaries.toLocaleString()} icon={<Users className="w-5 h-5" />} />
          )}
          <InfoField label="Date Published" value={project.datePublished} icon={<Calendar className="w-5 h-5" />} />
          {project.lastUpdated && (
            <InfoField label="Last Updated" value={project.lastUpdated} icon={<TrendingUp className="w-5 h-5" />} />
          )}
        </div>

        {/* Supporting Documents */}
        {project.supportingDocs.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="text-sm font-bold text-[#09637E] uppercase tracking-widest mb-4">Supporting Documents</h4>
            <div className="flex flex-wrap gap-2">
              {project.supportingDocs.map((doc, index) => (
                <span key={index} className="px-4 py-2 bg-[#EBF4F6] text-[#09637E] text-sm font-bold rounded-full border border-[#09637E]/10">
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Funding & Utilization */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 p-8 md:p-12">
        <h3 className="text-xl font-bold text-[#1C1C1C] mb-8 flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-[#088395]" />
          Project Funding & Utilization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 rounded-2xl bg-[#EBF4F6] border border-[#09637E]/10">
            <p className="text-xs font-bold text-[#09637E]/50 uppercase tracking-widest mb-2">Total Approved Budget</p>
            <p className="text-3xl font-black text-[#09637E]">{formatCurrency(project.financials.totalApprovedBudget)}</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Funding Source</p>
            <p className="text-2xl font-bold text-[#1C1C1C]">{project.financials.fundingSource}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <FinancialMetric
            label="Amount Released"
            value={formatCurrency(project.financials.amountReleased)}
            color="text-blue-600"
          />
          <FinancialMetric
            label="Amount Utilized"
            value={formatCurrency(project.financials.amountUtilized)}
            color="text-emerald-600"
          />
          <FinancialMetric
            label="Remaining Balance"
            value={formatCurrency(project.financials.remainingBalance)}
            color="text-amber-600"
          />
        </div>

        {/* Utilization Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-gray-700">Budget Utilization</p>
            <span className={`text-sm font-bold ${getUtilizationColor(project.financials.utilizationStatus)}`}>
              {utilizationPercentage.toFixed(1)}% • {project.financials.utilizationStatus}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#088395] to-[#09637E] rounded-full transition-all duration-500"
              style={{ width: `${utilizationPercentage}%` }}
            />
          </div>
        </div>

        {/* Proof of Expenditure */}
        {project.financials.proofOfExpenditure.length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-[#09637E] uppercase tracking-widest mb-4">Proof of Expenditure</h4>
            <div className="flex flex-wrap gap-2">
              {project.financials.proofOfExpenditure.map((proof, index) => (
                <span key={index} className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full border border-emerald-200">
                  <FileText className="w-3 h-3 inline mr-1" />
                  {proof}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium mt-4">
              Last Updated: {project.financials.lastUpdated}
            </p>
          </div>
        )}
      </div>

      {/* Blockchain Verification */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#09637E]/10 p-8 md:p-12">
        <h3 className="text-xl font-bold text-[#1C1C1C] mb-8 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          Blockchain Verification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <BlockchainField label="Transaction Hash (TxHash)" value={project.txHash} copyable />
          <BlockchainField label="Block Number" value={project.block} />
          <BlockchainField label="Document Hash (SHA-256)" value={project.documentHash} copyable />
          <BlockchainField label="Timestamp" value={new Date(project.timestamp).toLocaleString()} />
          <BlockchainField label="From Address" value={project.fromAddress} copyable />
          <BlockchainField label="To Address" value={project.toAddress} copyable />
        </div>

        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-emerald-900">Verification Status</p>
              <p className="text-sm text-emerald-700 font-medium">{project.verificationStatus}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowBlockchainModal(true)}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Blockchain Proof
          </button>
        </div>
      </div>

      {/* Blockchain Modal */}
      <AnimatePresence>
        {showBlockchainModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowBlockchainModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-[#088395]"
            >
              <div className="p-8 border-b border-gray-50 bg-[#EBF4F6] flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-[#1C1C1C] mb-1">Blockchain Verification Proof</h3>
                  <p className="text-xs text-gray-500 font-bold">Full on-chain record information</p>
                </div>
                <button onClick={() => setShowBlockchainModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <BlockchainModalField label="Project ID" value={project.projectId} />
                <BlockchainModalField label="Project Title" value={project.projectTitle} />
                <BlockchainModalField label="Transaction Hash" value={project.txHash} mono />
                <BlockchainModalField label="Block Number" value={project.block} />
                <BlockchainModalField label="Document Hash" value={project.documentHash} mono />
                <BlockchainModalField label="From Address" value={project.fromAddress} mono />
                <BlockchainModalField label="To Address" value={project.toAddress} mono />
                <BlockchainModalField label="Timestamp" value={new Date(project.timestamp).toLocaleString()} />
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-900">Immutably Recorded on Blockchain</span>
                    </div>
                    <button className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                      View on Explorer <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setShowBlockchainModal(false)}
                  className="px-8 py-3 bg-[#09637E] text-white font-bold rounded-2xl hover:bg-[#088395] transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoField({ label, value, icon }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#088395]">{icon}</span>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-base font-bold text-[#1C1C1C]">{value}</p>
    </div>
  );
}

function FinancialMetric({ label, value, color }: any) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function BlockchainField({ label, value, copyable = false }: any) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-mono text-[#088395] font-bold break-all">{value}</p>
        {copyable && (
          <button 
            onClick={() => navigator.clipboard.writeText(value)}
            className="text-xs text-gray-400 hover:text-[#088395] transition-colors"
            title="Copy to clipboard"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function BlockchainModalField({ label, value, mono = false }: any) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{label}</label>
      <div className={`p-4 rounded-2xl bg-gray-50 border border-gray-100 ${mono ? 'font-mono' : ''} text-sm break-all text-[#1C1C1C] font-bold`}>
        {value}
      </div>
    </div>
  );
}
