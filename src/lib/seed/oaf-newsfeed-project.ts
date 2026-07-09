export type SeedTask = {
  title: string;
  weight: number;
};

export type SeedPhase = {
  title: string;
  weight: number;
  tasks: SeedTask[];
};

export const OAF_NEWSFEED_PROJECT = {
  name: "OAF Newsfeed Command Center",
  companyName: "OAF Nation",
  description:
    "Internal newsfeed automation system for OAF. Pull or intake candidate articles, review/select 4–6 per day, generate OAF-style Newsroom/social packages, and send selected packages to Slack for approval.",
  status: "in_progress" as const,
  priority: "high" as const,
  phases: [
    {
      title: "Phase 1: Project Setup, Scope, and Workflow Discovery",
      weight: 10,
      tasks: [
        { title: "Review existing OAF social media Slack workflow", weight: 2 },
        { title: "Document current approval flow: post package → thread → ✅ approval", weight: 2 },
        { title: "Confirm Phase 1 responsibility split: Brandon drafts/source package, Lance posts, Anthony PM", weight: 1.5 },
        { title: "Document OAF content themes and Commander's Intent", weight: 2 },
        { title: "Define MVP scope: article intake/review/generate/send to Slack only", weight: 1.5 },
        { title: "Confirm Reuters access method: manual, Reuters Connect, API, export, or other", weight: 1 },
      ],
    },
    {
      title: "Phase 2: Source Intake System",
      weight: 15,
      tasks: [
        { title: "Create source settings structure: Reuters, RSS, DVIDS, open sources, discovery-only sources", weight: 2 },
        { title: "Build manual Reuters intake form", weight: 3 },
        { title: "Add fields for headline, article text, source URL/article ID, published date, reporter/editing credit", weight: 2 },
        { title: "Create article database/table", weight: 2 },
        { title: "Create source usage labels: Reuters licensed, open source, public domain, discovery only, needs review", weight: 1.5 },
        { title: "Build RSS/open-source adapter structure", weight: 2 },
        { title: "Add source toggle on/off setting", weight: 1 },
        { title: "Store raw pulled/imported content for traceability", weight: 1.5 },
      ],
    },
    {
      title: "Phase 3: News Inbox and Candidate Review",
      weight: 15,
      tasks: [
        { title: "Build News Inbox screen", weight: 2.5 },
        { title: "Display article cards with title, source, date, topic, region, summary, status", weight: 2 },
        { title: "Add filters: source, topic, date, status, OAF fit score", weight: 1.5 },
        { title: "Add article statuses: pulled, shortlisted, rejected, generated, ready for Slack, sent, approved, revision, posted", weight: 2 },
        { title: "Build Article Review screen", weight: 2.5 },
        { title: "Add shortlist/reject buttons", weight: 1 },
        { title: "Add Generate Package button", weight: 1.5 },
        { title: "Add daily target indicator: 4–6 articles selected", weight: 1 },
        { title: "Add duplicate/similar story warning", weight: 1 },
      ],
    },
    {
      title: "Phase 4: OAF Fit Scoring and Topic Matching",
      weight: 10,
      tasks: [
        { title: "Create topic categories: Ukraine/Russia, NATO, Middle East, China/Taiwan, Pentagon, weapons, terrorism, veteran/military-adjacent", weight: 2 },
        { title: "Build keyword matching for each category", weight: 1.5 },
        { title: "Add AI-generated article summary", weight: 1.5 },
        { title: "Add Why This Fits OAF explanation", weight: 1.5 },
        { title: "Add OAF fit score from 1–100", weight: 1.5 },
        { title: "Add visual/graphic potential score from 1–5", weight: 1 },
        { title: "Add low-priority rules for generic politics, entertainment, lifestyle, non-security stories", weight: 1 },
      ],
    },
    {
      title: "Phase 5: AI Package Generator",
      weight: 20,
      tasks: [
        { title: "Create structured AI prompt for OAF-style Newsroom drafts", weight: 3 },
        { title: "Require AI to only use facts from the source article", weight: 2 },
        { title: "Generate OAF-style headline", weight: 1.5 },
        { title: "Generate Newsroom draft", weight: 3 },
        { title: "Generate short excerpt/teaser", weight: 1.5 },
        { title: "Generate IG caption", weight: 1.5 },
        { title: "Generate FB caption", weight: 1.5 },
        { title: "Generate hashtag suggestions", weight: 1 },
        { title: "Generate suggested post time", weight: 1 },
        { title: "Generate photo/creative direction", weight: 1.5 },
        { title: "Generate photo caption/source credit", weight: 1 },
        { title: "Preserve Reuters reporting/editing credit", weight: 1 },
        { title: "Save generated package to database", weight: 0.5 },
      ],
    },
    {
      title: "Phase 6: Slack Approval Package",
      weight: 15,
      tasks: [
        { title: "Create Slack app/bot setup", weight: 2 },
        { title: "Store Slack channel ID and bot token securely", weight: 1 },
        { title: "Build Slack Preview screen", weight: 2 },
        { title: "Format main Slack message: headline, source, suggested time, creative direction, approval status", weight: 2 },
        { title: "Format thread reply: Newsroom draft, IG copy, FB copy, hashtag, source credit, source URL", weight: 2.5 },
        { title: "Add Send to Slack button", weight: 2 },
        { title: "Save Slack timestamp/thread ID after posting", weight: 1 },
        { title: "Add approval instructions: ✅ approve, 🔁 revise, ❌ reject", weight: 1 },
        { title: "Update article status to sent_to_slack", weight: 1.5 },
      ],
    },
    {
      title: "Phase 7: Status Board and Project Tracking",
      weight: 7,
      tasks: [
        { title: "Build Status Board screen", weight: 2 },
        { title: "Group articles by status", weight: 1 },
        { title: "Show daily count: pulled, shortlisted, generated, sent, approved, posted", weight: 1.5 },
        { title: "Add manual status updates", weight: 1 },
        { title: "Add notes/comments field per article", weight: 1 },
        { title: "Add simple activity timeline per article", weight: 0.5 },
      ],
    },
    {
      title: "Phase 8: Testing, QA, and Safety Checks",
      weight: 10,
      tasks: [
        { title: "Test manual Reuters intake", weight: 1.5 },
        { title: "Test package generation against real OAF examples", weight: 2 },
        { title: "Test Slack message formatting", weight: 1.5 },
        { title: "Test Slack thread reply formatting", weight: 1 },
        { title: "Test source credit preservation", weight: 1 },
        { title: "Test that AI does not invent facts", weight: 1.5 },
        { title: "Test status changes from intake to Slack sent", weight: 1 },
        { title: "Fix UI/workflow bugs", weight: 0.5 },
      ],
    },
    {
      title: "Phase 9: Deployment and Handoff",
      weight: 8,
      tasks: [
        { title: "Deploy internal app", weight: 1.5 },
        { title: "Configure environment variables", weight: 1 },
        { title: "Set up Supabase production tables", weight: 1 },
        { title: "Set up Slack bot permissions", weight: 1 },
        { title: "Create basic SOP for Brandon workflow", weight: 1.5 },
        { title: "Create basic SOP for Lance handoff", weight: 1 },
        { title: "Final walkthrough with Anthony/Lance", weight: 1 },
      ],
    },
  ] satisfies SeedPhase[],
};

export function validateProjectWeights(project: typeof OAF_NEWSFEED_PROJECT): void {
  const phaseTotal = project.phases.reduce((sum, p) => sum + p.weight, 0);
  if (Math.abs(phaseTotal - 100) > 0.001) {
    throw new Error(`Phase weights sum to ${phaseTotal}, expected 100`);
  }
  for (const phase of project.phases) {
    const taskTotal = phase.tasks.reduce((sum, t) => sum + t.weight, 0);
    if (Math.abs(taskTotal - phase.weight) > 0.001) {
      throw new Error(`${phase.title}: task weights sum to ${taskTotal}, expected ${phase.weight}`);
    }
  }
}

validateProjectWeights(OAF_NEWSFEED_PROJECT);
