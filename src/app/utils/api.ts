import { projectId, publicAnonKey } from './supabase/info';
import { BarangayProject } from './projectData';
import { ProjectAuditLog } from './auditLogData';
import { Document } from './documentData';
import { BlockchainTransaction } from './blockchainData';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-602f5697`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
});

async function handleResponse<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${label} (${res.status}): ${text}`);
  }
  return res.json();
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<BarangayProject[]> {
  const res = await fetch(`${BASE_URL}/projects`, { headers: getHeaders() });
  return handleResponse<BarangayProject[]>(res, 'Failed to fetch projects');
}

export async function createProject(project: BarangayProject): Promise<BarangayProject> {
  const res = await fetch(`${BASE_URL}/projects`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(project) });
  return handleResponse<BarangayProject>(res, 'Failed to create project');
}

export async function updateProject(id: string, project: BarangayProject): Promise<BarangayProject> {
  const res = await fetch(`${BASE_URL}/projects/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(project) });
  return handleResponse<BarangayProject>(res, 'Failed to update project');
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/projects/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse<void>(res, 'Failed to delete project');
}

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export async function fetchDocuments(): Promise<Document[]> {
  const res = await fetch(`${BASE_URL}/documents`, { headers: getHeaders() });
  return handleResponse<Document[]>(res, 'Failed to fetch documents');
}

export async function createDocument(doc: Document): Promise<Document> {
  const res = await fetch(`${BASE_URL}/documents`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(doc) });
  return handleResponse<Document>(res, 'Failed to create document');
}

export async function updateDocument(id: string, doc: Document): Promise<Document> {
  const res = await fetch(`${BASE_URL}/documents/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(doc) });
  return handleResponse<Document>(res, 'Failed to update document');
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/documents/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse<void>(res, 'Failed to delete document');
}

// ─── BLOCKCHAIN TRANSACTIONS ─────────────────────────────────────────────────

export async function fetchBlockchainTransactions(): Promise<BlockchainTransaction[]> {
  const res = await fetch(`${BASE_URL}/blockchain-transactions`, { headers: getHeaders() });
  return handleResponse<BlockchainTransaction[]>(res, 'Failed to fetch blockchain transactions');
}

export async function createBlockchainTransaction(tx: BlockchainTransaction): Promise<BlockchainTransaction> {
  const res = await fetch(`${BASE_URL}/blockchain-transactions`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(tx) });
  return handleResponse<BlockchainTransaction>(res, 'Failed to create blockchain transaction');
}

// ─── BARANGAYS ────────────────────────────────────────────────────────────────

export async function fetchBarangays(): Promise<Array<{ id: string; name: string }>> {
  const res = await fetch(`${BASE_URL}/barangays`, { headers: getHeaders() });
  return handleResponse<Array<{ id: string; name: string }>>(res, 'Failed to fetch barangays');
}

export async function createBarangay(barangay: { id: string; name: string }): Promise<{ id: string; name: string }> {
  const res = await fetch(`${BASE_URL}/barangays`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(barangay) });
  return handleResponse<{ id: string; name: string }>(res, 'Failed to create barangay');
}

export async function updateBarangay(id: string, barangay: { id: string; name: string }): Promise<{ id: string; name: string }> {
  const res = await fetch(`${BASE_URL}/barangays/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(barangay) });
  return handleResponse<{ id: string; name: string }>(res, 'Failed to update barangay');
}

export async function deleteBarangay(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/barangays/${id}`, { method: 'DELETE', headers: getHeaders() });
  return handleResponse<void>(res, 'Failed to delete barangay');
}

// ─── AUDIT LOGS ──────────────────────────────────────────────────────────────

export async function fetchAuditLogs(): Promise<ProjectAuditLog[]> {
  const res = await fetch(`${BASE_URL}/audit-logs`, { headers: getHeaders() });
  return handleResponse<ProjectAuditLog[]>(res, 'Failed to fetch audit logs');
}

export async function createAuditLog(log: ProjectAuditLog): Promise<ProjectAuditLog> {
  const res = await fetch(`${BASE_URL}/audit-logs`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(log) });
  return handleResponse<ProjectAuditLog>(res, 'Failed to create audit log');
}

// ─── SEED ────────────────────────────────────────────────────────────────────

export async function seedDatabase(payload: {
  projects: BarangayProject[];
  auditLogs: ProjectAuditLog[];
  documents: Document[];
  blockchainTransactions: BlockchainTransaction[];
  barangays: Array<{ id: string; name: string }>;
}): Promise<{ message: string; skipped?: boolean }> {
  const res = await fetch(`${BASE_URL}/seed`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
  return handleResponse<{ message: string; skipped?: boolean }>(res, 'Failed to seed database');
}

export async function reseedDatabase(payload: {
  projects: BarangayProject[];
  auditLogs: ProjectAuditLog[];
  documents: Document[];
  blockchainTransactions: BlockchainTransaction[];
  barangays: Array<{ id: string; name: string }>;
}): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/reseed`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(payload) });
  return handleResponse<{ message: string }>(res, 'Failed to reseed database');
}
