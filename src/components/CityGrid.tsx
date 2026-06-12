import React from 'react';
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
  // Dimensiones de la cuadrícula: 10 columnas por 6 filas
  const cols = 10;
  const rows = 6;
  const spacing = 2.5; // Tamaño manzana (2.0) + Calle (0.5)

  // Función para transformar coordenadas de manzana (C, R) a coordenadas 3D (X, Y, Z)
  const getCoords = (c: number, r: number): [number, number, number] => {
    const x = (c - (cols - 1) / 2) * spacing; // Centrado en X
    const z = (r - (rows - 1) / 2) * spacing; // Centrado en Z
    return [x, 0.05, z];
  };

  // Coordenadas de los caminos de tráfico (rutas alineadas con las calles de la cuadrícula 10x6)
  const carPaths = [
    [
      { x: -10.0, y: 0.1, z: -5.0 },
      { x: 10.0, y: 0.1, z: -5.0 },
      { x: 10.0, y: 0.1, z: 5.0 },
      { x: -10.0, y: 0.1, z: 5.0 },
    ]
  ];

  const pedestrianPaths = [
    [
      { x: -5.0, y: 0.03, z: -2.5 },
      { x: 5.0, y: 0.03, z: -2.5 },
      { x: 5.0, y: 0.03, z: 2.5 },
      { x: -5.0, y: 0.03, z: 2.5 },
    ]
  ];

  // Determinar si una manzana debe ser un parque verde decorativo
  const checkIsPark = (c: number, r: number): boolean => {
    // Parques en esquinas y puntos intermedios seleccionados de los bordes para equilibrio visual
    const parkCoords = [
      {c: 0, r: 0}, {c: 9, r: 0}, {c: 0, r: 5}, {c: 9, r: 5},
      {c: 0, r: 2}, {c: 9, r: 2}, {c: 4, r: 0}, {c: 5, r: 0},
      {c: 4, r: 5}, {c: 5, r: 5}
    ];
    return parkCoords.some(p => p.c === c && p.r === r);
  };

  // Renderizar manzanas de la cuadrícula
  const renderBlocks = () => {
    const blocks: React.ReactNode[] = [];
    const scaleFactor = 0.90; // Escala para cada casa dentro del cuadrante (ocupa 0.9 unidades, dejando 0.1 de vereda)

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const [x, y, z] = getCoords(c, r);
        const blockId = `block-${c}-${r}`;

        // 1. Verificar si es un parque o el Ayuntamiento
        const isHQ = c === 4 && r === 2;

        if (checkIsPark(c, r)) {
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

        // 2. Buscar si hay algún elemento de CV o Habilidad en esta manzana
        const expItem = cvData.experience.find(e => e.gridPos.x === c && e.gridPos.z === r);
        const projItem = cvData.projects.find(p => p.gridPos.x === c && p.gridPos.z === r);
        const eduItem = cvData.education.find(ed => ed.gridPos.x === c && ed.gridPos.z === r);
        const skillItem = cvData.skills.find(s => s.gridPos.x === c && s.gridPos.z === r);

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

  return (
    <group>
      {/* ISLA PRINCIPAL: Plato de concreto blanco que delimita la ciudad. Fuera de esto no hay detalles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[26, 16]} />
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

      {/* VEGETACIÓN EN LOS ALREDEDORES (ÁRBOLES Y ARBUSTOS) */}
      {/* Lado izquierdo (X < -13) */}
      <MeadowTree position={[-16, -0.05, 5]} scale={1.2} />
      <MeadowTree position={[-15, -0.05, -5]} scale={0.9} />
      <MeadowTree position={[-18, -0.05, -8]} scale={1.1} />
      <MeadowTree position={[-24, -0.05, -2]} scale={1.3} />
      <MeadowTree position={[-20, -0.05, 8]} scale={1.0} />
      <MeadowTree position={[-28, -0.05, 4]} scale={1.4} />
      <MeadowTree position={[-22, -0.05, -12]} scale={1.25} />
      <MeadowBush position={[-14, -0.05, 7]} scale={1.0} />
      <MeadowBush position={[-18, -0.05, 2]} scale={1.2} />
      <MeadowBush position={[-22, -0.05, -6]} scale={1.1} />
      <MeadowBush position={[-16, -0.05, -10]} scale={0.8} />

      {/* Lado derecho (X > 13) */}
      <MeadowTree position={[15, -0.05, -6]} scale={1.1} />
      <MeadowTree position={[16, -0.05, 3]} scale={0.95} />
      <MeadowTree position={[22, -0.05, -5]} scale={1.25} />
      <MeadowTree position={[25, -0.05, 5]} scale={1.0} />
      <MeadowTree position={[14, -0.05, 9]} scale={0.8} />
      <MeadowTree position={[28, -0.05, -2]} scale={1.35} />
      <MeadowTree position={[19, -0.05, 12]} scale={1.15} />
      <MeadowBush position={[18, -0.05, -3]} scale={1.1} />
      <MeadowBush position={[20, -0.05, 7]} scale={1.0} />
      <MeadowBush position={[23, -0.05, -9]} scale={0.9} />
      <MeadowBush position={[16, -0.05, -11]} scale={1.2} />

      {/* Lado trasero (Z < -8) */}
      <MeadowTree position={[-8, -0.05, -12]} scale={1.05} />
      <MeadowTree position={[8, -0.05, -13]} scale={1.15} />
      <MeadowTree position={[0, -0.05, -15]} scale={1.3} />
      <MeadowTree position={[-4, -0.05, -10]} scale={0.85} />
      <MeadowTree position={[3, -0.05, -11]} scale={0.9} />
      <MeadowTree position={[-12, -0.05, -14]} scale={1.2} />
      <MeadowTree position={[12, -0.05, -15]} scale={1.25} />
      <MeadowBush position={[-12, -0.05, -10]} scale={1.15} />
      <MeadowBush position={[11, -0.05, -11]} scale={1.0} />
      <MeadowBush position={[-2, -0.05, -13]} scale={0.95} />

      {/* Lado delantero (Z > 8) */}
      <MeadowTree position={[-6, -0.05, 12]} scale={1.1} />
      <MeadowTree position={[6, -0.05, 13]} scale={1.0} />
      <MeadowTree position={[-1, -0.05, 11]} scale={0.85} />
      <MeadowTree position={[10, -0.05, 11]} scale={1.2} />
      <MeadowTree position={[-11, -0.05, 13]} scale={1.25} />
      <MeadowTree position={[12, -0.05, 14]} scale={1.1} />
      <MeadowBush position={[12, -0.05, 11]} scale={1.1} />
      <MeadowBush position={[-10, -0.05, 11]} scale={1.0} />
      <MeadowBush position={[2, -0.05, 12]} scale={0.9} />

      {/* REJILLA DE CALLES LONGITUDINALES Y TRANSVERSALES */}
      {/* 9 Calles Verticales */}
      {Array.from({ length: cols - 1 }).map((_, i) => {
        const x = (i - (cols - 2) / 2) * spacing;
        return (
          <mesh key={`v-street-${i}`} position={[x, 0.015, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 14.8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
        );
      })}

      {/* 5 Calles Horizontales */}
      {Array.from({ length: rows - 1 }).map((_, i) => {
        const z = (i - (rows - 2) / 2) * spacing;
        return (
          <mesh key={`h-street-${i}`} position={[0, 0.015, z]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24.8, 0.3]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
        );
      })}

      {/* RENDERIZADO DE LAS MANZANAS, EDIFICIOS Y PARQUES */}
      {renderBlocks()}

      {/* TRÁFICO (Vehículos y Peatones circulando por las calles perimetrales de la cuadrícula) */}
      <Traffic carPaths={carPaths} pedestrianPaths={pedestrianPaths} />
    </group>
  );
};
