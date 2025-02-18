// PM Teams Data
const pmTeams = {
  team1: {
    name: "Tim 1",
    members: [
      { name: "Sahab", phone: "6285920157602" },
      { name: "Ade", phone: "6287778511596" },
    ],
  },
  team2: {
    name: "Tim 2",
    members: [
      { name: "Setiman", phone: "6287771212492" },
      { name: "Suhaemi", phone: "6282125458011" },
    ],
  },
  team3: {
    name: "Tim 3",
    members: [
      { name: "Asmara", phone: "6287811223995" },
      { name: "Rifki", phone: "6287770878765" },
    ],
  },
  team4: {
    name: "Tim 4",
    members: [
      { name: "Rijal", phone: "6287880855311" },
      { name: "Yanto", phone: "6285956157199" },
    ],
  },
};

// PM Assets Data
const pmAssets = [
  {
    id: 1,
    name: "Gedung Administrasi",
    description: "Pemeliharaan atap gedung ADB",
    detail: `
1. Periksa, dan perbaikan/pembersihan atap dak beton
2. Periksa, dan perbaikan/pembersihan atap zincalume
3. Periksa, dan perbaikan/pembersihan talang air
4. Periksa, dan perbaikan simpul dak beton`,
  },
  {
    id: 2,
    name: "Gedung Administrasi",
    description: "Pemeliharaan struktur gedung ADB",
    detail: `
1. Periksa, dan perbaikan/pengecatan wallpaper dinding
2. Periksa, dan perbaikan/pengecatan plafon
3. Periksa, dan perbaikan/pengecatan cladding 
4. Periksa, dan perbaikan lantai keramik 
5. Periksa, dan perbaikan aksesoris dinding
6. Periksa kondisi handrail`,
  },
  {
    id: 3,
    name: "Gedung Administrasi",
    description: "Pemeliharaan Sanitasi Gedung ADB",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Pengetesan dan perbaikan Urinoir, wastafel, closet, jet shower, shower.
3. Periksa dan pembersihan floor drain.
4. Periksa Pompa dan pelampung penampungan air`,
  },
  {
    id: 4,
    name: "Gedung Administrasi",
    description: "Pemeliharaan electrical gedung ADB",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa dan perbaikan penggantian lampu
3. Periksa dan perbaikan peratalatan elektronik
4. Periksa dan perbaikan stop kontak dan MCB
5. Periksa dan perbaikan exhaus`,
  },
  {
    id: 5,
    name: "Masjid nurkahrohah",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 6,
    name: "Pos 3 dan gate",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 7,
    name: "Pos 3 Outfall",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 8,
    name: "Pos Tebing",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 9,
    name: "Pos 2",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 10,
    name: "Pos 1 dan gate",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 11,
    name: "Pos Ecopark",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 12,
    name: "Lapangan Tennis",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan lapangan
3. Periksa, dan perbaikan/pengecatan garis lapangan
4. Periksa, dan perbaikan/pengecatan pagar
5. Periksa, dan perbaikan lantai lapangan
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listrik lainnya)
8. Periksa dan perbaikan aksesoris lapangan`,
  },
  {
    id: 13,
    name: "Dapur Umum",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 14,
    name: "Rumah Pompa Gerem",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Periksa, dan perbaikan/pengecatan wallpaper dinding
2. Periksa, dan perbaikan/pengecatan plafon
3. Periksa, dan perbaikan/pengecatan cladding 
4. Periksa, dan perbaikan lantai keramik 
5. Periksa, dan perbaikan aksesoris dinding
6. Periksa kondisi handrail`,
  },
  {
    id: 15,
    name: "Pos rumah pompa gerem",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 16,
    name: "Gudang Fasau",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 17,
    name: "Rumah Bijak Sampah",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 18,
    name: "Pos GPP",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 19,
    name: "Lapangan Olah raga Ecopark",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa lantai beton area olah raga
3. Periksa dan perbaikan aksesoris lapanga olah raga`,
  },
  {
    id: 20,
    name: "Saung Ecopark",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa dan perbaikan dudukan saung
3. Periksa dan perbaikan atap jerami
4. Periksa dan perbaikan ikatan tulangan saung`,
  },
  {
    id: 21,
    name: "Relling dan pagar Ecopark",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisa
2. Periksa dan perbaikan pondasi reiling pagar
3. Periksa dan perbaikan pengecatan pagar`,
  },
  {
    id: 22,
    name: "Pintu Air Ecopark",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisa
2. Periksa struktur pintu air
3. periksa dan hand valve pelumasan pintu air`,
  },
  {
    id: 23,
    name: "Tempat parkir dan musholla ecopark",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 24,
    name: "Rumah Pompa Lebak gede",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 25,
    name: "Mess lebak gede",
    description: "Pemeliharaan common building non KR",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 26,
    name: "Sungai ADB",
    description: "Pemeliharaan Sungai ADB",
    detail: `
1. Persiapan peralatan dan mobilisa
2. Periksa lantai beton 
3. Periksa dan perbaikan turap sungai
4. Periksa kondisi bak kontrol`,
  },
  {
    id: 27,
    name: "Sungai Ecopark",
    description: "Pemeliharaan Sungai Ecopark",
    detail: `
1. Persiapan peralatan dan mobilisa
2. Periksa lantai beton 
3. Periksa dan perbaikan turap sungai
4. Periksa kondisi bak kontrol`,
  },
  {
    id: 28,
    name: "Saluran air KTI Ecopark",
    description: "Pemeliharaan Pipa KTI Ecopark",
    detail: `
1. Persiapan peralatan dan mobilisa
2. Periksa danperbaikan kondisi pipa air KTI
3. Periksa dan perbaikan keran air dan flow meter
4. Periksa/perbaikan flow meter dan catat meter air`,
  },
  {
    id: 29,
    name: "Saluran Air KTI Lebak Gede",
    description: "Pemeliharaan Pipa KTI Lebak Gede",
    detail: `
1. Persiapan peralatan dan mobilisa
2. Periksa danperbaikan kondisi pipa air KTI
3. Periksa dan perbaikan keran air dan flow meter
4. Periksa/perbaikan flow meter dan catat meter air`,
  },
  {
    id: 30,
    name: "Pos Keamanan",
    description: "Pemeliharaan Pos Keamanan",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa, dan perbaikan/pembersihan atap dak beton
3. Periksa, dan perbaikan/pengecatan dinding
4. Periksa, dan perbaikan/pengecatan plafon
5. Periksa, dan perbaikan lantai keramik 
6. Periksa dan perbaikan sanitasi area
7. Periksa dan perbaikan electrical (lampu, stop kontak, instalasi listiklainnya)
8. Periksa dan perbaikan aksesoris gedung`,
  },
  {
    id: 31,
    name: "Gedung Administrasi",
    description: "Pemeliharaan Furniture Ruangan Gedung ADB",
    detail: `
1. Periksa, dan perbaikan/meja kursi
2. Periksa, dan perbaikan/pengecatan lemari
3. Periksa, dan perbaikan rak buku
4. Periksa, dan perbaikan sofa dan kursi tamu
5. Periksa, dan perbaikan meja rapat
6. Periksa, dan perbaikan aksesoris ruangan`,
  },
  {
    id: 32,
    name: "Meteran Air KTI",
    description: "Pemeliharaan Meter Air KTI",
    detail: `
1. Persiapan peralatan dan mobilisasi
2. Periksa dan catat (foto) Meter KTI
3. Periksa dan perbaikan Meteran KTI
4. Periksa dan perbaikan flow meter
5. Periksa dan catat kebocoran 
6. Input Meter KTI database
7. Cetak tagihan KTI`,
  },
];

// PM Schedule Data - represents the 4-week rotation pattern
const pmSchedule = {
  week1: {
    SENIN: [
      { assetId: 1, teamId: 1 },
      { assetId: 6, teamId: 2 },
    ],
    SELASA: [
      { assetId: 2, teamId: 2 },
      { assetId: 7, teamId: 3 },
    ],
    RABU: [
      { assetId: 3, teamId: 3 },
      { assetId: 8, teamId: 4 },
    ],
    KAMIS: [
      { assetId: 4, teamId: 4 },
      { assetId: 9, teamId: 1 },
    ],
    JUMAT: [
      { assetId: 5, teamId: 1 },
      { assetId: 10, teamId: 2 },
    ],
  },
  week2: {
    SENIN: [
      { assetId: 11, teamId: 2 },
      { assetId: 16, teamId: 3 },
    ],
    SELASA: [
      { assetId: 12, teamId: 3 },
      { assetId: 17, teamId: 4 },
    ],
    RABU: [
      { assetId: 13, teamId: 4 },
      { assetId: 18, teamId: 1 },
    ],
    KAMIS: [
      { assetId: 14, teamId: 1 },
      { assetId: 19, teamId: 2 },
    ],
    JUMAT: [
      { assetId: 15, teamId: 2 },
      { assetId: 20, teamId: 3 },
    ],
  },
  week3: {
    SENIN: [
      { assetId: 21, teamId: 3 },
      { assetId: 26, teamId: 4 },
    ],
    SELASA: [
      { assetId: 22, teamId: 4 },
      { assetId: 27, teamId: 1 },
    ],
    RABU: [
      { assetId: 23, teamId: 1 },
      { assetId: 28, teamId: 2 },
    ],
    KAMIS: [
      { assetId: 24, teamId: 2 },
      { assetId: 29, teamId: 3 },
    ],
    JUMAT: [
      { assetId: 25, teamId: 3 },
      { assetId: 30, teamId: 4 },
    ],
  },
  week4: {
    SENIN: [
      { assetId: 31, teamId: 4 },
      { assetId: 1, teamId: 1 },
    ],
    SELASA: [
      { assetId: 32, teamId: 1 },
      { assetId: 2, teamId: 2 },
    ],
    RABU: [
      { assetId: 1, teamId: 2 },
      { assetId: 3, teamId: 3 },
    ],
    KAMIS: [
      { assetId: 2, teamId: 3 },
      { assetId: 4, teamId: 4 },
    ],
    JUMAT: [
      { assetId: 3, teamId: 4 },
      { assetId: 1, teamId: 1 },
    ],
  },
};

// Function to determine which team is working on a given date
const getTeamAssignment = (date) => {
  const targetDate = new Date(date);

  // Get ISO week number
  const getWeekDetails = (date) => {
    const target = new Date(date.getTime());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    const weekInYear = 1 + Math.ceil((firstThursday - target) / 604800000);

    // Calculate cycle week (1-4) based on the week number
    const weekInCycle = ((weekInYear - 1) % 4) + 1;
    return { weekInCycle, weekInYear };
  };

  // Get week details
  const { weekInCycle } = getWeekDetails(targetDate);

  // Get day of week and convert to schedule format (we only have Mon-Fri)
  const dayOfWeek = targetDate.getDay();
  const days = ["", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];
  const scheduleDay = days[dayOfWeek];

  // If weekend or invalid day, return empty array
  if (!scheduleDay) return [];

  // Get week schedule based on ISO week cycle
  const weekSchedule = pmSchedule[`week${weekInCycle}`];
  if (!weekSchedule) return [];

  // Get day schedule
  const daySchedule = weekSchedule[scheduleDay];
  if (!daySchedule) return [];

  // Map assignments to detailed objects with asset and team info
  return daySchedule.map((assignment) => ({
    asset: pmAssets.find((a) => a.id === assignment.assetId),
    team: Object.values(pmTeams).find(
      (_, index) => index + 1 === assignment.teamId
    ),
    weekInYear: getWeekDetails(targetDate).weekInYear,
    weekInCycle: weekInCycle,
    date: targetDate.toISOString().split("T")[0],
  }));
};

/*
  Usage Example:
  To find out which team is assigned to which asset on a specific date, 
  you can call the getTeamAssignment function with the desired date as follows:
  
  const assignments = getTeamAssignment("2025-02-10");
  console.log(assignments);
  
  This will return an array of objects, each containing the asset and the team assigned to it on the given date.
  */

module.exports = {
  pmTeams,
  pmAssets,
  pmSchedule,
  getTeamAssignment,
};
