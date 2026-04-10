/**
 * F1 2026 Season Data
 * Race schedule with coordinates and arc generator for three-globe visualization
 * 22 rounds (Bahrain & Saudi Arabian GPs cancelled)
 */

/**
 * 2026 F1 Race Calendar
 * 22 rounds in calendar order with circuit coordinates and dates
 */
export const f1Races = [
  {
    round: 1,
    name: "Australian Grand Prix",
    location: "Melbourne",
    country: "Australia",
    date: "8 March 2026",
    lat: -37.8497,
    lng: 144.968,
  },
  {
    round: 2,
    name: "Chinese Grand Prix",
    location: "Shanghai",
    country: "China",
    date: "15 March 2026",
    lat: 31.3389,
    lng: 121.2198,
  },
  {
    round: 3,
    name: "Japanese Grand Prix",
    location: "Suzuka",
    country: "Japan",
    date: "29 March 2026",
    lat: 34.8431,
    lng: 136.5407,
  },
  {
    round: 4,
    name: "Miami Grand Prix",
    location: "Miami",
    country: "USA",
    date: "3 May 2026",
    lat: 25.9581,
    lng: -80.2389,
  },
  {
    round: 5,
    name: "Canadian Grand Prix",
    location: "Montreal",
    country: "Canada",
    date: "24 May 2026",
    lat: 45.5048,
    lng: -73.5228,
  },
  {
    round: 6,
    name: "Monaco Grand Prix",
    location: "Monaco",
    country: "Monaco",
    date: "7 June 2026",
    lat: 43.7347,
    lng: 7.4206,
  },
  {
    round: 7,
    name: "Barcelona-Catalunya Grand Prix",
    location: "Montmelo",
    country: "Spain",
    date: "14 June 2026",
    lat: 41.57,
    lng: 2.2611,
  },
  {
    round: 8,
    name: "Austrian Grand Prix",
    location: "Spielberg",
    country: "Austria",
    date: "28 June 2026",
    lat: 47.2197,
    lng: 14.7647,
  },
  {
    round: 9,
    name: "British Grand Prix",
    location: "Silverstone",
    country: "UK",
    date: "5 July 2026",
    lat: 52.0786,
    lng: -1.0169,
  },
  {
    round: 10,
    name: "Belgian Grand Prix",
    location: "Spa",
    country: "Belgium",
    date: "19 July 2026",
    lat: 50.4372,
    lng: 5.9714,
  },
  {
    round: 11,
    name: "Hungarian Grand Prix",
    location: "Budapest",
    country: "Hungary",
    date: "26 July 2026",
    lat: 47.5789,
    lng: 19.2486,
  },
  {
    round: 12,
    name: "Dutch Grand Prix",
    location: "Zandvoort",
    country: "Netherlands",
    date: "23 August 2026",
    lat: 52.3888,
    lng: 4.5409,
  },
  {
    round: 13,
    name: "Italian Grand Prix",
    location: "Monza",
    country: "Italy",
    date: "6 September 2026",
    lat: 45.6156,
    lng: 9.2811,
  },
  {
    round: 14,
    name: "Spanish Grand Prix",
    location: "Madrid",
    country: "Spain",
    date: "13 September 2026",
    lat: 40.4653,
    lng: -3.6153,
  },
  {
    round: 15,
    name: "Azerbaijan Grand Prix",
    location: "Baku",
    country: "Azerbaijan",
    date: "26 September 2026",
    lat: 40.3725,
    lng: 49.8533,
  },
  {
    round: 16,
    name: "Singapore Grand Prix",
    location: "Singapore",
    country: "Singapore",
    date: "11 October 2026",
    lat: 1.2914,
    lng: 103.8639,
  },
  {
    round: 17,
    name: "United States Grand Prix",
    location: "Austin",
    country: "USA",
    date: "25 October 2026",
    lat: 30.1328,
    lng: -97.6411,
  },
  {
    round: 18,
    name: "Mexico City Grand Prix",
    location: "Mexico City",
    country: "Mexico",
    date: "1 November 2026",
    lat: 19.4042,
    lng: -99.0907,
  },
  {
    round: 19,
    name: "São Paulo Grand Prix",
    location: "São Paulo",
    country: "Brazil",
    date: "8 November 2026",
    lat: -23.7036,
    lng: -46.6997,
  },
  {
    round: 20,
    name: "Las Vegas Grand Prix",
    location: "Las Vegas",
    country: "USA",
    date: "21 November 2026",
    lat: 36.1699,
    lng: -115.1398,
  },
  {
    round: 21,
    name: "Qatar Grand Prix",
    location: "Lusail",
    country: "Qatar",
    date: "29 November 2026",
    lat: 25.49,
    lng: 51.4536,
  },
  {
    round: 22,
    name: "Abu Dhabi Grand Prix",
    location: "Abu Dhabi",
    country: "UAE",
    date: "6 December 2026",
    lat: 24.4672,
    lng: 54.6031,
  },
];

/**
 * Haversine distance calculation
 * Returns distance in kilometers between two lat/lng points
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate arcs for three-globe visualization
 * Creates arcs between consecutive race locations
 * Arc altitude is normalized based on haversine distance
 *
 * @param {Array} races - Array of race objects with lat/lng coordinates
 * @returns {Array} Array of arc objects for three-globe
 */
export function generateArcs(races) {
  // First pass: compute all distances
  const distances = [];
  for (let i = 0; i < races.length - 1; i++) {
    distances.push(haversineDistance(
      races[i].lat, races[i].lng,
      races[i + 1].lat, races[i + 1].lng
    ));
  }
  const maxDist = Math.max(...distances);

  // Second pass: build arcs with normalized altitude
  return distances.map((distance, i) => ({
    order: i + 1,
    startLat: races[i].lat,
    startLng: races[i].lng,
    endLat: races[i + 1].lat,
    endLng: races[i + 1].lng,
    arcAlt: 0.15 + (0.6 - 0.15) * (distance / maxDist),
    color: "#e8002d",
  }));
}
