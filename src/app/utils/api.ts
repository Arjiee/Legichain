import { createClient } from '@supabase/supabase-js';
import { BarangayProject } from '../projectData';
import { Document } from '../documentData';
import { ProjectAuditLog } from '../auditLogData';
import { BlockchainTransaction } from '../blockchainData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── PRODUCTION BARANGAY METADATA LOOKUP ────────────────────────────────────

export async function fetchBarangays(): Promise<Array<{ id: string; name: string }>> {
  try {
    const { data, error } = await supabase
      .from('barangays')
      .select('id, name')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        { id: "1", name: "Poblacion 1" },
        { id: "2", name: "Poblacion 2" },
        { id: "3", name: "Poblacion 3" },
        { id: "4", name: "Poblacion 4" },
        { id: "5", name: "Poblacion 5" },
      ];
    }
    return data.map(b => ({ id: b.id.toString(), name: b.name }));
  } catch (err) {
    return [
      { id: "1", name: "Poblacion 1" },
      { id: "2", name: "Poblacion 2" },
      { id: "3", name: "Poblacion 3" },
      { id: "4", name: "Poblacion 4" },
      { id: "5", name: "Poblacion 5" },
    ];
  }
}

// ─── CENTRAL SYSTEM AUDIT CHRONOLOGICAL MAPPINGS ─────────────────────────────

export async function fetchAuditLogs(): Promise<ProjectAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*');

    if (error) {
      console.error("❌ Supabase table log collection failed:", error.message);
      return [];
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp || new Date(row.created_at).toLocaleString(),
      performedBy: row.performed_by || 'System',
      action: row.action || '',
      actionType: row.action_type || 'Create',
      module: row.module || 'System',
      description: row.description || '',
      barangay: row.barangay || 'General',
      projectId: row.project_id || null,
      projectTitle: row.project_title || null,
      documentId: row.document_id || null,
      txHash: row.tx_hash || '0x...',
      block: row.block || '---',
      blockchainStatus: row.blockchain_status || 'Local',
      createdAt: row.created_at
    }));
  } catch (err) {
    return [];
  }
}

export async function createAuditLog(log: Partial<ProjectAuditLog>): Promise<any> {
  try {
    const databaseRow = {
      timestamp: log.timestamp || new Date().toLocaleString(),
      performed_by: log.performedBy,
      action: log.action,
      action_type: log.actionType,
      module: log.module,
      description: log.description,
      barangay: log.barangay,
      project_id: log.projectId || null,
      project_title: log.projectTitle || null,
      document_id: log.documentId || null,
      tx_hash: log.txHash || '',
      block: log.block || '',
      blockchain_status: log.blockchainStatus || 'Verified'
    };

    const { data, error } = await supabase
      .from('audit_logs')
      .insert([databaseRow])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (err: any) {
    return null;
  }
}

// ─── MASTER RECORD DOCUMENTS PIPELINES (FIXED CASED RESOLUTION MAPPING) ──────

export async function fetchDocuments(): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*');
    if (error) throw error;
    if (!data) return [];

    // FIXED: Maps relational snake_case database outputs directly into front-end keys
    return data.map((doc: any) => ({
      ...doc,
      txHash: doc.tx_hash || doc.txHash || '0x...',
      blockchainStatus: doc.blockchain_status || doc.blockchainStatus || 'Local',
      attachedFiles: doc.attached_files || doc.attachedFiles || []
    }));
  } catch (err) {
    console.error("Critical documents fetch error layout:", err);
    return [];
  }
}

export async function createDocument(doc: Document): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert([doc])
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateDocument(id: string | number, doc: any): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .update(doc)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteDocument(id: string | number): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── STORAGE PROCESSOR ──────────────────────────────────────────────────────

export async function uploadDocumentImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
  const filePath = `scans/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('document-attachments')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Asset storage upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('document-attachments')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// ─── DEVELOPMENT PROJECTS SECTIONS ──────────────────────────────────────────

export async function fetchProjects(): Promise<BarangayProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  if (error) throw error;
  return data || [];
}

export async function createProject(project: BarangayProject): Promise<BarangayProject> {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateProject(id: string | number, project: Partial<BarangayProject>): Promise<BarangayProject> {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteProject(id: string | number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── MISC INDICES TRACES ────────────────────────────────────────────────────

export async function fetchBlockchainTransactions(): Promise<BlockchainTransaction[]> {
  const { data, error } = await supabase
    .from('blockchain_transactions')
    .select('*');
  if (error) return [];
  return data || [];
}

export async function createBlockchainTransaction(tx: BlockchainTransaction): Promise<void> {
  await supabase
    .from('blockchain_transactions')
    .insert([tx]);
}