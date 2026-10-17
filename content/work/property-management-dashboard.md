---
title: "Property Management Dashboard"
role: "Product Designer"
timeline: "Design & UX Architecture"
summary: "Property managers struggled to track unit maintenance, upcoming lease renewals, and tenant requests across fragmented spreadsheets and legacy portals."
description: "UX case study: a property management dashboard that brings maintenance, lease renewals, and tenant requests into one clear view. By Yogesh Raya."
updated: "2026-10-03"
tags:
  - "Product Design"
  - "Dashboard UX"
  - "Information Architecture"
featuredOrder: 1
relatedInsights:
  - "what-should-a-dashboard-show-first"
  - "designing-clearer-product-flows"
kind: "case-study"
status: "published"
---

# Property Management Dashboard

## 1. Overview
- **Product:** All-in-one web operations platform for residential and commercial property managers.
- **Audience:** Property managers, leasing agents, and maintenance supervisors juggling multiple building complexes.
- **Role:** Product Designer responsible for user research, information architecture, wireframes, and design system components.
- **Timeline & Context:** 3-month design phase focused on turning an overwhelming legacy spreadsheet workflow into a unified web console.


## 2. Problem
Property managers faced daily cognitive overload when managing rental portfolios:
- Emergency maintenance requests were mixed with routine inquiries in crowded email inboxes, leading to missed repairs and tenant complaints.
- Key financial health metrics (outstanding rent, upcoming lease expirations, vacant units) required manually cross-referencing three separate software tools.
- Complex data tables had dozens of unformatted columns that forced users to horizontally scroll on 13-inch laptop displays.

---

## 3. Evidence and Constraints
- **User Observations:** During interviews with 6 property managers, 5 had sticky notes on their monitors to remind them of pending critical tenant requests because the existing software buried unassigned tickets.
- **Screen Limitations:** Managers frequently worked on 13" laptop screens at front desks or during on-site inspections, meaning the layout could not rely on ultrawide monitor real estate.
- **Business Need:** Reduce the average time required to log and dispatch a maintenance contractor from 15 minutes to under 3 minutes.
- **Technical Constraint:** Backend APIs delivered nested relation objects; the UI needed to handle incomplete tenant profiles without breaking table alignment.

---

## 4. Decisions and Trade-offs
1. **Prioritizing "Action Required" over Static Analytics:**
   - *Option A:* Lead with expansive revenue and occupancy charts.
   - *Option B:* Lead with actionable triage items (urgent maintenance, overdue rents, leases expiring in <30 days).
   - *Decision:* We chose Option B. Property managers start their morning by solving urgent tenant friction, not admiring revenue graphs.
2. **Side Drawer Inspection vs. Full-Page Navigation:**
   - Instead of navigating away from the main unit registry every time a manager clicks a tenant, we introduced an interactive slide-over drawer.
   - *Result:* Preserves the manager's scroll position and active search filters while allowing instant status changes.
3. **Card Metrics vs. Tabular Density:**
   - Designed high-contrast summary tiles with clear status pills (e.g., "94% Occupancy", "4 Urgent Tickets") paired with progressive search filters.

---

## 5. Solution
- **Action-Oriented Dashboard View:** Prominent summary cards at the top showing the immediate operational pulse: Pending Maintenance, Overdue Payments, and Vacancy Rate.
- **Unified Request Triage Queue:** Filterable ticket board categorizing maintenance by urgency level, assigned vendor, and unit number.
- **Quick-Action Drawers:** Slide-over panels allowing managers to approve invoices, assign contractors, and notify tenants in two clicks.
- **Responsive Table Controls:** Collapsible columns with custom view presets (e.g., "Leasing View", "Financial View", "Maintenance View").

---

## 6. Outcome and Learnings
- **What Was Delivered:** Complete design system, interactive prototypes in Figma, and high-fidelity specifications for frontend engineers.
- **Observed Impact:** In usability testing with test participants, time-to-dispatch for maintenance requests dropped from 14 minutes down to 2.5 minutes.
- **What Remains to Be Validated:** Real-world adoption of custom table column presets across older non-technical staff over a 6-month production cycle.
- **Key Takeaway:** Good dashboard design is not about displaying all data at once; it is about surfacing what needs a decision right now and tucking the rest away until requested.

