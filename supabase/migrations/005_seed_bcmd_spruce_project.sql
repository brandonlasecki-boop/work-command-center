-- Seed BCMD Spruce Phone Migration project
DO $$
DECLARE
  v_company_id UUID;
  v_project_id UUID;
  v_phase_id UUID;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE name = 'BCMD' LIMIT 1;
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'BCMD company not found';
  END IF;

  SELECT id INTO v_project_id FROM projects WHERE name = 'BCMD Spruce Phone Migration' LIMIT 1;
  IF v_project_id IS NOT NULL THEN
    RAISE NOTICE 'BCMD Spruce Phone Migration already exists, skipping seed';
    RETURN;
  END IF;

  INSERT INTO projects (company_id, name, description, status, priority)
  VALUES (
    v_company_id,
    'BCMD Spruce Phone Migration',
    'Migrate the BCMD phone line to Spruce, ensure successful number porting, onboard all BCMD staff into Spruce, organize users, validate functionality, and transition the team to daily use.',
    'in_progress',
    'high'
  )
  RETURNING id INTO v_project_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 1: Planning & Approval', 12, 1)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm project scope and migration objectives', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Obtain BCMD approval to migrate phone line', 3, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify current phone carrier/account information', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Gather required porting documentation (account number, PIN, billing address, authorization, etc.)', 2.5, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify Spruce account ownership/admin access', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Establish migration timeline and communication plan', 1.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 2: Spruce Environment Setup', 18, 2)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure Spruce organization settings', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create BCMD team/group', 3, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Invite all BCMD members to Spruce', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify each member has activated their account', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Assign roles and permissions', 2, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure inbox/group routing', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure notifications for all users', 2, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify desktop/mobile access for all users', 3, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 3: Phone Number Porting', 22, 3)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify port eligibility', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Complete port request documentation', 3, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Submit phone number port request', 5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Monitor port request status', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Respond to carrier/Spruce requests if needed', 2, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify approved port date', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm successful number transfer', 4, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Validate inbound/outbound calling after port', 2, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 4: System Configuration', 15, 4)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure business hours', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure auto replies', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure voicemail greeting', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure voicemail routing', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure shared inbox workflows', 2, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure tags/categories if needed', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure message assignment process', 2, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test notifications and routing', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 5: Testing & Validation', 13, 5)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test inbound calls', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test outbound calls', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test SMS messaging', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test MMS/images', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test group messaging', 1, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test voicemail', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test internal message assignment', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify every BCMD member can access Spruce', 2, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 6: User Training & Adoption', 12, 6)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create quick-start guide', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Conduct team walkthrough/training', 3, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Demonstrate call handling workflow', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Demonstrate messaging workflow', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Answer user questions', 1, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Verify users are comfortable using Spruce', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 7: Go Live & Support', 8, 7)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Announce go-live', 1, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Monitor first-day usage', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Resolve post-migration issues', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm all users actively using Spruce', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Close migration project', 2, 5);

END $$;
