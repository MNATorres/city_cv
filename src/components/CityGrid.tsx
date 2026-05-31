import React from 'react';
import { Building } from './Building';
import { Traffic } from './Traffic';
import { cvData } from '../cvData';

interface CityGridProps {
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
}

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

  // Coordenadas de los caminos de tráfico (rutas perimetrales ajustadas a la cuadrícula 10x6)
  const carPaths = [
    [
      { x: -11.25, y: 0.1, z: -6.25 },
      { x: 11.25, y: 0.1, z: -6.25 },
      { x: 11.25, y: 0.1, z: 6.25 },
      { x: -11.25, y: 0.1, z: 6.25 },
    ]
  ];

  const pedestrianPaths = [
    [
      { x: -6.25, y: 0.03, z: -3.75 },
      { x: 6.25, y: 0.03, z: -3.75 },
      { x: 6.25, y: 0.03, z: 3.75 },
      { x: -6.25, y: 0.03, z: 3.75 },
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

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const position = getCoords(c, r);
        const blockId = `block-${c}-${r}`;

        // 1. Verificar si hay un elemento de CV en esta manzana
        const isHQ = c === 4 && r === 2;
        const expItem = cvData.experience.find(e => e.gridPos.x === c && e.gridPos.z === r);
        const projItem = cvData.projects.find(p => p.gridPos.x === c && p.gridPos.z === r);
        const eduItem = cvData.education.find(ed => ed.gridPos.x === c && ed.gridPos.z === r);
        const skillItem = cvData.skills.find(s => s.gridPos.x === c && s.gridPos.z === r);

        // Si es un parque, dibujamos un parque verde y continuamos
        if (checkIsPark(c, r)) {
          blocks.push(<Park key={blockId} position={position} />);
          continue;
        }

        // 2. Renderizar la plataforma de la manzana (base de cemento claro)
        const isSelected = 
          (isHQ && selectedBuildingId === 'hq') ||
          (expItem && selectedBuildingId === expItem.id) ||
          (projItem && selectedBuildingId === projItem.id) ||
          (eduItem && selectedBuildingId === eduItem.id) ||
          (skillItem && selectedBuildingId === skillItem.id) ||
          (selectedBuildingId === blockId);

        blocks.push(
          <group key={`plat-${blockId}`} position={position}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[2.0, 0.05, 2.0]} />
              <meshStandardMaterial
                color={isSelected ? '#e0f2fe' : '#ffffff'}
                roughness={0.5}
                metalness={0.1}
              />
            </mesh>
            {/* Pequeña cuadrícula o borde para darle detalle estilo FOE */}
            <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.92, 0.98, 4]} />
              <meshBasicMaterial color={isSelected ? '#00f0ff' : '#cbd5e1'} transparent opacity={0.5} />
            </mesh>
          </group>
        );

        // 3. Renderizar el Edificio correspondiente
        if (isHQ) {
          blocks.push(
            <Building
              key={blockId}
              id="hq"
              name="Centro de Comando (BIO)"
              type="hq"
              position={position}
              size={[1, 1]}
              isSelected={selectedBuildingId === 'hq'}
              onClick={() => onSelectBuilding('hq')}
            />
          );
        } else if (expItem) {
          blocks.push(
            <Building
              key={blockId}
              id={expItem.id}
              name={`${expItem.role} @ ${expItem.company.split(' ')[0]}`}
              type={expItem.buildingType}
              position={position}
              size={expItem.size}
              isSelected={selectedBuildingId === expItem.id}
              onClick={() => onSelectBuilding(expItem.id)}
            />
          );
        } else if (projItem) {
          blocks.push(
            <Building
              key={blockId}
              id={projItem.id}
              name={projItem.name}
              type={projItem.buildingType}
              position={position}
              size={projItem.size}
              isSelected={selectedBuildingId === projItem.id}
              onClick={() => onSelectBuilding(projItem.id)}
            />
          );
        } else if (eduItem) {
          blocks.push(
            <Building
              key={blockId}
              id={eduItem.id}
              name={eduItem.degree.split(' ')[0] + ' (' + eduItem.institution.split(' ')[0] + ')'}
              type={eduItem.buildingType}
              position={position}
              size={eduItem.size}
              isSelected={selectedBuildingId === eduItem.id}
              onClick={() => onSelectBuilding(eduItem.id)}
            />
          );
        } else if (skillItem) {
          // Las habilidades se renderizan como "casas comunes" interactivas
          blocks.push(
            <Building
              key={blockId}
              id={skillItem.id}
              name={`Habilidad: ${skillItem.name}`}
              type="house"
              position={position}
              size={[1, 1]}
              isSelected={selectedBuildingId === skillItem.id}
              onClick={() => onSelectBuilding(skillItem.id)}
            />
          );
        } else {
          // El resto son casas comunes decorativas que también muestran un mensaje
          blocks.push(
            <Building
              key={blockId}
              id={blockId}
              name="Sector Residencial"
              type="house"
              position={position}
              size={[1, 1]}
              isSelected={selectedBuildingId === blockId}
              onClick={() => onSelectBuilding(blockId)}
            />
          );
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
