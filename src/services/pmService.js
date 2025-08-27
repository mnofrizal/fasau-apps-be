const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { ENDPOINTS } = require("../config/constants");
const { getTeamAssignment } = require("../utils/get52WeekSchedule");

const prisma = new PrismaClient();

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

// Main function to send PM schedule for a specific date
const sendPMSchedule = async (targetDate = new Date(), options = {}) => {
  const { groupOnly = false } = options;
  try {
    // Get assignments for the target date
    const assignments = getTeamAssignment(targetDate);

    if (!assignments || assignments.length === 0) {
      return {
        success: false,
        message: "No assignments for this date (weekend or holiday)",
        data: null,
      };
    }

    const results = {
      individualMessages: [],
      groupMessage: null,
      errors: [],
    };

    // Send message to each team member working today (skip if groupOnly is true)
    if (!groupOnly) {
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

            const response = await axios.post(
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
            results.individualMessages.push({
              memberName: member.name,
              phone: member.phone,
              asset: asset.name,
              success: true,
              response: response.data,
            });
          } catch (error) {
            console.error(
              `Error sending message to ${member.name}:`,
              error.message
            );
            results.errors.push({
              memberName: member.name,
              phone: member.phone,
              asset: asset.name,
              error: error.message,
            });
          }
        }
      }
    } else {
      console.log("Skipping individual messages - groupOnly mode enabled");
    }

    // Send summary to group
    try {
      const groupId = await getWhatsAppGroupId();
      if (!groupId) {
        results.errors.push({
          type: "group_message",
          error: "No WhatsApp group ID found in database",
        });
      } else {
        // Add delay before sending group message
        const delaySeconds = getRandomDelay();
        console.log(
          `Waiting ${delaySeconds} seconds before sending group message...`
        );
        await delay(delaySeconds);

        const summaryMessage = formatSummaryMessage(assignments);
        const response = await axios.post(
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
        results.groupMessage = {
          success: true,
          groupId: groupId,
          response: response.data,
        };
      }
    } catch (error) {
      console.error("Error sending group message:", error.message);
      results.errors.push({
        type: "group_message",
        error: error.message,
      });
    }

    const messageType = groupOnly
      ? "group message only"
      : "individual and group messages";
    return {
      success: true,
      message: `PM schedule sent successfully for ${targetDate.toLocaleDateString(
        "id-ID"
      )} (${messageType})`,
      data: {
        date: targetDate.toISOString().split("T")[0],
        mode: groupOnly ? "group_only" : "full",
        assignments: assignments.map((a) => ({
          asset: a.asset.name,
          team: a.team.name,
          members: a.team.members.map((m) => m.name),
        })),
        results: results,
      },
    };
  } catch (error) {
    console.error("Error in sendPMSchedule:", error.message);
    return {
      success: false,
      message: "Failed to send PM schedule",
      error: error.message,
    };
  }
};

// Function to get today's PM assignments without sending messages
const getTodayPMAssignments = (targetDate = new Date()) => {
  try {
    const assignments = getTeamAssignment(targetDate);

    if (!assignments || assignments.length === 0) {
      return {
        success: false,
        message: "No assignments for this date (weekend or holiday)",
        data: null,
      };
    }

    return {
      success: true,
      message: `PM assignments found for ${targetDate.toLocaleDateString(
        "id-ID"
      )}`,
      data: {
        date: targetDate.toISOString().split("T")[0],
        assignments: assignments.map((a) => ({
          asset: {
            id: a.asset.id,
            name: a.asset.name,
            description: a.asset.description,
            detail: a.asset.detail,
          },
          team: {
            name: a.team.name,
            members: a.team.members,
          },
          weekInYear: a.weekInYear,
          weekInCycle: a.weekInCycle,
        })),
      },
    };
  } catch (error) {
    console.error("Error in getTodayPMAssignments:", error.message);
    return {
      success: false,
      message: "Failed to get PM assignments",
      error: error.message,
    };
  }
};

module.exports = {
  sendPMSchedule,
  getTodayPMAssignments,
  formatSummaryMessage,
  getWhatsAppGroupId,
};
