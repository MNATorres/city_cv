export interface Position3D {
  x: number;
  z: number;
}

export interface CVStat {
  label: string;
  value: string | number;
  icon: string;
  description: string;
}

export interface CVSkill {
  id: string;
  name: string;
  level: number; // 0 a 100
  category: 'Frontend' | 'Backend' | 'DevOps / Cloud' | 'Herramientas';
  gridPos: Position3D;
  description: string;
}

export interface CVExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
  buildingType: 'factory' | 'laboratory' | 'beacon' | 'greenhouse' | 'hq' | 'port';
  gridPos: Position3D;
  size: [number, number];
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  period: string;
  technologies: string[];
  link?: string;
  buildingType: 'port' | 'beacon';
  gridPos: Position3D;
  size: [number, number];
}

export interface CVEducation {
  id: string;
  degree: string;
  institution: string;
  period: string;
  details: string;
  buildingType: 'greenhouse';
  gridPos: Position3D;
  size: [number, number];
}

export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
    contact: {
      email: string;
      github: string;
      linkedin: string;
      location: string;
    };
  };
  stats: CVStat[];
  skills: CVSkill[];
  experience: CVExperience[];
  projects: CVProject[];
  education: CVEducation[];
}

// Las posiciones corresponden a índices de columna (0 a 9) y fila (0 a 5)
// que luego el componente CityGrid transformará a coordenadas 3D espaciales.
export const cvData: CVData = {
  personalInfo: {
    name: "Matías Alejandro",
    title: "Ingeniero de Software Senior / Creative Developer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    bio: "Apasionado por fusionar el diseño interactivo en 3D con arquitecturas robustas y escalables. Llevo más de 6 años transformando ideas en experiencias digitales del mundo real (y ahora en el metaverso tridimensional). Especialista en React, TypeScript y gráficos interactivos para la web.",
    contact: {
      email: "matias@example.com",
      github: "https://github.com/matias-dev",
      linkedin: "https://linkedin.com/in/matias-dev",
      location: "Buenos Aires, Argentina (GMT-3)"
    }
  },
  stats: [
    { label: "Puntos Forge", value: "1,842", icon: "forgePoints", description: "Commits realizados en el último año" },
    { label: "Suministros", value: "342K", icon: "supplies", description: "Líneas de código limpio producidas" },
    { label: "Monedas", value: "982", icon: "coins", description: "Tazas de café consumidas para programar" },
    { label: "Diamantes", value: "214", icon: "diamonds", description: "Bugs legendarios detectados y resueltos" },
    { label: "Gremio", value: "Tech Vanguard", icon: "guild", description: "Miembro del gremio de desarrollo activo" },
    { label: "Era Activa", value: "Era React 19", icon: "era", description: "Última era tecnológica dominada" }
  ],
  skills: [
    {
      id: "skill-react",
      name: "React / Next.js",
      level: 95,
      category: "Frontend",
      gridPos: { x: 3, z: 1 },
      description: "Especialista en React y Next.js. Creación de aplicaciones web SPA y SSR eficientes, optimización de renderizado, React Server Components (RSC) y manejo de estados complejos con Zustand/Redux."
    },
    {
      id: "skill-ts",
      name: "TypeScript",
      level: 92,
      category: "Frontend",
      gridPos: { x: 4, z: 1 },
      description: "Desarrollo tipado seguro robusto. Implementación de genéricos complejos, utilidades de tipos avanzadas y arquitecturas limpias estructuradas que garantizan la mantenibilidad a gran escala."
    },
    {
      id: "skill-r3f",
      name: "Three.js / R3F",
      level: 85,
      category: "Frontend",
      gridPos: { x: 5, z: 1 },
      description: "Creación de experiencias WebGL interactivas en 3D. Control de cámaras, iluminación física, optimización de llamadas de dibujo (draw calls), creación de shaders GLSL y animaciones fluidas."
    },
    {
      id: "skill-html-css",
      name: "HTML5 / CSS3",
      level: 90,
      category: "Frontend",
      gridPos: { x: 6, z: 1 },
      description: "Diseños responsivos con CSS vainilla, maquetación adaptativa, Flexbox, Grid Layouts y micro-animaciones fluidas con transiciones avanzadas. Dominio de variables nativas (custom properties)."
    },
    {
      id: "skill-node",
      name: "Node.js / Express",
      level: 88,
      category: "Backend",
      gridPos: { x: 2, z: 3 },
      description: "Desarrollo de servidores backend y APIs REST/GraphQL rápidos y escalables con Node.js y Express/NestJS. Manejo de autenticación, sockets y optimización de base de datos."
    },
    {
      id: "skill-db",
      name: "Bases de Datos",
      level: 80,
      category: "Backend",
      gridPos: { x: 1, z: 2 },
      description: "Modelado y optimización de bases de datos relacionales (PostgreSQL, MySQL) y no relacionales (MongoDB). Manejo de índices, relaciones complejas y persistencia segura."
    },
    {
      id: "skill-graphql",
      name: "GraphQL / APIs",
      level: 85,
      category: "Backend",
      gridPos: { x: 1, z: 3 },
      description: "Diseño e implementación de endpoints unificados con GraphQL (Apollo Server/Client). Reducción del sobre-envío de datos (over-fetching) y mejora del rendimiento cliente-servidor."
    },
    {
      id: "skill-docker",
      name: "Docker / K8s",
      level: 75,
      category: "DevOps / Cloud",
      gridPos: { x: 8, z: 2 },
      description: "Contenerización de microservicios con Docker y orquestación básica con Kubernetes. Automatización de entornos locales de desarrollo idénticos a los servidores de producción."
    },
    {
      id: "skill-aws",
      name: "AWS Cloud",
      level: 80,
      category: "DevOps / Cloud",
      gridPos: { x: 8, z: 3 },
      description: "Despliegue y administración de infraestructura en la nube. Configuración de buckets S3, servidores EC2, bases de datos RDS y arquitecturas serverless con AWS Lambda."
    },
    {
      id: "skill-cicd",
      name: "CI/CD Automations",
      level: 82,
      category: "DevOps / Cloud",
      gridPos: { x: 7, z: 3 },
      description: "Configuración de pipelines automatizados de integración y despliegue continuo (CI/CD) con GitHub Actions para testing automático, linters y despliegues automáticos a producción."
    },
    {
      id: "skill-git",
      name: "Git / GitHub",
      level: 95,
      category: "Herramientas",
      gridPos: { x: 5, z: 2 },
      description: "Control de versiones avanzado. Dominio de rebase, cherry-pick, resolución de conflictos y metodologías de branching colaborativo (GitFlow / Trunk-based Development)."
    },
    {
      id: "skill-figma",
      name: "Figma (UI/UX)",
      level: 80,
      category: "Herramientas",
      gridPos: { x: 4, z: 3 },
      description: "Diseño de interfaces de usuario interactivas en Figma. Creación de prototipos rápidos, diseño de sistemas de componentes atómicos y colaboración estrecha entre el área de diseño y código."
    },
    {
      id: "skill-vite",
      name: "Vite / Webpack",
      level: 88,
      category: "Herramientas",
      gridPos: { x: 3, z: 2 },
      description: "Configuración y optimización de empaquetadores web de alta velocidad. Configuración de módulos HMR, code-splitting dinámico e integraciones con compiladores de TypeScript y CSS."
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Desarrollador Full Stack Senior",
      company: "Innovación Digital S.A. (Gremio Tech Vanguard)",
      period: "2023 - Presente",
      description: [
        "Lideré el rediseño completo de la plataforma de e-commerce principal, migrando a Next.js y mejorando los tiempos de carga en un 40%.",
        "Implementé integraciones complejas en 3D para la previsualización interactiva de productos usando Three.js y React Three Fiber.",
        "Establecí flujos de trabajo de CI/CD automatizados y metodologías ágiles en un equipo de 10 desarrolladores."
      ],
      technologies: ["React", "TypeScript", "Next.js", "Three.js", "Node.js", "Docker", "AWS"],
      buildingType: "factory",
      gridPos: { x: 2, z: 2 },
      size: [1, 1] // Ahora caben exactamente en 1 manzana
    },
    {
      id: "exp-2",
      role: "Ingeniero de Software Frontend",
      company: "CyberNet Core Systems",
      period: "2021 - 2023",
      description: [
        "Desarrollé dashboards de análisis de datos en tiempo real con WebSocket y gráficos interactivos optimizados.",
        "Creé una librería interna de componentes de UI de alto rendimiento utilizada por más de 5 equipos de desarrollo.",
        "Reduje la tasa de bugs reportados por clientes en un 35% mediante pruebas unitarias y de integración rigurosas."
      ],
      technologies: ["React", "Redux Toolkit", "TypeScript", "Sass", "Jest", "Vite"],
      buildingType: "laboratory",
      gridPos: { x: 7, z: 2 },
      size: [1, 1]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Cyber-City Simulator 3D",
      description: "Un simulador urbano procedural en el navegador utilizando React Three Fiber y físicas básicas en 3D. Cuenta con generación procedural de edificios y tráfico simulado.",
      period: "2025",
      technologies: ["Three.js", "React Three Fiber", "Zustand", "GLSL Shaders"],
      link: "https://github.com/matias-dev/cyber-city-sim",
      buildingType: "port",
      gridPos: { x: 3, z: 4 },
      size: [1, 1]
    },
    {
      id: "proj-2",
      name: "Aetherial UI Library",
      description: "Librería de componentes de interfaz inspirada en el diseño cyberpunk y futurista de vidrio esmerilado (glassmorphism). Diseñada para máxima accesibilidad y rendimiento.",
      period: "2024",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Storybook"],
      link: "https://github.com/matias-dev/aetherial-ui",
      buildingType: "beacon",
      gridPos: { x: 6, z: 4 },
      size: [1, 1]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Licenciatura en Sistemas de Información",
      institution: "Universidad Tecnológica Nacional",
      period: "2017 - 2022",
      details: "Especialización en Ingeniería de Software, Bases de Datos Relacionales y Arquitectura de Sistemas Computacionales.",
      buildingType: "greenhouse",
      gridPos: { x: 4, z: 4 },
      size: [1, 1]
    }
  ]
};
