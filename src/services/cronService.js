const cron = require("node-cron");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { ENDPOINTS } = require("../config/constants");
const { getTeamAssignment } = require("../utils/get52WeekSchedule");

const prisma = new PrismaClient();

// Configuration
const SEND_TIME = {
  hour: 7,
  minute: 00,
};

// Helper function to delay execution
const delay = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// Helper function to get random delay between 1-10 seconds
const getRandomDelay = () => Math.floor(Math.random() * 10) + 1;

// Helper function to get group ID from database
const getWhatsAppGroupId = async () => {
  try {
    const config = await prisma.whatsappConfig.findFirst();
    return config?.groupId;
  } catch (error) {
    console.error("Error fetching WhatsApp group ID:", error);
    return null;
  }
};

// Function to format summary message
const formatSummaryMessage = (assignments) => {
  const date = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedAssignments = assignments
    .map(
      (a, index) =>
        `${index + 1}. ${a.asset.name} : _${a.team.members
          .map((m) => m.name)
          .join(" dan ")}_`
    )
    .join("\n");

  return `
  📅 *JADWAL PM ${date}*

${formattedAssignments}
  
Untuk detail pekerjaannya telah dikirim pada masing-masing tim.
Terimakasih 🙏`;
};

// Schedule task to run at configured time every day
const scheduleDailyMessage = () => {
  // Main schedule for sending message at configured time
  cron.schedule(
    `${SEND_TIME.minute} ${SEND_TIME.hour} * * *`,
    async () => {
      try {
        // Get today's assignments
        const today = new Date();
        const assignments = getTeamAssignment(today);

        if (!assignments) {
          console.log("No assignments for today (weekend or holiday)");
          return;
        }

        // Send message to each team member working today
        for (const assignment of assignments) {
          const { asset, team } = assignment;

          // Send message to each team member
          for (const member of team.members) {
            const message = `Selamat Pagi kak ${member.name}, hari ini adalah jadwal PM untuk _${asset.description}_ di area *${asset.name}*

Detail pekerjaan:${asset.detail}

Khusus untuk pelaporan Pekerjaan PM ini gunakan

> .L2 Laporannya

Harap lakukan pemeriksaan dan pemeliharaan sesuai dengan detail di atas. Selamat bekerja!`;

            try {
              // Add random delay before sending each message
              const delaySeconds = getRandomDelay();
              console.log(
                `Waiting ${delaySeconds} seconds before sending message to ${member.name}...`
              );
              await delay(delaySeconds);

              await axios.post(
                ENDPOINTS.WA.SEND_MESSAGE,
                {
                  phoneNumber: member.phone,
                  message: message,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(`Message sent successfully to ${member.name}`);
            } catch (error) {
              console.error(
                `Error sending message to ${member.name}:`,
                error.message
              );
            }
          }
        }

        // Send summary to group
        try {
          const groupId = await getWhatsAppGroupId();
          if (!groupId) {
            console.error("No WhatsApp group ID found in database");
            return;
          }

          // Add delay before sending group message
          const delaySeconds = getRandomDelay();
          console.log(
            `Waiting ${delaySeconds} seconds before sending group message...`
          );
          await delay(delaySeconds);

          const summaryMessage = formatSummaryMessage(assignments);
          await axios.post(
            ENDPOINTS.WA.SEND_MESSAGE_GROUP,
            {
              groupId: groupId,
              message: summaryMessage,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("Summary message sent successfully to group");
        } catch (error) {
          console.error("Error sending group message:", error.message);
        }
      } catch (error) {
        console.error("Error in daily message scheduler:", error.message);
      }
    },
    {
      timezone: "Asia/Jakarta", // Set timezone to Asia/Jakarta
    }
  );
  console.log(
    `Daily message scheduler initialized - Message will be sent every day at ${
      SEND_TIME.hour
    }:${SEND_TIME.minute
      .toString()
      .padStart(2, "0")} AM (Asia/Jakarta timezone)`
  );
};

module.exports = {
  scheduleDailyMessage,
  SEND_TIME,
};
