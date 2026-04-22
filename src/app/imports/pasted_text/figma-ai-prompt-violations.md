Here is a **clear Figma AI prompt** to generate **random violation cases for each ordinance** and ensure they appear in both dashboards.

---

# Figma AI Prompt – Generate Random Violation Cases for Each Ordinance

**Prompt:**

Update the **GMA Cavite Blockchain Barangay Ordinance Monitoring System prototype** to generate **random violation cases for each ordinance record** and ensure the violation data is **visible and synchronized in both the Admin Panel – Ordinance Records and the Ordinance Monitoring Dashboard**.

---

# 1. Generate Random Violation Cases

For each ordinance in the system (including the **50 ordinance records**), generate **random violation cases**.

Each violation case should contain the following fields:

* Violation Case ID
* Ordinance ID
* Barangay
* Ordinance Title
* Violation Type
* Date of Violation
* Violation Status (Pending, Warning Issued, Resolved)
* Recorded By (Admin/Barangay Officer)

Ensure every ordinance has **multiple violation cases** so that the **Total Violations Recorded value increases realistically**.

Example violation types:

* Improper waste disposal
* Minor outside curfew hours
* Illegal street parking
* Public littering
* Excessive noise after 10 PM
* Unauthorized street vending
* Smoking in public area
* Illegal dumping of garbage

---

# 2. Display Violation Data in Ordinance Details

When a user clicks **View Details** for an ordinance, display a **Violation Cases Table** containing:

* Violation Case ID
* Violation Type
* Date
* Barangay
* Status
* Recorded By

This table should show **all violation cases related to that ordinance**.

---

# 3. Update Total Violations Automatically

Each generated violation case should automatically **increase the “Total Violations Recorded” value** in:

* **Admin Panel – Ordinance Records**
* **Ordinance Monitoring Dashboard**
* **Ordinance Details Page**

The number must always match across all dashboards.

---

# 4. Synchronization Between Dashboards

Ensure that the **violation records created in the Admin Panel are automatically mirrored in the Ordinance Monitoring Dashboard**.

The dashboards must always show the **same violation data and counts**.

Admin Panel:

* Can **view, add, edit, or remove violation cases**

Citizen Dashboard:

* Can **view violation data only**

---

# 5. Optional Blockchain Record

For demonstration purposes, each violation case may include a **mock blockchain verification record** containing:

* Transaction Hash (TxHash)
* Block Number
* Timestamp
* Verification Status

This will simulate **secure blockchain logging of ordinance violations**.

---

✅ **Result:**
Each ordinance will now contain **random violation cases**, and these cases will **update the Total Violations count automatically** while being **visible in both the Admin Panel Ordinance Records and the Ordinance Monitoring Dashboard with identical data**.
