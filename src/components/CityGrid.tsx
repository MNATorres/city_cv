import React from 'react';
import { Instances, Instance } from '@react-three/drei';
import { Building } from './Building';
import { Traffic } from './Traffic';
import { cvData } from '../cvData';

interface CityGridProps {
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
}

// Componente de Árbol de Pradera procedimental
const MeadowTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1.0 }) => {
  const hash = Math.sin(position[0] * 12.9898 + position[2] * 78.233) * 43758.5453;
  const treeType = Math.floor(Math.abs(hash * 10)) % 3;
  const heightScale = 0.85 + (Math.abs(hash) % 0.3);
  const finalScale = scale * heightScale;
  
  return (
    <group position={position} scale={[finalScale, finalScale, finalScale]}>
      {treeType === 0 && (
        <group>
          <mesh castShadow position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.4, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <coneGeometry args={[0.28, 0.6, 8]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      )}

      {treeType === 1 && (
        <group>
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.4, 0]} castShadow>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
        </group>
      )}

      {treeType === 2 && (
        <group>
          <mesh castShadow position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.48, 0]} castShadow>
            <coneGeometry args={[0.22, 0.5, 8]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Componente de Arbusto de Pradera procedimental
const MeadowBush: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1.0 }) => {
  const hash = Math.sin(position[0] * 12.9898 + position[2] * 78.233) * 43758.5453;
  const bushScale = 0.7 + (Math.abs(hash) % 0.5);
  
  return (
    <group position={position} scale={[scale * bushScale, scale * bushScale, scale * bushScale]}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color="#16a34a" roughness={0.9} flatShading />
      </mesh>
      <mesh castShadow position={[0.1, 0.07, -0.05]} scale={[0.8, 0.8, 0.8]}>
        <dodecahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
};

// Farola urbana de bajo poligonaje (poste + brazo + cabezal cálido emisivo)
const StreetLamp: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Poste */}
      <mesh castShadow position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Brazo curvo */}
      <mesh castShadow position={[0.18, 1.22, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Cabezal luminoso cálido */}
      <mesh position={[0.36, 1.16, 0]}>
        <boxGeometry args={[0.16, 0.08, 0.12]} />
        <meshStandardMaterial color="#fff4d6" emissive="#ffd27a" emissiveIntensity={1.4} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Componente para un Parque con árboles procedimentales bajos en polígonos
const Park: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Base de césped verde claro */}
      <mesh receiveShadow position={[0, 0.025, 0]}>
        <boxGeometry args={[2.0, 0.05, 2.0]} />
        <meshStandardMaterial color="#86efac" roughness={0.9} />
      </mesh>
      
      {/* Árbol 1 */}
      <group position={[-0.4, 0.05, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <coneGeometry args={[0.25, 0.5, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.8} />
        </mesh>
      </group>

      {/* Árbol 2 */}
      <group position={[0.4, 0.05, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Árbol 3 */}
      <group position={[-0.3, 0.05, 0.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <coneGeometry args={[0.2, 0.45, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export const CityGrid: React.FC<CityGridProps> = ({
  selectedBuildingId,
  onSelectBuilding,
}) => {
  // El CV vive en una cuadrícula lógica de 10x6, pero la metrópolis se extiende
  // mucho más allá con manzanas residenciales y parques alrededor del núcleo.
  const cvCols = 10;
  const cvRows = 6;
  const cols = 16; // Ancho total de la ciudad
  const rows = 10; // Profundidad total de la ciudad
  const spacing = 2.5; // Tamaño manzana (2.0) + Calle (0.5)

  // Desplazamiento para mantener la cuadrícula del CV centrada dentro de la ciudad
  const offsetC = Math.floor((cols - cvCols) / 2); // 3
  const offsetR = Math.floor((rows - cvRows) / 2); // 2

  // Función para transformar coordenadas de manzana (C, R) a coordenadas 3D (X, Y, Z)
  const getCoords = (c: number, r: number): [number, number, number] => {
    const x = (c - (cols - 1) / 2) * spacing; // Centrado en X
    const z = (r - (rows - 1) / 2) * spacing; // Centrado en Z
    return [x, 0.05, z];
  };

  // Semilla determinista por manzana (para parques y decoración pseudo-aleatorios estables)
  const blockHash = (c: number, r: number): number =>
    Math.abs(Math.sin(c * 49.13 + r * 91.7) * 43758.5453) % 1.0;

  // Mitad del ancho/profundidad del anillo de calles perimetrales (justo dentro de la ciudad)
  const ringX = (cols / 2 - 0.5) * spacing; // 18.75
  const ringZ = (rows / 2 - 0.5) * spacing; // 11.25

  // Coordenadas de los caminos de tráfico (anillo perimetral de la metrópolis)
  const carPaths = [
    [
      { x: -ringX, y: 0.1, z: -ringZ },
      { x: ringX, y: 0.1, z: -ringZ },
      { x: ringX, y: 0.1, z: ringZ },
      { x: -ringX, y: 0.1, z: ringZ },
    ]
  ];

  const pedestrianPaths = [
    [
      { x: -ringX / 2, y: 0.03, z: -ringZ / 2 },
      { x: ringX / 2, y: 0.03, z: -ringZ / 2 },
      { x: ringX / 2, y: 0.03, z: ringZ / 2 },
      { x: -ringX / 2, y: 0.03, z: ringZ / 2 },
    ]
  ];

  // ¿Esta manzana (en coordenadas del CV) es un parque del núcleo?
  const checkIsCorePark = (cvC: number, cvR: number): boolean => {
    const parkCoords = [
      {c: 0, r: 0}, {c: 9, r: 0}, {c: 0, r: 5}, {c: 9, r: 5},
      {c: 0, r: 2}, {c: 9, r: 2}, {c: 4, r: 0}, {c: 5, r: 0},
      {c: 4, r: 5}, {c: 5, r: 5}
    ];
    return parkCoords.some(p => p.c === cvC && p.r === cvR);
  };

  // Renderizar manzanas de la cuadrícula
  const renderBlocks = () => {
    const blocks: React.ReactNode[] = [];
    const scaleFactor = 0.90; // Escala para cada casa dentro del cuadrante (ocupa 0.9 unidades, dejando 0.1 de vereda)

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const [x, y, z] = getCoords(c, r);
        const blockId = `block-${c}-${r}`;

        // Coordenadas equivalentes dentro de la cuadrícula lógica del CV (10x6)
        const cvC = c - offsetC;
        const cvR = r - offsetR;
        const inCore = cvC >= 0 && cvC < cvCols && cvR >= 0 && cvR < cvRows;

        // 1. Verificar si es el Ayuntamiento (centro de la cuadrícula del CV)
        const isHQ = inCore && cvC === 4 && cvR === 2;

        // Parques: los del núcleo en posiciones fijas; en el anillo exterior, dispersos
        const isPark = inCore
          ? checkIsCorePark(cvC, cvR)
          : blockHash(c, r) < 0.28;

        if (isPark) {
          blocks.push(<Park key={blockId} position={[x, y, z]} />);
          continue;
        }

        if (isHQ) {
          // El Ayuntamiento central (HQ) se queda en tamaño normal y centrado
          blocks.push(
            <group key={`plat-${blockId}`} position={[x, y, z]}>
              <mesh receiveShadow castShadow>
                <boxGeometry args={[2.0, 0.05, 2.0]} />
                <meshStandardMaterial
                  color={selectedBuildingId === 'hq' ? '#e0f2fe' : '#ffffff'}
                  roughness={0.5}
                  metalness={0.1}
                />
              </mesh>
              <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.92, 0.98, 4]} />
                <meshBasicMaterial color={selectedBuildingId === 'hq' ? '#00f0ff' : '#cbd5e1'} transparent opacity={0.5} />
              </mesh>
            </group>
          );
          blocks.push(
            <Building
              key={`building-${blockId}`}
              id="hq"
              name="Centro de Comando (BIO)"
              type="hq"
              position={[x, y, z]}
              size={[1, 1]}
              isSelected={selectedBuildingId === 'hq'}
              onClick={() => onSelectBuilding('hq')}
            />
          );
          continue;
        }

        // 2. Buscar si hay algún elemento de CV o Habilidad en esta manzana (en coords del núcleo)
        const expItem = inCore ? cvData.experience.find(e => e.gridPos.x === cvC && e.gridPos.z === cvR) : undefined;
        const projItem = inCore ? cvData.projects.find(p => p.gridPos.x === cvC && p.gridPos.z === cvR) : undefined;
        const eduItem = inCore ? cvData.education.find(ed => ed.gridPos.x === cvC && ed.gridPos.z === cvR) : undefined;
        const skillItem = inCore ? cvData.skills.find(s => s.gridPos.x === cvC && s.gridPos.z === cvR) : undefined;

        // Si alguna casa de esta manzana está seleccionada, la plataforma brilla
        const isBlockSelected = 
          (expItem && selectedBuildingId === expItem.id) ||
          (projItem && selectedBuildingId === projItem.id) ||
          (eduItem && selectedBuildingId === eduItem.id) ||
          (skillItem && selectedBuildingId === skillItem.id) ||
          selectedBuildingId === `${blockId}-q0` ||
          selectedBuildingId === `${blockId}-q1` ||
          selectedBuildingId === `${blockId}-q2` ||
          selectedBuildingId === `${blockId}-q3`;

        // Renderizar la plataforma de la manzana
        blocks.push(
          <group key={`plat-${blockId}`} position={[x, y, z]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[2.0, 0.05, 2.0]} />
              <meshStandardMaterial
                color={isBlockSelected ? '#e0f2fe' : '#ffffff'}
                roughness={0.5}
                metalness={0.1}
              />
            </mesh>
            <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.92, 0.98, 4]} />
              <meshBasicMaterial color={isBlockSelected ? '#00f0ff' : '#cbd5e1'} transparent opacity={0.5} />
            </mesh>
          </group>
        );

        // Definir los 4 cuadrantes dentro de la manzana (grid de 2x2)
        const o = 0.45; // Offset respecto al centro
        const subPositions: [number, number, number][] = [
          [x - o, y, z - o], // Cuadrante 0
          [x + o, y, z - o], // Cuadrante 1
          [x - o, y, z + o], // Cuadrante 2
          [x + o, y, z + o], // Cuadrante 3
        ];

        // 3. Renderizar las 4 casas por manzana
        for (let q = 0; q < 4; q++) {
          const subPos = subPositions[q];
          const subId = `${blockId}-q${q}`;

          // Si hay un elemento de CV en este bloque, lo colocamos en el primer cuadrante (q === 0)
          if (q === 0 && (expItem || projItem || eduItem || skillItem)) {
            if (expItem) {
              blocks.push(
                <Building
                  key={`building-${subId}`}
                  id={expItem.id}
                  name={`${expItem.role} @ ${expItem.company.split(' ')[0]}`}
                  type={expItem.buildingType}
                  position={subPos}
                  size={[0.5, 0.5]}
                  isSelected={selectedBuildingId === expItem.id}
                  onClick={() => onSelectBuilding(expItem.id)}
                  scale={scaleFactor}
                />
              );
            } else if (projItem) {
              blocks.push(
                <Building
                  key={`building-${subId}`}
                  id={projItem.id}
                  name={projItem.name}
                  type={projItem.buildingType}
                  position={subPos}
                  size={[0.5, 0.5]}
                  isSelected={selectedBuildingId === projItem.id}
                  onClick={() => onSelectBuilding(projItem.id)}
                  scale={scaleFactor}
                />
              );
            } else if (eduItem) {
              blocks.push(
                <Building
                  key={`building-${subId}`}
                  id={eduItem.id}
                  name={eduItem.degree.split(' ')[0] + ' (' + eduItem.institution.split(' ')[0] + ')'}
                  type={eduItem.buildingType}
                  position={subPos}
                  size={[0.5, 0.5]}
                  isSelected={selectedBuildingId === eduItem.id}
                  onClick={() => onSelectBuilding(eduItem.id)}
                  scale={scaleFactor}
                />
              );
            } else if (skillItem) {
              blocks.push(
                <Building
                  key={`building-${subId}`}
                  id={skillItem.id}
                  name={`Habilidad: ${skillItem.name}`}
                  type="house"
                  position={subPos}
                  size={[0.5, 0.5]}
                  isSelected={selectedBuildingId === skillItem.id}
                  onClick={() => onSelectBuilding(skillItem.id)}
                  scale={scaleFactor}
                />
              );
            }
          } else {
            // Casas comunes de relleno decorativo
            blocks.push(
              <Building
                key={`building-${subId}`}
                id={subId}
                name="Sector Residencial"
                type="house"
                position={subPos}
                size={[0.5, 0.5]}
                isSelected={selectedBuildingId === subId}
                onClick={() => onSelectBuilding(subId)}
                scale={scaleFactor}
              />
            );
          }
        }
      }
    }

    return blocks;
  };

  // Dimensiones de la isla de concreto que delimita la metrópolis
  const islandW = cols * spacing + 2; // 42
  const islandD = rows * spacing + 3; // 28

  // Bosque procedimental que rodea la isla (determinista para no re-aleatorizar en cada render)
  const vegetation = React.useMemo(() => {
    const items: { tree: boolean; pos: [number, number, number]; scale: number }[] = [];
    const h = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1.0;
    const halfX = islandW / 2 + 1.5; // empieza justo fuera de la isla
    const halfZ = islandD / 2 + 1.5;
    const bands = 2;     // profundidad del bosque
    const perX = 17;     // densidad lados superior/inferior
    const perZ = 11;     // densidad lados izquierdo/derecho
    let k = 1;
    for (let b = 0; b < bands; b++) {
      const gx = halfX + b * 3.4;
      const gz = halfZ + b * 3.4;
      for (let i = 0; i < perX; i++) {
        const x = -gx + (i / (perX - 1)) * 2 * gx + (h(k++) - 0.5) * 2.6;
        items.push({ tree: h(k++) > 0.32, pos: [x, -0.05, gz + (h(k++) - 0.5) * 2.2], scale: 0.8 + h(k++) * 0.9 });
        items.push({ tree: h(k++) > 0.32, pos: [x, -0.05, -gz - (h(k++) - 0.5) * 2.2], scale: 0.8 + h(k++) * 0.9 });
      }
      for (let i = 0; i < perZ; i++) {
        const z = -gz + (i / (perZ - 1)) * 2 * gz + (h(k++) - 0.5) * 2.6;
        items.push({ tree: h(k++) > 0.32, pos: [gx + (h(k++) - 0.5) * 2.2, -0.05, z], scale: 0.8 + h(k++) * 0.9 });
        items.push({ tree: h(k++) > 0.32, pos: [-gx - (h(k++) - 0.5) * 2.2, -0.05, z], scale: 0.8 + h(k++) * 0.9 });
      }
    }
    return items;
  }, [islandW, islandD]);

  // Marcas viales discontinuas (líneas centrales amarillas) para cada calle.
  // Se renderizan con InstancedMesh (drei <Instances>) para minimizar draw calls.
  const vStreetLen = rows * spacing - 0.4;
  const hStreetLen = cols * spacing - 0.4;
  const roadDashes = React.useMemo(() => {
    const dashes: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    const dashLen = 0.65;
    const period = 1.7;
    const dashW = 0.07;
    // Calles verticales (línea central larga en Z)
    for (let i = 0; i < cols - 1; i++) {
      const x = (i - (cols - 2) / 2) * spacing;
      const n = Math.floor(vStreetLen / period);
      const start = -((n - 1) * period) / 2;
      for (let d = 0; d < n; d++) {
        dashes.push({ pos: [x, 0.022, start + d * period], scale: [dashW, dashLen, 1] });
      }
    }
    // Calles horizontales (línea central larga en X)
    for (let i = 0; i < rows - 1; i++) {
      const z = (i - (rows - 2) / 2) * spacing;
      const n = Math.floor(hStreetLen / period);
      const start = -((n - 1) * period) / 2;
      for (let d = 0; d < n; d++) {
        dashes.push({ pos: [start + d * period, 0.022, z], scale: [dashLen, dashW, 1] });
      }
    }
    return dashes;
  }, [cols, rows, spacing, vStreetLen, hStreetLen]);

  // Farolas distribuidas a lo largo del anillo perimetral, mirando hacia la calzada
  const lamps = React.useMemo(() => {
    const list: { pos: [number, number, number]; rot: number }[] = [];
    const lx = ringX + 0.55; // justo en la vereda exterior del anillo
    const lz = ringZ + 0.55;
    const stepX = (2 * ringX) / 7;
    const stepZ = (2 * ringZ) / 5;
    for (let i = 0; i <= 7; i++) {
      const x = -ringX + i * stepX;
      list.push({ pos: [x, 0, -lz], rot: 0 });          // borde trasero, brazo hacia +Z (calle)
      list.push({ pos: [x, 0, lz], rot: Math.PI });      // borde delantero, brazo hacia -Z
    }
    for (let i = 1; i < 5; i++) {
      const z = -ringZ + i * stepZ;
      list.push({ pos: [-lx, 0, z], rot: -Math.PI / 2 }); // borde izquierdo
      list.push({ pos: [lx, 0, z], rot: Math.PI / 2 });   // borde derecho
    }
    return list;
  }, [ringX, ringZ]);

  return (
    <group>
      {/* ISLA PRINCIPAL: Plato de concreto blanco que delimita la ciudad. Fuera de esto no hay detalles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[islandW, islandD]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* SUELO DE PASTO AL REDEDOR: Plano inmenso de césped verde */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial
          color="#86efac" // Verde pasto claro, a tono con los parques
          roughness={0.9}
        />
      </mesh>

      {/* BOSQUE PERIMETRAL PROCEDIMENTAL (árboles y arbustos rodeando la metrópolis) */}
      {vegetation.map((v, i) =>
        v.tree
          ? <MeadowTree key={`veg-${i}`} position={v.pos} scale={v.scale} />
          : <MeadowBush key={`veg-${i}`} position={v.pos} scale={v.scale} />
      )}

      {/* REJILLA DE CALLES DE ASFALTO LONGITUDINALES Y TRANSVERSALES */}
      {/* Calles Verticales (asfalto oscuro, dejando una vereda blanca a los lados) */}
      {Array.from({ length: cols - 1 }).map((_, i) => {
        const x = (i - (cols - 2) / 2) * spacing;
        return (
          <mesh key={`v-street-${i}`} position={[x, 0.015, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, vStreetLen]} />
            <meshStandardMaterial color="#3c4250" roughness={0.95} metalness={0.0} />
          </mesh>
        );
      })}

      {/* Calles Horizontales */}
      {Array.from({ length: rows - 1 }).map((_, i) => {
        const z = (i - (rows - 2) / 2) * spacing;
        return (
          <mesh key={`h-street-${i}`} position={[0, 0.015, z]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[hStreetLen, 0.42]} />
            <meshStandardMaterial color="#3c4250" roughness={0.95} metalness={0.0} />
          </mesh>
        );
      })}

      {/* LÍNEAS CENTRALES DISCONTINUAS (un solo draw call vía InstancedMesh) */}
      <Instances limit={roadDashes.length} range={roadDashes.length}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#f5c84b" roughness={0.6} emissive="#3a2c00" emissiveIntensity={0.2} />
        {roadDashes.map((d, i) => (
          <Instance key={`dash-${i}`} position={d.pos} rotation={[-Math.PI / 2, 0, 0]} scale={d.scale} />
        ))}
      </Instances>

      {/* FAROLAS PERIMETRALES */}
      {lamps.map((l, i) => (
        <StreetLamp key={`lamp-${i}`} position={l.pos} rotation={l.rot} />
      ))}

      {/* RENDERIZADO DE LAS MANZANAS, EDIFICIOS Y PARQUES */}
      {renderBlocks()}

      {/* TRÁFICO (Vehículos y Peatones circulando por las calles perimetrales de la cuadrícula) */}
      <Traffic carPaths={carPaths} pedestrianPaths={pedestrianPaths} />
    </group>
  );
};
