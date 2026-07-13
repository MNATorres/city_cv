import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface TrafficProps {
  carPaths: Point3D[][];
  pedestrianPaths: Point3D[][];
}

// Paleta de colores neón para la flota de vehículos
const CAR_COLORS = [
  { color: '#00f0ff', trail: '#00aaff' },
  { color: '#ff007f', trail: '#ff0055' },
  { color: '#39ff14', trail: '#00aa00' },
  { color: '#ffb700', trail: '#cc8800' },
  { color: '#c77dff', trail: '#7b2cbf' },
  { color: '#ff5d00', trail: '#cc4400' },
  { color: '#f8fafc', trail: '#88ccff' },
];

const PED_COLORS = ['#bd00ff', '#00f0ff', '#ffb700', '#39ff14', '#ff007f'];

// Hash determinista para variar la flota sin re-aleatorizar en cada render
const hash = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1.0;

// Largo total de un circuito cerrado (suma de segmentos incluyendo el cierre)
const pathLength = (path: Point3D[]): number => {
  let len = 0;
  for (let i = 0; i < path.length; i++) {
    const a = path[i];
    const b = path[(i + 1) % path.length];
    len += Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
  }
  return len || 1;
};

interface Vehicle {
  pathIndex: number;
  color: string;
  trail: string;
  size: [number, number, number];
  speed: number;
  progress: number;
  dir: 1 | -1;
  height: number;
}

interface Pedestrian {
  pathIndex: number;
  color: string;
  speed: number;
  progress: number;
  dir: 1 | -1;
}

export const Traffic: React.FC<TrafficProps> = ({ carPaths, pedestrianPaths }) => {
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const pedestrianRefs = useRef<(THREE.Group | null)[]>([]);

  // Longitud de cada circuito (para normalizar la velocidad)
  const carPerimeters = React.useMemo(() => carPaths.map(pathLength), [carPaths]);
  const pedPerimeters = React.useMemo(() => pedestrianPaths.map(pathLength), [pedestrianPaths]);

  // Construir la flota de vehículos: varios autos por circuito, con sentidos alternos
  const vehicles = React.useMemo<Vehicle[]>(() => {
    const list: Vehicle[] = [];
    carPaths.forEach((path, pi) => {
      const perimeter = pathLength(path);
      const count = Math.max(3, Math.round(perimeter / 17)); // más autos en anillos largos
      const dir: 1 | -1 = pi % 2 === 0 ? 1 : -1; // los anillos alternan sentido
      for (let k = 0; k < count; k++) {
        const s = hash(pi * 13.7 + k * 7.31);
        const palette = CAR_COLORS[(pi * 3 + k) % CAR_COLORS.length];
        list.push({
          pathIndex: pi,
          color: palette.color,
          trail: palette.trail,
          size: [0.3 + s * 0.12, 0.12 + s * 0.05, 0.6 + s * 0.28],
          speed: 1.5 + s * 1.3,
          progress: k / count + s * 0.03,
          dir,
          height: 0.16 + s * 0.05, // cerca del asfalto (menos "flotante")
        });
      }
    });
    return list;
  }, [carPaths]);

  // Construir peatones/drones repartidos por los circuitos peatonales
  const pedestrians = React.useMemo<Pedestrian[]>(() => {
    const list: Pedestrian[] = [];
    pedestrianPaths.forEach((path, pi) => {
      const perimeter = pathLength(path);
      const count = Math.max(3, Math.round(perimeter / 9));
      const dir: 1 | -1 = pi % 2 === 0 ? 1 : -1;
      for (let k = 0; k < count; k++) {
        const s = hash(pi * 5.3 + k * 3.17 + 91.7);
        list.push({
          pathIndex: pi,
          color: PED_COLORS[(pi * 2 + k) % PED_COLORS.length],
          speed: 0.4 + s * 0.25,
          progress: k / count + s * 0.05,
          dir,
        });
      }
    });
    return list;
  }, [pedestrianPaths]);

  // Progreso vivo de cada elemento. Un useMemo devuelve un array estable que se
  // reinicia cuando cambia la flota; mutar sus elementos dentro de useFrame es seguro.
  const carProgress = React.useMemo(() => vehicles.map((v) => v.progress), [vehicles]);
  const pedProgress = React.useMemo(() => pedestrians.map((p) => p.progress), [pedestrians]);

  // Interpolar posición y tangente a lo largo de un circuito cerrado
  const getPositionOnPath = (
    path: Point3D[],
    progress: number,
    heightOffset = 0
  ): { pos: THREE.Vector3; dir: THREE.Vector3 } => {
    const total = path.length;
    const normalized = ((progress % 1.0) + 1.0) % 1.0; // admite progreso negativo
    const exact = normalized * total;
    const index = Math.floor(exact);
    const nextIndex = (index + 1) % total;
    const ratio = exact - index;

    const p1 = path[index];
    const p2 = path[nextIndex];

    const pos = new THREE.Vector3(
      p1.x + (p2.x - p1.x) * ratio,
      p1.y + (p2.y - p1.y) * ratio + heightOffset,
      p1.z + (p2.z - p1.z) * ratio
    );
    const dir = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z).normalize();

    return { pos, dir };
  };

  useFrame((_, delta) => {
    // 1. Vehículos
    vehicles.forEach((v, idx) => {
      const group = carRefs.current[idx];
      if (!group) return;
      const path = carPaths[v.pathIndex];
      if (!path || path.length < 2) return;

      const perimeter = carPerimeters[v.pathIndex] || 1;
      carProgress[idx] += (v.dir * v.speed * delta) / perimeter;

      const { pos, dir } = getPositionOnPath(path, carProgress[idx], v.height);
      group.position.copy(pos);
      // Orientar hacia el sentido de avance (invertido si dir = -1)
      group.lookAt(pos.clone().add(dir.multiplyScalar(v.dir)));
    });

    // 2. Peatones
    pedestrians.forEach((p, idx) => {
      const group = pedestrianRefs.current[idx];
      if (!group) return;
      const path = pedestrianPaths[p.pathIndex];
      if (!path || path.length < 2) return;

      const perimeter = pedPerimeters[p.pathIndex] || 1;
      pedProgress[idx] += (p.dir * p.speed * delta) / perimeter;

      const { pos, dir } = getPositionOnPath(path, pedProgress[idx], 0.05);
      group.position.copy(pos);
      group.lookAt(pos.clone().add(dir.multiplyScalar(p.dir)));
    });
  });

  return (
    <group>
      {/* FLOTA DE VEHÍCULOS */}
      {vehicles.map((v, idx) => (
        <group key={`car-${idx}`} ref={(el) => { carRefs.current[idx] = el; }}>
          {/* Cuerpo */}
          <mesh castShadow>
            <boxGeometry args={v.size} />
            <meshStandardMaterial color={v.color} roughness={0.25} metalness={0.8} />
          </mesh>
          {/* Parabrisas */}
          <mesh position={[0, 0.07, 0.18]}>
            <boxGeometry args={[v.size[0] * 0.75, 0.08, 0.2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
          </mesh>
          {/* Luz trasera / estela */}
          <mesh position={[0, 0, -(v.size[2] / 2 + 0.05)]}>
            <boxGeometry args={[0.2, 0.04, 0.1]} />
            <meshBasicMaterial color={v.trail} />
          </mesh>
          {/* Turbinas de levitación */}
          {[
            [-0.15, 0.18],
            [0.15, 0.18],
            [-0.15, -0.2],
            [0.15, -0.2],
          ].map(([tx, tz], ti) => (
            <mesh key={ti} position={[tx, -v.size[1] / 2, tz]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
          ))}
        </group>
      ))}

      {/* PEATONES / DRONES */}
      {pedestrians.map((p, idx) => (
        <group key={`ped-${idx}`} ref={(el) => { pedestrianRefs.current[idx] = el; }}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 8]} />
            <meshStandardMaterial color="#141829" roughness={0.4} metalness={0.8} />
          </mesh>
          {/* Visor de neón */}
          <mesh position={[0, 0.06, 0.07]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
