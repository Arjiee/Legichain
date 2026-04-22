import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarangayProject, ProjectCategory, ProjectStatus, FundingSource } from '../utils/projectData';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: BarangayProject) => Promise<void>;
  editProject?: BarangayProject | null;
}

const CATEGORIES: ProjectCategory[] = [
  'Infrastructure & Physical Improvement',
  'Health, Sanitation, and Environment',
  'Safety, Order, and Social Services',
  'Livelihood, Education, and Agriculture',
];

const STATUSES: ProjectStatus[] = ['Planned', 'Ongoing', 'Completed', 'Cancelled'];

const FUNDING_SOURCES: FundingSource[] = [
  'Barangay Fund',
  'LGU',
  'National Government',
  'NGO',
  'Mixed Funding',
];

const BARANGAYS = ['Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5'];

const generateId = () => Date.now().toString();
const generateProjectId = () => `PROJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
const generateTxHash = () => '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
const generateBlock = () => String(15000000 + Math.floor(Math.random() * 1000000));

const BLANK_PROJECT: BarangayProject = {
  id: '',
  projectId: '',
  barangay: 'Poblacion 1',
  projectTitle: '',
  category: 'Infrastructure & Physical Improvement',
  description: '',
  location: '',
  startDate: new Date().toISOString().split('T')[0],
  expectedCompletionDate: new Date().toISOString().split('T')[0],
  projectStatus: 'Planned',
  implementingOffice: '',
  beneficiaries: '',
  totalBeneficiaries: 0,
  financials: {
    totalApprovedBudget: 0,
    fundingSource: 'Barangay Fund',
    amountReleased: 0,
    amountUtilized: 0,
    remainingBalance: 0,
    utilizationStatus: 'Not Started',
    proofOfExpenditure: [],
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  },
  blockchainVerified: true,
  txHash: '',
  block: '',
  timestamp: new Date().toISOString(),
  fromAddress: '0x1234567890abcdef1234567890abcdef1234567890',
  toAddress: '0xabcdef1234567890abcdef1234567890abcdef1234567890',
  documentHash: '',
  verificationStatus: 'Verified on Chain',
  supportingDocs: [],
  datePublished: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
};

export function ProjectFormModal({ isOpen, onClose, onSave, editProject }: ProjectFormModalProps) {
  const [form, setForm] = useState<BarangayProject>(BLANK_PROJECT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editProject) {
      setForm(editProject);
    } else {
      setForm({ ...BLANK_PROJECT, id: generateId(), projectId: generateProjectId(), txHash: generateTxHash(), block: generateBlock(), documentHash: generateTxHash() });
    }
    setError('');
  }, [editProject, isOpen]);

  const update = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateFinancials = (field: string, value: any) => {
    setForm(prev => {
      const budget = field === 'totalApprovedBudget' ? Number(value) : prev.financials.totalApprovedBudget;
      const utilized = field === 'amountUtilized' ? Number(value) : prev.financials.amountUtilized;
      const released = field === 'amountReleased' ? Number(value) : prev.financials.amountReleased;
      const remaining = budget - utilized;
      
      let utilizationStatus: 'Not Started' | 'Partially Utilized' | 'Fully Utilized' = 'Not Started';
      if (utilized > 0 && utilized < budget) utilizationStatus = 'Partially Utilized';
      else if (utilized >= budget && budget > 0) utilizationStatus = 'Fully Utilized';

      return {
        ...prev,
        financials: {
          ...prev.financials,
          [field]: field === 'fundingSource' ? value : Number(value),
          remainingBalance: remaining,
          utilizationStatus,
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }
      };
    });
  };

  const handleSave = async () => {
    if (!form.projectTitle.trim()) { setError('Project title is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!form.location.trim()) { setError('Location is required.'); return; }
    if (!form.implementingOffice.trim()) { setError('Implementing office is required.'); return; }

    try {
      setSaving(true);
      setError('');
      await onSave(form);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border-2 border-[#088395] max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 bg-[#EBF4F6] rounded-t-[32px] flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-[#1C1C1C]">
                  {editProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  {editProject ? `Editing: ${editProject.projectId}` : 'Create a new barangay project record'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8 flex-1">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                  {error}
                </div>
              )}

              {/* Basic Info */}
              <section>
                <h3 className="text-sm font-black text-[#09637E] uppercase tracking-widest mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Project Title *</label>
                    <input
                      value={form.projectTitle}
                      onChange={e => update('projectTitle', e.target.value)}
                      placeholder="e.g. Installation of Solar Streetlights"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Barangay *</label>
                    <select
                      value={form.barangay}
                      onChange={e => update('barangay', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    >
                      {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => update('category', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status *</label>
                    <select
                      value={form.projectStatus}
                      onChange={e => update('projectStatus', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Implementing Office *</label>
                    <input
                      value={form.implementingOffice}
                      onChange={e => update('implementingOffice', e.target.value)}
                      placeholder="e.g. Barangay Engineering Office"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      rows={3}
                      placeholder="Brief description of the project..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Location *</label>
                    <input
                      value={form.location}
                      onChange={e => update('location', e.target.value)}
                      placeholder="e.g. Main Road, Poblacion 1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Beneficiaries</label>
                    <input
                      value={form.beneficiaries}
                      onChange={e => update('beneficiaries', e.target.value)}
                      placeholder="e.g. All residents of Poblacion 1"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Beneficiaries</label>
                    <input
                      type="number"
                      value={form.totalBeneficiaries || 0}
                      onChange={e => update('totalBeneficiaries', Number(e.target.value))}
                      min={0}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Dates */}
              <section>
                <h3 className="text-sm font-black text-[#09637E] uppercase tracking-widest mb-4">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => update('startDate', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Expected Completion</label>
                    <input
                      type="date"
                      value={form.expectedCompletionDate}
                      onChange={e => update('expectedCompletionDate', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Actual Completion</label>
                    <input
                      type="date"
                      value={form.actualCompletionDate || ''}
                      onChange={e => update('actualCompletionDate', e.target.value || undefined)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Financials */}
              <section>
                <h3 className="text-sm font-black text-[#09637E] uppercase tracking-widest mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Approved Budget (₱)</label>
                    <input
                      type="number"
                      value={form.financials.totalApprovedBudget}
                      onChange={e => updateFinancials('totalApprovedBudget', e.target.value)}
                      min={0}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Funding Source</label>
                    <select
                      value={form.financials.fundingSource}
                      onChange={e => updateFinancials('fundingSource', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    >
                      {FUNDING_SOURCES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Amount Released (₱)</label>
                    <input
                      type="number"
                      value={form.financials.amountReleased}
                      onChange={e => updateFinancials('amountReleased', e.target.value)}
                      min={0}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Amount Utilized (₱)</label>
                    <input
                      type="number"
                      value={form.financials.amountUtilized}
                      onChange={e => updateFinancials('amountUtilized', e.target.value)}
                      min={0}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#EBF4F6] rounded-2xl border border-[#09637E]/10">
                  <div className="flex justify-between text-sm font-bold text-[#09637E]">
                    <span>Remaining Balance:</span>
                    <span>₱{form.financials.remainingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Utilization Status:</span>
                    <span className="font-bold">{form.financials.utilizationStatus}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-gray-50 border-t border-gray-100 rounded-b-[32px] flex justify-end gap-4 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-[#088395] text-white font-bold rounded-2xl hover:bg-[#09637E] transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> {editProject ? 'Save Changes' : 'Create Project'}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
