export type SeedTaskStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "blocked"
  | "waiting_on_approval"
  | "waiting_on_vendor"
  | "waiting_on_internal_owner";

export type SeedTask = {
  title: string;
  weight: number;
  status?: SeedTaskStatus;
};

export type SeedPhase = {
  title: string;
  weight: number;
  tasks: SeedTask[];
};

export type SeedMilestone = {
  title: string;
  status: SeedTaskStatus;
};

export const WC360_COST_GOVERNANCE = {
  name: "WC360 Cost Governance & Redundancy Cleanup",
  companyName: "WoundCare 360",
  description:
    "Create a complete cost governance and redundancy cleanup process for WC360. Track every system WC360 uses, who uses each item/license/line/device, what it costs, what can be removed, what requires approval, and what savings are actually realized. Based on the WC360 Cost Governance Workbook with tabs for Dashboard, License Assumptions, Microsoft 365, T-Mobile, RingCentral, Devices, Spruce, Zoho, Adobe, and Quick Wins.",
  status: "in_progress" as const,
  priority: "high" as const,
  milestones: [
    { title: "Workbook Structure Created", status: "completed" },
    { title: "Microsoft 365 Initial Review Completed", status: "completed" },
    { title: "RingCentral Initial Review Completed", status: "completed" },
    { title: "T-Mobile & Device Inventory Completed", status: "not_started" },
    { title: "Spruce / Phone Workflow Target State Defined", status: "not_started" },
    { title: "Zoho & Adobe Reviews Completed", status: "not_started" },
    { title: "Quick Wins Approved", status: "not_started" },
    { title: "First Savings Actions Implemented", status: "not_started" },
    { title: "Dashboard QA Complete", status: "not_started" },
    { title: "Final Savings Report Delivered", status: "not_started" },
  ] satisfies SeedMilestone[],
  phases: [
    {
      title: "Phase 1: Workbook Foundation & Project Setup",
      weight: 12,
      tasks: [
        {
          title: "Review current WC360 cost governance workbook and existing tabs",
          weight: 1,
          status: "completed",
        },
        {
          title: "Create initial cost governance workbook structure",
          weight: 2,
          status: "completed",
        },
        {
          title:
            "Create scoped system tabs: Dashboard, License Assumptions, Microsoft 365, T-Mobile, RingCentral, Devices, Spruce, Zoho, Adobe, Quick Wins",
          weight: 2,
          status: "completed",
        },
        {
          title: "Create License Assumptions tab for pricing references and assumptions",
          weight: 2,
          status: "completed",
        },
        {
          title: "Create initial Dashboard / savings summary scaffold",
          weight: 2,
          status: "completed",
        },
        {
          title: "Standardize action/status options across all system tabs",
          weight: 1,
          status: "in_progress",
        },
        {
          title:
            "Identify decision owners/approvers for removals, downgrades, ports, and system changes",
          weight: 1,
        },
        {
          title: "Define recurring governance cadence for ongoing cost review",
          weight: 1,
        },
      ],
    },
    {
      title: "Phase 2: Microsoft 365 / GoDaddy License Review",
      weight: 14,
      tasks: [
        { title: "Import Microsoft 365 mailbox/license list", weight: 3, status: "completed" },
        {
          title: "Map visible GoDaddy/Microsoft license pricing to each license type",
          weight: 2,
          status: "completed",
        },
        {
          title: "Add Keep/Remove/Review actions and savings formulas",
          weight: 2,
          status: "completed",
        },
        {
          title: "Complete initial Microsoft 365 Keep/Remove/Review classification",
          weight: 2,
          status: "completed",
        },
        { title: "Add owner and business purpose for each mailbox/license", weight: 1.5 },
        {
          title: "Validate proposed removals with leadership or department owners",
          weight: 1.5,
        },
        { title: "Execute approved Microsoft 365 removals/downgrades", weight: 1 },
        {
          title: "Confirm actual monthly savings after GoDaddy/Microsoft changes",
          weight: 1,
        },
      ],
    },
    {
      title: "Phase 3: RingCentral Review & Cleanup",
      weight: 12,
      tasks: [
        { title: "Create RingCentral cost review sheet", weight: 1, status: "completed" },
        {
          title: "Import current RingCentral users, extensions, and phone numbers",
          weight: 2.5,
          status: "completed",
        },
        { title: "Add monthly cost and savings formulas", weight: 1.5, status: "completed" },
        {
          title: "Complete initial RingCentral Keep/Remove/Review classification",
          weight: 2,
          status: "completed",
        },
        { title: "Validate RingCentral lines marked Review", weight: 1 },
        {
          title: "Confirm which numbers need Spruce transition, forwarding, or port planning",
          weight: 1.5,
        },
        { title: "Execute approved RingCentral removals/cancellations", weight: 1 },
        { title: "Verify call continuity after approved removals", weight: 1 },
        { title: "Update actual RingCentral savings realized", weight: 0.5 },
      ],
    },
    {
      title: "Phase 4: T-Mobile & Device Inventory",
      weight: 12,
      tasks: [
        { title: "Create T-Mobile and Devices tabs", weight: 2, status: "completed" },
        { title: "Collect current T-Mobile bill/export", weight: 2 },
        {
          title: "Inventory T-Mobile phone numbers, SIMs, plans, and monthly costs",
          weight: 2,
        },
        {
          title: "Inventory devices, serial numbers, cellular lines, and assigned users",
          weight: 2,
        },
        { title: "Match T-Mobile lines to devices and active users", weight: 1 },
        {
          title: "Identify unused, duplicate, inactive, or unassigned lines/devices",
          weight: 1,
        },
        { title: "Validate proposed removals or reassignments with owners", weight: 0.8 },
        { title: "Execute approved cancellations, returns, or reassignments", weight: 0.8 },
        { title: "Update tracker with savings and disposition notes", weight: 0.4 },
      ],
    },
    {
      title: "Phase 5: Spruce & Phone Workflow Alignment",
      weight: 12,
      tasks: [
        { title: "Create Spruce cost review tab", weight: 1, status: "completed" },
        { title: "Confirm current Spruce account/admin access", weight: 1 },
        {
          title: "Inventory Spruce users, numbers, groups, and routing setup",
          weight: 1.5,
        },
        {
          title: "Determine overlap between Spruce, RingCentral, and T-Mobile",
          weight: 1.5,
        },
        {
          title: "Verify active WC360/BCMD users and groups in Spruce as needed",
          weight: 1.5,
        },
        {
          title:
            "Define target phone workflow: what should live in Spruce vs RingCentral vs mobile lines",
          weight: 2,
        },
        {
          title: "Configure or clean up Spruce groups, users, and routing",
          weight: 1.5,
        },
        { title: "Train affected users on Spruce workflow if needed", weight: 1 },
        { title: "Validate live call/text routing after changes", weight: 1 },
      ],
    },
    {
      title: "Phase 6: Zoho & Adobe License Review",
      weight: 10,
      tasks: [
        { title: "Create Zoho and Adobe cost review tabs", weight: 2, status: "completed" },
        { title: "Gather Zoho user/license export", weight: 1 },
        { title: "Gather Adobe user/license export", weight: 1 },
        { title: "Map Zoho and Adobe users to role/business need", weight: 1.5 },
        { title: "Identify unused or redundant Zoho licenses/modules", weight: 1 },
        { title: "Identify unused or redundant Adobe licenses", weight: 1 },
        { title: "Validate proposed removals with department owners", weight: 0.8 },
        { title: "Execute approved removals, downgrades, or cancellations", weight: 1 },
        { title: "Update actual savings and notes", weight: 0.7 },
      ],
    },
    {
      title: "Phase 7: Cross-System Redundancy Mapping & Ownership Governance",
      weight: 10,
      tasks: [
        { title: "Build master user/system ownership map across all tabs", weight: 2 },
        {
          title:
            "Cross-check users across Microsoft 365, RingCentral, Spruce, T-Mobile, Zoho, and Adobe",
          weight: 1.5,
        },
        {
          title:
            "Identify duplicate tools/workflows across phone, communication, documents, creative, CRM/admin, and mobile lines",
          weight: 1.5,
        },
        { title: "Define system of record for each major function", weight: 1 },
        { title: "Require owner and business purpose for every paid item", weight: 1 },
        {
          title:
            "Create removal/approval rules for future licenses, devices, phone lines, and subscriptions",
          weight: 1,
        },
        { title: "Create renewal and billing review cadence", weight: 1 },
        { title: "Build exceptions list for paid items that must remain", weight: 1 },
      ],
    },
    {
      title: "Phase 8: Quick Wins & Savings Execution",
      weight: 10,
      tasks: [
        { title: "Create Quick Wins tab scaffold", weight: 1, status: "completed" },
        { title: "Populate high-confidence savings opportunities", weight: 2 },
        {
          title: "Rank opportunities by savings, risk, effort, and decision owner",
          weight: 1.5,
        },
        {
          title: "Create action plan for first removals/downgrades/cancellations",
          weight: 1.5,
        },
        { title: "Track approval status and next steps for each quick win", weight: 1 },
        { title: "Implement approved quick wins", weight: 1 },
        { title: "Record actual monthly and annual savings realized", weight: 1 },
        { title: "Capture lessons learned, blockers, and unresolved items", weight: 1 },
      ],
    },
    {
      title: "Phase 9: Dashboard QA, Reporting, and Handoff",
      weight: 8,
      tasks: [
        { title: "Audit Dashboard formulas and cross-sheet references", weight: 2 },
        { title: "Fix dashboard summary logic for all systems", weight: 1.5 },
        {
          title: "Add progress indicators for review completion and implementation completion",
          weight: 1,
        },
        { title: "Create weekly leadership summary/reporting view", weight: 1 },
        {
          title:
            "Create SOP for adding/removing systems, licenses, phone lines, and devices going forward",
          weight: 1,
        },
        {
          title: "Handoff ongoing ownership to WC360 admin/finance/operations owner",
          weight: 1,
        },
        { title: "Close project with final savings report", weight: 0.5 },
      ],
    },
    {
      title: "Milestones",
      weight: 0,
      tasks: [
        { title: "Workbook Structure Created", weight: 0, status: "completed" },
        {
          title: "Microsoft 365 Initial Review Completed",
          weight: 0,
          status: "completed",
        },
        {
          title: "RingCentral Initial Review Completed",
          weight: 0,
          status: "completed",
        },
        { title: "T-Mobile & Device Inventory Completed", weight: 0 },
        { title: "Spruce / Phone Workflow Target State Defined", weight: 0 },
        { title: "Zoho & Adobe Reviews Completed", weight: 0 },
        { title: "Quick Wins Approved", weight: 0 },
        { title: "First Savings Actions Implemented", weight: 0 },
        { title: "Dashboard QA Complete", weight: 0 },
        { title: "Final Savings Report Delivered", weight: 0 },
      ],
    },
  ] satisfies SeedPhase[],
};

export function validateWc360ProjectWeights(project: typeof WC360_COST_GOVERNANCE): void {
  const weightedPhases = project.phases.filter((p) => p.weight > 0);
  const phaseTotal = weightedPhases.reduce((sum, p) => sum + p.weight, 0);
  if (Math.abs(phaseTotal - 100) > 0.001) {
    throw new Error(`Weighted phase weights sum to ${phaseTotal}, expected 100`);
  }
  for (const phase of project.phases) {
    const taskTotal = phase.tasks.reduce((sum, t) => sum + t.weight, 0);
    if (Math.abs(taskTotal - phase.weight) > 0.001) {
      throw new Error(`${phase.title}: task weights sum to ${taskTotal}, expected ${phase.weight}`);
    }
  }
}

validateWc360ProjectWeights(WC360_COST_GOVERNANCE);
