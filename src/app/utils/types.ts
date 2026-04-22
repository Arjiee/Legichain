// Document Categories for GMA Blockchain
export type DocumentCategory = 
  | 'Barangay Ordinance'
  | 'Barangay Resolution'
  | 'Executive Order'
  | 'Koneksyong Lokal'
  | 'Bids and Awards Committee'
  | 'Report & Financial Aid';

export interface CategoryConfig {
  id: string;
  name: DocumentCategory;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

export const categoryConfigs: CategoryConfig[] = [
  {
    id: 'ordinance',
    name: 'Barangay Ordinance',
    icon: 'ScrollText',
    color: '#C40C0C',
    bgColor: 'bg-red-50 border-red-200',
    description: 'Official ordinances passed by the Barangay Council'
  },
  {
    id: 'resolution',
    name: 'Barangay Resolution',
    icon: 'FileCheck2',
    color: '#FF6500',
    bgColor: 'bg-orange-50 border-orange-200',
    description: 'Barangay resolutions and official decisions'
  },
  {
    id: 'executive-order',
    name: 'Executive Order',
    icon: 'Stamp',
    color: '#CC561E',
    bgColor: 'bg-orange-100 border-orange-300',
    description: 'Executive orders signed by Barangay officials'
  },
  {
    id: 'koneksyong-lokal',
    name: 'Koneksyong Lokal',
    icon: 'Network',
    color: '#C40C0C',
    bgColor: 'bg-red-50 border-red-200',
    description: 'Freedom of Information Office - Transparency mechanism & citizen helpdesk'
  },
  {
    id: 'bids-awards',
    name: 'Bids and Awards Committee',
    icon: 'FileText',
    color: '#FF6500',
    bgColor: 'bg-orange-50 border-orange-200',
    description: 'Procurement notices, bidding schedules, and awarded projects'
  },
  {
    id: 'financial-aid',
    name: 'Report & Financial Aid',
    icon: 'BarChart3',
    color: '#CC561E',
    bgColor: 'bg-orange-100 border-orange-300',
    description: 'Transparency reports, financial aid releases, and fund utilization'
  }
];

export interface Document {
  id: string;
  documentNumber: string;
  title: string;
  category: DocumentCategory;
  dateApproved: string;
  approvedBy: string;
  fileHash: string;
  ipfsCID: string;
  blockchainTxId: string;
  status: 'Published' | 'Pending';
  timestamp: string;
  description?: string;
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  documentId: string;
  timestamp: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
}
