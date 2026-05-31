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
}

export const Building: React.FC<BuildingProps> = ({
  name,
  type,
  position,
  size,
  isSelected,
  onClick,
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
    // 1. Suavizar la escala (micro-animación de hover)
    if (groupRef.current) {
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 10 * delta);
      groupRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current);
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

    // Pulsar luces neon
    if (lightRef.current) {
      const baseIntensity = type === 'hq' ? 2 : 1;
      lightRef.current.intensity = baseIntensity + Math.sin(time * 8) * 0.5;
    }
  });

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
                <meshStandardMaterial color="#00f0ff" emissive="#00aaff" roughness={0.1} metalness={0.9} />
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
            {/* Luz de neón puntual */}
            <pointLight ref={lightRef} position={[0, 3, 0]} color="#00f0ff" distance={8} intensity={2} />
          </group>
        );

      case 'factory': // Fábrica de Datos (Experiencia Senior)
        return (
          <group>
            {/* Base cúbica industrial */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.9, 1.5]} />
              <meshStandardMaterial color="#2a2f45" roughness={0.6} metalness={0.7} />
            </mesh>
            {/* Modulo superior angular */}
            <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.5, 1.2]} />
              <meshStandardMaterial color="#353b59" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* Reactores o chimeneas futuristas */}
            <mesh position={[-0.4, 1.5, -0.4]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
              <meshStandardMaterial color="#1a1c24" roughness={0.8} metalness={0.5} />
            </mesh>
            <mesh position={[0.4, 1.5, 0.4]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
              <meshStandardMaterial color="#1a1c24" roughness={0.8} metalness={0.5} />
            </mesh>
            {/* Núcleo de energía de neón púrpura */}
            <mesh position={[0, 0.5, 0.76]} castShadow>
              <boxGeometry args={[0.8, 0.3, 0.05]} />
              <meshStandardMaterial color="#bd00ff" emissive="#a000dd" roughness={0.2} />
            </mesh>
            <pointLight ref={lightRef} position={[0, 0.5, 0.9]} color="#bd00ff" distance={5} intensity={1} />
          </group>
        );

      case 'laboratory': // Laboratorio de Investigación (Skills/Experiencia)
        return (
          <group>
            {/* Domo Geodésico Principal */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
              <sphereGeometry args={[1.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#142c42" roughness={0.2} metalness={0.9} transparent opacity={0.85} />
            </mesh>
            {/* Bobinas internas de energía */}
            <group ref={rotatorRef} position={[0, 0.2, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.2, 1.0, 8]} />
                <meshStandardMaterial color="#00f0ff" emissive="#0088cc" />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#ffd700" emissive="#b8860b" />
              </mesh>
            </group>
            {/* Anillo de soporte metálico exterior */}
            <mesh position={[0, 0.05, 0]}>
              <torusGeometry args={[1.15, 0.08, 6, 24]} />
              <meshStandardMaterial color="#0c0d12" roughness={0.6} metalness={0.9} />
            </mesh>
            <pointLight ref={lightRef} position={[0, 0.6, 0]} color="#00f0ff" distance={6} intensity={1.5} />
          </group>
        );

      case 'port': // Espaciopuerto (Proyectos)
        return (
          <group>
            {/* Pista de despegue redonda */}
            <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
              <cylinderGeometry args={[1.3, 1.4, 0.1, 16]} />
              <meshStandardMaterial color="#121829" roughness={0.8} metalness={0.9} />
            </mesh>
            {/* Anillos de luz led en la pista */}
            <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.08, 32]} />
              <meshBasicMaterial color="#39ff14" side={THREE.DoubleSide} />
            </mesh>
            {/* Columnas de soporte */}
            <mesh position={[-1.1, 0.4, -0.6]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshStandardMaterial color="#2d3b75" />
            </mesh>
            <mesh position={[1.1, 0.4, -0.6]} castShadow>
              <boxGeometry args={[0.15, 0.8, 0.15]} />
              <meshStandardMaterial color="#2d3b75" />
            </mesh>
            {/* NAVE ESPACIAL FUTURISTA FLOTANDO */}
            <group ref={floaterRef}>
              {/* Cuerpo de la nave */}
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.3, 0.9, 4]} />
                <meshStandardMaterial color="#a0afc8" roughness={0.3} metalness={0.9} />
              </mesh>
              {/* Alas de la nave */}
              <mesh position={[0, -0.05, -0.1]} castShadow>
                <boxGeometry args={[1.0, 0.08, 0.3]} />
                <meshStandardMaterial color="#202b54" metalness={0.8} />
              </mesh>
              {/* Turbina trasera brillante */}
              <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
                <meshBasicMaterial color="#00f0ff" />
              </mesh>
            </group>
            <pointLight ref={lightRef} position={[0, 1.2, 0]} color="#39ff14" distance={5} intensity={1} />
          </group>
        );

      case 'beacon': // Baliza Cuántica (Proyectos)
        return (
          <group>
            {/* Base triangular piramidal */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.7, 0.6, 4]} />
              <meshStandardMaterial color="#1a1f33" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* Spire central (aguja metálica) */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.15, 2.2, 4]} />
              <meshStandardMaterial color="#353b59" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Cristal de energía flotante en la punta */}
            <mesh position={[0, 2.7, 0]} castShadow>
              <octahedronGeometry args={[0.22]} />
              <meshStandardMaterial color="#ffb700" emissive="#ff8800" roughness={0.1} />
            </mesh>
            {/* Anillo electromagnético flotante que rota */}
            <group ref={rotatorRef} position={[0, 1.4, 0]}>
              <mesh castShadow>
                <torusGeometry args={[0.5, 0.06, 6, 16]} />
                <meshStandardMaterial color="#bd00ff" emissive="#600099" metalness={0.8} />
              </mesh>
            </group>
            <pointLight ref={lightRef} position={[0, 2.7, 0]} color="#ffb700" distance={6} intensity={1.5} />
          </group>
        );

      case 'greenhouse': // Invernadero Hidropónico (Educación)
        return (
          <group>
            {/* Base de concreto tecnológico */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.3, 1.6]} />
              <meshStandardMaterial color="#1f2336" roughness={0.7} metalness={0.6} />
            </mesh>
            {/* Domo de vidrio transparente de invernadero */}
            <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.4, 1.0, 1.4]} />
              <meshStandardMaterial
                color="#00ff66"
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
              <meshStandardMaterial color="#0c0d12" wireframe />
            </mesh>
            {/* Plantas hidropónicas interiores (Cajas emisivas verdes) */}
            <mesh position={[-0.35, 0.35, -0.35]} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#39ff14" emissive="#008000" roughness={0.9} />
            </mesh>
            <mesh position={[0.35, 0.35, 0.35]} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#39ff14" emissive="#008000" roughness={0.9} />
            </mesh>
            <pointLight ref={lightRef} position={[0, 0.7, 0]} color="#39ff14" distance={5} intensity={1.2} />
          </group>
        );

      case 'house': // Casa Común / Residencia / Habilidad
        return (
          <group>
            {/* Estructura principal de la villa moderna (blanca) */}
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.9, 0.5, 0.9]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Módulo superior contrastante (gris oscuro) */}
            <mesh position={[0.05, 0.6, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.6, 0.3, 0.6]} />
              <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Techo inclinado / Panel Solar (Futurista) */}
            <mesh position={[-0.03, 0.78, 0]} rotation={[0.2, 0, 0.1]} castShadow>
              <boxGeometry args={[0.75, 0.04, 0.7]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Ventanas de neón (brillo cian y ámbar) */}
            <mesh position={[0.25, 0.25, 0.46]}>
              <planeGeometry args={[0.15, 0.2]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
            <mesh position={[-0.25, 0.25, 0.46]}>
              <planeGeometry args={[0.15, 0.2]} />
              <meshBasicMaterial color="#ffb700" />
            </mesh>
            {/* Pequeña luz de neón de la entrada */}
            <pointLight ref={lightRef} position={[0, 0.45, 0.5]} color="#ffb700" distance={3} intensity={0.5} />
          </group>
        );

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
