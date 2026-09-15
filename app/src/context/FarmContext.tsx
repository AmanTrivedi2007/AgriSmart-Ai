import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export const crops = ['Tomato', 'Wheat', 'Rice', 'Maize', 'Cotton', 'Potato', 'Chilli', 'Onion'];

export type Scenario = 'disease' | 'healthy' | 'uncertain' | 'error';

export type FarmDetails = {
  crop: string;
  stage: string;
  soil: string;
  rain: string;
  ph: string;
  moisture: string;
  temperature: string;
  location: string;
};

export type Diagnosis = {
  status: string;
  title: string;
  confidence: number | null;
  actions: string[];
  details: FarmDetails;
};

const emptyDetails: FarmDetails = {
  crop: '',
  stage: '',
  soil: '',
  rain: '',
  ph: '',
  moisture: '',
  temperature: '',
  location: '',
};

const sampleDetails: FarmDetails = {
  crop: 'Tomato',
  stage: 'Flowering',
  soil: 'Loamy',
  rain: 'Medium',
  ph: '6.5',
  moisture: '31',
  temperature: '29',
  location: 'Nashik, Maharashtra',
};

export function createDemoDiagnosis(scenario: Scenario, details: FarmDetails, _sources?: unknown): Diagnosis {
  const crop = details.crop || 'your crop';

  if (scenario === 'healthy') {
    return {
      status: 'Healthy crop',
      title: `${crop} looks healthy`,
      confidence: 92,
      actions: [
        'Keep the current watering schedule unless soil moisture drops below 25%.',
        'Scout once a week for early pests on the underside of leaves.',
        'Continue the same nutrient mix while growth remains steady.',
      ],
      details,
    };
  }

  if (scenario === 'uncertain') {
    return {
      status: 'Uncertain result',
      title: 'A clearer leaf photo is needed',
      confidence: null,
      actions: [
        'Take a close-up of one leaf in natural light, with the affected area in focus.',
        'Avoid heavy shadows, gloves, or distant wide shots.',
        'Upload again so the report can pick up leaf texture and colour.',
      ],
      details,
    };
  }

  return {
    status: 'Disease detected',
    title: `Early blight suspected on ${crop}`,
    confidence: 78,
    actions: [
      'Remove the worst-affected leaves and keep them off the soil.',
      'Improve airflow around plants and avoid wetting foliage in the evening.',
      'Ask Farmi for a treatment plan based on this sample report.',
    ],
    details,
  };
}

type FarmContextValue = {
  file: File | null;
  setFile: (file: File | null) => void;
  details: FarmDetails;
  sources: unknown;
  updateDetail: (key: keyof FarmDetails, value: string) => void;
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  setLatest: (diagnosis: Diagnosis) => void;
  latest: Diagnosis | null;
  useSamples: () => void;
  clearContext: () => void;
  advisorQuestion: string;
  setAdvisorQuestion: (question: string) => void;
};

const FarmContext = createContext<FarmContextValue | null>(null);

export function FarmProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<FarmDetails>(emptyDetails);
  const [scenario, setScenario] = useState<Scenario>('disease');
  const [latest, setLatest] = useState<Diagnosis | null>(null);
  const [advisorQuestion, setAdvisorQuestion] = useState('');

  const value = useMemo<FarmContextValue>(() => ({
    file,
    setFile,
    details,
    sources: {},
    updateDetail: (key, value) => setDetails(prev => ({ ...prev, [key]: value })),
    scenario,
    setScenario,
    setLatest,
    latest,
    useSamples: () => setDetails(sampleDetails),
    clearContext: () => setDetails(emptyDetails),
    advisorQuestion,
    setAdvisorQuestion,
  }), [file, details, scenario, latest, advisorQuestion]);

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used inside FarmProvider');
  }
  return context;
}
