import { createClient } from '@supabase/supabase-js';
import { BarangayProject } from '../projectData';
import { Document } from '../documentData';
import { ProjectAuditLog } from '../auditLogData';
import { BlockchainTransaction } from '../blockchainData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── ACTIVE BARANGAY METADATA LOOKUP ────────────────────────────────────────

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

// ─── SYSTEM AUDIT TRAIL LOGS REDUCERS ───────────────────────────────────────

export async function fetchAuditLogs(): Promise<ProjectAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*');

    if (error) {
      console.error("❌ Supabase raw table query fetch block failed:", error.message);
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
    console.error("Critical connection failure inside audit log parser:", err);
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
    console.error("Failed to append systemic audit record:", err.message);
    return null;
  }
}

// ─── ADMINISTRATIVE LAW DOCUMENTS PIPELINES ────────────────────────────────

export async function fetchDocuments(): Promise<Document[]> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*');
    if (error) throw error;
    if (!data) return [];

    return data.map((doc: any) => ({
      ...doc,
      txHash: doc.tx_hash || doc.txHash || '0x...',
      blockchainStatus: doc.blockchain_status || doc.blockchainStatus || 'Local',
      attachedFiles: doc.attached_files || doc.attachedFiles || []
    }));
  } catch (err) {
    console.error("Critical document registry parser exception:", err);
    return [];
  }
}

export async function createDocument(doc: Document): Promise<Document> {
  // FIXED: Explicit snake_case mappings to prevent table payload rejection drops
  const databaseRow = {
    id: doc.id || Date.now().toString(),
    document_id: doc.documentId || doc.id || '',
    title: doc.title || '',
    type: doc.type || 'Ordinance',
    barangay: doc.barangay || '',
    status: doc.status || 'Draft',
    description: doc.description || '',
    publisher: doc.publisher || '',
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    attached_files: Array.isArray(doc.attachedFiles) ? doc.attachedFiles : (Array.isArray((doc as any).attached_files) ? (doc as any).attached_files : []),
    tx_hash: doc.txHash || '',
    blockchain_status: doc.blockchainStatus || 'Local',
    block: doc.block || ''
  };
  
  const { data, error } = await supabase
    .from('documents')
    .insert([databaseRow])
    .select();
    
  if (error) {
    console.error("Supabase Document Insertion Error Details:", error.message);
    throw error;
  }
  
  return {
    ...data[0],
    txHash: data[0].tx_hash || '0x...',
    blockchainStatus: data[0].blockchain_status || 'Local',
    attachedFiles: data[0].attached_files || []
  };
}

export async function updateDocument(id: string | number, doc: any): Promise<Document> {
  // Translate dynamically on structural patch variations safely
  const databaseRow: any = { ...doc };
  if ('txHash' in doc) databaseRow.tx_hash = doc.txHash;
  if ('blockchainStatus' in doc) databaseRow.blockchain_status = doc.blockchainStatus;
  if ('attachedFiles' in doc) databaseRow.attached_files = doc.attachedFiles;

  const { data, error } = await supabase
    .from('documents')
    .update(databaseRow)
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

// ─── SECURE STORAGE ASSET UPLOADS ──────────────────────────────────────────

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

// ─── REGIONAL REFORMS DEVELOPMENT PROJECTS SECTIONS ─────────────────────────

export async function fetchProjects(): Promise<BarangayProject[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
      
    if (error) throw error;
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      projectId: row.project_id || row.projectId || '',
      projectTitle: row.project_title || row.projectTitle || '',
      barangay: row.barangay || '',
      category: row.category || '',
      description: row.description || '',
      location: row.location || '',
      startDate: row.start_date || row.startDate || '',
      expectedCompletionDate: row.expected_completion_date || row.expectedCompletionDate || '',
      projectStatus: row.project_status || row.projectStatus || 'Planned',
      implementingOffice: row.implementing_office || row.implementingOffice || '',
      beneficiaries: row.beneficiaries || '',
      totalBeneficiaries: Number(row.total_beneficiaries || row.totalBeneficiaries || 0),
      financials: row.financials || {},
      blockchainVerified: row.blockchain_verified || row.blockchainVerified || false,
      txHash: row.tx_hash || row.txHash || '',
      block: row.block || '',
      documentHash: row.document_hash || row.documentHash || '',
      verificationStatus: row.verification_status || row.verificationStatus || 'Local',
      datePublished: row.date_published || row.datePublished || ''
    }));
  } catch (err) {
    console.error("Failed to translate relational project parameters:", err);
    return [];
  }
}

export async function createProject(project: any): Promise<any> {
  const databaseRow = {
    id: project.id || Date.now().toString(),
    project_id: project.projectId,
    project_title: project.projectTitle,
    barangay: project.barangay,
    category: project.category,
    description: project.description,
    location: project.location,
    start_date: project.startDate,
    expected_completion_date: project.expectedCompletionDate,
    project_status: project.projectStatus,
    implementing_office: project.implementingOffice,
    beneficiaries: project.beneficiaries,
    total_beneficiaries: project.totalBeneficiaries,
    financials: project.financials,
    blockchain_verified: project.blockchainVerified,
    tx_hash: project.txHash,
    block: project.block,
    document_hash: project.documentHash,
    verification_status: project.verificationStatus,
    date_published: project.datePublished
  };

  const { data, error } = await supabase
    .from('projects')
    .insert([databaseRow])
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function updateProject(id: string | number, project: any): Promise<any> {
  const databaseRow = {
    project_id: project.projectId,
    project_title: project.projectTitle,
    barangay: project.barangay,
    category: project.category,
    description: project.description,
    location: project.location,
    start_date: project.startDate,
    expected_completion_date: project.expectedCompletionDate,
    project_status: project.projectStatus,
    implementing_office: project.implementingOffice,
    beneficiaries: project.beneficiaries,
    total_beneficiaries: project.totalBeneficiaries,
    financials: project.financials,
    blockchain_verified: project.blockchainVerified,
    tx_hash: project.txHash,
    block: project.block,
    document_hash: project.documentHash,
    verification_status: project.verificationStatus,
    date_published: project.datePublished
  };

  const { data, error } = await supabase
    .from('projects')
    .update(databaseRow)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data?.[0];
}

export async function deleteProject(id: string | number): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── BLOCKCHAIN BACKUP EXPLORER CACHING TRAILS ─────────────────────────────

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