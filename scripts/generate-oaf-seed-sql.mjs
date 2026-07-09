import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const phases = [
  {
    title: "Phase 1: Project Setup, Scope, and Workflow Discovery",
    weight: 9,
    description: null,
    tasks: [
      ["Review existing OAF social media Slack workflow", 2, "not_started", null],
      ["Document current approval flow: post package → thread → ✅ approval", 2, "not_started", null],
      ["Confirm Phase 1 responsibility split: Brandon drafts/source package, Lance posts, Anthony PM", 1.5, "not_started", null],
      ["Document OAF content themes and Commander's Intent", 2, "not_started", null],
      ["Define MVP scope: article intake/review/generate/send to Slack only", 1.5, "not_started", null],
    ],
  },
  {
    title: "Phase 2: Platform Access & Setup",
    weight: 22,
    description:
      "Secure and document all platform access needed to support the OAF Newsfeed workflow, including source access, Newsroom access, social media access, Slack workflow access, creative assets, and automation credentials.",
    tasks: [
      [
        "Confirm OAF Slack workspace/channel access",
        2,
        "in_progress",
        "Confirm access to the OAF social media channel and ability to view current workflow, post messages, and use threads.",
      ],
      [
        "Identify OAF Slack admin / app approval owner",
        1,
        "not_started",
        "Needed for future Slack bot/app setup.",
      ],
      [
        "Confirm Reuters subscription owner and access method",
        2,
        "not_started",
        "Identify whether access is through Reuters Connect, login, export, feed, API, MCP, email, or manual workflow.",
      ],
      [
        "Confirm Reuters license usage rights",
        2,
        "not_started",
        "Confirm whether OAF can republish Reuters text/images on the OAF Newsroom and use related copy on Facebook/Instagram.",
      ],
      [
        "Request Shopify/OAF Newsroom access",
        2,
        "not_started",
        "Prefer draft/view access first. Need ability to view existing Newsroom posts and eventually create drafts if Phase 2/3 requires it.",
      ],
      [
        "Identify Shopify admin / publishing owner",
        1,
        "not_started",
        "Track who can approve/publish final OAF Newsroom posts.",
      ],
      [
        "Request Meta Business Suite access",
        2,
        "not_started",
        "Needed for Facebook Page and Instagram account visibility. Phase 1 may only require view access; Phase 2 may require posting/scheduling access.",
      ],
      [
        "Confirm Facebook Page permissions",
        1,
        "not_started",
        "Track whether access is view-only, content creation, publishing, or admin.",
      ],
      [
        "Confirm Instagram business account permissions",
        1,
        "not_started",
        "Track whether access allows viewing, posting, scheduling, insights, or admin.",
      ],
      [
        "Identify current social scheduling tool, if any",
        1,
        "not_started",
        "Determine whether OAF uses Meta Planner, Buffer, Metricool, Later, Hootsuite, or manual posting only.",
      ],
      [
        "Request creative asset/template access",
        1.5,
        "not_started",
        "Canva, Adobe, brand kit, logos, templates, image sizing rules, and approved design examples.",
      ],
      [
        "Confirm where approved assets are stored",
        1,
        "not_started",
        "Google Drive, Dropbox, SharePoint, Slack files, or another asset library.",
      ],
      [
        "Document open/approved source candidates for future Reuters replacement",
        1.5,
        "not_started",
        "DVIDS, Defense.gov, NATO, State.gov, CENTCOM/EUCOM, Navy/Air Force/Army feeds, GDELT, NewsAPI, etc.",
      ],
      [
        "Set up development/admin access for automation build",
        2,
        "not_started",
        "GitHub, Vercel, Supabase, Slack app credentials, AI API key, environment variables.",
      ],
      [
        "Create access tracker table",
        1,
        "not_started",
        "Track platform, purpose, owner, access level, credentials method, status, blocker, and notes.",
      ],
    ],
  },
  {
    title: "Phase 3: Source Intake System",
    weight: 15,
    description: null,
    tasks: [
      ["Create source settings structure: Reuters, RSS, DVIDS, open sources, discovery-only sources", 2, "not_started", null],
      ["Build manual Reuters intake form", 3, "not_started", null],
      ["Add fields for headline, article text, source URL/article ID, published date, reporter/editing credit", 2, "not_started", null],
      ["Create article database/table", 2, "not_started", null],
      ["Create source usage labels: Reuters licensed, open source, public domain, discovery only, needs review", 1.5, "not_started", null],
      ["Build RSS/open-source adapter structure", 2, "not_started", null],
      ["Add source toggle on/off setting", 1, "not_started", null],
      ["Store raw pulled/imported content for traceability", 1.5, "not_started", null],
    ],
  },
  {
    title: "Phase 4: News Inbox and Candidate Review",
    weight: 15,
    description: null,
    tasks: [
      ["Build News Inbox screen", 2.5, "not_started", null],
      ["Display article cards with title, source, date, topic, region, summary, status", 2, "not_started", null],
      ["Add filters: source, topic, date, status, OAF fit score", 1.5, "not_started", null],
      ["Add article statuses: pulled, shortlisted, rejected, generated, ready for Slack, sent, approved, revision, posted", 2, "not_started", null],
      ["Build Article Review screen", 2.5, "not_started", null],
      ["Add shortlist/reject buttons", 1, "not_started", null],
      ["Add Generate Package button", 1.5, "not_started", null],
      ["Add daily target indicator: 4–6 articles selected", 1, "not_started", null],
      ["Add duplicate/similar story warning", 1, "not_started", null],
    ],
  },
  {
    title: "Phase 5: OAF Fit Scoring and Topic Matching",
    weight: 10,
    description: null,
    tasks: [
      ["Create topic categories: Ukraine/Russia, NATO, Middle East, China/Taiwan, Pentagon, weapons, terrorism, veteran/military-adjacent", 2, "not_started", null],
      ["Build keyword matching for each category", 1.5, "not_started", null],
      ["Add AI-generated article summary", 1.5, "not_started", null],
      ["Add Why This Fits OAF explanation", 1.5, "not_started", null],
      ["Add OAF fit score from 1–100", 1.5, "not_started", null],
      ["Add visual/graphic potential score from 1–5", 1, "not_started", null],
      ["Add low-priority rules for generic politics, entertainment, lifestyle, non-security stories", 1, "not_started", null],
    ],
  },
  {
    title: "Phase 6: AI Package Generator",
    weight: 20,
    description: null,
    tasks: [
      ["Create structured AI prompt for OAF-style Newsroom drafts", 3, "not_started", null],
      ["Require AI to only use facts from the source article", 2, "not_started", null],
      ["Generate OAF-style headline", 1.5, "not_started", null],
      ["Generate Newsroom draft", 3, "not_started", null],
      ["Generate short excerpt/teaser", 1.5, "not_started", null],
      ["Generate IG caption", 1.5, "not_started", null],
      ["Generate FB caption", 1.5, "not_started", null],
      ["Generate hashtag suggestions", 1, "not_started", null],
      ["Generate suggested post time", 1, "not_started", null],
      ["Generate photo/creative direction", 1.5, "not_started", null],
      ["Generate photo caption/source credit", 1, "not_started", null],
      ["Preserve Reuters reporting/editing credit", 1, "not_started", null],
      ["Save generated package to database", 0.5, "not_started", null],
    ],
  },
  {
    title: "Phase 7: Slack Approval Package",
    weight: 15,
    description: null,
    tasks: [
      ["Create Slack app/bot setup", 2, "not_started", null],
      ["Store Slack channel ID and bot token securely", 1, "not_started", null],
      ["Build Slack Preview screen", 2, "not_started", null],
      ["Format main Slack message: headline, source, suggested time, creative direction, approval status", 2, "not_started", null],
      ["Format thread reply: Newsroom draft, IG copy, FB copy, hashtag, source credit, source URL", 2.5, "not_started", null],
      ["Add Send to Slack button", 2, "not_started", null],
      ["Save Slack timestamp/thread ID after posting", 1, "not_started", null],
      ["Add approval instructions: ✅ approve, 🔁 revise, ❌ reject", 1, "not_started", null],
      ["Update article status to sent_to_slack", 1.5, "not_started", null],
    ],
  },
  {
    title: "Phase 8: Status Board and Project Tracking",
    weight: 7,
    description: null,
    tasks: [
      ["Build Status Board screen", 2, "not_started", null],
      ["Group articles by status", 1, "not_started", null],
      ["Show daily count: pulled, shortlisted, generated, sent, approved, posted", 1.5, "not_started", null],
      ["Add manual status updates", 1, "not_started", null],
      ["Add notes/comments field per article", 1, "not_started", null],
      ["Add simple activity timeline per article", 0.5, "not_started", null],
    ],
  },
  {
    title: "Phase 9: Testing, QA, and Safety Checks",
    weight: 10,
    description: null,
    tasks: [
      ["Test manual Reuters intake", 1.5, "not_started", null],
      ["Test package generation against real OAF examples", 2, "not_started", null],
      ["Test Slack message formatting", 1.5, "not_started", null],
      ["Test Slack thread reply formatting", 1, "not_started", null],
      ["Test source credit preservation", 1, "not_started", null],
      ["Test that AI does not invent facts", 1.5, "not_started", null],
      ["Test status changes from intake to Slack sent", 1, "not_started", null],
      ["Fix UI/workflow bugs", 0.5, "not_started", null],
    ],
  },
  {
    title: "Phase 10: Deployment and Handoff",
    weight: 8,
    description: null,
    tasks: [
      ["Deploy internal app", 1.5, "not_started", null],
      ["Configure environment variables", 1, "not_started", null],
      ["Set up Supabase production tables", 1, "not_started", null],
      ["Set up Slack bot permissions", 1, "not_started", null],
      ["Create basic SOP for Brandon workflow", 1.5, "not_started", null],
      ["Create basic SOP for Lance handoff", 1, "not_started", null],
      ["Final walkthrough with Anthony/Lance", 1, "not_started", null],
    ],
  },
];

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

let phaseBlocks = "";
phases.forEach((phase, phaseIndex) => {
  const phaseDescriptionSql = phase.description
    ? `'${escapeSql(phase.description)}'`
    : "NULL";
  phaseBlocks += `
  INSERT INTO work_items (project_id, parent_id, type, title, description, weight, sort_order)
  VALUES (v_project_id, NULL, 'phase', '${escapeSql(phase.title)}', ${phaseDescriptionSql}, ${phase.weight}, ${phaseIndex + 1})
  RETURNING id INTO v_phase_id;
`;
  phase.tasks.forEach(([title, weight, status, description], taskIndex) => {
    const taskDescriptionSql = description ? `'${escapeSql(description)}'` : "NULL";
    phaseBlocks += `
  INSERT INTO work_items (project_id, parent_id, type, title, description, status, weight, sort_order)
  VALUES (v_project_id, v_phase_id, 'task', '${escapeSql(title)}', ${taskDescriptionSql}, '${status}', ${weight}, ${taskIndex + 1});
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
`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(join(root, "supabase/migrations/003_seed_oaf_newsfeed_project.sql"), sql);
console.log("Generated supabase/migrations/003_seed_oaf_newsfeed_project.sql");
