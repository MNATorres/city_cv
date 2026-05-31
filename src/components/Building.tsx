import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingProps {
  id: string;
  name: string;
  type: 'hq' | 'factory' | 'laboratory' | 'beacon' | 'greenhouse' | 'port' | 'house';
  position: [number, number, number];
  size: [number, number]; // [width, depth]
  isSelected: boolean;
  onClick: () => void;
  scale?: number;
}

export const Building: React.FC<BuildingProps> = ({
  name,
  type,
  position,
  size,
  isSelected,
  onClick,
  scale = 1.0,
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Referencias para partes específicas que queremos animar
  const rotatorRef = useRef<THREE.Mesh>(null);
  const floaterRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Variables para la animación de escala y hover
  const targetScale = hovered || isSelected ? 1.08 : 1.0;
  const currentScale = useRef(1.0);

  useFrame((state, delta) => {
    const hasAnimations = type !== 'house' && type !== 'greenhouse';
    const isInteracting = hovered || isSelected;

    // Si la escala ya está estabilizada y el edificio no tiene animaciones ni interacción, regresamos temprano
    const scaleDiff = Math.abs(currentScale.current - targetScale);
    if (!hasAnimations && !isInteracting && scaleDiff < 0.005) {
      if (groupRef.current) {
        const s = targetScale * scale;
        groupRef.current.scale.set(s, s, s);
      }
      return;
    }

    // 1. Suavizar la escala (micro-animación de hover)
    if (groupRef.current) {
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 10 * delta);
      const s = currentScale.current * scale;
      groupRef.current.scale.set(s, s, s);
    }

    // 2. Animaciones temáticas por tipo de edificio
    const time = state.clock.getElapsedTime();

    // Rotar elementos (anillos del faro, bobinas del laboratorio)
    if (rotatorRef.current) {
      if (type === 'beacon') {
        rotatorRef.current.rotation.y = time * 2;
        rotatorRef.current.rotation.x = Math.sin(time) * 0.2;
      } else if (type === 'laboratory') {
        rotatorRef.current.rotation.y = -time * 1.5;
      } else if (type === 'hq') {
        rotatorRef.current.rotation.y = time * 0.5;
      }
    }

    // Flotar elementos (nave en espaciopuerto, antena de la base)
    if (floaterRef.current) {
      if (type === 'port') {
        // La nave flota arriba y abajo
        floaterRef.current.position.y = 1.6 + Math.sin(time * 3) * 0.15;
        floaterRef.current.rotation.y = time * 0.2;
      } else if (type === 'hq') {
        floaterRef.current.position.y = 3.5 + Math.sin(time * 2) * 0.05;
      }
    }

    // Pulsar luces de neón en edificios interactuando
    if (lightRef.current && isInteracting) {
      const baseIntensity = type === 'hq' ? 2.0 : 1.2;
      lightRef.current.intensity = baseIntensity + Math.sin(time * 8) * 0.4;
    }
  });

  // Generar estilo pseudo-aleatorio basado en la posición para dar variedad sin consumir CPU
  const hash = Math.abs(Math.sin(position[0] * 12.9898 + position[2] * 78.233) * 43758.5453);
  const houseStyle = Math.floor(hash) % 4; // 0, 1, 2, o 3

  // Renderizar una de las 4 casas procedimentales
  const renderHouse = (style: number) => {
    switch (style) {
      case 0: // Villa Cúbica Moderna
        return (
          <group>
            {/* Estructura principal blanca */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Módulo superior gris */}
            <mesh position={[0.05, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.55, 0.3, 0.55]} />
              <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Techo panel solar inclinado */}
            <mesh position={[-0.03, 0.78, 0]} rotation={[0.2, 0, 0.1]} castShadow>
              <boxGeometry args={[0.7, 0.03, 0.65]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Ventanita de neón cian */}
            <mesh position={[0.2, 0.25, 0.41]}>
              <planeGeometry args={[0.12, 0.16]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.4, 0.45]} color="#00f0ff" distance={3} intensity={0.8} />
            )}
          </group>
        );

      case 1: // Torre Cilindrica / Mini Rascacielos
        return (
          <group>
            {/* Base del cilindro plateado */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.28, 0.33, 0.9, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Anillos divisorios metálicos */}
            <mesh position={[0, 0.3, 0]}>
              <torusGeometry args={[0.34, 0.02, 4, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <torusGeometry args={[0.32, 0.02, 4, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
            {/* Cúpula de cristal superior */}
            <mesh position={[0, 0.95, 0]} castShadow>
              <sphereGeometry args={[0.24, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#7c3aed" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
            </mesh>
            {/* Antena de neón */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.35, 4]} />
              <meshBasicMaterial color="#7c3aed" />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.95, 0]} color="#8b5cf6" distance={3} intensity={0.8} />
            )}
          </group>
        );

      case 2: // Cúpula Ecológica (Eco-Dome)
        return (
          <group>
            {/* Base de anillo metálico oscuro */}
            <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.42, 0.46, 0.16, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* Domo principal de vidrio templado */}
            <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#0d9488" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
            </mesh>
            {/* Estructura de soporte interna */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.06, 0.25, 0.06]} />
              <meshStandardMaterial color="#d97706" emissive="#b45309" />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.25, 0]} color="#14b8a6" distance={3} intensity={0.8} />
            )}
          </group>
        );

      case 3: // Pabellón en forma de L
      default:
        return (
          <group>
            {/* Módulo horizontal blanco */}
            <mesh position={[-0.1, 0.2, 0.1]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.4, 0.45]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Módulo vertical de madera/cobre */}
            <mesh position={[0.2, 0.35, -0.12]} castShadow receiveShadow>
              <boxGeometry args={[0.35, 0.7, 0.35]} />
              <meshStandardMaterial color="#b45309" roughness={0.5} metalness={0.6} />
            </mesh>
            {/* Alero superior plano oscuro */}
            <mesh position={[-0.05, 0.55, 0.05]} castShadow>
              <boxGeometry args={[0.8, 0.04, 0.55]} />
              <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Gran ventanal frontal de neón */}
            <mesh position={[-0.1, 0.2, 0.33]}>
              <planeGeometry args={[0.4, 0.18]} />
              <meshBasicMaterial color="#eab308" />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.3, 0.35]} color="#eab308" distance={3} intensity={0.8} />
            )}
          </group>
        );
    }
  };

  // Renderizar geometría según el tipo de edificio
  const renderGeometry = () => {
    switch (type) {
      case 'hq': // Centro de Comando / Ayuntamiento
        return (
          <group>
            {/* Base cónica masiva */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.8, 1.2, 0.8, 8]} />
              <meshStandardMaterial color="#1a2245" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Torre Central */}
            <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.5, 0.6, 2.2, 8]} />
              <meshStandardMaterial color="#2d3b75" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Domo de Energía Flotante */}
            <group ref={floaterRef}>
              <mesh castShadow>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="#0284c7" emissive="#0284c7" roughness={0.1} metalness={0.9} />
              </mesh>
            </group>
            {/* Anillo Tecnológico Rotatorio alrededor del domo */}
            <mesh ref={rotatorRef} position={[0, 2.8, 0]} castShadow>
              <torusGeometry args={[0.9, 0.08, 8, 24]} />
              <meshStandardMaterial color="#bd00ff" emissive="#5d0080" metalness={0.9} />
            </mesh>
            {/* Haz de luz de neón vertical hacia el cielo */}
            <mesh position={[0, 5, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 4, 8, 1, true]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.65} side={THREE.DoubleSide} />
            </mesh>
            {/* Luz de neón puntual activa solo al interactuar */}
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 3, 0]} color="#00f0ff" distance={8} intensity={2} />
            )}
          </group>
        );

      case 'factory': // Fábrica de Datos (Experiencia Senior)
        return (
          <group>
            {/* Base cúbica industrial */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.9, 1.5]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.7} />
            </mesh>
            {/* Modulo superior angular */}
            <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.5, 1.2]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
            </mesh>
            {/* Reactores o chimeneas futuristas */}
            <mesh position={[-0.4, 1.5, -0.4]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.5} />
            </mesh>
            <mesh position={[0.4, 1.5, 0.4]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.5} />
            </mesh>
            {/* Núcleo de energía de neón púrpura */}
            <mesh position={[0, 0.5, 0.76]} castShadow>
              <boxGeometry args={[0.8, 0.3, 0.05]} />
              <meshStandardMaterial color="#bd00ff" emissive="#a000dd" roughness={0.2} />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.5, 0.9]} color="#bd00ff" distance={5} intensity={1} />
            )}
          </group>
        );

      case 'laboratory': // Laboratorio de Investigación (Skills/Experiencia)
        return (
          <group>
            {/* Domo Geodésico Principal */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <sphereGeometry args={[1.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
            </mesh>
            {/* Bobinas internas de energía */}
            <group ref={rotatorRef} position={[0, 0.2, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.2, 1.0, 8]} />
                <meshStandardMaterial color="#0284c7" emissive="#0284c7" />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#ffd700" emissive="#b8860b" />
              </mesh>
            </group>
            {/* Anillo de soporte metálico exterior */}
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[1.15, 0.08, 6, 24]} />
              <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.9} />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.6, 0]} color="#00f0ff" distance={6} intensity={1.5} />
            )}
          </group>
        );

      case 'port': // Espaciopuerto (Proyectos)
        return (
          <group>
            {/* Pista de despegue redonda */}
            <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[1.3, 1.4, 0.1, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.9} />
            </mesh>
            {/* Anillos de luz led en la pista */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.08, 32]} />
              <meshBasicMaterial color="#16a34a" side={THREE.DoubleSide} />
            </mesh>
            {/* Columnas de soporte */}
            <mesh position={[-1.1, 0.4, -0.6]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[1.1, 0.4, -0.6]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* NAVE ESPACIAL FUTURISTA FLOTANDO */}
            <group ref={floaterRef}>
              {/* Cuerpo de la nave */}
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.3, 0.9, 4]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.9} />
              </mesh>
              {/* Alas de la nave */}
              <mesh position={[0, -0.05, -0.1]} castShadow>
                <boxGeometry args={[1.0, 0.08, 0.3]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
              {/* Turbina trasera brillante */}
              <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
                <meshBasicMaterial color="#0284c7" />
              </mesh>
            </group>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 1.2, 0]} color="#16a34a" distance={5} intensity={1} />
            )}
          </group>
        );

      case 'beacon': // Baliza Cuántica (Proyectos)
        return (
          <group>
            {/* Base triangular piramidal */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.7, 0.6, 4]} />
              <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* Spire central (aguja metálica) */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.15, 2.2, 4]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Cristal de energía flotante en la punta */}
            <mesh position={[0, 2.7, 0]} castShadow>
              <octahedronGeometry args={[0.22]} />
              <meshStandardMaterial color="#d97706" emissive="#d97706" roughness={0.1} />
            </mesh>
            {/* Anillo electromagnético flotante que rota */}
            <group ref={rotatorRef} position={[0, 1.4, 0]}>
              <mesh castShadow>
                <torusGeometry args={[0.5, 0.06, 6, 16]} />
                <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" metalness={0.8} />
              </mesh>
            </group>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 2.7, 0]} color="#d97706" distance={6} intensity={1.5} />
            )}
          </group>
        );

      case 'greenhouse': // Invernadero Hidropónico (Educación)
        return (
          <group>
            {/* Base de concreto tecnológico */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.3, 1.6]} />
              <meshStandardMaterial color="#64748b" roughness={0.7} metalness={0.6} />
            </mesh>
            {/* Domo de vidrio transparente de invernadero */}
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.4, 1.0, 1.4]} />
              <meshStandardMaterial
                color="#22c55e"
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Estructura del marco metálico */}
            <mesh position={[0, 0.8, 0]}>
              <boxGeometry args={[1.42, 1.02, 1.42]} />
              <meshStandardMaterial color="#1e293b" wireframe />
            </mesh>
            {/* Plantas hidropónicas interiores (Cajas de vegetación) */}
            <mesh position={[-0.35, 0.35, -0.35]} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#16a34a" roughness={0.9} />
            </mesh>
            <mesh position={[0.35, 0.35, 0.35]} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#16a34a" roughness={0.9} />
            </mesh>
            {(isSelected || hovered) && (
              <pointLight ref={lightRef} position={[0, 0.7, 0]} color="#22c55e" distance={5} intensity={1.2} />
            )}
          </group>
        );

      case 'house': // Casas Comunes Procedimentales
        return renderHouse(houseStyle);

      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation(); // Evitar pointerMissed
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Modelo 3D procedimental */}
      {renderGeometry()}

      {/* Brillo en la base cuando está seleccionado */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(size[0], size[1]) * 0.7, Math.max(size[0], size[1]) * 0.85, 32]} />
          <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Etiqueta HTML Flotante 3D (Se muestra en hover o si está seleccionado) */}
      {(hovered || isSelected) && (
        <Html distanceFactor={15} center position={[0, type === 'hq' ? 3.8 : 2.2, 0]}>
          <div className="building-label-3d">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};
