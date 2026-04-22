import { useState } from 'react';
import { Info, FileText, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

export function FOISection() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: 'About FOI', icon: <Info size={16} /> },
    { label: 'Request a Document', icon: <FileText size={16} /> },
    { label: 'Transparency Reports', icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-[#09637E] mb-4">Koneksyong Lokal</h1>
        <p className="text-gray-500 font-bold">
          Freedom of Information (FOI) Office Portal. Your right to information is protected and secured by LegiChain.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10 bg-[#EBF4F6]/50 p-2 rounded-3xl">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all cursor-pointer ${
              activeTab === i
                ? 'bg-[#09637E] text-white font-bold shadow-md'
                : 'text-[#09637E]/60 hover:bg-white hover:text-[#09637E]'
            }`}
          >
            {tab.icon}
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-[#09637E]/10 min-h-[400px]">
        {activeTab === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-black text-[#09637E]">Your Right to Know</h2>
            <p className="text-gray-600 font-bold leading-relaxed">
              The Koneksyong Lokal - Freedom of Information Office is dedicated to upholding transparency
              in barangay governance. Through LegiChain, we ensure that every citizen has access to
              official records, project updates, and financial statements.
            </p>
            <div className="p-6 rounded-3xl bg-[#EBF4F6] border border-[#09637E]/10">
              <p className="text-sm text-[#09637E] font-bold italic">
                "Knowledge is the foundation of a strong and participative community."
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              {[
                { title: 'Open Records', desc: 'All barangay project documents are publicly accessible through this portal.' },
                { title: 'Blockchain Proof', desc: 'Every record is immutably stored and verifiable on the blockchain.' },
                { title: 'Citizen First', desc: 'Designed for easy navigation by all members of the community.' },
              ].map(item => (
                <div key={item.title} className="p-5 rounded-2xl bg-[#EBF4F6]/50 border border-[#09637E]/10">
                  <h4 className="font-bold text-[#09637E] mb-2 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h2 className="text-2xl font-black text-[#09637E]">Submit an Information Request</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none transition-all text-sm"
                placeholder="Full Name"
              />
              <input
                type="email"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none transition-all text-sm"
                placeholder="Email Address"
              />
              <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none transition-all text-sm text-gray-500">
                <option value="">Select Barangay</option>
                {['Poblacion 1', 'Poblacion 2', 'Poblacion 3', 'Poblacion 4', 'Poblacion 5'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none transition-all text-sm text-gray-500">
                <option value="">Document Type</option>
                <option>Project Reports</option>
                <option>Financial Records</option>
                <option>Ordinances & Resolutions</option>
                <option>Procurement Documents</option>
              </select>
              <textarea
                rows={4}
                className="md:col-span-2 w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#088395] focus:outline-none transition-all text-sm"
                placeholder="Describe the document you are requesting and its purpose..."
              />
              <button className="md:col-span-2 w-full py-5 bg-[#088395] text-white font-bold rounded-2xl shadow-md hover:bg-[#09637E] transition-colors cursor-pointer">
                Submit Official FOI Request
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h2 className="text-2xl font-black text-[#09637E]">Transparency Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: '98%', label: 'Resolution Rate', color: 'text-[#09637E]' },
                { value: '2.4h', label: 'Avg Response Time', color: 'text-[#088395]' },
                { value: '1.2k', label: 'Queries Handled', color: 'text-[#7AB2B2]' },
              ].map(stat => (
                <div key={stat.label} className="p-8 border border-[#09637E]/10 rounded-3xl text-center bg-[#EBF4F6]/50 shadow-sm">
                  <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs font-bold text-[#09637E]/40 uppercase mt-2 tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-3xl bg-[#EBF4F6] border border-[#09637E]/10">
              <p className="text-sm font-bold text-[#09637E] mb-1">All records are verified and stored on blockchain</p>
              <p className="text-xs text-gray-500 font-medium">Each document transaction is immutably recorded ensuring data integrity and preventing unauthorized modifications.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
