import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const project = {
  name: "BCMD Spruce Phone Migration",
  companyName: "BCMD",
  description:
    "Migrate the BCMD phone line to Spruce, ensure successful number porting, onboard all BCMD staff into Spruce, organize users, validate functionality, and transition the team to daily use.",
  phases: [
    {
      title: "Phase 1: Planning & Approval",
      weight: 12,
      tasks: [
        ["Confirm project scope and migration objectives", 2],
        ["Obtain BCMD approval to migrate phone line", 3],
        ["Identify current phone carrier/account information", 1.5],
        ["Gather required porting documentation (account number, PIN, billing address, authorization, etc.)", 2.5],
        ["Verify Spruce account ownership/admin access", 1.5],
        ["Establish migration timeline and communication plan", 1.5],
      ],
    },
    {
      title: "Phase 2: Spruce Environment Setup",
      weight: 18,
      tasks: [
        ["Configure Spruce organization settings", 2],
        ["Create BCMD team/group", 3],
        ["Invite all BCMD members to Spruce", 2],
        ["Verify each member has activated their account", 2],
        ["Assign roles and permissions", 2],
        ["Configure inbox/group routing", 2],
        ["Configure notifications for all users", 2],
        ["Verify desktop/mobile access for all users", 3],
      ],
    },
    {
      title: "Phase 3: Phone Number Porting",
      weight: 22,
      tasks: [
        ["Verify port eligibility", 2],
        ["Complete port request documentation", 3],
        ["Submit phone number port request", 5],
        ["Monitor port request status", 2],
        ["Respond to carrier/Spruce requests if needed", 2],
        ["Verify approved port date", 2],
        ["Confirm successful number transfer", 4],
        ["Validate inbound/outbound calling after port", 2],
      ],
    },
    {
      title: "Phase 4: System Configuration",
      weight: 15,
      tasks: [
        ["Configure business hours", 2],
        ["Configure auto replies", 2],
        ["Configure voicemail greeting", 2],
        ["Configure voicemail routing", 2],
        ["Configure shared inbox workflows", 2],
        ["Configure tags/categories if needed", 2],
        ["Configure message assignment process", 2],
        ["Test notifications and routing", 1],
      ],
    },
    {
      title: "Phase 5: Testing & Validation",
      weight: 13,
      tasks: [
        ["Test inbound calls", 2],
        ["Test outbound calls", 2],
        ["Test SMS messaging", 2],
        ["Test MMS/images", 1],
        ["Test group messaging", 1],
        ["Test voicemail", 2],
        ["Test internal message assignment", 1],
        ["Verify every BCMD member can access Spruce", 2],
      ],
    },
    {
      title: "Phase 6: User Training & Adoption",
      weight: 12,
      tasks: [
        ["Create quick-start guide", 2],
        ["Conduct team walkthrough/training", 3],
        ["Demonstrate call handling workflow", 2],
        ["Demonstrate messaging workflow", 2],
        ["Answer user questions", 1],
        ["Verify users are comfortable using Spruce", 2],
      ],
    },
    {
      title: "Phase 7: Go Live & Support",
      weight: 8,
      tasks: [
        ["Announce go-live", 1],
        ["Monitor first-day usage", 2],
        ["Resolve post-migration issues", 2],
        ["Confirm all users actively using Spruce", 1],
        ["Close migration project", 2],
      ],
    },
  ],
};

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

let phaseBlocks = "";
project.phases.forEach((phase, phaseIndex) => {
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

const sql = `-- Seed BCMD Spruce Phone Migration project
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
    '${escapeSql(project.description)}',
    'in_progress',
    'high'
  )
  RETURNING id INTO v_project_id;
${phaseBlocks}
END $$;
`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
writeFileSync(join(root, "supabase/migrations/005_seed_bcmd_spruce_project.sql"), sql);
console.log("Generated supabase/migrations/005_seed_bcmd_spruce_project.sql");
