import React from 'react';
import {
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  MapPin,
  Mail,
  Zap,
} from 'lucide-react';
import { cvData } from '../cvData';

interface HUDProps {
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  audioPlaying: boolean;
  onToggleAudio: () => void;
}

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const HUD: React.FC<HUDProps> = ({
  selectedBuildingId,
  onSelectBuilding,
  audioPlaying,
  onToggleAudio,
}) => {
  // Buscar qué elemento de CV está seleccionado
  const selectedExp = cvData.experience.find((e) => e.id === selectedBuildingId);
  const selectedProj = cvData.projects.find((p) => p.id === selectedBuildingId);
  const selectedEdu = cvData.education.find((ed) => ed.id === selectedBuildingId);
  const selectedSkill = cvData.skills.find((s) => s.id === selectedBuildingId);
  const isHQSelected = selectedBuildingId === 'hq';
  const isDecoSelected = selectedBuildingId?.startsWith('block-');

  const handleCloseModal = () => {
    onSelectBuilding(null);
  };

  return (
    <div className="hud-layer">
      {/* Estilo para animación del modal flotante */}
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

      {/* 1. MODAL DETALLADO DEcurrículum (Centrado en la parte inferior de la pantalla) */}
      {selectedBuildingId && (
        <div
          className="glass-panel hud-interactive"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '520px',
            height: '340px',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px',
            border: '1px solid var(--accent-cyan)',
            boxShadow: 'var(--shadow-neon)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            pointerEvents: 'auto',
            zIndex: 100
          }}
        >
          {/* Cabecera del Modal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '12px' }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-cyber)',
                fontSize: '9px',
                letterSpacing: '1.5px',
                color: isHQSelected ? 'var(--accent-cyan)' : selectedExp ? 'var(--accent-purple)' : selectedProj ? 'var(--accent-green)' : selectedSkill ? 'var(--accent-cyan)' : selectedEdu ? 'var(--accent-amber)' : 'var(--text-muted)',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}>
                {isHQSelected ? 'Módulo Central' : selectedExp ? 'Experiencia Laboral' : selectedProj ? 'Proyecto de la Era' : selectedSkill ? 'Habilidad Adquirida' : selectedEdu ? 'Centro Académico' : 'Residencia Urbana'}
              </span>
              <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-cyber)', color: 'var(--text-primary)', marginTop: '2px' }}>
                {isHQSelected ? cvData.personalInfo.title : selectedExp ? selectedExp.role : selectedProj ? selectedProj.name : selectedSkill ? selectedSkill.name : selectedEdu ? selectedEdu.degree : 'Residencia Urbana'}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {isHQSelected ? cvData.personalInfo.name : selectedExp ? selectedExp.company : selectedProj ? selectedProj.period : selectedSkill ? `Categoría: ${selectedSkill.category}` : selectedEdu ? selectedEdu.institution : 'Sector Residencial'}
                {selectedExp && ` | ${selectedExp.period}`}
              </p>
            </div>

            {/* Botón de Cerrar */}
            <button
              onClick={handleCloseModal}
              style={{
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Cuerpo Desplazable del Modal */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', fontSize: '12.5px', lineHeight: '1.55', color: 'var(--text-primary)' }}>
            
            {/* CASO 1: HQ - INFORMACIÓN PERSONAL */}
            {isHQSelected && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{cvData.personalInfo.bio}"
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  <h4 style={{ fontFamily: 'var(--font-cyber)', fontSize: '11px', letterSpacing: '1px', color: 'var(--accent-cyan)' }}>
                    📍 Coordenadas de Contacto
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={12} className="text-neon-cyan" /> {cvData.personalInfo.contact.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} className="text-neon-cyan" /> {cvData.personalInfo.contact.location}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CASO 2: EXPERIENCIA LABORAL */}
            {selectedExp && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ul style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedExp.description.map((bullet, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)' }}>{bullet}</li>
                  ))}
                </ul>
                <div style={{ marginTop: '4px' }}>
                  <h4 style={{ fontFamily: 'var(--font-cyber)', fontSize: '10px', letterSpacing: '1px', color: 'var(--accent-purple)', marginBottom: '4px' }}>
                    Tecnologías Empleadas
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedExp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(189, 0, 255, 0.05)',
                          border: '1px solid rgba(189, 0, 255, 0.15)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-cyber)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CASO 3: PROYECTOS */}
            {selectedProj && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedProj.description}
                </p>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-cyber)', fontSize: '10px', letterSpacing: '1px', color: 'var(--accent-green)', marginBottom: '4px' }}>
                    Stack Tecnológico
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedProj.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(57, 255, 20, 0.05)',
                          border: '1px solid rgba(57, 255, 20, 0.15)',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-cyber)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedProj.link && (
                  <a
                    href={selectedProj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '4px',
                      alignSelf: 'flex-start',
                      color: 'var(--accent-cyan)',
                      textDecoration: 'none',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderBottom: '1px dashed var(--accent-cyan)'
                    }}
                  >
                    <GithubIcon size={12} /> Ver Código fuente <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}

            {/* CASO 4: EDUCACIÓN */}
            {selectedEdu && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedEdu.details}
                </p>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 183, 0, 0.04)',
                  border: '1px solid rgba(255, 183, 0, 0.15)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)'
                }}>
                  🎓 Completado en el período {selectedEdu.period}
                </div>
              </div>
            )}

            {/* CASO 5: HABILIDADES INDIVIDUALES (CASAS COMUNES) */}
            {selectedSkill && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedSkill.description}
                </p>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-cyber)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--accent-cyan)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={10} /> Nivel de Dominio
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                      <div style={{ height: '100%', width: `${selectedSkill.level}%`, background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '3px' }}></div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'var(--font-cyber)', color: 'var(--accent-cyan)' }}>
                      {selectedSkill.level}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CASO 6: CASAS DECORATIVAS DEL PUEBLO */}
            {isDecoSelected && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Esta vivienda forma parte del área urbana residencial de la ciudad.
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Actualmente está reservada para futuras expansiones del portafolio. Aquí se construirán nuevos proyectos y habilidades a medida que continúe mi crecimiento profesional.
                </p>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(0, 240, 255, 0.04)',
                  border: '1px solid rgba(0, 240, 255, 0.15)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic'
                }}>
                  💼 ¡Gracias por explorar la ciudad! Si te interesa mi perfil, no dudes en ponerte en contacto.
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 2. CONTROLES GENERALES FLOTANTES EN LA ESQUINA INFERIOR DERECHA */}
      <div
        className="hud-interactive"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'auto',
          zIndex: 90
        }}
      >
        {/* Interruptor de Audio */}
        <button
          onClick={onToggleAudio}
          className="glass-panel"
          style={{
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: audioPlaying ? 'var(--accent-cyan)' : 'var(--text-muted)',
            border: audioPlaying ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: audioPlaying ? 'var(--shadow-neon)' : 'none',
            background: 'var(--glass-bg)',
            transition: 'all 0.2s'
          }}
          title={audioPlaying ? "Silenciar banda sonora" : "Iniciar banda sonora"}
        >
          {audioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Enlaces Sociales */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '5px', gap: '5px', borderRadius: '18px', background: 'var(--glass-bg)' }}>
          <a
            href={cvData.personalInfo.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <GithubIcon size={14} />
          </a>
          <a
            href={cvData.personalInfo.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <LinkedinIcon size={14} />
          </a>
          <a
            href={`mailto:${cvData.personalInfo.contact.email}`}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Mail size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
