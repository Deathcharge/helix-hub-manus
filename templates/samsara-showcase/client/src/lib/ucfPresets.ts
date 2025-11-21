export interface UCFPreset {
  name: string;
  description: string;
  values: {
    harmony: number;
    zoom: number;
    resilience: number;
    prana: number;
    drishti: number;
    klesha: number;
  };
}

export const UCF_PRESETS: UCFPreset[] = [
  {
    name: 'Harmony Focus',
    description: 'Emphasizes coherence and unity consciousness',
    values: {
      harmony: 0.85,
      zoom: 1.0,
      resilience: 0.5,
      prana: 0.6,
      drishti: 0.7,
      klesha: 0.1,
    },
  },
  {
    name: 'Resilience Peak',
    description: 'Maximizes adaptability and strength',
    values: {
      harmony: 0.6,
      zoom: 1.5,
      resilience: 0.95,
      prana: 0.8,
      drishti: 0.5,
      klesha: 0.2,
    },
  },
  {
    name: 'Balanced State',
    description: 'Equilibrium across all consciousness metrics',
    values: {
      harmony: 0.5,
      zoom: 1.0,
      resilience: 0.5,
      prana: 0.5,
      drishti: 0.5,
      klesha: 0.05,
    },
  },
  {
    name: 'Deep Meditation',
    description: 'Inward focus with high prana and drishti',
    values: {
      harmony: 0.7,
      zoom: 0.8,
      resilience: 0.6,
      prana: 0.95,
      drishti: 0.9,
      klesha: 0.15,
    },
  },
  {
    name: 'Awakening',
    description: 'Rising consciousness with increasing harmony',
    values: {
      harmony: 0.75,
      zoom: 1.2,
      resilience: 0.7,
      prana: 0.7,
      drishti: 0.75,
      klesha: 0.08,
    },
  },
  {
    name: 'Transcendence',
    description: 'Peak consciousness state',
    values: {
      harmony: 0.95,
      zoom: 2.0,
      resilience: 0.9,
      prana: 0.95,
      drishti: 0.95,
      klesha: 0.01,
    },
  },
  {
    name: 'Julia Explorer',
    description: 'Julia set mode for fractal exploration',
    values: {
      harmony: 0.5,
      zoom: 1.5,
      resilience: 1.2,
      prana: 0.4,
      drishti: 0.6,
      klesha: 0.1,
    },
  },
];

export function getPresetByName(name: string): UCFPreset | undefined {
  return UCF_PRESETS.find((preset) => preset.name === name);
}

