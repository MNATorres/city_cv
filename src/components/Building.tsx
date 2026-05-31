import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
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
  isSelected,
  onClick,
  scale = 1.0,
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  // Variables para la animación de escala y hover
  const targetScale = hovered || isSelected ? 1.08 : 1.0;
  const currentScale = useRef(1.0);

  // Mapear los modelos de Kenney de acuerdo al tipo de edificio
  let modelPath = '/models/building-a.glb';
  const houseFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
  
  // Generar estilo pseudo-aleatorio basado en la posición para variedad
  const hash = Math.abs(Math.sin(position[0] * 12.9898 + position[2] * 78.233) * 43758.5453);
  const houseStyle = Math.floor(hash) % houseFiles.length;

  switch (type) {
    case 'hq':
      modelPath = '/models/building-skyscraper-a.glb';
      break;
    case 'factory':
      modelPath = '/models/building-skyscraper-b.glb';
      break;
    case 'laboratory':
      modelPath = '/models/building-skyscraper-c.glb';
      break;
    case 'port':
      modelPath = '/models/building-skyscraper-d.glb';
      break;
    case 'beacon':
      modelPath = '/models/building-skyscraper-e.glb';
      break;
    case 'greenhouse':
      modelPath = '/models/building-j.glb';
      break;
    case 'house':
    default:
      modelPath = `/models/building-${houseFiles[houseStyle]}.glb`;
      break;
  }

  // Cargar el modelo GLTF
  const { scene } = useGLTF(modelPath);

  // Clonar y configurar sombras/materiales para la luz del día clara
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    
    // Centrar y normalizar el tamaño base del modelo
    const box = new THREE.Box3().setFromObject(clone);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);
    
    const maxDim = Math.max(sizeVec.x, sizeVec.z);
    if (maxDim > 0) {
      clone.scale.set(1 / maxDim, 1 / maxDim, 1 / maxDim);
    }
    
    // Recalcular caja con la nueva escala para centrar y apoyar en el suelo
    const normalizedBox = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    normalizedBox.getCenter(center);
    
    // Centrar en X e Z, y colocar base Y en 0
    clone.position.x = -center.x;
    clone.position.z = -center.z;
    clone.position.y = -normalizedBox.min.y;

    clone.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Ajustar el material para que sea diurno y brillante
        const mesh = node as THREE.Mesh;
        if (mesh.material && (mesh.material as any).isMeshStandardMaterial) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.45;
          mat.metalness = 0.15;
        }
      }
    });

    // Envolver en un grupo para aplicar la posición y rotación limpiamente
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    return wrapper;
  }, [scene]);

  useFrame((_, delta) => {
    // Si la escala ya está estabilizada en su objetivo y no interactúa, retornamos temprano para ahorrar CPU
    const scaleDiff = Math.abs(currentScale.current - targetScale);
    if (!hovered && !isSelected && scaleDiff < 0.005) {
      if (groupRef.current) {
        const s = targetScale * scale;
        groupRef.current.scale.set(s, s, s);
      }
      return;
    }

    // Suavizar la escala (micro-animación de hover)
    if (groupRef.current) {
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, 10 * delta);
      const s = currentScale.current * scale;
      groupRef.current.scale.set(s, s, s);
    }
  });

  // Rotaciones pseudo-aleatorias para las casas de relleno para añadir realismo urbano
  const rotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  const houseRotation = type === 'house' ? rotations[Math.floor(hash) % 4] : 0;

  // Ajuste de escala base de los modelos de Kenney para que encajen en el cuadrante
  let baseScale = 1.0;
  if (type === 'hq') {
    baseScale = 1.8;
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
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
      {/* Modelo Kenney GLTF clonado */}
      <primitive
        object={clonedScene}
        rotation={[0, houseRotation, 0]}
        scale={[baseScale, baseScale, baseScale]}
        position={[0, 0.02, 0]}
      />

      {/* Brillo en la base cuando está seleccionado */}
      {isSelected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseScale * 0.52, baseScale * 0.62, 32]} />
          <meshBasicMaterial color="#0284c7" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Luz puntual activa únicamente al interactuar */}
      {(isSelected || hovered) && (
        <pointLight
          position={[0, type === 'hq' ? 2.5 : 1.2, 0]}
          color={type === 'hq' ? '#0284c7' : type === 'factory' ? '#7c3aed' : type === 'laboratory' ? '#0ea5e9' : '#d97706'}
          distance={4}
          intensity={1.2}
        />
      )}

      {/* Etiqueta HTML Flotante 3D (Se muestra en hover o si está seleccionado) */}
      {(hovered || isSelected) && (
        <Html distanceFactor={15} center position={[0, type === 'hq' ? 3.0 : 1.5, 0]}>
          <div className="building-label-3d">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Pre-cargar todos los modelos GLTF al inicio del módulo para evitar bloqueos visuales
useGLTF.preload('/models/building-skyscraper-a.glb');
useGLTF.preload('/models/building-skyscraper-b.glb');
useGLTF.preload('/models/building-skyscraper-c.glb');
useGLTF.preload('/models/building-skyscraper-d.glb');
useGLTF.preload('/models/building-skyscraper-e.glb');
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'].forEach(fileName => {
  useGLTF.preload(`/models/building-${fileName}.glb`);
});
