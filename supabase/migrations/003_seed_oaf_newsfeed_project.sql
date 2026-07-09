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

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 1: Project Setup, Scope, and Workflow Discovery', NULL, 9, 1)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Review existing OAF social media Slack workflow', NULL, 'not_started', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Document current approval flow: post package → thread → ✅ approval', NULL, 'not_started', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Phase 1 responsibility split: Brandon drafts/source package, Lance posts, Anthony PM', NULL, 'not_started', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Document OAF content themes and Commander''s Intent', NULL, 'not_started', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Define MVP scope: article intake/review/generate/send to Slack only', NULL, 'not_started', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 2: Platform Access & Setup', 'Secure and document all platform access needed to support the OAF Newsfeed workflow, including source access, Newsroom access, social media access, Slack workflow access, creative assets, and automation credentials.', 22, 2)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm OAF Slack workspace/channel access', 'Confirm access to the OAF social media channel and ability to view current workflow, post messages, and use threads.', 'in_progress', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify OAF Slack admin / app approval owner', 'Needed for future Slack bot/app setup.', 'not_started', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Reuters subscription owner and access method', 'Identify whether access is through Reuters Connect, login, export, feed, API, MCP, email, or manual workflow.', 'not_started', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Reuters license usage rights', 'Confirm whether OAF can republish Reuters text/images on the OAF Newsroom and use related copy on Facebook/Instagram.', 'not_started', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Request Shopify/OAF Newsroom access', 'Prefer draft/view access first. Need ability to view existing Newsroom posts and eventually create drafts if Phase 2/3 requires it.', 'not_started', 2, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify Shopify admin / publishing owner', 'Track who can approve/publish final OAF Newsroom posts.', 'not_started', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Request Meta Business Suite access', 'Needed for Facebook Page and Instagram account visibility. Phase 1 may only require view access; Phase 2 may require posting/scheduling access.', 'not_started', 2, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Facebook Page permissions', 'Track whether access is view-only, content creation, publishing, or admin.', 'not_started', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm Instagram business account permissions', 'Track whether access allows viewing, posting, scheduling, insights, or admin.', 'not_started', 1, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Identify current social scheduling tool, if any', 'Determine whether OAF uses Meta Planner, Buffer, Metricool, Later, Hootsuite, or manual posting only.', 'not_started', 1, 10);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Request creative asset/template access', 'Canva, Adobe, brand kit, logos, templates, image sizing rules, and approved design examples.', 'not_started', 1.5, 11);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Confirm where approved assets are stored', 'Google Drive, Dropbox, SharePoint, Slack files, or another asset library.', 'not_started', 1, 12);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Document open/approved source candidates for future Reuters replacement', 'DVIDS, Defense.gov, NATO, State.gov, CENTCOM/EUCOM, Navy/Air Force/Army feeds, GDELT, NewsAPI, etc.', 'not_started', 1.5, 13);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Set up development/admin access for automation build', 'GitHub, Vercel, Supabase, Slack app credentials, AI API key, environment variables.', 'not_started', 2, 14);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create access tracker table', 'Track platform, purpose, owner, access level, credentials method, status, blocker, and notes.', 'not_started', 1, 15);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 3: Source Intake System', NULL, 15, 3)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create source settings structure: Reuters, RSS, DVIDS, open sources, discovery-only sources', NULL, 'not_started', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build manual Reuters intake form', NULL, 'not_started', 3, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add fields for headline, article text, source URL/article ID, published date, reporter/editing credit', NULL, 'not_started', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create article database/table', NULL, 'not_started', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create source usage labels: Reuters licensed, open source, public domain, discovery only, needs review', NULL, 'not_started', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build RSS/open-source adapter structure', NULL, 'not_started', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add source toggle on/off setting', NULL, 'not_started', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Store raw pulled/imported content for traceability', NULL, 'not_started', 1.5, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 4: News Inbox and Candidate Review', NULL, 15, 4)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build News Inbox screen', NULL, 'not_started', 2.5, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Display article cards with title, source, date, topic, region, summary, status', NULL, 'not_started', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add filters: source, topic, date, status, OAF fit score', NULL, 'not_started', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add article statuses: pulled, shortlisted, rejected, generated, ready for Slack, sent, approved, revision, posted', NULL, 'not_started', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build Article Review screen', NULL, 'not_started', 2.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add shortlist/reject buttons', NULL, 'not_started', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Generate Package button', NULL, 'not_started', 1.5, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add daily target indicator: 4–6 articles selected', NULL, 'not_started', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add duplicate/similar story warning', NULL, 'not_started', 1, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 5: OAF Fit Scoring and Topic Matching', NULL, 10, 5)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create topic categories: Ukraine/Russia, NATO, Middle East, China/Taiwan, Pentagon, weapons, terrorism, veteran/military-adjacent', NULL, 'not_started', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build keyword matching for each category', NULL, 'not_started', 1.5, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add AI-generated article summary', NULL, 'not_started', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Why This Fits OAF explanation', NULL, 'not_started', 1.5, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add OAF fit score from 1–100', NULL, 'not_started', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add visual/graphic potential score from 1–5', NULL, 'not_started', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add low-priority rules for generic politics, entertainment, lifestyle, non-security stories', NULL, 'not_started', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 6: AI Package Generator', NULL, 20, 6)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create structured AI prompt for OAF-style Newsroom drafts', NULL, 'not_started', 3, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Require AI to only use facts from the source article', NULL, 'not_started', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate OAF-style headline', NULL, 'not_started', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate Newsroom draft', NULL, 'not_started', 3, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate short excerpt/teaser', NULL, 'not_started', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate IG caption', NULL, 'not_started', 1.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate FB caption', NULL, 'not_started', 1.5, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate hashtag suggestions', NULL, 'not_started', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate suggested post time', NULL, 'not_started', 1, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate photo/creative direction', NULL, 'not_started', 1.5, 10);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Generate photo caption/source credit', NULL, 'not_started', 1, 11);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Preserve Reuters reporting/editing credit', NULL, 'not_started', 1, 12);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Save generated package to database', NULL, 'not_started', 0.5, 13);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 7: Slack Approval Package', NULL, 15, 7)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create Slack app/bot setup', NULL, 'not_started', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Store Slack channel ID and bot token securely', NULL, 'not_started', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build Slack Preview screen', NULL, 'not_started', 2, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Format main Slack message: headline, source, suggested time, creative direction, approval status', NULL, 'not_started', 2, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Format thread reply: Newsroom draft, IG copy, FB copy, hashtag, source credit, source URL', NULL, 'not_started', 2.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add Send to Slack button', NULL, 'not_started', 2, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Save Slack timestamp/thread ID after posting', NULL, 'not_started', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add approval instructions: ✅ approve, 🔁 revise, ❌ reject', NULL, 'not_started', 1, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Update article status to sent_to_slack', NULL, 'not_started', 1.5, 9);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 8: Status Board and Project Tracking', NULL, 7, 8)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Build Status Board screen', NULL, 'not_started', 2, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Group articles by status', NULL, 'not_started', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Show daily count: pulled, shortlisted, generated, sent, approved, posted', NULL, 'not_started', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add manual status updates', NULL, 'not_started', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add notes/comments field per article', NULL, 'not_started', 1, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Add simple activity timeline per article', NULL, 'not_started', 0.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 9: Testing, QA, and Safety Checks', NULL, 10, 9)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test manual Reuters intake', NULL, 'not_started', 1.5, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test package generation against real OAF examples', NULL, 'not_started', 2, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test Slack message formatting', NULL, 'not_started', 1.5, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test Slack thread reply formatting', NULL, 'not_started', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test source credit preservation', NULL, 'not_started', 1, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test that AI does not invent facts', NULL, 'not_started', 1.5, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Test status changes from intake to Slack sent', NULL, 'not_started', 1, 7);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Fix UI/workflow bugs', NULL, 'not_started', 0.5, 8);

  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', 'Phase 10: Deployment and Handoff', NULL, 8, 10)
  RETURNING id INTO v_phase_id;

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Deploy internal app', NULL, 'not_started', 1.5, 1);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Configure environment variables', NULL, 'not_started', 1, 2);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Set up Supabase production tables', NULL, 'not_started', 1, 3);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Set up Slack bot permissions', NULL, 'not_started', 1, 4);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create basic SOP for Brandon workflow', NULL, 'not_started', 1.5, 5);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Create basic SOP for Lance handoff', NULL, 'not_started', 1, 6);

  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', 'Final walkthrough with Anthony/Lance', NULL, 'not_started', 1, 7);

  -- User spec phase weights sum to 131%; normalize all weights to 100%
  UPDATE work_items
  SET weight = ROUND((weight * 100.0 / 131.0)::numeric, 2)
  WHERE project_id = v_project_id;

  UPDATE work_items SET weight = weight + 0.04
  WHERE id = (
    SELECT wi.id FROM work_items wi
    WHERE wi.project_id = v_project_id AND wi.type = 'task'
    ORDER BY wi.sort_order DESC
    LIMIT 1
  );

END $$;
