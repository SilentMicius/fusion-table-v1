export interface Bottleneck {
  name: string;
  level: "CRITICAL" | "WARNING" | "OPTIMAL";
  detail: string;
}

export interface ChartPoint {
  label: string;
  conventional: number;
  baremetal: number;
}

export interface FusionMetrics {
  standard_latency_ms: number;
  baremetal_latency_ms: number;
  clock_cycles_saved: number;
  memory_footprint_kb: number;
  roi_percentage: number;
  comparison_chart_data: ChartPoint[];
}

export interface FusionData {
  fusione_applicata: string;
  fusione_descrizione: string;
  analisi_pre_mortem: string;
  bottlenecks_list: Bottleneck[];
  codice_bare_metal: string;
  roi_computazionale: string;
  metrics: FusionMetrics;
}

export interface PhysicalLawPreset {
  id: string;
  name: string;
  formula: string;
  description: string;
}

export interface AlgorithmPreset {
  id: string;
  name: string;
  signature: string;
  description: string;
}

export interface ReactionPreset {
  id: string;
  title: string;
  physicalLaw: string;
  algorithm: string;
  description: string;
}

export interface CortexNode {
  id: string;
  name: string;
  alias: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  charge: number; // dynamic volt spike (0 to 1)
  threshold: number; // threshold voltage for activation
  description: string;
}

export interface CortexSynapse {
  fromId: string;
  toId: string;
  weight: number; // connection conductivity (0.1 to 1)
  activity: number; // current intensity (voltage flow)
  mapped: boolean; // whether electricity drawer has illuminated this path
}

export interface CortexOptimizationResponse {
  titolo: string;
  descrizione: string;
  strutturaCortex: string;
  misureElettriche: {
    potenzialeMedioMv: number;
    velocitaPropagazioneMs: number;
    conducibilitaSocks: string;
    sinapsiAttiveCount: number;
  };
  codiceVettorialeC: string;
  consigliMiglioramento: string[];
}

