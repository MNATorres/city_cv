import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CityGrid } from './CityGrid';
import { cvData } from '../cvData';

interface CameraControllerProps {
  focusedBuildingPos: { x: number; z: number } | null;
}

const CameraController: React.FC<CameraControllerProps> = ({ focusedBuildingPos }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  
  // Posición objetivo del control (target)
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  // Posición objetivo de la cámara
  const targetCamPos = useRef(new THREE.Vector3(12, 12, 12));

  // Ref para controlar si hay una transición de enfoque activa
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (focusedBuildingPos) {
      // Centrar el target del control en el edificio seleccionado (y=0)
      targetLookAt.current.set(focusedBuildingPos.x, 0, focusedBuildingPos.z);
      // Mantener el offset isométrico para la posición de la cámara
      targetCamPos.current.set(
        focusedBuildingPos.x + 10,
        10,
        focusedBuildingPos.z + 10
      );
    } else {
      // Volver al centro de la ciudad
      targetLookAt.current.set(0, 0, 0);
      targetCamPos.current.set(12, 12, 12);
    }
    // Activar transición automática al enfocar
    isTransitioning.current = true;
  }, [focusedBuildingPos]);

  // Escuchar cuando el usuario arrastra manualmente los controles para cancelar el enfoque automático
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleStart);
    return () => {
      controls.removeEventListener('start', handleStart);
    };
  }, []);

  useFrame((_, delta) => {
    // Si no estamos en transición, no interferimos con OrbitControls
    if (!isTransitioning.current) return;

    const lerpSpeed = 5 * delta;
    
    if (controlsRef.current) {
      // Lerp del target
      controlsRef.current.target.lerp(targetLookAt.current, lerpSpeed);
      // Lerp de la posición de la cámara
      camera.position.lerp(targetCamPos.current, lerpSpeed);
      controlsRef.current.update();

      // Verificar si ya estamos lo suficientemente cerca del objetivo
      const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);
      const distCam = camera.position.distanceTo(targetCamPos.current);

      if (distTarget < 0.02 && distCam < 0.02) {
        // Ajustar de forma exacta y desactivar transición
        controlsRef.current.target.copy(targetLookAt.current);
        camera.position.copy(targetCamPos.current);
        controlsRef.current.update();
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      screenSpacePanning={true}
      minZoom={20}
      maxZoom={90}
      maxPolarAngle={Math.PI / 2.1} // Permite girar y ver casi de lado
      minPolarAngle={0.05} // Permite vista cenital
    />
  );
};

interface MainCanvasProps {
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
}

export const MainCanvas: React.FC<MainCanvasProps> = ({
  selectedBuildingId,
  onSelectBuilding,
}) => {
  // Encontrar la posición del edificio seleccionado
  let focusedBuildingPos: { x: number; z: number } | null = null;
  if (selectedBuildingId) {
    const exp = cvData.experience.find((e) => e.id === selectedBuildingId);
    const proj = cvData.projects.find((p) => p.id === selectedBuildingId);
    const edu = cvData.education.find((ed) => ed.id === selectedBuildingId);
    
    // Ayuntamiento / HQ general (id especial)
    if (selectedBuildingId === 'hq') {
      focusedBuildingPos = { x: 0, z: 0 };
    } else if (exp) {
      focusedBuildingPos = exp.gridPos;
    } else if (proj) {
      focusedBuildingPos = proj.gridPos;
    } else if (edu) {
      focusedBuildingPos = edu.gridPos;
    }
  }

  return (
    <div className="canvas-container">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={() => onSelectBuilding(null)} // Cerrar modal al hacer clic en el vacío
      >
        {/* Color de fondo del Canvas (combinado con el CSS de la app) */}
        <color attach="background" args={['#eef2f7']} />
        
        {/* Cámara Ortográfica predeterminada para el look isométrico tipo FOE */}
        <OrthographicCamera
          makeDefault
          position={[12, 12, 12]}
          zoom={35}
          near={0.1}
          far={1000}
        />

        {/* Luces atmosféricas diurnas */}
        {/* 1. Luz Ambiental blanca brillante */}
        <ambientLight intensity={0.7} color="#ffffff" />

        {/* 2. Luz Direccional Principal: Sol brillante (blanco/cálido suave) */}
        <directionalLight
          position={[15, 30, 10]}
          intensity={1.3}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-camera-near={0.1}
          shadow-camera-far={100}
          shadow-bias={-0.0005}
        />

        {/* 3. Luz Secundaria de Relleno blanca suave */}
        <directionalLight
          position={[-15, 10, -10]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* 4. Luz de Rebote en el Suelo */}
        <hemisphereLight
          args={['#ffffff', '#cbd5e1', 0.4]}
        />

        {/* Niebla clara diurna para profundidad espacial */}
        <fog attach="fog" args={['#eef2f7', 40, 110]} />

        {/* Grid de la ciudad, calles y edificios envuelto en Suspense para carga de modelos GLB */}
        <React.Suspense fallback={null}>
          <CityGrid
            selectedBuildingId={selectedBuildingId}
            onSelectBuilding={onSelectBuilding}
          />
        </React.Suspense>

        {/* Controlador de Cámara */}
        <CameraController focusedBuildingPos={focusedBuildingPos} />
      </Canvas>
    </div>
  );
};
