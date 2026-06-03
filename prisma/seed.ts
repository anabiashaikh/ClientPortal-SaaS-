import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.actionItem.deleteMany();
  await prisma.meetingAttendee.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.assetVersion.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.timelineUpdate.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectTeam.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organizationUser.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("  ✓ Cleaned existing data");

  // ── Create Users ────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@clientportal.com",
      password: "admin123",
      role: "SUPER_ADMIN",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      email: "alice@clientportal.com",
      password: "password",
      role: "ADMIN",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Williams",
      email: "bob@clientportal.com",
      password: "password",
      role: "TEAM_MEMBER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: "Charlie Davis",
      email: "charlie@clientportal.com",
      password: "password",
      role: "TEAM_MEMBER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
    },
  });

  const clientUser = await prisma.user.create({
    data: {
      name: "Diana Martinez",
      email: "diana@acmecorp.com",
      password: "password",
      role: "CLIENT",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
    },
  });

  console.log("  ✓ Created 5 users");

  // ── Create Organization ─────────────────────────────────────────
  const org = await prisma.organization.create({
    data: {
      name: "ClientPortal Agency",
      users: {
        create: [
          { userId: admin.id },
          { userId: alice.id },
          { userId: bob.id },
          { userId: charlie.id },
          { userId: clientUser.id },
        ],
      },
    },
  });

  console.log("  ✓ Created organization");

  // ── Create Projects ─────────────────────────────────────────────
  const websiteRedesign = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete overhaul of the corporate website with modern design, improved UX, and mobile-first approach.",
      status: "ACTIVE",
      progress: 75,
      budget: 50000,
      budgetUsed: 37500,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      organizationId: org.id,
      team: {
        create: [
          { userId: alice.id, role: "Lead Designer" },
          { userId: bob.id, role: "Frontend Dev" },
          { userId: charlie.id, role: "Backend Dev" },
        ],
      },
      tags: {
        create: [
          { name: "Design", color: "#3b82f6" },
          { name: "Development", color: "#8b5cf6" },
        ],
      },
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: "Mobile App V2",
      description: "Version 2 of the mobile application with new features, performance improvements, and redesigned UI.",
      status: "AT_RISK",
      progress: 40,
      budget: 80000,
      budgetUsed: 72000,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-09-15"),
      organizationId: org.id,
      team: {
        create: [
          { userId: bob.id, role: "Lead Developer" },
          { userId: charlie.id, role: "QA Engineer" },
        ],
      },
      tags: {
        create: [
          { name: "Mobile", color: "#f59e0b" },
          { name: "React Native", color: "#06b6d4" },
        ],
      },
    },
  });

  const marketingCampaign = await prisma.project.create({
    data: {
      name: "Marketing Campaign Q3",
      description: "Q3 digital marketing campaign across social media, email, and PPC channels.",
      status: "ACTIVE",
      progress: 90,
      budget: 25000,
      budgetUsed: 22500,
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      organizationId: org.id,
      team: {
        create: [{ userId: alice.id, role: "Campaign Manager" }],
      },
      tags: {
        create: [{ name: "Marketing", color: "#22c55e" }],
      },
    },
  });

  const ecommerce = await prisma.project.create({
    data: {
      name: "E-Commerce Platform",
      description: "Full e-commerce platform with product catalog, cart, checkout, and payment integration.",
      status: "COMPLETED",
      progress: 100,
      budget: 120000,
      budgetUsed: 115000,
      startDate: new Date("2025-10-01"),
      endDate: new Date("2026-03-31"),
      organizationId: org.id,
      team: {
        create: [
          { userId: bob.id, role: "Tech Lead" },
          { userId: charlie.id, role: "Developer" },
        ],
      },
      tags: {
        create: [
          { name: "E-Commerce", color: "#ef4444" },
          { name: "Full Stack", color: "#8b5cf6" },
        ],
      },
    },
  });

  console.log("  ✓ Created 4 projects");

  // ── Create Tasks ────────────────────────────────────────────────
  const tasksData = [
    { title: "Design homepage wireframes", description: "Create low-fi wireframes for the new homepage layout", status: "IN_PROGRESS" as const, priority: "HIGH" as const, projectId: websiteRedesign.id, assigneeId: alice.id, dueDate: new Date("2026-06-05"), estimatedHours: 8 },
    { title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for automated deployments", status: "TODO" as const, priority: "CRITICAL" as const, projectId: mobileApp.id, assigneeId: bob.id, dueDate: new Date("2026-06-02"), estimatedHours: 4 },
    { title: "API endpoint for user auth", description: "Build REST endpoints for login, signup, password reset", status: "IN_PROGRESS" as const, priority: "HIGH" as const, projectId: mobileApp.id, assigneeId: charlie.id, dueDate: new Date("2026-06-08"), estimatedHours: 12 },
    { title: "Write unit tests for cart module", description: "Add Jest tests covering cart operations", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const, projectId: ecommerce.id, assigneeId: bob.id, dueDate: new Date("2026-06-10"), estimatedHours: 6 },
    { title: "Client review preparation", description: "Prepare slide deck for client review session", status: "IN_REVIEW" as const, priority: "HIGH" as const, projectId: websiteRedesign.id, assigneeId: alice.id, dueDate: new Date("2026-06-01"), estimatedHours: 3 },
    { title: "Deploy staging environment", description: "Setup and deploy to staging server for QA", status: "DONE" as const, priority: "MEDIUM" as const, projectId: marketingCampaign.id, assigneeId: charlie.id, dueDate: new Date("2026-05-28"), estimatedHours: 2 },
    { title: "Fix mobile nav bug", description: "Navigation menu not closing on route change", status: "TODO" as const, priority: "CRITICAL" as const, projectId: websiteRedesign.id, assigneeId: bob.id, dueDate: new Date("2026-06-03"), estimatedHours: 2 },
    { title: "Create social media assets", description: "Design banner and post templates for Q3 campaign", status: "BACKLOG" as const, priority: "LOW" as const, projectId: marketingCampaign.id, assigneeId: alice.id, dueDate: new Date("2026-06-15"), estimatedHours: 10 },
    { title: "Implement dark mode", description: "Add dark mode toggle and theme support across the app", status: "BACKLOG" as const, priority: "MEDIUM" as const, projectId: websiteRedesign.id, assigneeId: bob.id, dueDate: new Date("2026-06-20"), estimatedHours: 6 },
    { title: "Performance audit", description: "Run Lighthouse and optimize page load speeds", status: "TODO" as const, priority: "HIGH" as const, projectId: websiteRedesign.id, assigneeId: charlie.id, dueDate: new Date("2026-06-12"), estimatedHours: 4 },
  ];

  for (const t of tasksData) {
    await prisma.task.create({ data: t });
  }

  console.log("  ✓ Created 10 tasks");

  // ── Create Meetings ─────────────────────────────────────────────
  const meeting1 = await prisma.meeting.create({
    data: {
      title: "Website Redesign - Weekly Sync",
      date: new Date("2026-06-02T10:00:00Z"),
      duration: 30,
      type: "Weekly Sync",
      status: "SCHEDULED",
      link: "https://meet.google.com/abc-defg-hij",
      projectId: websiteRedesign.id,
      attendees: {
        create: [
          { userId: alice.id },
          { userId: bob.id },
          { userId: charlie.id },
        ],
      },
    },
  });

  await prisma.meeting.create({
    data: {
      title: "Mobile App - Sprint Review",
      date: new Date("2026-06-04T14:00:00Z"),
      duration: 60,
      type: "Review",
      status: "SCHEDULED",
      link: "https://zoom.us/j/123456789",
      projectId: mobileApp.id,
      attendees: {
        create: [{ userId: bob.id }, { userId: charlie.id }],
      },
    },
  });

  await prisma.meeting.create({
    data: {
      title: "Website Redesign - Client Demo",
      date: new Date("2026-05-20T15:00:00Z"),
      duration: 45,
      type: "Demo",
      status: "COMPLETED",
      notes: "<p>Presented wireframes and design system to client. Received positive feedback on color palette.</p>",
      projectId: websiteRedesign.id,
      attendees: {
        create: [{ userId: alice.id }, { userId: clientUser.id }],
      },
      actionItems: {
        create: [
          { content: "Revise hero section CTA copy", completed: true },
          { content: "Add testimonials section to homepage", completed: false },
          { content: "Schedule follow-up for mobile mockups", completed: true },
        ],
      },
    },
  });

  console.log("  ✓ Created 3 meetings");

  // ── Create Timeline Updates ─────────────────────────────────────
  const timelineData = [
    { content: "Project kickoff meeting completed. Team aligned on objectives and timeline.", projectId: websiteRedesign.id },
    { content: "Wireframe phase completed. Moving to high-fidelity mockups.", projectId: websiteRedesign.id },
    { content: "Client approved the design system and color palette.", projectId: websiteRedesign.id },
    { content: "Sprint 1 completed: Authentication and user management modules done.", projectId: mobileApp.id },
    { content: "Campaign landing pages deployed to production.", projectId: marketingCampaign.id },
  ];

  for (const t of timelineData) {
    await prisma.timelineUpdate.create({ data: t });
  }

  console.log("  ✓ Created 5 timeline updates");

  // ── Create Audit Logs ───────────────────────────────────────────
  const auditData = [
    { action: "CREATE", entity: "Project", entityId: websiteRedesign.id, userId: admin.id },
    { action: "UPDATE", entity: "Task", entityId: "seed-task", userId: alice.id, details: { field: "status", from: "TODO", to: "IN_PROGRESS" } },
    { action: "CREATE", entity: "Meeting", entityId: meeting1.id, userId: alice.id },
    { action: "UPLOAD", entity: "Asset", entityId: "seed-asset", userId: bob.id, details: { filename: "hero-image.png", size: 2048000 } },
  ];

  for (const a of auditData) {
    await prisma.auditLog.create({ data: a });
  }

  console.log("  ✓ Created 4 audit logs");

  console.log("\n✅ Seed completed successfully!");
  console.log("   Login with: admin@clientportal.com / admin123");
}

main()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    pool.end();
    process.exit(1);
  });
