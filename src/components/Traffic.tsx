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

// Configuración de los vehículos (Velocidad, colores, desfases)
const VEHICLE_CONFIGS = [
  { color: '#00f0ff', trailColor: '#00aaff', speed: 2.2, size: [0.35, 0.15, 0.75], startProgress: 0.0, heightOffset: 0.4 },
  { color: '#ff007f', trailColor: '#ff0055', speed: 1.8, size: [0.3, 0.12, 0.65], startProgress: 0.25, heightOffset: 0.5 },
  { color: '#39ff14', trailColor: '#00aa00', speed: 2.5, size: [0.32, 0.14, 0.7], startProgress: 0.5, heightOffset: 0.45 },
  { color: '#ffb700', trailColor: '#cc8800', speed: 1.6, size: [0.4, 0.16, 0.8], startProgress: 0.75, heightOffset: 0.38 },
];

const PEDESTRIAN_CONFIGS = [
  { color: '#bd00ff', speed: 0.5, startProgress: 0.0 },
  { color: '#00f0ff', speed: 0.6, startProgress: 0.3 },
  { color: '#ffb700', speed: 0.4, startProgress: 0.6 },
  { color: '#39ff14', speed: 0.55, startProgress: 0.8 },
];

export const Traffic: React.FC<TrafficProps> = ({ carPaths, pedestrianPaths }) => {
  // Guardamos las referencias a los meshes para moverlos directamente en useFrame (alto rendimiento)
  const carRefs = useRef<(THREE.Group | null)[]>([]);
  const pedestrianRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Seguimiento de la distancia recorrida para cada elemento
  const carProgress = useRef<number[]>(VEHICLE_CONFIGS.map(c => c.startProgress));
  const pedProgress = useRef<number[]>(PEDESTRIAN_CONFIGS.map(p => p.startProgress));

  // Función de ayuda para interpolar la posición a lo largo de un circuito cerrado
  const getPositionOnPath = (path: Point3D[], progress: number, heightOffset = 0): { pos: THREE.Vector3, dir: THREE.Vector3 } => {
    const totalWaypoints = path.length;
    
    // El progreso va de 0 a 1 y da la vuelta en bucle
    const normalizedProgress = progress % 1.0;
    const exactIndex = normalizedProgress * totalWaypoints;
    const index = Math.floor(exactIndex);
    const nextIndex = (index + 1) % totalWaypoints;
    
    const ratio = exactIndex - index;
    
    const p1 = path[index];
    const p2 = path[nextIndex];
    
    // Posición interpolada
    const pos = new THREE.Vector3(
      p1.x + (p2.x - p1.x) * ratio,
      (p1.y + (p2.y - p1.y) * ratio) + heightOffset,
      p1.z + (p2.z - p1.z) * ratio
    );

    // Vector dirección para orientar el objeto hacia adelante
    const dir = new THREE.Vector3(
      p2.x - p1.x,
      p2.y - p1.y,
      p2.z - p1.z
    ).normalize();

    return { pos, dir };
  };

  useFrame((_, delta) => {
    // 1. Animar Vehículos (Coches voladores)
    VEHICLE_CONFIGS.forEach((config, idx) => {
      const carGroup = carRefs.current[idx];
      if (!carGroup) return;

      const path = carPaths[0]; // Usar la primera ruta de vehículos
      if (!path) return;

      // Calcular el largo total estimado del camino para avanzar de manera consistente
      // Avance: velocidad * delta / perímetro aproximado (anillo perimetral de la metrópolis 16x10)
      const perimeter = 120;
      carProgress.current[idx] += (config.speed * delta) / perimeter;

      const { pos, dir } = getPositionOnPath(path, carProgress.current[idx], config.heightOffset);
      
      // Actualizar posición
      carGroup.position.copy(pos);
      
      // Orientar en la dirección del movimiento
      const targetLookAt = pos.clone().add(dir);
      carGroup.lookAt(targetLookAt);
    });

    // 2. Animar Peatones (Pequeños drones caminantes)
    PEDESTRIAN_CONFIGS.forEach((config, idx) => {
      const pedMesh = pedestrianRefs.current[idx];
      if (!pedMesh) return;

      const path = pedestrianPaths[0]; // Usar la primera ruta peatonal
      if (!path) return;

      const perimeter = 60; // Perímetro peatonal interior ajustado para 16x10
      pedProgress.current[idx] += (config.speed * delta) / perimeter;

      const { pos, dir } = getPositionOnPath(path, pedProgress.current[idx], 0.05);

      pedMesh.position.copy(pos);
      
      // Orientar
      const targetLookAt = pos.clone().add(dir);
      pedMesh.lookAt(targetLookAt);
    });
  });

  return (
    <group>
      {/* RENDER DE COCHES VOLADORES */}
      {VEHICLE_CONFIGS.map((config, idx) => (
        <group
          key={`car-${idx}`}
          ref={el => { carRefs.current[idx] = el; }}
        >
          {/* Cuerpo del Coche Futurista */}
          <mesh castShadow>
            <boxGeometry args={config.size as [number, number, number]} />
            <meshStandardMaterial
              color={config.color}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Parabrisas de Neón (Cian o color secundario) */}
          <mesh position={[0, 0.07, 0.2]}>
            <boxGeometry args={[0.26, 0.08, 0.2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>

          {/* Luz Trasera de Neón (Estela) */}
          <mesh position={[0, 0, -(config.size[2] / 2 + 0.05)]}>
            <boxGeometry args={[0.2, 0.04, 0.1]} />
            <meshBasicMaterial color={config.trailColor} />
          </mesh>

          {/* Turbinas de levitación magnética inferiores (4 pequeñas esferas/cilindros) */}
          <mesh position={[-0.15, -config.size[1]/2, 0.2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[0.15, -config.size[1]/2, 0.2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[-0.15, -config.size[1]/2, -0.2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[0.15, -config.size[1]/2, -0.2]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </group>
      ))}

      {/* RENDER DE PEATONES (Drones esféricos de vigilancia) */}
      {PEDESTRIAN_CONFIGS.map((config, idx) => (
        <mesh
          key={`ped-${idx}`}
          ref={el => { pedestrianRefs.current[idx] = el; }}
          castShadow
        >
          {/* Forma cilíndrica/esférica tipo robot futurista */}
          <cylinderGeometry args={[0.08, 0.08, 0.25, 8]} />
          <meshStandardMaterial
            color="#141829"
            roughness={0.4}
            metalness={0.8}
          />
          {/* Ojo/Visor brillante de neón */}
          <mesh position={[0, 0.06, 0.07]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={config.color} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};
