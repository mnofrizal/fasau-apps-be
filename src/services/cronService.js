const cron = require("node-cron");
const axios = require("axios");
const { getTeamAssignment } = require("../utils/get52WeekSchedule");

// Configuration
const SEND_TIME = {
  hour: 1,
  minute: 47,
};

// Helper function to delay execution
const delay = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// Helper function to get random delay between 5-10 seconds
const getRandomDelay = () => Math.floor(Math.random() * 6) + 5;

// Schedule task to run at configured time every day
const scheduleDailyMessage = () => {
  // Check time every minute for countdown
  cron.schedule("* * * * *", () => {
    const now = new Date();
    const target = new Date();
    target.setHours(SEND_TIME.hour, SEND_TIME.minute, 0, 0);

    // If target time has passed for today, set for next day
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }

    const diffMs = target - now;
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 2) {
      console.log(
        `Message will be sent in ${diffMins} minute${diffMins !== 1 ? "s" : ""}`
      );
    }
  });

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
                "http://localhost:3920/api/messages",
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
  SEND_TIME, // Export for external use if needed
};
