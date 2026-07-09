-- Seed WC360 Cost Governance & Redundancy Cleanup project
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
    'Create a complete cost governance and redundancy cleanup process for WC360. Track every system WC360 uses, who uses each item/license/line/device, what it costs, what can be removed, what requires approval, and what savings are actually realized. Based on the WC360 Cost Governance Workbook with tabs for Dashboard, License Assumptions, Microsoft 365, T-Mobile, RingCentral, Devices, Spruce, Zoho, Adobe, and Quick Wins.',
    'in_progress',
    'high'
  )
  RETURNING id INTO v_project_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 1: Workbook Foundation & Project Setup', 12, 1)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Review current WC360 cost governance workbook and existing tabs', 1, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create initial cost governance workbook structure', 2, 2, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create scoped system tabs: Dashboard, License Assumptions, Microsoft 365, T-Mobile, RingCentral, Devices, Spruce, Zoho, Adobe, Quick Wins', 2, 3, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create License Assumptions tab for pricing references and assumptions', 2, 4, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create initial Dashboard / savings summary scaffold', 2, 5, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Standardize action/status options across all system tabs', 1, 6, 'in_progress');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify decision owners/approvers for removals, downgrades, ports, and system changes', 1, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Define recurring governance cadence for ongoing cost review', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 2: Microsoft 365 / GoDaddy License Review', 14, 2)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Import Microsoft 365 mailbox/license list', 3, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Map visible GoDaddy/Microsoft license pricing to each license type', 2, 2, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Keep/Remove/Review actions and savings formulas', 2, 3, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Complete initial Microsoft 365 Keep/Remove/Review classification', 2, 4, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Add owner and business purpose for each mailbox/license', 1.5, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Validate proposed removals with leadership or department owners', 1.5, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Execute approved Microsoft 365 removals/downgrades', 1, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm actual monthly savings after GoDaddy/Microsoft changes', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 3: RingCentral Review & Cleanup', 12, 3)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create RingCentral cost review sheet', 1, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Import current RingCentral users, extensions, and phone numbers', 2.5, 2, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Add monthly cost and savings formulas', 1.5, 3, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Complete initial RingCentral Keep/Remove/Review classification', 2, 4, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Validate RingCentral lines marked Review', 1, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm which numbers need Spruce transition, forwarding, or port planning', 1.5, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Execute approved RingCentral removals/cancellations', 1, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify call continuity after approved removals', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Update actual RingCentral savings realized', 0.5, 9, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 4: T-Mobile & Device Inventory', 12, 4)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create T-Mobile and Devices tabs', 2, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Collect current T-Mobile bill/export', 2, 2, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Inventory T-Mobile phone numbers, SIMs, plans, and monthly costs', 2, 3, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Inventory devices, serial numbers, cellular lines, and assigned users', 2, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Match T-Mobile lines to devices and active users', 1, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify unused, duplicate, inactive, or unassigned lines/devices', 1, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Validate proposed removals or reassignments with owners', 0.8, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Execute approved cancellations, returns, or reassignments', 0.8, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Update tracker with savings and disposition notes', 0.4, 9, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 5: Spruce & Phone Workflow Alignment', 12, 5)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create Spruce cost review tab', 1, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm current Spruce account/admin access', 1, 2, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Inventory Spruce users, numbers, groups, and routing setup', 1.5, 3, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Determine overlap between Spruce, RingCentral, and T-Mobile', 1.5, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify active WC360/BCMD users and groups in Spruce as needed', 1.5, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Define target phone workflow: what should live in Spruce vs RingCentral vs mobile lines', 2, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure or clean up Spruce groups, users, and routing', 1.5, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Train affected users on Spruce workflow if needed', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Validate live call/text routing after changes', 1, 9, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 6: Zoho & Adobe License Review', 10, 6)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create Zoho and Adobe cost review tabs', 2, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Gather Zoho user/license export', 1, 2, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Gather Adobe user/license export', 1, 3, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Map Zoho and Adobe users to role/business need', 1.5, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify unused or redundant Zoho licenses/modules', 1, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify unused or redundant Adobe licenses', 1, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Validate proposed removals with department owners', 0.8, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Execute approved removals, downgrades, or cancellations', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Update actual savings and notes', 0.7, 9, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 7: Cross-System Redundancy Mapping & Ownership Governance', 10, 7)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Build master user/system ownership map across all tabs', 2, 1, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Cross-check users across Microsoft 365, RingCentral, Spruce, T-Mobile, Zoho, and Adobe', 1.5, 2, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify duplicate tools/workflows across phone, communication, documents, creative, CRM/admin, and mobile lines', 1.5, 3, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Define system of record for each major function', 1, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Require owner and business purpose for every paid item', 1, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Create removal/approval rules for future licenses, devices, phone lines, and subscriptions', 1, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Create renewal and billing review cadence', 1, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Build exceptions list for paid items that must remain', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 8: Quick Wins & Savings Execution', 10, 8)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Create Quick Wins tab scaffold', 1, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Populate high-confidence savings opportunities', 2, 2, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Rank opportunities by savings, risk, effort, and decision owner', 1.5, 3, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Create action plan for first removals/downgrades/cancellations', 1.5, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Track approval status and next steps for each quick win', 1, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Implement approved quick wins', 1, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Record actual monthly and annual savings realized', 1, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Capture lessons learned, blockers, and unresolved items', 1, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 9: Dashboard QA, Reporting, and Handoff', 8, 9)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Audit Dashboard formulas and cross-sheet references', 2, 1, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Fix dashboard summary logic for all systems', 1.5, 2, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Add progress indicators for review completion and implementation completion', 1, 3, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Create weekly leadership summary/reporting view', 1, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Create SOP for adding/removing systems, licenses, phone lines, and devices going forward', 1, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Handoff ongoing ownership to WC360 admin/finance/operations owner', 1, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Close project with final savings report', 0.5, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Milestones', 0, 10)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Workbook Structure Created', 0, 1, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'Microsoft 365 Initial Review Completed', 0, 2, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status, completed_at)
  VALUES (v_project_id, v_phase_id, 'task', 'RingCentral Initial Review Completed', 0, 3, 'completed', NOW());

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'T-Mobile & Device Inventory Completed', 0, 4, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Spruce / Phone Workflow Target State Defined', 0, 5, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Zoho & Adobe Reviews Completed', 0, 6, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Quick Wins Approved', 0, 7, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'First Savings Actions Implemented', 0, 8, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Dashboard QA Complete', 0, 9, 'not_started');

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order, status)
  VALUES (v_project_id, v_phase_id, 'task', 'Final Savings Report Delivered', 0, 10, 'not_started');

END $$;
