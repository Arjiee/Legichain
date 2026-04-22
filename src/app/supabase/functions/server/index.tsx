import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
app.get("/make-server-602f5697/health", (c) => {
  return c.json({ status: "ok" });
});

// ─── PROJECTS ────────────────────────────────────────────────────────────────

app.get("/make-server-602f5697/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    return c.json(projects);
  } catch (err) {
    console.log("Error fetching projects:", err);
    return c.json({ error: `Failed to fetch projects: ${err}` }, 500);
  }
});

app.get("/make-server-602f5697/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await kv.get(`project:${id}`);
    if (!project) return c.json({ error: "Project not found" }, 404);
    return c.json(project);
  } catch (err) {
    return c.json({ error: `Failed to fetch project: ${err}` }, 500);
  }
});

app.post("/make-server-602f5697/projects", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.id) return c.json({ error: "Project id is required" }, 400);
    await kv.set(`project:${body.id}`, body);
    return c.json(body, 201);
  } catch (err) {
    return c.json({ error: `Failed to create project: ${err}` }, 500);
  }
});

app.put("/make-server-602f5697/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    await kv.set(`project:${id}`, { ...body, id });
    return c.json({ ...body, id });
  } catch (err) {
    return c.json({ error: `Failed to update project: ${err}` }, 500);
  }
});

app.delete("/make-server-602f5697/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`project:${id}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Failed to delete project: ${err}` }, 500);
  }
});

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

app.get("/make-server-602f5697/documents", async (c) => {
  try {
    const docs = await kv.getByPrefix("doc:");
    const sorted = (docs as any[]).sort((a, b) =>
      new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );
    return c.json(sorted);
  } catch (err) {
    console.log("Error fetching documents:", err);
    return c.json({ error: `Failed to fetch documents: ${err}` }, 500);
  }
});

app.get("/make-server-602f5697/documents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const doc = await kv.get(`doc:${id}`);
    if (!doc) return c.json({ error: "Document not found" }, 404);
    return c.json(doc);
  } catch (err) {
    return c.json({ error: `Failed to fetch document: ${err}` }, 500);
  }
});

app.post("/make-server-602f5697/documents", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.id) return c.json({ error: "Document id is required" }, 400);
    await kv.set(`doc:${body.id}`, body);
    return c.json(body, 201);
  } catch (err) {
    return c.json({ error: `Failed to create document: ${err}` }, 500);
  }
});

app.put("/make-server-602f5697/documents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    await kv.set(`doc:${id}`, { ...body, id });
    return c.json({ ...body, id });
  } catch (err) {
    return c.json({ error: `Failed to update document: ${err}` }, 500);
  }
});

app.delete("/make-server-602f5697/documents/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`doc:${id}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Failed to delete document: ${err}` }, 500);
  }
});

// ─── BLOCKCHAIN TRANSACTIONS ─────────────────────────────────────────────────

app.get("/make-server-602f5697/blockchain-transactions", async (c) => {
  try {
    const txs = await kv.getByPrefix("blockchain_tx:");
    const sorted = (txs as any[]).sort((a, b) =>
      parseInt(b.blockNumber) - parseInt(a.blockNumber)
    );
    return c.json(sorted);
  } catch (err) {
    console.log("Error fetching blockchain transactions:", err);
    return c.json({ error: `Failed to fetch blockchain transactions: ${err}` }, 500);
  }
});

app.post("/make-server-602f5697/blockchain-transactions", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.txHash) return c.json({ error: "txHash is required" }, 400);
    // Use a sanitized key (replace 0x prefix with safe chars)
    const key = `blockchain_tx:${body.txHash.replace(/[^a-zA-Z0-9]/g, '_')}`;
    await kv.set(key, body);
    return c.json(body, 201);
  } catch (err) {
    return c.json({ error: `Failed to create blockchain transaction: ${err}` }, 500);
  }
});

// ─── BARANGAYS ────────────────────────────────────────────────────────────────

app.get("/make-server-602f5697/barangays", async (c) => {
  try {
    const barangays = await kv.getByPrefix("barangay:");
    const sorted = (barangays as any[]).sort((a, b) => a.id.localeCompare(b.id));
    return c.json(sorted);
  } catch (err) {
    console.log("Error fetching barangays:", err);
    return c.json({ error: `Failed to fetch barangays: ${err}` }, 500);
  }
});

app.post("/make-server-602f5697/barangays", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.id) return c.json({ error: "Barangay id is required" }, 400);
    await kv.set(`barangay:${body.id}`, body);
    return c.json(body, 201);
  } catch (err) {
    return c.json({ error: `Failed to create barangay: ${err}` }, 500);
  }
});

app.put("/make-server-602f5697/barangays/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    await kv.set(`barangay:${id}`, { ...body, id });
    return c.json({ ...body, id });
  } catch (err) {
    return c.json({ error: `Failed to update barangay: ${err}` }, 500);
  }
});

app.delete("/make-server-602f5697/barangays/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`barangay:${id}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Failed to delete barangay: ${err}` }, 500);
  }
});

// ─── AUDIT LOGS ──────────────────────────────────────────────────────────────

app.get("/make-server-602f5697/audit-logs", async (c) => {
  try {
    const logs = await kv.getByPrefix("audit_log:");
    const sorted = (logs as any[]).sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return c.json(sorted);
  } catch (err) {
    console.log("Error fetching audit logs:", err);
    return c.json({ error: `Failed to fetch audit logs: ${err}` }, 500);
  }
});

app.post("/make-server-602f5697/audit-logs", async (c) => {
  try {
    const body = await c.req.json();
    if (!body.id) return c.json({ error: "Audit log id is required" }, 400);
    await kv.set(`audit_log:${body.id}`, body);
    return c.json(body, 201);
  } catch (err) {
    return c.json({ error: `Failed to create audit log: ${err}` }, 500);
  }
});

// ─── SEED ────────────────────────────────────────────────────────────────────

// Smart idempotent seed — checks actual DB content per entity type, seeds only what's missing
app.post("/make-server-602f5697/seed", async (c) => {
  try {
    const { projects, auditLogs, documents, blockchainTransactions, barangays } = await c.req.json();

    // Check what's actually in the DB right now (don't rely on a marker alone)
    const [
      existingProjects,
      existingBarangays,
      existingDocs,
      existingTxs,
      existingLogs,
    ] = await Promise.all([
      kv.getByPrefix("project:"),
      kv.getByPrefix("barangay:"),
      kv.getByPrefix("doc:"),
      kv.getByPrefix("blockchain_tx:"),
      kv.getByPrefix("audit_log:"),
    ]);

    const seeded: Record<string, number> = {};

    if ((existingProjects as any[]).length === 0 && projects?.length > 0) {
      const entries: [string, unknown][] = projects.map((p: any) => [`project:${p.id}`, p]);
      await kv.mset(entries);
      seeded.projects = projects.length;
    }

    if ((existingLogs as any[]).length === 0 && auditLogs?.length > 0) {
      const entries: [string, unknown][] = auditLogs.map((l: any) => [`audit_log:${l.id}`, l]);
      await kv.mset(entries);
      seeded.auditLogs = auditLogs.length;
    }

    if ((existingDocs as any[]).length === 0 && documents?.length > 0) {
      const entries: [string, unknown][] = documents.map((d: any) => [`doc:${d.id}`, d]);
      await kv.mset(entries);
      seeded.documents = documents.length;
    }

    if ((existingTxs as any[]).length === 0 && blockchainTransactions?.length > 0) {
      const entries: [string, unknown][] = blockchainTransactions.map((tx: any) => [
        `blockchain_tx:${tx.txHash.replace(/[^a-zA-Z0-9]/g, '_')}`,
        tx,
      ]);
      await kv.mset(entries);
      seeded.blockchainTransactions = blockchainTransactions.length;
    }

    if ((existingBarangays as any[]).length === 0 && barangays?.length > 0) {
      const entries: [string, unknown][] = barangays.map((b: any) => [`barangay:${b.id}`, b]);
      await kv.mset(entries);
      seeded.barangays = barangays.length;
    }

    // Update seed markers
    await kv.set("system:seeded_v1", { seededAt: new Date().toISOString() });
    await kv.set("system:seeded_v2", {
      seededAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
    });

    if (Object.keys(seeded).length === 0) {
      console.log("Seed check complete — all entities already present, nothing to seed.");
      return c.json({ message: "All data already present in database", skipped: true });
    }

    console.log("Seeded missing entities:", JSON.stringify(seeded));
    return c.json({ message: "Missing data seeded successfully", seeded });
  } catch (err) {
    console.log("Error seeding database:", err);
    return c.json({ error: `Failed to seed database: ${err}` }, 500);
  }
});

// Force reseed (clears all data and reseeds everything from scratch)
app.post("/make-server-602f5697/reseed", async (c) => {
  try {
    await kv.del("system:seeded_v1");
    await kv.del("system:seeded_v2");

    const { projects, auditLogs, documents, blockchainTransactions, barangays } = await c.req.json();

    if (projects?.length > 0) {
      const entries: [string, unknown][] = projects.map((p: any) => [`project:${p.id}`, p]);
      await kv.mset(entries);
    }
    if (auditLogs?.length > 0) {
      const entries: [string, unknown][] = auditLogs.map((l: any) => [`audit_log:${l.id}`, l]);
      await kv.mset(entries);
    }
    if (documents?.length > 0) {
      const entries: [string, unknown][] = documents.map((d: any) => [`doc:${d.id}`, d]);
      await kv.mset(entries);
    }
    if (blockchainTransactions?.length > 0) {
      const entries: [string, unknown][] = blockchainTransactions.map((tx: any) => [
        `blockchain_tx:${tx.txHash.replace(/[^a-zA-Z0-9]/g, '_')}`,
        tx,
      ]);
      await kv.mset(entries);
    }
    if (barangays?.length > 0) {
      const entries: [string, unknown][] = barangays.map((b: any) => [`barangay:${b.id}`, b]);
      await kv.mset(entries);
    }

    await kv.set("system:seeded_v1", { seededAt: new Date().toISOString() });
    await kv.set("system:seeded_v2", { seededAt: new Date().toISOString() });

    console.log("Full reseed complete.");
    return c.json({ message: "Database reseeded successfully" });
  } catch (err) {
    console.log("Error reseeding:", err);
    return c.json({ error: `Failed to reseed: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);