// Mock data for LegiChain system
import { Document, SystemLog, DocumentCategory } from './types';

export const mockDocuments: Document[] = [
  {
    id: '1',
    documentNumber: 'BO-2025-001',
    title: 'Ordinance on Waste Segregation and Recycling Program',
    category: 'Barangay Ordinance',
    dateApproved: '2025-01-15',
    approvedBy: 'Hon. Maria Santos, Barangay Captain',
    fileHash: 'a3f5d8e9c2b1a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0',
    ipfsCID: 'QmX7Jk8fN9pL2mQ4rS6tV8wY0zB3cD5eF7gH9iJ1kL3mN5oP7',
    blockchainTxId: '0x8f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3',
    status: 'Published',
    timestamp: '2025-01-15T10:30:00Z',
    description: 'An ordinance establishing a comprehensive waste segregation and recycling program in the barangay'
  },
  {
    id: '2',
    documentNumber: 'BR-2025-001',
    title: 'Resolution Approving Budget Allocation for Community Health Program',
    category: 'Barangay Resolution',
    dateApproved: '2025-02-01',
    approvedBy: 'Hon. Juan dela Cruz, Barangay Kagawad',
    fileHash: 'b4g6e9f0d3c2b5a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1',
    ipfsCID: 'QmY8Lm9gO0qM3nR5sT7vW9xZ1aC4dE6fG8hI0jK2lM4nO6pQ8',
    blockchainTxId: '0x9g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4',
    status: 'Published',
    timestamp: '2025-02-01T14:20:00Z',
    description: 'Resolution approving ₱500,000 budget allocation for annual health program'
  },
  {
    id: '3',
    documentNumber: 'EO-2025-001',
    title: 'Executive Order on Enhanced Security Measures',
    category: 'Executive Order',
    dateApproved: '2025-03-10',
    approvedBy: 'Hon. Rosa Reyes, Barangay Captain',
    fileHash: 'c5h7f0g1e4d3c6b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2',
    ipfsCID: 'QmZ9Mn0hP1rN4oS6tU8wX0yA2bD5eF7gH9iJ1kL3mN5oP7qR9',
    blockchainTxId: '0xa5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4',
    status: 'Published',
    timestamp: '2025-03-10T09:15:00Z',
    description: 'Executive order implementing enhanced security protocols for barangay facilities'
  },
  {
    id: '4',
    documentNumber: 'KL-2025-001',
    title: 'Koneksyong Lokal: Youth Leadership Training Partnership',
    category: 'Koneksyong Lokal',
    dateApproved: '2025-04-05',
    approvedBy: 'Hon. Pedro Garcia, SK Chairman',
    fileHash: 'd6i8g1h2f5e4d7c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3',
    ipfsCID: 'QmA0No1iQ2sO5pT7uV9xY1zA3cE6fG8hI0jK2lM4nO6pQ8rS0',
    blockchainTxId: '0xb6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5',
    status: 'Published',
    timestamp: '2025-04-05T11:45:00Z',
    description: 'Partnership program with local NGOs for youth leadership development'
  },
  {
    id: '5',
    documentNumber: 'BAC-2025-001',
    title: 'Procurement Notice for Barangay Hall Renovation Project',
    category: 'Bids and Awards Committee',
    dateApproved: '2025-05-12',
    approvedBy: 'Hon. Ana Lopez, BAC Chairperson',
    fileHash: 'e7j9h2i3g6f5e8d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4',
    ipfsCID: 'QmB1Op2jR3tP6qU8vW0yZ2aB4dF7gH9iJ1kL3mN5oP7qR9sT1',
    blockchainTxId: '0xc7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6',
    status: 'Published',
    timestamp: '2025-05-12T13:00:00Z',
    description: 'Open bidding for Barangay Hall renovation worth ₱2,500,000'
  },
  {
    id: '6',
    documentNumber: 'RFA-2025-001',
    title: 'Q1 2025 Financial Aid Utilization Report',
    category: 'Report & Financial Aid',
    dateApproved: '2025-06-01',
    approvedBy: 'Hon. Carlos Mendez, Barangay Treasurer',
    fileHash: 'f8k0i3j4h7g6f9e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5',
    ipfsCID: 'QmC2Pq3kS4uQ7rV9wX1yZ3aB5dG8hI0jK2lM4nO6pQ8rS0tU2',
    blockchainTxId: '0xd8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7',
    status: 'Published',
    timestamp: '2025-06-01T08:00:00Z',
    description: 'Quarterly report on financial aid distribution and fund utilization'
  },
  {
    id: '7',
    documentNumber: 'BO-2025-002',
    title: 'Ordinance on Curfew Hours for Minors',
    category: 'Barangay Ordinance',
    dateApproved: '2025-06-15',
    approvedBy: 'Hon. Maria Santos, Barangay Captain',
    fileHash: 'g9l1j4k5i8h7g0f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6',
    ipfsCID: 'QmD3Qr4lT5vR8sW0xY2zA4bC6eH9iJ1kL3mN5oP7qR9sT1uV3',
    blockchainTxId: '0xe9k8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8',
    status: 'Pending',
    timestamp: '2025-06-15T16:00:00Z',
    description: 'Ordinance implementing curfew hours for minors to ensure public safety'
  },
  {
    id: '8',
    documentNumber: 'BR-2025-002',
    title: 'Resolution for Emergency Disaster Response Fund',
    category: 'Barangay Resolution',
    dateApproved: '2025-07-01',
    approvedBy: 'Hon. Juan dela Cruz, Barangay Kagawad',
    fileHash: 'h0m2k5l6j9i8h1g3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7',
    ipfsCID: 'QmE4Rs5mU6wS9tX1yZ3aB5cD7fI0jK2lM4nO6pQ8rS0tU2vW4',
    blockchainTxId: '0xf0l9k8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9',
    status: 'Published',
    timestamp: '2025-07-01T10:30:00Z',
    description: 'Resolution establishing ₱300,000 emergency fund for disaster response'
  },
  {
    id: '9',
    documentNumber: 'KL-2025-002',
    title: 'Community Health Outreach Program with Local Clinic',
    category: 'Koneksyong Lokal',
    dateApproved: '2025-07-20',
    approvedBy: 'Hon. Pedro Garcia, Health Committee Chair',
    fileHash: 'i1n3l6m7k0j9i2h4g5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8',
    ipfsCID: 'QmF5St6nV7xT0uY2zA4bC6dE8gJ1kL3mN5oP7qR9sT1uV3wX5',
    blockchainTxId: '0xg1m0l9k8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0',
    status: 'Published',
    timestamp: '2025-07-20T14:00:00Z',
    description: 'Partnership with Barangay Health Center for monthly medical missions'
  },
  {
    id: '10',
    documentNumber: 'BAC-2025-002',
    title: 'Award Notice: Community Center Construction Project',
    category: 'Bids and Awards Committee',
    dateApproved: '2025-08-05',
    approvedBy: 'Hon. Ana Lopez, BAC Chairperson',
    fileHash: 'j2o4m7n8l1k0j3i5h6g7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9',
    ipfsCID: 'QmG6Tu7oW8yU1vZ3aB5cD7eF9hK2lM4nO6pQ8rS0tU2vW4xY6',
    blockchainTxId: '0xh2n1m0l9k8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1',
    status: 'Published',
    timestamp: '2025-08-05T09:00:00Z',
    description: 'Contract awarded to ABC Construction for ₱5,000,000 project'
  },
  {
    id: '11',
    documentNumber: 'RFA-2025-002',
    title: 'Scholarship Program Financial Report 2025',
    category: 'Report & Financial Aid',
    dateApproved: '2025-08-20',
    approvedBy: 'Hon. Carlos Mendez, Barangay Treasurer',
    fileHash: 'k3p5n8o9m2l1k4j6i7h8g9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0',
    ipfsCID: 'QmH7Uv8pX9zV2wA4bC6dE8fG0iL3mN5oP7qR9sT1uV3wX5yZ7',
    blockchainTxId: '0xi3o2n1m0l9k8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2',
    status: 'Published',
    timestamp: '2025-08-20T11:00:00Z',
    description: 'Financial report on scholarship program covering 50 students'
  },
  {
    id: '12',
    documentNumber: 'EO-2025-002',
    title: 'Executive Order on Digital Transformation Initiative',
    category: 'Executive Order',
    dateApproved: '2025-09-01',
    approvedBy: 'Hon. Rosa Reyes, Barangay Captain',
    fileHash: 'l4q6o9p0n3m2l5k7j8i9h0g1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1',
    ipfsCID: 'QmI8Vw9qY0aW3xB5cD7eF9gH1jM4nO6pQ8rS0tU2vW4xY6zA8',
    blockchainTxId: '0xj4p3o2n1m0l9k8j7i6h5g4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3',
    status: 'Published',
    timestamp: '2025-09-01T13:30:00Z',
    description: 'Initiative to digitize all barangay services and document management'
  }
];

export const mockSystemLogs: SystemLog[] = [
  {
    id: '1',
    user: 'admin@barangay.gov.ph',
    action: 'Uploaded Document',
    documentId: 'RFA-2025-002',
    timestamp: '2025-08-20T11:00:00Z',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: '2',
    user: 'clerk@barangay.gov.ph',
    action: 'Updated Document',
    documentId: 'BAC-2025-002',
    timestamp: '2025-08-05T09:05:00Z',
    ipAddress: '192.168.1.101',
    status: 'Success'
  },
  {
    id: '3',
    user: 'admin@barangay.gov.ph',
    action: 'Uploaded Document',
    documentId: 'KL-2025-002',
    timestamp: '2025-07-20T14:00:00Z',
    ipAddress: '192.168.1.100',
    status: 'Success'
  },
  {
    id: '4',
    user: 'secretary@barangay.gov.ph',
    action: 'Verified Document',
    documentId: 'BR-2025-002',
    timestamp: '2025-07-01T10:35:00Z',
    ipAddress: '192.168.1.102',
    status: 'Success'
  },
  {
    id: '5',
    user: 'clerk@barangay.gov.ph',
    action: 'Attempted Upload',
    documentId: 'BO-2025-003',
    timestamp: '2025-06-25T16:30:00Z',
    ipAddress: '192.168.1.101',
    status: 'Failed'
  }
];

export const categories: DocumentCategory[] = [
  'Barangay Ordinance',
  'Barangay Resolution',
  'Executive Order',
  'Koneksyong Lokal',
  'Bids and Awards Committee',
  'Report & Financial Aid'
];

export const dashboardStats = {
  totalDocuments: 247,
  verifiedDocuments: 245,
  pendingUploads: 2,
  blockchainTransactions: 247,
  categoryCounts: {
    'Barangay Ordinance': 45,
    'Barangay Resolution': 78,
    'Executive Order': 32,
    'Koneksyong Lokal': 28,
    'Bids and Awards Committee': 35,
    'Report & Financial Aid': 29
  }
};