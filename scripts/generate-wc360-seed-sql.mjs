import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const project = {
  name: "WC360 Cost Governance & Redundancy Cleanup",
  companyName: "WoundCare 360",
  description:
    "Create a complete cost governance and redundancy cleanup process for WC360. Track every system WC360 uses, who uses each item/license/line/device, what it costs, what can be removed, what requires approval, and what savings are actually realized. Based on the WC360 Cost Governance Workbook with tabs for Dashboard, License Assumptions, Microsoft 365, T-Mobile, RingCentral, Devices, Spruce, Zoho, Adobe, and Quick Wins.",
  phases: [
    {
      title: "Phase 1: Workbook Foundation & Project Setup",
      weight: 12,
      tasks: [
        ["Review current WC360 cost governance workbook and existing tabs", 1, "completed"],
        ["Create initial cost governance workbook structure", 2, "completed"],
        [
          "Create scoped system tabs: Dashboard, License Assumptions, Microsoft 365, T-Mobile, RingCentral, Devices, Spruce, Zoho, Adobe, Quick Wins",
          2,
          "completed",
        ],
        ["Create License Assumptions tab for pricing references and assumptions", 2, "completed"],
        ["Create initial Dashboard / savings summary scaffold", 2, "completed"],
        ["Standardize action/status options across all system tabs", 1, "in_progress"],
        [
          "Identify decision owners/approvers for removals, downgrades, ports, and system changes",
          1,
          "not_started",
        ],
        ["Define recurring governance cadence for ongoing cost review", 1, "not_started"],
      ],
    },
    {
      title: "Phase 2: Microsoft 365 / GoDaddy License Review",
      weight: 14,
      tasks: [
        ["Import Microsoft 365 mailbox/license list", 3, "completed"],
        ["Map visible GoDaddy/Microsoft license pricing to each license type", 2, "completed"],
        ["Add Keep/Remove/Review actions and savings formulas", 2, "completed"],
        ["Complete initial Microsoft 365 Keep/Remove/Review classification", 2, "completed"],
        ["Add owner and business purpose for each mailbox/license", 1.5, "not_started"],
        ["Validate proposed removals with leadership or department owners", 1.5, "not_started"],
        ["Execute approved Microsoft 365 removals/downgrades", 1, "not_started"],
        ["Confirm actual monthly savings after GoDaddy/Microsoft changes", 1, "not_started"],
      ],
    },
    {
      title: "Phase 3: RingCentral Review & Cleanup",
      weight: 12,
      tasks: [
        ["Create RingCentral cost review sheet", 1, "completed"],
        ["Import current RingCentral users, extensions, and phone numbers", 2.5, "completed"],
        ["Add monthly cost and savings formulas", 1.5, "completed"],
        ["Complete initial RingCentral Keep/Remove/Review classification", 2, "completed"],
        ["Validate RingCentral lines marked Review", 1, "not_started"],
        [
          "Confirm which numbers need Spruce transition, forwarding, or port planning",
          1.5,
          "not_started",
        ],
        ["Execute approved RingCentral removals/cancellations", 1, "not_started"],
        ["Verify call continuity after approved removals", 1, "not_started"],
        ["Update actual RingCentral savings realized", 0.5, "not_started"],
      ],
    },
    {
      title: "Phase 4: T-Mobile & Device Inventory",
      weight: 12,
      tasks: [
        ["Create T-Mobile and Devices tabs", 2, "completed"],
        ["Collect current T-Mobile bill/export", 2, "not_started"],
        ["Inventory T-Mobile phone numbers, SIMs, plans, and monthly costs", 2, "not_started"],
        ["Inventory devices, serial numbers, cellular lines, and assigned users", 2, "not_started"],
        ["Match T-Mobile lines to devices and active users", 1, "not_started"],
        ["Identify unused, duplicate, inactive, or unassigned lines/devices", 1, "not_started"],
        ["Validate proposed removals or reassignments with owners", 0.8, "not_started"],
        ["Execute approved cancellations, returns, or reassignments", 0.8, "not_started"],
        ["Update tracker with savings and disposition notes", 0.4, "not_started"],
      ],
    },
    {
      title: "Phase 5: Spruce & Phone Workflow Alignment",
      weight: 12,
      tasks: [
        ["Create Spruce cost review tab", 1, "completed"],
        ["Confirm current Spruce account/admin access", 1, "not_started"],
        ["Inventory Spruce users, numbers, groups, and routing setup", 1.5, "not_started"],
        ["Determine overlap between Spruce, RingCentral, and T-Mobile", 1.5, "not_started"],
        ["Verify active WC360/BCMD users and groups in Spruce as needed", 1.5, "not_started"],
        [
          "Define target phone workflow: what should live in Spruce vs RingCentral vs mobile lines",
          2,
          "not_started",
        ],
        ["Configure or clean up Spruce groups, users, and routing", 1.5, "not_started"],
        ["Train affected users on Spruce workflow if needed", 1, "not_started"],
        ["Validate live call/text routing after changes", 1, "not_started"],
      ],
    },
    {
      title: "Phase 6: Zoho & Adobe License Review",
      weight: 10,
      tasks: [
        ["Create Zoho and Adobe cost review tabs", 2, "completed"],
        ["Gather Zoho user/license export", 1, "not_started"],
        ["Gather Adobe user/license export", 1, "not_started"],
        ["Map Zoho and Adobe users to role/business need", 1.5, "not_started"],
        ["Identify unused or redundant Zoho licenses/modules", 1, "not_started"],
        ["Identify unused or redundant Adobe licenses", 1, "not_started"],
        ["Validate proposed removals with department owners", 0.8, "not_started"],
        ["Execute approved removals, downgrades, or cancellations", 1, "not_started"],
        ["Update actual savings and notes", 0.7, "not_started"],
      ],
    },
    {
      title: "Phase 7: Cross-System Redundancy Mapping & Ownership Governance",
      weight: 10,
      tasks: [
        ["Build master user/system ownership map across all tabs", 2, "not_started"],
        [
          "Cross-check users across Microsoft 365, RingCentral, Spruce, T-Mobile, Zoho, and Adobe",
          1.5,
          "not_started",
        ],
        [
          "Identify duplicate tools/workflows across phone, communication, documents, creative, CRM/admin, and mobile lines",
          1.5,
          "not_started",
        ],
        ["Define system of record for each major function", 1, "not_started"],
        ["Require owner and business purpose for every paid item", 1, "not_started"],
        [
          "Create removal/approval rules for future licenses, devices, phone lines, and subscriptions",
          1,
          "not_started",
        ],
        ["Create renewal and billing review cadence", 1, "not_started"],
        ["Build exceptions list for paid items that must remain", 1, "not_started"],
      ],
    },
    {
      title: "Phase 8: Quick Wins & Savings Execution",
      weight: 10,
      tasks: [
        ["Create Quick Wins tab scaffold", 1, "completed"],
        ["Populate high-confidence savings opportunities", 2, "not_started"],
        ["Rank opportunities by savings, risk, effort, and decision owner", 1.5, "not_started"],
        ["Create action plan for first removals/downgrades/cancellations", 1.5, "not_started"],
        ["Track approval status and next steps for each quick win", 1, "not_started"],
        ["Implement approved quick wins", 1, "not_started"],
        ["Record actual monthly and annual savings realized", 1, "not_started"],
        ["Capture lessons learned, blockers, and unresolved items", 1, "not_started"],
      ],
    },
    {
      title: "Phase 9: Dashboard QA, Reporting, and Handoff",
      weight: 8,
      tasks: [
        ["Audit Dashboard formulas and cross-sheet references", 2, "not_started"],
        ["Fix dashboard summary logic for all systems", 1.5, "not_started"],
        [
          "Add progress indicators for review completion and implementation completion",
          1,
          "not_started",
        ],
        ["Create weekly leadership summary/reporting view", 1, "not_started"],
        [
          "Create SOP for adding/removing systems, licenses, phone lines, and devices going forward",
          1,
          "not_started",
        ],
        ["Handoff ongoing ownership to WC360 admin/finance/operations owner", 1, "not_started"],
        ["Close project with final savings report", 0.5, "not_started"],
      ],
    },
    {
      title: "Milestones",
      weight: 0,
      tasks: [
        ["Workbook Structure Created", 0, "completed"],
        ["Microsoft 365 Initial Review Completed", 0, "completed"],
        ["RingCentral Initial Review Completed", 0, "completed"],
        ["T-Mobile & Device Inventory Completed", 0, "not_started"],
        ["Spruce / Phone Workflow Target State Defined", 0, "not_started"],
        ["Zoho & Adobe Reviews Completed", 0, "not_started"],
        ["Quick Wins Approved", 0, "not_started"],
        ["First Savings Actions Implemented", 0, "not_started"],
        ["Dashboard QA Complete", 0, "not_started"],
        ["Final Savings Report Delivered", 0, "not_started"],
      ],
    },
  ],
};

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

function taskInsert(title, weight, status, sortOrder) {
  if (status === "completed") {
    return `
  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', '${escapeSql(title)}', ${weight}, ${sortOrder}, '${status}', NOW());
`;
  }
  return `
  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', '${escapeSql(title)}', ${weight}, ${sortOrder}, '${status}');
`;
}

let phaseBlocks = "";
project.phases.forEach((phase, phaseIndex) => {
  phaseBlocks += `
  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', '${escapeSql(phase.title)}', ${phase.weight}, ${phaseIndex + 1})
  RETURNING id INTO v_phase_id;
`;
  phase.tasks.forEach(([title, weight, status], taskIndex) => {
    phaseBlocks += taskInsert(title, weight, status, taskIndex + 1);
  });
});

const sql = `-- Seed WC360 Cost Governance & Redundancy Cleanup project
DO $$
DECLARE
  v_company_id UUID;
  v_project_id UUID;
  v_phase_id UUID;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE name = 'WoundCare 360' LIMIT 1;
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'WoundCare 360 company not found';
  END IF;

  SELECT id INTO v_project_id FROM projects WHERE name = 'WC360 Cost Governance & Redundancy Cleanup' LIMIT 1;
  IF v_project_id IS NOT NULL THEN
    RAISE NOTICE 'WC360 Cost Governance & Redundancy Cleanup already exists, skipping seed';
    RETURN;
  END IF;

  INSERT INTO projects (company_id, name, description, status, priority)
  VALUES (
    v_company_id,
    'WC360 Cost Governance & Redundancy Cleanup',
    '${escapeSql(project.description)}',
    'in_progress',
    'high'
  )
  RETURNING id INTO v_project_id;
${phaseBlocks}
END $$;
`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(
  join(root, "supabase/migrations/010_seed_wc360_cost_governance_project.sql"),
  sql
);
console.log("Generated supabase/migrations/010_seed_wc360_cost_governance_project.sql");
