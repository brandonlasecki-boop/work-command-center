-- Add Platform Access & Setup phase to OAF Newsfeed Command Center and renormalize weights.
-- Previous raw total: 110. Removed duplicate Reuters task: -1. New phase raw weight: 22. New raw total: 131.
DO $$
DECLARE
  v_project_id UUID;
  v_phase_id UUID;
  v_existing_phase UUID;
BEGIN
  SELECT id INTO v_project_id
  FROM projects
  WHERE name = 'OAF Newsfeed Command Center'
  LIMIT 1;

  IF v_project_id IS NULL THEN
    RAISE NOTICE 'OAF Newsfeed Command Center not found, skipping';
    RETURN;
  END IF;

  SELECT id INTO v_existing_phase
  FROM work_items
  WHERE project_id = v_project_id
    AND type = 'phase'
    AND title = 'Phase 2: Platform Access & Setup'
  LIMIT 1;

  IF v_existing_phase IS NOT NULL THEN
    RAISE NOTICE 'Platform Access & Setup phase already exists, skipping';
    RETURN;
  END IF;

  DELETE FROM work_items
  WHERE project_id = v_project_id
    AND type = 'task'
    AND title = 'Confirm Reuters access method: manual, Reuters Connect, API, export, or other';

  UPDATE work_items
  SET sort_order = sort_order + 1
  WHERE project_id = v_project_id
    AND type = 'phase'
    AND sort_order >= 2;

  UPDATE work_items
  SET title = CASE title
    WHEN 'Phase 2: Source Intake System' THEN 'Phase 3: Source Intake System'
    WHEN 'Phase 3: News Inbox and Candidate Review' THEN 'Phase 4: News Inbox and Candidate Review'
    WHEN 'Phase 4: OAF Fit Scoring and Topic Matching' THEN 'Phase 5: OAF Fit Scoring and Topic Matching'
    WHEN 'Phase 5: AI Package Generator' THEN 'Phase 6: AI Package Generator'
    WHEN 'Phase 6: Slack Approval Package' THEN 'Phase 7: Slack Approval Package'
    WHEN 'Phase 7: Status Board and Project Tracking' THEN 'Phase 8: Status Board and Project Tracking'
    WHEN 'Phase 8: Testing, QA, and Safety Checks' THEN 'Phase 9: Testing, QA, and Safety Checks'
    WHEN 'Phase 9: Deployment and Handoff' THEN 'Phase 10: Deployment and Handoff'
    ELSE title
  END
  WHERE project_id = v_project_id
    AND type = 'phase';

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (
    v_project_id,
    NULL,
    'phase',
    'Phase 2: Platform Access & Setup',
    'Secure and document all platform access needed to support the OAF Newsfeed workflow, including source access, Newsroom access, social media access, Slack workflow access, creative assets, and automation credentials.',
    22,
    2
  )
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES
    (
      v_project_id,
      v_phase_id,
      'task',
      'Confirm OAF Slack workspace/channel access',
      'Confirm access to the OAF social media channel and ability to view current workflow, post messages, and use threads.',
      'in_progress',
      2,
      1
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Identify OAF Slack admin / app approval owner',
      'Needed for future Slack bot/app setup.',
      'not_started',
      1,
      2
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Confirm Reuters subscription owner and access method',
      'Identify whether access is through Reuters Connect, login, export, feed, API, MCP, email, or manual workflow.',
      'not_started',
      2,
      3
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Confirm Reuters license usage rights',
      'Confirm whether OAF can republish Reuters text/images on the OAF Newsroom and use related copy on Facebook/Instagram.',
      'not_started',
      2,
      4
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Request Shopify/OAF Newsroom access',
      'Prefer draft/view access first. Need ability to view existing Newsroom posts and eventually create drafts if Phase 2/3 requires it.',
      'not_started',
      2,
      5
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Identify Shopify admin / publishing owner',
      'Track who can approve/publish final OAF Newsroom posts.',
      'not_started',
      1,
      6
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Request Meta Business Suite access',
      'Needed for Facebook Page and Instagram account visibility. Phase 1 may only require view access; Phase 2 may require posting/scheduling access.',
      'not_started',
      2,
      7
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Confirm Facebook Page permissions',
      'Track whether access is view-only, content creation, publishing, or admin.',
      'not_started',
      1,
      8
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Confirm Instagram business account permissions',
      'Track whether access allows viewing, posting, scheduling, insights, or admin.',
      'not_started',
      1,
      9
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Identify current social scheduling tool, if any',
      'Determine whether OAF uses Meta Planner, Buffer, Metricool, Later, Hootsuite, or manual posting only.',
      'not_started',
      1,
      10
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Request creative asset/template access',
      'Canva, Adobe, brand kit, logos, templates, image sizing rules, and approved design examples.',
      'not_started',
      1.5,
      11
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Confirm where approved assets are stored',
      'Google Drive, Dropbox, SharePoint, Slack files, or another asset library.',
      'not_started',
      1,
      12
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Document open/approved source candidates for future Reuters replacement',
      'DVIDS, Defense.gov, NATO, State.gov, CENTCOM/EUCOM, Navy/Air Force/Army feeds, GDELT, NewsAPI, etc.',
      'not_started',
      1.5,
      13
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Set up development/admin access for automation build',
      'GitHub, Vercel, Supabase, Slack app credentials, AI API key, environment variables.',
      'not_started',
      2,
      14
    ),
    (
      v_project_id,
      v_phase_id,
      'task',
      'Create access tracker table',
      'Track platform, purpose, owner, access level, credentials method, status, blocker, and notes.',
      'not_started',
      1,
      15
    );

  -- Existing items were normalized to 100/110; scale to 100/131.
  UPDATE work_items
  SET weight = ROUND((weight * 110.0 / 131.0)::numeric, 2)
  WHERE project_id = v_project_id
    AND id <> v_phase_id
    AND parent_id IS DISTINCT FROM v_phase_id;

  -- New phase and tasks were inserted at raw weights; normalize to 100/131.
  UPDATE work_items
  SET weight = ROUND((weight * 100.0 / 131.0)::numeric, 2)
  WHERE project_id = v_project_id
    AND (id = v_phase_id OR parent_id = v_phase_id);

  DELETE FROM work_items
  WHERE project_id = v_project_id
    AND type = 'phase'
    AND title = 'Setup:Access';

  UPDATE work_items
  SET sort_order = CASE title
    WHEN 'Phase 1: Project Setup, Scope, and Workflow Discovery' THEN 1
    WHEN 'Phase 2: Platform Access & Setup' THEN 2
    WHEN 'Phase 3: Source Intake System' THEN 3
    WHEN 'Phase 4: News Inbox and Candidate Review' THEN 4
    WHEN 'Phase 5: OAF Fit Scoring and Topic Matching' THEN 5
    WHEN 'Phase 6: AI Package Generator' THEN 6
    WHEN 'Phase 7: Slack Approval Package' THEN 7
    WHEN 'Phase 8: Status Board and Project Tracking' THEN 8
    WHEN 'Phase 9: Testing, QA, and Safety Checks' THEN 9
    WHEN 'Phase 10: Deployment and Handoff' THEN 10
    ELSE sort_order
  END
  WHERE project_id = v_project_id
    AND type = 'phase';

END $$;
