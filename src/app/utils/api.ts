/**
 * LegiChain Production API Layer
 * Direct secure connection to Supabase tables bypassing deleted proxies.
 * Automatically translates variable casings: JavaScript camelCase <-> PostgreSQL snake_case
 */

import { createClient } from '@supabase/supabase-js';
import { BarangayProject } from './projectData';
import { ProjectAuditLog } from './auditLogData';
import { Document } from './documentData';
import { BlockchainTransaction } from './blockchainData';

// Initialize Supabase client via system environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing primary Supabase configuration variables in .env environment file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to sanitize incoming mock data strings from breaking primary native UUID indexes
const cleanId = (id: string | undefined) => (id && id.length > 24 ? id : undefined);

// ─── 1. PRODUCTION ADMINISTRATIVE DOCUMENTS MODULE ───────────────────────────

export async function fetchDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('date_published', { ascending: false });

  if (error) throw new Error(`Failed to query database documents layer: ${error.message}`);
  
  return (data || []).map((row: any) => ({
    id: row.id,
    documentId: row.document_id,
    type: row.type,
    title: row.title,
    barangay: row.barangay,
    datePublished: row.date_published,
    publishedBy: row.published_by,
    status: row.status,
    blockchainStatus: row.blockchain_status,
    violationCount: row.violation_count || 0,
    description: row.description,
    fullContent: row.full_content,
    attachedFiles: row.attached_files || [],
    txHash: row.tx_hash,
    block: row.block,
    verifiedBy: row.verified_by,
    verificationTimestamp: row.verification_timestamp,
    lastModified: row.last_modified,
    ordinanceNumber: row.ordinance_number,
    effectivityDate: row.effectivity_date,
    tags: row.tags || []
  }));
}

export async function createDocument(doc: Document): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert([{
      id: cleanId(doc.id),
      document_id: doc.documentId,
      type: doc.type,
      title: doc.title,
      barangay: doc.barangay,
      date_published: doc.datePublished,
      published_by: doc.publishedBy,
      status: doc.status,
      blockchain_status: doc.blockchainStatus,
      violation_count: doc.violationCount,
      description: doc.description,
      full_content: doc.fullContent,
      attached_files: doc.attachedFiles,
      tx_hash: doc.txHash,
      block: doc.block,
      verified_by: doc.verifiedBy,
      verification_timestamp: doc.verificationTimestamp,
      last_modified: doc.lastModified,
      ordinance_number: doc.ordinanceNumber,
      effectivity_date: doc.effectivityDate,
      tags: doc.tags
    }])
    .select()
    .single();

  if (error) throw new Error(`Document initialization write failed: ${error.message}`);
  return { ...doc, id: data.id };
}

export async function updateDocument(id: string, doc: Partial<Document>): Promise<void> {
  const updatePayload: any = {};
  if (doc.title !== undefined) updatePayload.title = doc.title;
  if (doc.status !== undefined) updatePayload.status = doc.status;
  if (doc.blockchainStatus !== undefined) updatePayload.blockchain_status = doc.blockchainStatus;
  if (doc.txHash !== undefined) updatePayload.tx_hash = doc.txHash;
  if (doc.block !== undefined) updatePayload.block = doc.block;
  if (doc.lastModified !== undefined) updatePayload.last_modified = doc.lastModified;

  const { error } = await supabase
    .from('documents')
    .update(updatePayload)
    .eq('id', id);

  if (error) throw new Error(`Document update mutation transaction failed: ${error.message}`);
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Document removal request rejected: ${error.message}`);
}

// ─── 2. PRODUCTION DEVELOPMENT PROJECTS & FINANCIALS MODULE ──────────────────

export async function fetchProjects(): Promise<BarangayProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_financials(*)');

  if (error) throw new Error(`Failed to extract project tracking records: ${error.message}`);

  return (data || []).map((row: any) => {
    const fin = row.project_financials?.[0] || {};
    return {
      id: row.id,
      projectId: row.project_id,
      barangay: row.barangay,
      projectTitle: row.project_title,
      category: row.category,
      description: row.description,
      location: row.location,
      startDate: row.start_date,
      expectedCompletionDate: row.expected_completion_date,
      actualCompletionDate: row.actual_completion_date,
      projectStatus: row.project_status,
      implementingOffice: row.implementing_office,
      beneficiaries: row.beneficiaries,
      totalBeneficiaries: row.total_beneficiaries,
      blockchainVerified: row.blockchain_verified,
      txHash: row.tx_hash,
      block: row.block,
      timestamp: row.timestamp,
      fromAddress: row.from_address,
      toAddress: row.to_address,
      documentHash: row.document_hash,
      verificationStatus: row.verification_status,
      supportingDocs: row.supporting_docs || [],
      datePublished: row.date_published,
      lastUpdated: row.last_updated,
      financials: {
        totalApprovedBudget: Number(fin.total_approved_budget || 0),
        fundingSource: fin.funding_source || 'Barangay Fund',
        amountReleased: Number(fin.amount_released || 0),
        amountUtilized: Number(fin.amount_utilized || 0),
        remainingBalance: Number(fin.remaining_balance || 0),
        utilizationStatus: fin.utilization_status || 'Not Started',
        proofOfExpenditure: fin.proof_of_expenditure || [],
        lastUpdated: fin.last_updated || ''
      }
    };
  });
}

export async function createProject(project: BarangayProject): Promise<BarangayProject> {
  const { data: pData, error: pError } = await supabase
    .from('projects')
    .insert([{
      id: cleanId(project.id),
      project_id: project.projectId,
      barangay: project.barangay,
      project_title: project.projectTitle,
      category: project.category,
      description: project.description,
      location: project.location,
      start_date: project.startDate,
      expected_completion_date: project.expectedCompletionDate,
      actual_completion_date: project.actualCompletionDate || null,
      project_status: project.projectStatus,
      implementing_office: project.implementingOffice,
      beneficiaries: project.beneficiaries,
      total_beneficiaries: project.totalBeneficiaries || 0,
      blockchain_verified: project.blockchainVerified,
      tx_hash: project.txHash || null,
      block: project.block || null,
      timestamp: project.timestamp || null,
      from_address: project.fromAddress || null,
      to_address: project.toAddress || null,
      document_hash: project.documentHash || null,
      verification_status: project.verificationStatus || 'Pending',
      supporting_docs: project.supportingDocs || [],
      date_published: project.datePublished,
      last_updated: project.lastUpdated || null
    }])
    .select()
    .single();

  if (pError) throw new Error(`Project profile creation failed: ${pError.message}`);

  if (project.financials) {
    const { error: fError } = await supabase
      .from('project_financials')
      .insert([{
        project_record_id: pData.id,
        total_approved_budget: project.financials.totalApprovedBudget,
        funding_source: project.financials.fundingSource,
        amount_released: project.financials.amountReleased,
        amount_utilized: project.financials.amountUtilized,
        remaining_balance: project.financials.remainingBalance,
        utilization_status: project.financials.utilizationStatus,
        proof_of_expenditure: project.financials.proofOfExpenditure || [],
        last_updated: project.financials.lastUpdated
      }]);

    if (fError) throw new Error(`Project created, but financial tracking link failed: ${fError.message}`);
  }

  return { ...project, id: pData.id };
}

export async function updateProject(id: string, project: BarangayProject): Promise<BarangayProject> {
  const { error: pError } = await supabase
    .from('projects')
    .update({
      project_title: project.projectTitle,
      category: project.category,
      description: project.description,
      location: project.location,
      project_status: project.projectStatus,
      implementing_office: project.implementingOffice,
      total_beneficiaries: project.totalBeneficiaries,
      blockchain_verified: project.blockchainVerified,
      tx_hash: project.txHash,
      block: project.block,
      verification_status: project.verificationStatus,
      last_updated: project.lastUpdated
    })
    .eq('id', id);

  if (pError) throw new Error(`Failed to update master project entry: ${pError.message}`);

  if (project.financials) {
    const { error: fError } = await supabase
      .from('project_financials')
      .update({
        total_approved_budget: project.financials.totalApprovedBudget,
        funding_source: project.financials.fundingSource,
        amount_released: project.financials.amountReleased,
        amount_utilized: project.financials.amountUtilized,
        remaining_balance: project.financials.remainingBalance,
        utilization_status: project.financials.utilizationStatus,
        proof_of_expenditure: project.financials.proofOfExpenditure,
        last_updated: project.financials.lastUpdated
      })
      .eq('project_record_id', id);

    if (fError) throw new Error(`Failed to update corresponding project financial lines: ${fError.message}`);
  }

  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Project deletion request rejected: ${error.message}`);
}

// ─── 3. IMMUTABLE OPERATIONAL SYSTEM AUDIT LOGS ──────────────────────────────

export async function fetchAuditLogs(): Promise<ProjectAuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to extract audit engine lines: ${error.message}`);
  
  return (data || []).map((row: any) => ({
    id: row.id,
    timestamp: row.timestamp,
    performedBy: row.performed_by,
    action: row.action,
    actionType: row.action_type,
    module: row.module,
    description: row.description,
    barangay: row.barangay,
    projectId: row.project_id,
    projectTitle: row.project_title,
    details: row.details,
    beforeValue: row.before_value,
    afterValue: row.after_value,
    txHash: row.tx_hash,
    block: row.block,
    blockchainStatus: row.blockchain_status,
    ipAddress: row.ip_address,
    changeType: row.change_type
  }));
}

export async function createAuditLog(log: ProjectAuditLog): Promise<void> {
  const { error } = await supabase
    .from('audit_logs')
    .insert([{
      timestamp: log.timestamp,
      performed_by: log.performedBy,
      action: log.action,
      action_type: log.actionType,
      module: log.module,
      description: log.description,
      barangay: log.barangay,
      project_id: log.projectId || null,
      project_title: log.projectTitle || null,
      details: log.details,
      before_value: log.beforeValue || null,
      after_value: log.afterValue || null,
      tx_hash: log.txHash,
      block: log.block,
      blockchain_status: log.blockchainStatus,
      ip_address: log.ipAddress || null,
      change_type: log.changeType || null
    }]);

  if (error) throw new Error(`Audit log verification commit skipped: ${error.message}`);
}

// ─── 4. BLOCKCHAIN TRANSACTION RECEIPTS LEDGER MODULE ─────────────────────────

export async function fetchBlockchainTransactions(): Promise<BlockchainTransaction[]> {
  const { data, error } = await supabase
    .from('blockchain_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to retrieve network block receipts: ${error.message}`);
  
  return (data || []).map((row: any) => ({
    txHash: row.tx_hash,
    blockNumber: row.block_number,
    previousBlockHash: row.previous_block_hash,
    smartContractAddress: row.smart_contract_address,
    ordinanceId: row.ordinance_id,
    barangay: row.barangay,
    violationCaseId: row.violation_case_id,
    recordType: row.record_type,
    actionRecorded: row.action_recorded,
    timestamp: row.timestamp,
    recordedBy: row.recorded_by,
    verificationStatus: row.verification_status,
    ordinanceTitle: row.ordinance_title,
    violationType: row.violation_type,
    gasUsed: row.gas_used,
    gasPrice: row.gas_price
  }));
}

export async function createBlockchainTransaction(tx: BlockchainTransaction): Promise<void> {
  const { error } = await supabase
    .from('blockchain_transactions')
    .insert([{
      tx_hash: tx.txHash,
      block_number: tx.blockNumber,
      previous_block_hash: tx.previousBlockHash,
      smart_contract_address: tx.smartContractAddress,
      ordinance_id: cleanId(tx.ordinanceId),
      barangay: tx.barangay,
      violation_case_id: tx.violationCaseId || null,
      record_type: tx.recordType,
      action_recorded: tx.actionRecorded,
      timestamp: tx.timestamp,
      recorded_by: tx.recordedBy,
      verification_status: tx.verificationStatus,
      ordinance_title: tx.ordinanceTitle || null,
      violation_type: tx.violationType || null,
      gas_used: tx.gasUsed || null,
      gas_price: tx.gasPrice || null
    }]);

  if (error) throw new Error(`Failed to log verified on-chain block transaction: ${error.message}`);
}

// ─── 5. AUTOMATED LIVE MIGRATION/SEED ROUTINE ────────────────────────────────

export async function seedProductionProjects(payload: BarangayProject[]): Promise<{ message: string; count: number }> {
  let successfullySeeded = 0;

  for (const project of payload) {
    try {
      const { data: pData, error: pError } = await supabase
        .from('projects')
        .insert([{
          project_id: project.projectId,
          barangay: project.barangay,
          project_title: project.projectTitle,
          category: project.category,
          description: project.description,
          location: project.location,
          start_date: project.startDate,
          expected_completion_date: project.expectedCompletionDate,
          actual_completion_date: project.actualCompletionDate || null,
          project_status: project.projectStatus,
          implementing_office: project.implementingOffice,
          beneficiaries: project.beneficiaries,
          total_beneficiaries: project.totalBeneficiaries || 0,
          blockchain_verified: project.blockchainVerified,
          tx_hash: project.txHash || null,
          block: project.block || null,
          timestamp: project.timestamp || null,
          from_address: project.fromAddress || null,
          to_address: project.toAddress || null,
          document_hash: project.documentHash || null,
          verification_status: project.verificationStatus || 'Pending',
          supporting_docs: project.supportingDocs || [],
          date_published: project.datePublished,
          last_updated: project.lastUpdated || null
        }])
        .select()
        .single();

      if (pError) continue;

      if (project.financials) {
        await supabase
          .from('project_financials')
          .insert([{
            project_record_id: pData.id,
            total_approved_budget: project.financials.totalApprovedBudget,
            funding_source: project.financials.fundingSource,
            amount_released: project.financials.amountReleased,
            amount_utilized: project.financials.amountUtilized,
            remaining_balance: project.financials.remainingBalance,
            utilization_status: project.financials.utilizationStatus,
            proof_of_expenditure: project.financials.proofOfExpenditure || [],
            last_updated: project.financials.lastUpdated
          }]);
        
        successfullySeeded++;
      }
    } catch (err) {
      console.error("Migration looping runner exception:", err);
    }
  }

  return { message: "Production database hydration process completed.", count: successfullySeeded };
}
