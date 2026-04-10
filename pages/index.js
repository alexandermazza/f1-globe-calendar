import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { f1Races, generateArcs } from "../lib/data/f1-2024";

const World = dynamic(() => import("../lib/components/ui/globe").then(m => m.World), { ssr: false });

const globeConfig = {
  pointSize: 2,
  globeColor: "#0d1b2a",
  showAtmosphere: true,
  atmosphereColor: "#ff1801",
  atmosphereAltitude: 0.15,
  emissive: "#0a0a1a",
  emissiveIntensity: 0.25,
  shininess: 0.9,
  polygonColor: "rgba(200,220,255,0.65)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1500,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 48, lng: 10 },
  autoRotate: true,
  autoRotateSpeed: 0.3,
};

// circuit points ensure all 24 markers render via GlobeComponent's _buildData
const circuitPoints = f1Races.map(race => ({
  order: race.round,
  startLat: race.lat,
  startLng: race.lng,
  endLat: race.lat,
  endLng: race.lng,
  arcAlt: 0,
  color: "#e8002d",
}));

const arcs = generateArcs(f1Races);
const globeData = [...arcs, ...circuitPoints];

export default function Home() {
  const [hoveredCircuit, setHoveredCircuit] = useState(null);
  const [frontRace, setFrontRace] = useState(null);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-8 inset-x-0 z-20 text-center pointer-events-none"
      >
        <h1 className="text-white font-bold tracking-widest text-2xl md:text-4xl uppercase">
          2024 Formula 1 Season
        </h1>
        <p className="text-sm md:text-base mt-1" style={{ color: "rgba(232,0,45,0.8)" }}>
          24 Grands Prix · 21 Countries
        </p>
      </motion.div>

      {/* Globe */}
      <div className="absolute inset-0">
        <World
          globeConfig={globeConfig}
          data={globeData}
          races={f1Races}
          onHoverChange={setHoveredCircuit}
          onFrontRaceChange={setFrontRace}
        />
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-black pointer-events-none z-10" />

      {/* Front-facing race card — positioned on the globe at the circuit point */}
      {frontRace && !hoveredCircuit && (
        <motion.div
          key={frontRace.race.round}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute z-40 pointer-events-none"
          style={{
            left: Math.min(
              frontRace.screenX + 14,
              (typeof window !== "undefined" ? window.innerWidth : 800) - 190
            ),
            top: Math.min(
              Math.max(frontRace.screenY - 10, 80),
              (typeof window !== "undefined" ? window.innerHeight : 800) - 140
            ),
          }}
        >
          <div className="bg-[#0d0d0d]/90 backdrop-blur-sm border border-[#e8002d]/40 rounded-lg px-3 py-2.5 w-[180px] sm:w-[210px]">
            <div className="text-[#e8002d] text-[10px] font-bold tracking-widest mb-0.5">
              ROUND {String(frontRace.race.round).padStart(2, "0")}
            </div>
            <div className="text-white font-bold text-xs sm:text-sm leading-tight">{frontRace.race.name}</div>
            <div className="text-neutral-400 text-[10px] sm:text-xs mt-0.5">
              {frontRace.race.location}, {frontRace.race.country}
            </div>
            <div className="text-neutral-500 text-[10px] mt-0.5">{frontRace.race.date}</div>
          </div>
        </motion.div>
      )}

      {/* Hover tooltip */}
      {hoveredCircuit && (
        <div
          className="absolute z-50 pointer-events-none bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 text-sm shadow-lg"
          style={{ left: hoveredCircuit.screenX + 12, top: hoveredCircuit.screenY - 10 }}
        >
          <div className="text-[#e8002d] font-bold text-xs mb-1">
            RD {String(hoveredCircuit.race.round).padStart(2, "0")}
          </div>
          <div className="text-white font-semibold">{hoveredCircuit.race.name}</div>
          <div className="text-neutral-400 text-xs">
            {hoveredCircuit.race.location}, {hoveredCircuit.race.country}
          </div>
          <div className="text-neutral-500 text-xs mt-0.5">{hoveredCircuit.race.date}</div>
        </div>
      )}
    </div>
  );
}
