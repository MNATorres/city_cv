import { useState, useEffect, useRef } from 'react';
import { MainCanvas } from './components/MainCanvas';
import { HUD } from './components/HUD';
import './App.css';

// Clase para generar una banda sonora ambiental procedimental retro-futurista (Web Audio API)
class ProceduralSynth {
  private ctx: AudioContext | null = null;
  private bassOsc: OscillatorNode | null = null;
  private bassGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private timerId: any = null;

  start() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // 1. Filtro paso-bajo para dar un tono cálido, profundo y de baja frecuencia
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1, this.ctx.currentTime);
      this.filter.connect(this.ctx.destination);

      // 2. Oscilador de bajos (Dron continuo de fondo en La1 / 55Hz)
      this.bassOsc = this.ctx.createOscillator();
      this.bassOsc.type = 'sawtooth';
      this.bassOsc.frequency.setValueAtTime(55.0, this.ctx.currentTime);
      
      this.bassGain = this.ctx.createGain();
      // Volumen muy bajo para que sea agradable de fondo
      this.bassGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      
      this.bassOsc.connect(this.bassGain);
      this.bassGain.connect(this.filter);
      
      this.bassOsc.start();

      // 3. Generar arpegios de ambiente aleatorios armoniosos
      this.playAmbientMelody();
    } catch (e) {
      console.error("No se pudo iniciar el AudioContext:", e);
    }
  }

  private playAmbientMelody() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    
    // Notas en la escala Pentatónica Menor de La (La2, Do3, Re3, Mi3, Sol3)
    const notes = [110.0, 130.81, 146.83, 164.81, 196.00, 220.0];
    
    const playNote = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Onda triangular para un tono de flauta/sintetizador analógico suave
      osc.type = 'triangle';
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);
      
      // Envolvente de volumen: ataque suave, decaimiento muy largo (reverb simulada)
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 1.5); // Ataque
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0); // Decaimiento largo
      
      osc.connect(gain);
      if (this.filter) {
        gain.connect(this.filter);
      } else {
        gain.connect(this.ctx.destination);
      }
      
      osc.start(now);
      osc.stop(now + 6.1);
      
      // Programar la siguiente nota de forma aleatoria (cada 3 a 6 segundos)
      const nextDelay = 3000 + Math.random() * 3000;
      this.timerId = setTimeout(playNote, nextDelay);
    };
    
    playNote();
  }

  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    
    try {
      if (this.bassOsc) {
        this.bassOsc.stop();
        this.bassOsc.disconnect();
      }
      if (this.bassGain) {
        this.bassGain.disconnect();
      }
      if (this.ctx) {
        this.ctx.close();
      }
    } catch (e) {
      // Ignorar errores al cerrar
    }
    
    this.ctx = null;
    this.bassOsc = null;
    this.bassGain = null;
    this.filter = null;
  }
}

function App() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const synthRef = useRef<ProceduralSynth | null>(null);

  // Inicializar o detener el sintetizador procedimental según el estado
  useEffect(() => {
    if (audioPlaying) {
      synthRef.current = new ProceduralSynth();
      synthRef.current.start();
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    }

    // Limpieza al desmontar el componente
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, [audioPlaying]);

  const handleToggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  return (
    <>
      {/* 3D R3F Canvas de la Ciudad */}
      <MainCanvas
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={setSelectedBuildingId}
      />

      {/* Capa de Interfaz (HUD) */}
      <HUD
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={setSelectedBuildingId}
        audioPlaying={audioPlaying}
        onToggleAudio={handleToggleAudio}
      />
    </>
  );
}

export default App;
