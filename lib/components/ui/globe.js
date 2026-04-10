import { useEffect, useRef, useState } from "react";
import { Color, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "./data/globe.json";
extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;

// Define the GlobeComponent to be dynamically imported
export function GlobeComponent({ globeConfig, data, globeRef }) {
  const [globeData, setGlobeData] = useState(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (typeof window !== "undefined" && globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const _buildData = () => {
    const arcs = data;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color);
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every((k) => v2[k] === v[k])
        ) === i
    );

    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);

      startAnimation();
    }
  }, [globeData]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) return;

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => d.startLat * 1)
      .arcStartLng((d) => d.startLng * 1)
      .arcEndLat((d) => d.endLat * 1)
      .arcEndLng((d) => d.endLng * 1)
      .arcColor((e) => e.color)
      .arcAltitude((e) => e.arcAlt * 1)
      .arcStroke(0.4)
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => e.order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(data)
      .pointColor(() => "#ff4466")
      .pointsMerge(true)
      .pointAltitude(0.02)
      .pointRadius(4);

    globeRef.current
      .ringsData([])
      .ringColor((e) => (t) => e.color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && globeRef.current && globeData) {
      const interval = setInterval(() => {
        if (!globeRef.current || !globeData) return;

        const numbersOfRings = genRandomNumbers(
          0,
          data.length,
          Math.floor((data.length * 4) / 5)
        );

        globeRef.current.ringsData(
          globeData.filter((d, i) => numbersOfRings.includes(i))
        );
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [globeRef.current, globeData]);

  return (
    <>
      {typeof window !== "undefined" && <threeGlobe ref={globeRef} />}
    </>
  );
}

// three-globe v2.35.2 has no built-in hover API. This component projects
// circuit world positions to screen coords each frame and detects proximity
// to the mouse cursor, replacing the spec's original onPointHover approach.
function CircuitHoverDetector({ races, globeRef, onHoverChange }) {
  const { camera, gl } = useThree();
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rectRef = useRef(null);
  const prevRef = useRef(null);

  useEffect(() => {
    const canvas = gl.domElement;
    rectRef.current = canvas.getBoundingClientRect();

    const onMove = (e) => {
      const rect = rectRef.current;
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onResize = () => {
      rectRef.current = canvas.getBoundingClientRect();
    };

    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [gl]);

  useFrame(() => {
    if (!globeRef.current) return;
    const rect = rectRef.current;
    if (!rect) return;
    const { x: mx, y: my } = mouseRef.current;

    let closest = null;
    let closestDist = 30;

    races.forEach((race) => {
      const pos = globeRef.current.getCoords(race.lat, race.lng, 0.01);
      if (!pos) return;
      const vec = new Vector3(pos.x, pos.y, pos.z);

      // Cull back hemisphere: circuit's world position doubles as outward normal
      // for a sphere centered at origin. If it faces away from camera, skip.
      const toCamera = camera.position.clone().sub(vec);
      if (toCamera.dot(vec) < 0) return;

      vec.project(camera);
      const sx = (vec.x * 0.5 + 0.5) * rect.width;
      const sy = (-vec.y * 0.5 + 0.5) * rect.height;
      const dist = Math.hypot(sx - mx, sy - my);
      if (dist < closestDist) {
        closestDist = dist;
        closest = { race, screenX: sx, screenY: sy };
      }
    });

    const prev = prevRef.current;
    const changed =
      (closest === null) !== (prev === null) ||
      (closest !== null && prev !== null && closest.race.round !== prev.race.round);

    if (changed) {
      prevRef.current = closest;
      onHoverChange(closest);
    }
  });

  return null;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    if (typeof window !== "undefined") {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(size.width, size.height);
      gl.setClearColor(0x000000, 0);
    }
  }, [gl, size]);

  return null;
}

export function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}

function FrontRaceDetector({ races, globeRef, onFrontRaceChange }) {
  const { camera, gl } = useThree();
  const prevRoundRef = useRef(null);
  const rectRef = useRef(null);

  useEffect(() => {
    const canvas = gl.domElement;
    rectRef.current = canvas.getBoundingClientRect();
    const onResize = () => { rectRef.current = canvas.getBoundingClientRect(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [gl]);

  useFrame(() => {
    if (!globeRef.current || !races.length) return;
    const rect = rectRef.current;
    if (!rect) return;

    const camDir = camera.position.clone().normalize();
    let bestRace = null;
    let bestDot = -Infinity;
    let bestScreenX = 0;
    let bestScreenY = 0;

    races.forEach((race) => {
      const pos = globeRef.current.getCoords(race.lat, race.lng, 0);
      if (!pos) return;
      const vec = new Vector3(pos.x, pos.y, pos.z);
      const raceVec = vec.clone().normalize();
      const dot = raceVec.dot(camDir);
      if (dot > bestDot) {
        bestDot = dot;
        bestRace = race;
        const projected = vec.clone().project(camera);
        bestScreenX = (projected.x * 0.5 + 0.5) * rect.width;
        bestScreenY = (-projected.y * 0.5 + 0.5) * rect.height;
      }
    });

    if (bestRace && bestRace.round !== prevRoundRef.current) {
      prevRoundRef.current = bestRace.round;
      onFrontRaceChange({ race: bestRace, screenX: bestScreenX, screenY: bestScreenY });
    }
  });

  return null;
}

export function World({ globeConfig, data, races, onHoverChange, onFrontRaceChange }) {
  const globeRef = useRef(null);

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 300], fov: 50, near: 1, far: 1000 }}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={1.2} />
      <directionalLight color={globeConfig.directionalLeftLight} position={[-400, 100, 400]} intensity={1.0} />
      <directionalLight color={globeConfig.directionalTopLight} position={[-200, 500, 200]} intensity={0.8} />
      <pointLight color={globeConfig.pointLight} position={[-200, 500, 200]} intensity={1.4} />
      <GlobeComponent globeConfig={globeConfig} data={data} globeRef={globeRef} />
      <CircuitHoverDetector races={races || []} globeRef={globeRef} onHoverChange={onHoverChange || (() => {})} />
      {onFrontRaceChange && (
        <FrontRaceDetector races={races || []} globeRef={globeRef} onFrontRaceChange={onFrontRaceChange} />
      )}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
        autoRotate={globeConfig.autoRotate}
        autoRotateSpeed={globeConfig.autoRotateSpeed}
      />
    </Canvas>
  );
}
