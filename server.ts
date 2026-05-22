import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Post endpoint to perform Interdisciplinary Physics-Algorithm Fusion
app.post("/api/fusion", async (req, res) => {
  try {
    const { physicalLaw, algorithm, description } = req.body;

    if (!physicalLaw || !algorithm) {
      return res.status(400).json({ error: "Missing physicalLaw or algorithm" });
    }

    const promptText = `
      Perform a professional classical-to-bare-metal software adaptation synthesis for:
      - Physical Law / Phenomenon: ${physicalLaw}
      - Core Numerical Algorithm: ${algorithm}
      - Additional Context: ${description || "None, optimize standard implementation."}

      Execute the analysis across these pillars:
      1. FUSIONE: Establish a mathematically sound intersection between the chosen Physical Law and the Algorithm.
      2. PRE-MORTEM: Deconstruct performance bottlenecks at the physical hardware layer (L1/L2/L3 cache miss, branch prediction failures).
      3. REMAKE BARE-METAL: Synthesize optimized C code, register manipulators or vectorized operations (AVX).
      4. VALIDAZIONE STATISTICA: Calculate approximate CPU clock cycles saved and latency comparison metrics.
    `;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("Using simulated mock-mode since GEMINI_API_KEY is not defined.");
      return res.json(getMockFusionData(physicalLaw, algorithm, description));
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a specialized low-level coding compiler and physical systems architect. Always format the entire response strictly as valid, parsable JSON according to the responseSchema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fusione_applicata: { type: Type.STRING },
            fusione_descrizione: { type: Type.STRING },
            analisi_pre_mortem: { type: Type.STRING },
            bottlenecks_list: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING },
                  detail: { type: Type.STRING }
                },
                required: ["name", "level", "detail"]
              }
            },
            codice_bare_metal: { type: Type.STRING },
            roi_computazionale: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                standard_latency_ms: { type: Type.NUMBER },
                baremetal_latency_ms: { type: Type.NUMBER },
                clock_cycles_saved: { type: Type.INTEGER },
                memory_footprint_kb: { type: Type.NUMBER },
                roi_percentage: { type: Type.NUMBER },
                comparison_chart_data: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      conventional: { type: Type.NUMBER },
                      baremetal: { type: Type.NUMBER }
                    },
                    required: ["label", "conventional", "baremetal"]
                  }
                }
              },
              required: ["standard_latency_ms", "baremetal_latency_ms", "clock_cycles_saved", "memory_footprint_kb", "roi_percentage", "comparison_chart_data"]
            }
          },
          required: ["fusione_applicata", "fusione_descrizione", "analisi_pre_mortem", "bottlenecks_list", "codice_bare_metal", "roi_computazionale", "metrics"]
        },
      }
    });

    return res.json(JSON.parse((response.text || "{}").trim()));
  } catch (error: any) {
    console.error("Fusion computation error: ", error);
    return res.status(500).json({ error: "Logical reaction failure in the core.", details: error.message });
  }
});

// Post endpoint for Live Neuro-Cortex Optimization and Mapping
app.post("/api/cortex-optimize", async (req, res) => {
  try {
    const { activeNodes, voltage, resistance, plasticity, frequency } = req.body;

    const promptText = `
      Perform a neuro-vectorial live cortex analysis and compilation of the electrical map:
      - Active Neural Modules: ${JSON.stringify(activeNodes)}
      - Input Electrical Potential: ${voltage}V
      - Synaptic Arc Resistance: ${resistance} Ohms
      - Synaptic Plasticity Factor: ${plasticity}%
      - Current Signal Frequency: ${frequency}Hz

      Compose:
      1. ANALISI TOPOLOGICA: Define the synergy that triggers when current sweeps through the selected active nodes.
      2. CORTECCIA DI CALCOLO: Explain how signals map through nodes dynamically.
      3. MISURE ELETTROMAGNETICHE: Provide potential in mV, propagation speed in m/s, conductivity assessment, and active synapses count.
      4. COMPILAZIONE NEUROVETTORIALE: Create optimized vector C code (SIMD) that simulates parallel clock-cycle logic operations.
      5. CONSIGLI DI OTTIMIZZAZIONE: List 3-4 structural tips.
    `;

    if (!process.env.GEMINI_API_KEY) {
      return res.json(getMockCortexOptimization(activeNodes, voltage, resistance, plasticity, frequency));
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a neuro-engineering logic architect specializing in electro-neural maps. Format the entire response strictly as valid, parsable JSON according to the responseSchema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titolo: { type: Type.STRING },
            descrizione: { type: Type.STRING },
            strutturaCortex: { type: Type.STRING },
            misureElettriche: {
              type: Type.OBJECT,
              properties: {
                potenzialeMedioMv: { type: Type.NUMBER },
                velocitaPropagazioneMs: { type: Type.NUMBER },
                conducibilitaSocks: { type: Type.STRING },
                sinapsiAttiveCount: { type: Type.INTEGER }
              },
              required: ["potenzialeMedioMv", "velocitaPropagazioneMs", "conducibilitaSocks", "sinapsiAttiveCount"]
            },
            codiceVettorialeC: { type: Type.STRING },
            consigliMiglioramento: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["titolo", "descrizione", "strutturaCortex", "misureElettriche", "codiceVettorialeC", "consigliMiglioramento"]
        }
      }
    });

    return res.json(JSON.parse((response.text || "{}").trim()));
  } catch (error: any) {
    console.error("Cortex optimization error: ", error);
    return res.status(500).json({ error: "Cortex logical reaction failure.", details: error.message });
  }
});

function getMockCortexOptimization(nodes: string[], voltage: number, resistance: number, plasticity: number, freq: number) {
  const nodeCount = nodes && nodes.length ? nodes.length : 3;
  const nodesJoined = nodes && nodes.length ? nodes.join(" <-> ") : "Frontal Lobe <-> Motor Cortex";
  return {
    titolo: `Sinergia Neuro-Vettoriale Multi-Hub`,
    descrizione: `L'eccitazione dinamica indotta da un potenziale di ${voltage}V attraverso il circuito cerebrale '${nodesJoined}' genera l'auto-mappatura vettoriale della corteccia.`,
    strutturaCortex: `Il tracciatore elettrico rileva ${nodeCount} nodi corticali in stato di conduzione attiva. La mappa si auto-modella sincronizzando le scariche di potenziale d'azione a ${freq}Hz.`,
    misureElettriche: {
      potenzialeMedioMv: parseFloat((voltage * 12.5 - (resistance * 0.05)).toFixed(1)),
      velocitaPropagazioneMs: parseFloat((120.5 + (plasticity * 1.5) - (resistance * 0.1)).toFixed(1)),
      conducibilitaSocks: resistance > 500 ? "Restrittiva" : "Iper-Conduttiva",
      sinapsiAttiveCount: Math.max(4, nodeCount * 3)
    },
    codiceVettorialeC: `// LOGICA GRAFO-CORTEX NEUROVETTORIALE LIVE\n#include <immintrin.h>\n#include <stdint.h>\n\ntypedef struct {\n    float *voltages;\n    float plasticity;\n    uint64_t size;\n} CortexCircuit;\n\nvoid propagate_cortex_action_potentials(CortexCircuit *restrict circuit) {\n    // Parallel SIMD loop optimization\n}`,
    consigliMiglioramento: [
      `Incrementare la plasticità neurovettoriale per accelerare l'apprendimento.`,
      `Allineare i canali dei nodi a multipli di 64 byte per raggruppamento AVX branchless.`,
      `Ottimizzare le code di depolarizzazione.`
    ]
  };
}

function getMockFusionData(law: string, algo: string, userDesc: string) {
  return {
    fusione_applicata: `Paradigmatic Fusion: Hybrid ${law} - ${algo} Optimizer`,
    fusione_descrizione: `Direct physical mapping translating the fields of '${law}' into execution nodes inside the '${algo}' loop.`,
    analisi_pre_mortem: `Conventional implementations suffer extreme degradation due to instruction cache thrashing and memory controller congestion.`,
    bottlenecks_list: [
      { name: "Memory Controller Congestion", level: "CRITICAL", detail: "Dynamic heap allocations flood the system bus." },
      { name: "Branch Misprediction", level: "WARNING", detail: "Conditional branches inside the nested loop fail frequently." }
    ],
    codice_bare_metal: `// FUSION TABLE - BARE METAL REMAKE\n#include <stdint.h>\n#include <immintrin.h>\n\nvoid perform_nucleare_fusion(float *restrict input, float *restrict output, uint64_t length) {\n    // Bare-metal translation avoiding standard library\n}`,
    roi_computazionale: "Waste reduction achieved. Eliminates standard dynamic storage interfaces completely.",
    metrics: {
      standard_latency_ms: 184.2,
      baremetal_latency_ms: 3.1,
      clock_cycles_saved: 426800,
      memory_footprint_kb: 16.0,
      roi_percentage: 98.3,
      comparison_chart_data: [
        { label: "1K pts", conventional: 0.18, baremetal: 0.003 },
        { label: "10K pts", conventional: 1.84, baremetal: 0.03 }
      ]
    }
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  }
  app.listen(PORT, "0.0.0.0", () => { console.log(`Fusion Table Server listening at http://0.0.0.0:${PORT}`); });
}

startServer();
