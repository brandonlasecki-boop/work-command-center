export type SeedTask = {
  title: string;
  weight: number;
};

export type SeedPhase = {
  title: string;
  weight: number;
  tasks: SeedTask[];
};

export const BCMD_SPRUCE_MIGRATION = {
  name: "BCMD Spruce Phone Migration",
  companyName: "BCMD",
  description:
    "Migrate the BCMD phone line to Spruce, ensure successful number porting, onboard all BCMD staff into Spruce, organize users, validate functionality, and transition the team to daily use.",
  status: "in_progress" as const,
  priority: "high" as const,
  milestones: [
    "BCMD Approval Received",
    "Spruce Environment Ready",
    "Port Submitted",
    "Port Approved",
    "Phone Number Successfully Ported",
    "Team Fully Onboarded",
    "Training Complete",
    "Project Closed",
  ],
  phases: [
    {
      title: "Phase 1: Planning & Approval",
      weight: 12,
      tasks: [
        { title: "Confirm project scope and migration objectives", weight: 2 },
        { title: "Obtain BCMD approval to migrate phone line", weight: 3 },
        { title: "Identify current phone carrier/account information", weight: 1.5 },
        {
          title:
            "Gather required porting documentation (account number, PIN, billing address, authorization, etc.)",
          weight: 2.5,
        },
        { title: "Verify Spruce account ownership/admin access", weight: 1.5 },
        { title: "Establish migration timeline and communication plan", weight: 1.5 },
      ],
    },
    {
      title: "Phase 2: Spruce Environment Setup",
      weight: 18,
      tasks: [
        { title: "Configure Spruce organization settings", weight: 2 },
        { title: "Create BCMD team/group", weight: 3 },
        { title: "Invite all BCMD members to Spruce", weight: 2 },
        { title: "Verify each member has activated their account", weight: 2 },
        { title: "Assign roles and permissions", weight: 2 },
        { title: "Configure inbox/group routing", weight: 2 },
        { title: "Configure notifications for all users", weight: 2 },
        { title: "Verify desktop/mobile access for all users", weight: 3 },
      ],
    },
    {
      title: "Phase 3: Phone Number Porting",
      weight: 22,
      tasks: [
        { title: "Verify port eligibility", weight: 2 },
        { title: "Complete port request documentation", weight: 3 },
        { title: "Submit phone number port request", weight: 5 },
        { title: "Monitor port request status", weight: 2 },
        { title: "Respond to carrier/Spruce requests if needed", weight: 2 },
        { title: "Verify approved port date", weight: 2 },
        { title: "Confirm successful number transfer", weight: 4 },
        { title: "Validate inbound/outbound calling after port", weight: 2 },
      ],
    },
    {
      title: "Phase 4: System Configuration",
      weight: 15,
      tasks: [
        { title: "Configure business hours", weight: 2 },
        { title: "Configure auto replies", weight: 2 },
        { title: "Configure voicemail greeting", weight: 2 },
        { title: "Configure voicemail routing", weight: 2 },
        { title: "Configure shared inbox workflows", weight: 2 },
        { title: "Configure tags/categories if needed", weight: 2 },
        { title: "Configure message assignment process", weight: 2 },
        { title: "Test notifications and routing", weight: 1 },
      ],
    },
    {
      title: "Phase 5: Testing & Validation",
      weight: 13,
      tasks: [
        { title: "Test inbound calls", weight: 2 },
        { title: "Test outbound calls", weight: 2 },
        { title: "Test SMS messaging", weight: 2 },
        { title: "Test MMS/images", weight: 1 },
        { title: "Test group messaging", weight: 1 },
        { title: "Test voicemail", weight: 2 },
        { title: "Test internal message assignment", weight: 1 },
        { title: "Verify every BCMD member can access Spruce", weight: 2 },
      ],
    },
    {
      title: "Phase 6: User Training & Adoption",
      weight: 12,
      tasks: [
        { title: "Create quick-start guide", weight: 2 },
        { title: "Conduct team walkthrough/training", weight: 3 },
        { title: "Demonstrate call handling workflow", weight: 2 },
        { title: "Demonstrate messaging workflow", weight: 2 },
        { title: "Answer user questions", weight: 1 },
        { title: "Verify users are comfortable using Spruce", weight: 2 },
      ],
    },
    {
      title: "Phase 7: Go Live & Support",
      weight: 8,
      tasks: [
        { title: "Announce go-live", weight: 1 },
        { title: "Monitor first-day usage", weight: 2 },
        { title: "Resolve post-migration issues", weight: 2 },
        { title: "Confirm all users actively using Spruce", weight: 1 },
        { title: "Close migration project", weight: 2 },
      ],
    },
  ] satisfies SeedPhase[],
};

export function validateBcmdProjectWeights(project: typeof BCMD_SPRUCE_MIGRATION): void {
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

validateBcmdProjectWeights(BCMD_SPRUCE_MIGRATION);
