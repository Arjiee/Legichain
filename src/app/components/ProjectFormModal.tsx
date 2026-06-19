import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarangayProject, ProjectCategory, ProjectStatus, FundingSource } from '../utils/projectData';
import { useData } from './DataContext';

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

const generateId = () => Date.now().toString();
const generateProjectId = () => `PROJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;

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
  blockchainVerified: false, 
  txHash: '',
  block: '',
  timestamp: '',
  fromAddress: '',
  toAddress: '',
  documentHash: '',
  verificationStatus: 'Pending Blockchain Registry',
  supportingDocs: [],
  datePublished: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
};

export function ProjectFormModal({ isOpen, onClose, onSave, editProject }: ProjectFormModalProps) {
  const { barangays = [] } = useData(); 
  const [form, setForm] = useState<BarangayProject>(BLANK_PROJECT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editProject) {
      setForm({
        ...editProject,
        // Safeguard nested financials elements if pulling a partial database row
        financials: {
          ...BLANK_PROJECT.financials,
          ...(editProject.financials || {})
        }
      });
    } else {
      const initialBarangay = barangays.length > 0 ? barangays[0].name : 'Poblacion 1';
      setForm({ 
        ...BLANK_PROJECT, 
        barangay: initialBarangay,
        id: generateId(), 
        projectId: generateProjectId() 
      });
    }
    setError('');
  }, [editProject, isOpen, barangays]);

  const update = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateFinancials = (field: string, value: any) => {
    setForm(prev => {
      const budget = field === 'totalApprovedBudget' ? Number(value) : prev.financials.totalApprovedBudget;
      const utilized = field === 'amountUtilized' ? Number(value) : prev.financials.amountUtilized;
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

      // FIXED: Strict payload sanitization mapping to make database insertions rock solid
      const sanitizedPayload: BarangayProject = {
        ...form,
        projectTitle: form.projectTitle.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        implementingOffice: form.implementingOffice.trim(),
        beneficiaries: form.beneficiaries ? form.beneficiaries.trim() : '',
        totalBeneficiaries: Number(form.totalBeneficiaries) || 0,
        startDate: form.startDate || new Date().toISOString().split('T')[0],
        expectedCompletionDate: form.expectedCompletionDate || new Date().toISOString().split('T')[0],
        datePublished: form.datePublished || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        financials: {
          totalApprovedBudget: Number(form.financials.totalApprovedBudget) || 0,
          fundingSource: form.financials.fundingSource || 'Barangay Fund',
          amountReleased: Number(form.financials.amountReleased) || 0,
          amountUtilized: Number(form.financials.amountUtilized) || 0,
          remainingBalance: Number(form.financials.remainingBalance) || 0,
          utilizationStatus: form.financials.utilizationStatus || 'Not Started',
          proofOfExpenditure: Array.isArray(form.financials.proofOfExpenditure) ? form.financials.proofOfExpenditure : [],
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        }
      };

      await onSave(sanitizedPayload); 
      onClose();
    } catch (e: any) {
      console.error("Project submission breakdown intercept:", e);
      setError(e.message || 'Blockchain sealing failed. Please check your network or wallet pipeline.');
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border-2 border-[#088395] max-h-[85vh] flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-[#EBF4F6] flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-black text-[#1C1C1C]">
                  {editProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <p className="text-xs text-[#088395] font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                  <Database size={12} /> Sealing to Polygon Blockchain
                </p>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold">
                  {error}
                </div>
              )}

              {/* Basic Info */}
              <section className="space-y-4">
                <h3 className="text-xs font-black text-[#09637E] uppercase tracking-widest">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Project Title *</label>
                    <input
                      value={form.projectTitle}
                      onChange={e => update('projectTitle', e.target.value)}
                      placeholder="e.g. Installation of Solar Streetlights"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Barangay Jurisdiction *</label>
                    <select
                      value={form.barangay}
                      onChange={e => update('barangay', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    >
                      {barangays.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => update('category', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status *</label>
                    <select
                      value={form.projectStatus}
                      onChange={e => update('projectStatus', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Implementing Office *</label>
                    <input
                      value={form.implementingOffice}
                      onChange={e => update('implementingOffice', e.target.value)}
                      placeholder="e.g. Barangay Engineering Office"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      rows={3}
                      placeholder="Brief description of the project..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none resize-none text-gray-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Location *</label>
                    <input
                      value={form.location}
                      onChange={e => update('location', e.target.value)}
                      placeholder="e.g. Main Road, Poblacion 1"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Beneficiaries</label>
                    <input
                      value={form.beneficiaries}
                      onChange={e => update('beneficiaries', e.target.value)}
                      placeholder="e.g. All residents of Poblacion 1"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total Beneficiaries</label>
                    <input
                      type="number"
                      value={form.totalBeneficiaries || 0}
                      onChange={e => update('totalBeneficiaries', Number(e.target.value))}
                      min={0}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    />
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section className="space-y-4">
                <h3 className="text-xs font-black text-[#09637E] uppercase tracking-widest">Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={e => update('startDate', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Expected Completion</label>
                    <input
                      type="date"
                      value={form.expectedCompletionDate}
                      onChange={e => update('expectedCompletionDate', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Actual Completion</label>
                    <input
                      type="date"
                      value={form.actualCompletionDate || ''}
                      onChange={e => update('actualCompletionDate', e.target.value || undefined)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    />
                  </div>
                </div>
              </section>

              {/* Financials */}
              <section className="space-y-4">
                <h3 className="text-xs font-black text-[#09637E] uppercase tracking-widest">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Total Approved Budget (₱)</label>
                    <input
                      type="number"
                      value={form.financials.totalApprovedBudget}
                      onChange={e => updateFinancials('totalApprovedBudget', e.target.value)}
                      min={0}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none font-bold text-[#088395]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Funding Source</label>
                    <select
                      value={form.financials.fundingSource}
                      onChange={e => updateFinancials('fundingSource', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    >
                      {FUNDING_SOURCES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Amount Released (₱)</label>
                    <input
                      type="number"
                      value={form.financials.amountReleased}
                      onChange={e => updateFinancials('amountReleased', e.target.value)}
                      min={0}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Amount Utilized (₱)</label>
                    <input
                      type="number"
                      value={form.financials.amountUtilized}
                      onChange={e => updateFinancials('amountUtilized', e.target.value)}
                      min={0}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#088395] focus:outline-none text-gray-700 font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#EBF4F6] rounded-2xl border border-[#09637E]/10">
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

            {/* Actions Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#088395] text-white font-black rounded-xl hover:bg-[#09637E] transition-all shadow-md flex items-center gap-2 disabled:opacity-60 cursor-pointer text-xs"
              >
                {saving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sealing to Blockchain...</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> {editProject ? 'Save Changes' : 'Seal & Record Project'}</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}