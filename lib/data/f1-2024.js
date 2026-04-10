/**
 * F1 2024 Season Data
 * Race schedule with coordinates and arc generator for three-globe visualization
 */

/**
 * 2024 F1 Race Calendar
 * 24 rounds in calendar order with circuit coordinates and dates
 */
export const f1Races = [
  {
    round: 1,
    name: "Bahrain Grand Prix",
    location: "Sakhir",
    country: "Bahrain",
    date: "2 March 2024",
    lat: 26.0325,
    lng: 50.5106,
  },
  {
    round: 2,
    name: "Saudi Arabian Grand Prix",
    location: "Jeddah",
    country: "Saudi Arabia",
    date: "9 March 2024",
    lat: 21.6319,
    lng: 39.1044,
  },
  {
    round: 3,
    name: "Australian Grand Prix",
    location: "Melbourne",
    country: "Australia",
    date: "24 March 2024",
    lat: -37.8497,
    lng: 144.968,
  },
  {
    round: 4,
    name: "Japanese Grand Prix",
    location: "Suzuka",
    country: "Japan",
    date: "7 April 2024",
    lat: 34.8431,
    lng: 136.5407,
  },
  {
    round: 5,
    name: "Chinese Grand Prix",
    location: "Shanghai",
    country: "China",
    date: "21 April 2024",
    lat: 31.3389,
    lng: 121.2198,
  },
  {
    round: 6,
    name: "Miami Grand Prix",
    location: "Miami",
    country: "USA",
    date: "5 May 2024",
    lat: 25.9581,
    lng: -80.2389,
  },
  {
    round: 7,
    name: "Emilia Romagna Grand Prix",
    location: "Imola",
    country: "Italy",
    date: "19 May 2024",
    lat: 44.3439,
    lng: 11.7167,
  },
  {
    round: 8,
    name: "Monaco Grand Prix",
    location: "Monaco",
    country: "Monaco",
    date: "26 May 2024",
    lat: 43.7347,
    lng: 7.4206,
  },
  {
    round: 9,
    name: "Canadian Grand Prix",
    location: "Montreal",
    country: "Canada",
    date: "9 June 2024",
    lat: 45.5048,
    lng: -73.5228,
  },
  {
    round: 10,
    name: "Spanish Grand Prix",
    location: "Barcelona",
    country: "Spain",
    date: "23 June 2024",
    lat: 41.57,
    lng: 2.2611,
  },
  {
    round: 11,
    name: "Austrian Grand Prix",
    location: "Spielberg",
    country: "Austria",
    date: "30 June 2024",
    lat: 47.2197,
    lng: 14.7647,
  },
  {
    round: 12,
    name: "British Grand Prix",
    location: "Silverstone",
    country: "UK",
    date: "7 July 2024",
    lat: 52.0786,
    lng: -1.0169,
  },
  {
    round: 13,
    name: "Hungarian Grand Prix",
    location: "Budapest",
    country: "Hungary",
    date: "21 July 2024",
    lat: 47.5789,
    lng: 19.2486,
  },
  {
    round: 14,
    name: "Belgian Grand Prix",
    location: "Spa",
    country: "Belgium",
    date: "28 July 2024",
    lat: 50.4372,
    lng: 5.9714,
  },
  {
    round: 15,
    name: "Dutch Grand Prix",
    location: "Zandvoort",
    country: "Netherlands",
    date: "25 August 2024",
    lat: 52.3888,
    lng: 4.5409,
  },
  {
    round: 16,
    name: "Italian Grand Prix",
    location: "Monza",
    country: "Italy",
    date: "1 September 2024",
    lat: 45.6156,
    lng: 9.2811,
  },
  {
    round: 17,
    name: "Azerbaijan Grand Prix",
    location: "Baku",
    country: "Azerbaijan",
    date: "15 September 2024",
    lat: 40.3725,
    lng: 49.8533,
  },
  {
    round: 18,
    name: "Singapore Grand Prix",
    location: "Singapore",
    country: "Singapore",
    date: "22 September 2024",
    lat: 1.2914,
    lng: 103.8639,
  },
  {
    round: 19,
    name: "United States Grand Prix",
    location: "Austin",
    country: "USA",
    date: "20 October 2024",
    lat: 30.1328,
    lng: -97.6411,
  },
  {
    round: 20,
    name: "Mexico City Grand Prix",
    location: "Mexico City",
    country: "Mexico",
    date: "27 October 2024",
    lat: 19.4042,
    lng: -99.0907,
  },
  {
    round: 21,
    name: "São Paulo Grand Prix",
    location: "São Paulo",
    country: "Brazil",
    date: "3 November 2024",
    lat: -23.7036,
    lng: -46.6997,
  },
  {
    round: 22,
    name: "Las Vegas Grand Prix",
    location: "Las Vegas",
    country: "USA",
    date: "23 November 2024",
    lat: 36.1699,
    lng: -115.1398,
  },
  {
    round: 23,
    name: "Qatar Grand Prix",
    location: "Lusail",
    country: "Qatar",
    date: "1 December 2024",
    lat: 25.49,
    lng: 51.4536,
  },
  {
    round: 24,
    name: "Abu Dhabi Grand Prix",
    location: "Abu Dhabi",
    country: "UAE",
    date: "8 December 2024",
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
