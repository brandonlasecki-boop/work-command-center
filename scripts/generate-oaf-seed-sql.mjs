import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const phases = [
  {
    title: "Phase 1: Project Setup, Scope, and Workflow Discovery",
    weight: 10,
    tasks: [
      ["Review existing OAF social media Slack workflow", 2],
      ["Document current approval flow: post package → thread → ✅ approval", 2],
      ["Confirm Phase 1 responsibility split: Brandon drafts/source package, Lance posts, Anthony PM", 1.5],
      ["Document OAF content themes and Commander's Intent", 2],
      ["Define MVP scope: article intake/review/generate/send to Slack only", 1.5],
      ["Confirm Reuters access method: manual, Reuters Connect, API, export, or other", 1],
    ],
  },
  {
    title: "Phase 2: Source Intake System",
    weight: 15,
    tasks: [
      ["Create source settings structure: Reuters, RSS, DVIDS, open sources, discovery-only sources", 2],
      ["Build manual Reuters intake form", 3],
      ["Add fields for headline, article text, source URL/article ID, published date, reporter/editing credit", 2],
      ["Create article database/table", 2],
      ["Create source usage labels: Reuters licensed, open source, public domain, discovery only, needs review", 1.5],
      ["Build RSS/open-source adapter structure", 2],
      ["Add source toggle on/off setting", 1],
      ["Store raw pulled/imported content for traceability", 1.5],
    ],
  },
  {
    title: "Phase 3: News Inbox and Candidate Review",
    weight: 15,
    tasks: [
      ["Build News Inbox screen", 2.5],
      ["Display article cards with title, source, date, topic, region, summary, status", 2],
      ["Add filters: source, topic, date, status, OAF fit score", 1.5],
      ["Add article statuses: pulled, shortlisted, rejected, generated, ready for Slack, sent, approved, revision, posted", 2],
      ["Build Article Review screen", 2.5],
      ["Add shortlist/reject buttons", 1],
      ["Add Generate Package button", 1.5],
      ["Add daily target indicator: 4–6 articles selected", 1],
      ["Add duplicate/similar story warning", 1],
    ],
  },
  {
    title: "Phase 4: OAF Fit Scoring and Topic Matching",
    weight: 10,
    tasks: [
      ["Create topic categories: Ukraine/Russia, NATO, Middle East, China/Taiwan, Pentagon, weapons, terrorism, veteran/military-adjacent", 2],
      ["Build keyword matching for each category", 1.5],
      ["Add AI-generated article summary", 1.5],
      ["Add Why This Fits OAF explanation", 1.5],
      ["Add OAF fit score from 1–100", 1.5],
      ["Add visual/graphic potential score from 1–5", 1],
      ["Add low-priority rules for generic politics, entertainment, lifestyle, non-security stories", 1],
    ],
  },
  {
    title: "Phase 5: AI Package Generator",
    weight: 20,
    tasks: [
      ["Create structured AI prompt for OAF-style Newsroom drafts", 3],
      ["Require AI to only use facts from the source article", 2],
      ["Generate OAF-style headline", 1.5],
      ["Generate Newsroom draft", 3],
      ["Generate short excerpt/teaser", 1.5],
      ["Generate IG caption", 1.5],
      ["Generate FB caption", 1.5],
      ["Generate hashtag suggestions", 1],
      ["Generate suggested post time", 1],
      ["Generate photo/creative direction", 1.5],
      ["Generate photo caption/source credit", 1],
      ["Preserve Reuters reporting/editing credit", 1],
      ["Save generated package to database", 0.5],
    ],
  },
  {
    title: "Phase 6: Slack Approval Package",
    weight: 15,
    tasks: [
      ["Create Slack app/bot setup", 2],
      ["Store Slack channel ID and bot token securely", 1],
      ["Build Slack Preview screen", 2],
      ["Format main Slack message: headline, source, suggested time, creative direction, approval status", 2],
      ["Format thread reply: Newsroom draft, IG copy, FB copy, hashtag, source credit, source URL", 2.5],
      ["Add Send to Slack button", 2],
      ["Save Slack timestamp/thread ID after posting", 1],
      ["Add approval instructions: ✅ approve, 🔁 revise, ❌ reject", 1],
      ["Update article status to sent_to_slack", 1.5],
    ],
  },
  {
    title: "Phase 7: Status Board and Project Tracking",
    weight: 7,
    tasks: [
      ["Build Status Board screen", 2],
      ["Group articles by status", 1],
      ["Show daily count: pulled, shortlisted, generated, sent, approved, posted", 1.5],
      ["Add manual status updates", 1],
      ["Add notes/comments field per article", 1],
      ["Add simple activity timeline per article", 0.5],
    ],
  },
  {
    title: "Phase 8: Testing, QA, and Safety Checks",
    weight: 10,
    tasks: [
      ["Test manual Reuters intake", 1.5],
      ["Test package generation against real OAF examples", 2],
      ["Test Slack message formatting", 1.5],
      ["Test Slack thread reply formatting", 1],
      ["Test source credit preservation", 1],
      ["Test that AI does not invent facts", 1.5],
      ["Test status changes from intake to Slack sent", 1],
      ["Fix UI/workflow bugs", 0.5],
    ],
  },
  {
    title: "Phase 9: Deployment and Handoff",
    weight: 8,
    tasks: [
      ["Deploy internal app", 1.5],
      ["Configure environment variables", 1],
      ["Set up Supabase production tables", 1],
      ["Set up Slack bot permissions", 1],
      ["Create basic SOP for Brandon workflow", 1.5],
      ["Create basic SOP for Lance handoff", 1],
      ["Final walkthrough with Anthony/Lance", 1],
    ],
  },
];

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

let phaseBlocks = "";
phases.forEach((phase, phaseIndex) => {
  phaseBlocks += `
  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', '${escapeSql(phase.title)}', ${phase.weight}, ${phaseIndex + 1})
  RETURNING id INTO v_phase_id;
`;
  phase.tasks.forEach(([title, weight], taskIndex) => {
    phaseBlocks += `
  INSERT INTO work_items (project_id, parent_id, type, title, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', '${escapeSql(title)}', ${weight}, ${taskIndex + 1});
`;
  });
});

const sql = `-- Seed OAF Newsfeed Command Center project with weighted phases and tasks
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
${phaseBlocks}
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
`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(join(root, "supabase/migrations/003_seed_oaf_newsfeed_project.sql"), sql);
console.log("Generated supabase/migrations/003_seed_oaf_newsfeed_project.sql");
