---
title: "Briz — Simplifying Invoicing & Daily Tasks"
role: "Product Designer · Bytecare Technology"
timeline: "Product Design & Prototyping"
summary: "Small business owners found multi-item invoicing and transaction tracking on mobile clumsy and slow, leading to billing mistakes and delayed customer payments."
tags:
  - "Mobile UX"
  - "User Research"
  - "Interaction Design"
featuredOrder: 2
relatedInsights:
  - "designing-clearer-product-flows"
  - "better-product-design-feedback"
kind: "case-study"
gallery:
  - src: "/images/case-studies/agent-mesh.svg"
    alt: "Briz mobile invoice creation screen"
    width: 1080
    height: 1920
  - src: "/images/case-studies/sync-engine.svg"
    alt: "Briz payment tracking screen"
    width: 1080
    height: 1920
status: "published"
---

# Briz — Simplifying Invoicing & Daily Tasks

## 1. Overview
- **Product:** Mobile business management and invoicing application for micro-enterprises and independent shop owners.
- **Audience:** Small retail merchants, freelancers, and independent contractors in emerging markets operating predominantly on smartphones.
- **Role:** Product Designer at Bytecare Technology, leading user research, user journey mapping, and mobile UI flows.
- **Timeline & Context:** 4-month iterative design cycle aimed at improving mobile invoice creation and receivables tracking.

---

## 2. Problem
Small shop owners struggled to create professional invoices on mobile devices while serving walk-in customers:
- Existing desktop-first accounting tools required too many inputs (tax category codes, warehouse IDs, payment terms), causing shop owners to revert to handwritten paper receipts.
- Handwritten receipts led to lost revenue, forgotten payments, and hours spent recalculating balances at the end of each month.
- Users lacked immediate feedback on whether a digital receipt had been successfully viewed or acknowledged by their customer.

---

## 3. Evidence and Constraints
- **Field Interviews:** Spoke with 12 local business owners in Nepal; 9 reported that creating a digital invoice felt "too slow to do while a customer was standing in front of the counter."
- **Device Limitations:** Target users operated on budget Android devices with smaller screens (5.5" to 6.2") and intermittent mobile network connectivity.
- **Cognitive Constraints:** Financial terminology (e.g., "accounts receivable aging", "ledger debits") created intimidation. The interface had to use clear, everyday language ("Money In", "Money Out", "Unpaid Bills").

---

## 4. Decisions and Trade-offs
1. **Linear Stepper vs. Single Scrollable Form:**
   - *Option A:* One long scrollable form with all 14 fields.
   - *Option B:* Three-step progressive flow: Customer -> Line Items -> Instant Share.
   - *Decision:* We implemented Option B. Breaking the task into bite-sized screens reduced visual anxiety and allowed auto-advancing as soon as an item was added.
2. **Pre-populated Catalog vs. Freeform Typing:**
   - Allowed merchants to tap frequent inventory items from a horizontal quick-select strip rather than typing item descriptions and prices manually each time.
3. **Direct WhatsApp & SMS Sharing:**
   - Instead of requiring email addresses (which most local retail buyers do not use regularly), we placed one-tap WhatsApp and SMS PDF sharing at the completion of every sale.

---

## 5. Solution
- **Three-Step Quick Invoice Flow:** Select customer -> Tap item -> Confirm total. Creation time dropped to under 30 seconds.
- **Everyday Financial Language:** Simplified complex accounting terms into clear, visual transaction summaries with distinct color-coded badges for "Paid" and "Due".
- **One-Tap Payment Reminders:** Friendly, pre-formatted payment reminder messages that owners can send to clients directly over messaging apps without feeling confrontational.
- **Offline-First Local Drafting:** Invoices save instantly to the local device even during mobile internet drops, syncing automatically when connectivity returns.

---

## 6. Outcome and Learnings
- **What Was Delivered:** Complete end-to-end mobile design specifications, component library, and interactive prototypes tested with local merchants.
- **Verified Results:** Merchants using the simplified three-step flow completed invoice generation in an average of 28 seconds (down from over 2 minutes in earlier versions).
- **What Remains to Be Validated:** Long-term merchant retention on automated monthly tax summary exports across varying retail verticals.
- **Key Takeaway:** In mobile product design for non-technical users, clarity beats feature density every single time. Removing three non-essential fields did more for user adoption than any advanced feature could.

