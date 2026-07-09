-- Seed OAF Newsfeed Command Center project with weighted phases and tasks
DO $$
DECLARE
  v_company_id UUID;
  v_project_id UUID;
  v_phase_id UUID;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE name = 'OAF Nation' LIMIT 1;
  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'OAF Nation company not found';
  END IF;

  SELECT id INTO v_project_id FROM projects WHERE name = 'OAF Newsfeed Command Center' LIMIT 1;
  IF v_project_id IS NOT NULL THEN
    RAISE NOTICE 'OAF Newsfeed Command Center already exists, skipping seed';
    RETURN;
  END IF;

  INSERT INTO projects (company_id, name, description, status, priority)
  VALUES (
    v_company_id,
    'OAF Newsfeed Command Center',
    'Internal newsfeed automation system for OAF. Pull or intake candidate articles, review/select 4–6 per day, generate OAF-style Newsroom/social packages, and send selected packages to Slack for approval.',
    'in_progress',
    'high'
  )
  RETURNING id INTO v_project_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 1: Project Setup, Scope, and Workflow Discovery', 10, 1)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Review existing OAF social media Slack workflow', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Document current approval flow: post package → thread → ✅ approval', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Phase 1 responsibility split: Brandon drafts/source package, Lance posts, Anthony PM', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Document OAF content themes and Commander''s Intent', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Define MVP scope: article intake/review/generate/send to Slack only', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Reuters access method: manual, Reuters Connect, API, export, or other', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 2: Source Intake System', 15, 2)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create source settings structure: Reuters, RSS, DVIDS, open sources, discovery-only sources', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build manual Reuters intake form', 3, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add fields for headline, article text, source URL/article ID, published date, reporter/editing credit', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create article database/table', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create source usage labels: Reuters licensed, open source, public domain, discovery only, needs review', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build RSS/open-source adapter structure', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add source toggle on/off setting', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Store raw pulled/imported content for traceability', 1.5, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 3: News Inbox and Candidate Review', 15, 3)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build News Inbox screen', 2.5, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Display article cards with title, source, date, topic, region, summary, status', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add filters: source, topic, date, status, OAF fit score', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add article statuses: pulled, shortlisted, rejected, generated, ready for Slack, sent, approved, revision, posted', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build Article Review screen', 2.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add shortlist/reject buttons', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Generate Package button', 1.5, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add daily target indicator: 4–6 articles selected', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add duplicate/similar story warning', 1, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 4: OAF Fit Scoring and Topic Matching', 10, 4)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create topic categories: Ukraine/Russia, NATO, Middle East, China/Taiwan, Pentagon, weapons, terrorism, veteran/military-adjacent', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build keyword matching for each category', 1.5, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add AI-generated article summary', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Why This Fits OAF explanation', 1.5, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add OAF fit score from 1–100', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add visual/graphic potential score from 1–5', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add low-priority rules for generic politics, entertainment, lifestyle, non-security stories', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 5: AI Package Generator', 20, 5)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create structured AI prompt for OAF-style Newsroom drafts', 3, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Require AI to only use facts from the source article', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate OAF-style headline', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate Newsroom draft', 3, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate short excerpt/teaser', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate IG caption', 1.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate FB caption', 1.5, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate hashtag suggestions', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate suggested post time', 1, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate photo/creative direction', 1.5, 10);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate photo caption/source credit', 1, 11);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Preserve Reuters reporting/editing credit', 1, 12);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Save generated package to database', 0.5, 13);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 6: Slack Approval Package', 15, 6)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create Slack app/bot setup', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Store Slack channel ID and bot token securely', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build Slack Preview screen', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Format main Slack message: headline, source, suggested time, creative direction, approval status', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Format thread reply: Newsroom draft, IG copy, FB copy, hashtag, source credit, source URL', 2.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Send to Slack button', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Save Slack timestamp/thread ID after posting', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add approval instructions: ✅ approve, 🔁 revise, ❌ reject', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Update article status to sent_to_slack', 1.5, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 7: Status Board and Project Tracking', 7, 7)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build Status Board screen', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Group articles by status', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Show daily count: pulled, shortlisted, generated, sent, approved, posted', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add manual status updates', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add notes/comments field per article', 1, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add simple activity timeline per article', 0.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 8: Testing, QA, and Safety Checks', 10, 8)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test manual Reuters intake', 1.5, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test package generation against real OAF examples', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test Slack message formatting', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test Slack thread reply formatting', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test source credit preservation', 1, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test that AI does not invent facts', 1.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test status changes from intake to Slack sent', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Fix UI/workflow bugs', 0.5, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 9: Deployment and Handoff', 8, 9)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Deploy internal app', 1.5, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure environment variables', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Set up Supabase production tables', 1, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Set up Slack bot permissions', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create basic SOP for Brandon workflow', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create basic SOP for Lance handoff', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Final walkthrough with Anthony/Lance', 1, 7);

  -- User spec phase weights sum to 110%; normalize all weights to 100%
  UPDATE work_items
  SET weight = ROUND((weight * 100.0 / 110.0)::numeric, 2)
  WHERE project_id = v_project_id;

  UPDATE work_items SET weight = weight + 0.04
  WHERE id = (
    SELECT wi.id FROM work_items wi
    WHERE wi.project_id = v_project_id AND wi.type = 'task'
    ORDER BY wi.sort_order DESC
    LIMIT 1
  );

END $$;
