Here’s a **complete Figma AI prompt** to update your prototype so that the **Ordinance Records functionality from the admin dashboard** is also available in a **User Dashboard (“Ordinance Monitoring Dashboard”)** in **view-only mode** for citizens:

---

# Figma AI Prompt – Display Ordinance Records in User Dashboard (View-Only)

**Prompt:**

Update the **GMA Cavite Blockchain Barangay Ordinance Monitoring System prototype** so that the **“Ordinance Records” functionality currently in the Admin Dashboard** is also visible in the **User Dashboard**, renamed as **“Ordinance Monitoring Dashboard”**. Citizens can **view the ordinances and related data only**; they cannot modify, delete, or verify records.

---

# 1. Add User Dashboard Module

* Add a new dashboard section for **citizen users** called:

**“Ordinance Monitoring Dashboard”**

* Place this module on the **User Dashboard main page**.
* This dashboard mirrors the **Ordinance Records in the Admin Dashboard**, but **all actions are view-only**.

---

# 2. Display Ordinance Records Table (Read-Only)

Create a **read-only table** for citizen users with the following columns:

* Ordinance ID
* Barangay Name
* Ordinance Title
* Category
* Date Implemented
* Violations Recorded
* Enforcement Count
* Blockchain Verification Status
* View Details

All data must **sync with the admin dashboard** so citizens see **real-time updated ordinance information**.

---

# 3. Ordinance Details Page (View-Only)

When a citizen clicks **View Details**, display:

* Ordinance Title
* Barangay Name
* Ordinance Description
* Date Implemented
* Total Violations Recorded
* Yearly Violation Statistics
* Enforcement History (read-only)
* Blockchain Verification Section (TxHash, Block Number, Timestamp, Recorded By, Verification Status, read-only)

No buttons should allow **editing, adding, or deleting records**.

Include a **Return to Ordinance Monitoring Dashboard button**.

---

# 4. Real-Time Data Updates

Ensure that the **Ordinance Monitoring Dashboard automatically reflects the latest ordinance data**:

* New ordinances added by admin appear immediately
* Updated violation records show automatically
* Blockchain verification status is always current

---

# 5. User Interface Design

* Keep the **layout simple, clean, and citizen-friendly**
* Display **numeric counters and table data clearly**
* Maintain **easy navigation and responsive design**
* Ensure citizens can **read all ordinance information** without confusion

Example features:

* Table search bar (read-only)
* Barangay filter (view-only)
* Ordinance category filter (view-only)
* Pagination for large data

---

# 6. Permissions & Security

* Citizen users can **only view records**
* No access to editing, deleting, or adding ordinances
* Blockchain verification buttons are **disabled or hidden for citizens**

---

✅ Result:
The **Ordinance Records module in the admin dashboard** will now also appear in the **User Dashboard as “Ordinance Monitoring Dashboard”**, allowing **citizens to view all ordinances and violations in real-time, with blockchain verification displayed, but no modification permissions**, maintaining security and transparency.

---

If you want, I can also make a **single ultimate Figma AI prompt** that **combines all admin dashboard, citizen dashboard, blockchain explorer, transparency portal, and ordinance records updates**—so you can **paste once and fully update your entire prototype**.

Do you want me to do that?
