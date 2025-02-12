const { getTeamAssignment } = require("../utils/get52WeekSchedule");

class TeamAssignmentService {
  getDayName(date) {
    const days = [
      "MINGGU",
      "SENIN",
      "SELASA",
      "RABU",
      "KAMIS",
      "JUMAT",
      "SABTU",
    ];
    return days[new Date(date).getDay()];
  }

  getISOWeek(date) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year
    target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));

    // First Thursday of year decides first week
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    firstThursday.setDate(
      firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7)
    );

    // Calculate week number
    const weekDiff = (target - firstThursday) / (7 * 24 * 60 * 60 * 1000);
    const weekNumber = 1 + Math.floor(weekDiff);

    return weekNumber;
  }

  getWeekInfo(date) {
    const weekNumber = this.getISOWeek(date);

    // For 2025, week 1 starts on Dec 30, 2024
    // Adjust cycle calculation based on this
    const weekInCycle = ((weekNumber + 3) % 4) + 1; // +3 offset to align with the existing cycle

    return {
      weekNumber: weekNumber,
      weekInCycle: weekInCycle,
      dayName: this.getDayName(date),
    };
  }

  async getTodayAssignment() {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    return this.getAssignmentForDate(formattedDate);
  }

  async getAssignmentForDate(date) {
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }

    const assignments = getTeamAssignment(date);
    if (!assignments) {
      throw new Error(
        "No assignments for the specified date (weekend or holiday)"
      );
    }

    const { weekNumber, weekInCycle, dayName } = this.getWeekInfo(date);

    return {
      date: date,
      dayName: dayName,
      weekNumber: weekNumber,
      weekInCycle: weekInCycle,
      assignments: assignments,
    };
  }
}

module.exports = new TeamAssignmentService();
