const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanDatabase() {
  // Delete data in reverse order of dependencies
  await prisma.taskReport
    .deleteMany()
    .catch(() => console.log("No task reports to delete"));
  await prisma.acara
    .deleteMany()
    .catch(() => console.log("No acara to delete"));
  await prisma.task.deleteMany().catch(() => console.log("No tasks to delete"));
  await prisma.user.deleteMany().catch(() => console.log("No users to delete"));
}

async function main() {
  try {
    console.log("Cleaning database...");
    await cleanDatabase();

    console.log("Seeding database...");

    // Create sample users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: "john.doe@example.com",
          name: "John Doe",
        },
      }),
      prisma.user.create({
        data: {
          email: "jane.smith@example.com",
          name: "Jane Smith",
        },
      }),
      prisma.user.create({
        data: {
          email: "admin@example.com",
          name: "Admin User",
        },
      }),
    ]);

    console.log("Created users:", users);

    // Create sample tasks
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          title: "Weekly Team Meeting Notes",
          category: "MEMO",
          status: "COMPLETED",
          keterangan: "Meeting notes for sprint planning discussion",
        },
      }),
      prisma.task.create({
        data: {
          title: "Database Migration Plan",
          category: "TASK",
          status: "INPROGRESS",
          keterangan: "Plan and execute database migration to new structure",
        },
      }),
      prisma.task.create({
        data: {
          title: "Q1 Performance Report",
          category: "LAPORAN",
          status: "INPROGRESS",
          keterangan: "Quarterly performance analysis and metrics",
        },
      }),
    ]);

    console.log("Created tasks:", tasks);

    // Create sample acara
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const acara = await Promise.all([
      prisma.acara.create({
        data: {
          title: "Team Building Event",
          dateTime: tomorrow,
          location: "Central Park",
          status: "UPCOMING",
          description: "Annual team building and fun activities",
          category: "Social",
        },
      }),
      prisma.acara.create({
        data: {
          title: "Project Kickoff Meeting",
          dateTime: nextWeek,
          location: "Conference Room A",
          status: "UPCOMING",
          description: "Initial meeting for new project phase",
          category: "Meeting",
        },
      }),
      prisma.acara.create({
        data: {
          title: "Technical Workshop",
          dateTime: lastWeek,
          location: "Training Center",
          status: "DONE",
          description: "Workshop on new technologies",
          category: "Training",
        },
      }),
    ]);

    console.log("Created acara:", acara);

    // Create sample reports
    const reports = await Promise.all([
      prisma.taskReport.create({
        data: {
          evidence: "https://storage.example.com/evidence/maintenance-log.pdf",
          description: "Regular maintenance check completed for Server Room A",
          pelapor: "Ahmad Teknisi",
          phone: "+62812-3456-7890",
          category: "PM",
        },
      }),
      prisma.taskReport.create({
        data: {
          evidence: "https://storage.example.com/evidence/incident-report.pdf",
          description: "Emergency network outage incident and resolution",
          pelapor: "Budi Engineer",
          phone: "+62898-7654-3210",
          category: "CM",
        },
      }),
      prisma.taskReport.create({
        data: {
          evidence: "https://storage.example.com/evidence/system-upgrade.pdf",
          description: "System upgrade and performance optimization",
          pelapor: "Charlie Systems",
          phone: "+62856-1111-2222",
          category: "PM",
        },
      }),
      prisma.taskReport.create({
        data: {
          evidence:
            "https://storage.example.com/evidence/hardware-replacement.jpg",
          description: "Emergency hardware replacement for critical system",
          pelapor: "Diana Support",
          phone: "+62877-8888-9999",
          category: "CM",
        },
      }),
    ]);

    console.log("Created reports:", reports);
    console.log("Seeding finished.");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
