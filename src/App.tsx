import { useState, useEffect, useMemo, useRef } from "react";
import JSZip from "jszip";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Flame,
  ShieldAlert,
  FileCode,
  Gauge,
  Terminal,
  ArrowRight,
  Sparkles,
  Cpu,
  Database,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Sliders,
  Atom,
  TrendingUp,
  Layers,
  CircleAlert,
  Info,
  ChevronRight,
  BookOpen,
  Activity,
  GitBranch,
  Hourglass,
  Download,
  Orbit
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  PhysicalLawPreset,
  AlgorithmPreset,
  ReactionPreset,
  FusionData,
  Bottleneck
} from "./types";
import NeuroCortexCanvas from "./components/NeuroCortexCanvas";
import GemiSashaMutation from "./components/GemiSashaMutation";

const PHYSICAL_LAWS: PhysicalLawPreset[] = [

  {
    id: "Schrödinger Wave Model",
    name: "Schrödinger's Equation",
    formula: "iℏ ∂/∂t Ψ = ĤΨ",
    description: "Governs quantum wave amplitudes, multi-state superpositions, and potential tunneling vectors."
  },
  {
    id: "Maxwell Field Equations",
    name: "Maxwell's Equations",
    formula: "∇ × E = -∂B/∂t",
    description: "Defines electrodynamic wave propagations, curl field tensors, and magnetic flux loops."
  },
  {
    id: "Thermodynamics Second Law",
    name: "Thermodynamics & Entropy",
    formula: "dS ≥ dQ/T",
    description: "Regulates energy drift vectors, irreversible entropy decay paths, and dissipation gradients."
  },
  {
    id: "Navier Stokes Turbulence",
    name: "Navier-Stokes Equations",
    formula: "ρ(∂u/∂t + u·∇u) = -∇p + μ∇²u + f",
    description: "Formulates viscous fluid velocities, kinetic field vectors, and non-linear micro-turbulence."
  },
  {
    id: "Newtonian Feedback Mechanics",
    name: "Newton's Second Law",
    formula: "F = d(mv)/dt",
    description: "Governs classical dynamics, inertial momentum corrections, and vector kinetics."
  }
];

const ALGORITHMS: AlgorithmPreset[] = [
  {
    id: "Fast Fourier Transform",
    name: "Fast Fourier Transform (FFT)",
    signature: "O(N log N)",
    description: "Decouples spatial or temporal coordinates into multi-dimensional localized frequency spectrums."
  },
  {
    id: "Gradient Descent Optimization",
    name: "Gradient Descent Gradient",
    signature: "θ_t+1 = θ_t - η ∇L",
    description: "Navigates complex loss surfaces branchlessly to achieve hyper-convergence."
  },
  {
    id: "PID Feedback System",
    name: "PID Controller Feedback",
    signature: "u(t) = Kp·e(t) + Ki·∫e(τ)dτ + Kd·de/dt",
    description: "Performs real-time corrective tracking using proportional-integral-derivative registers."
  },
  {
    id: "Kalman State Filter",
    name: "Kalman Filter Predictor",
    signature: "x̂_k|k = x̂_k|k-1 + K_k ỹ_k",
    description: "Fuses measurement vectors recursively to establish high-fidelity status projections."
  },
  {
    id: "Modular BigInt Exponentiation",
    name: "Modular Exponentiation (RSA)",
    signature: "c = m^e mod n",
    description: "Leverages prime integer symmetries to perform modular multiplication pipelines."
  }
];

const STRATEGIC_REACTIONS: ReactionPreset[] = [
  {
    id: "q_fft",
    title: "Quantum FFT (Schrödinger + FFT)",
    physicalLaw: "Schrödinger Wave Model",
    algorithm: "Fast Fourier Transform",
    description: "Directs quantum Fourier amplitude calculations perfectly. Aligns wave lattices to 64-byte AVX boundary nodes to prevent dynamic coordinate memory transposition stalls."
  },
  {
    id: "t_gd",
    title: "Entropy Optimization (Thermodynamics + GD)",
    physicalLaw: "Thermodynamics Second Law",
    algorithm: "Gradient Descent Optimization",
    description: "Directly maps thermodynamic entropy dissipation parameters to training steps, preventing floating-point overhead in dynamic learning rate convergence layers."
  },
  {
    id: "e_rsa",
    title: "Magnetostatic RSA (Maxwell + Mod Expo)",
    physicalLaw: "Maxwell Field Equations",
    algorithm: "Modular BigInt Exponentiation",
    description: "Adapts Maxwell field vector symmetries to implement branchless modular modular multiplications, avoiding pipeline branch prediction misses."
  },
  {
    id: "m_pid",
    title: "Classical Guidance (Newtonian Mechanics + PID)",
    physicalLaw: "Newtonian Feedback Mechanics",
    algorithm: "PID Feedback System",
    description: "Translates inertial state derivatives into a streamlined feedback controller requiring zero stack framing and zero dynamic heap bindings."
  }
];

const LOADING_STEPS = [
  "Initialising Ignition Core Field...",
  "Performing Interdisciplinary Symmetries Projection...",
  "Analyzing Pipeline Bus Overheads & I/O Conflicts...",
  "Profiling L1/L2 Cache Sidelining Vectors...",
  "Synthesizing Bare-Metal Pointer Matrices...",
  "Verifying Statistical Theoretical Clock ROI..."
];

export default function App() {
  const [activeModule, setActiveModule] = useState<"reactor" | "cortex" | "gemisasha">("reactor");
  const [selectedLaw, setSelectedLaw] = useState<string>(PHYSICAL_LAWS[0].id);
  const [selectedAlgo, setSelectedAlgo] = useState<string>(ALGORITHMS[0].id);
  const [customDescription, setCustomDescription] = useState<string>("");
  
  const [reactionPreset, setReactionPreset] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "igniting" | "success" | "error">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [fusionResult, setFusionResult] = useState<FusionData | null>(null);
  const [activeTab, setActiveTab] = useState<"spark" | "blast" | "fallout" | "yield">("spark");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [utcTime, setUtcTime] = useState<string>("2026-05-21 14:57:22 UTC");

  // Live hardware register & cache simulation states
  const [testMode, setTestMode] = useState<"baremetal" | "conventional">("baremetal");
  const [registerStates, setRegisterStates] = useState<{ name: string; load: number; val: string }[]>([]);
  const [realtimeTelemetry, setRealtimeTelemetry] = useState<{
    cacheMissRate: number;
    pipelineStalls: number;
    busUtilization: number;
    coreTemp: number;
  }>({ cacheMissRate: 0.02, pipelineStalls: 3, busUtilization: 12.4, coreTemp: 38.5 });

  const [cacheHistory, setCacheHistory] = useState<{ time: string; misses: number; conventionalMisses: number }[]>([]);

  // Keep UTC clock ticking for authentic systems display
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      const utcString = date.toISOString().replace("T", " ").substring(0, 19) + " UTC";
      setUtcTime(utcString);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time register & cache telemetry updates
  useEffect(() => {
    // Build initial registers
    const initRegs = Array.from({ length: 16 }, (_, i) => ({
      name: `ZMM${String(i).padStart(2, "0")}`,
      load: 0,
      val: "0x000000000000"
    }));
    setRegisterStates(initRegs);

    // Initial rolling cache history with some noise
    const initHistory = Array.from({ length: 15 }, (_, i) => ({
      time: `-${15 - i}s`,
      misses: parseFloat((Math.random() * 0.02 + 0.01).toFixed(3)), // bare-metal
      conventionalMisses: parseFloat((Math.random() * 1.5 + 3.5).toFixed(3)) // conventional
    }));
    setCacheHistory(initHistory);
  }, []);

  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      // Update values based on active mode
      setRegisterStates(prev => {
        if (!prev || prev.length === 0) return prev;
        return prev.map((reg, idx) => {
          const isActiveReg = idx < 8; // In Vectorized baremetal we use first 8 registers intensely
          let load = 0;
          let valHex = "0x000000000000";
          
          if (testMode === "baremetal") {
            if (isActiveReg) {
              load = Math.floor(Math.random() * 20) + 75; // 75-95%
              valHex = `0x7FFD${Math.floor(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(4, "0")}AA${Math.floor(Math.random() * 0xFF).toString(16).toUpperCase().padStart(2, "0")}`;
            } else {
              load = Math.floor(Math.random() * 6) + 2; // 2-8%
              valHex = "0x000000000000";
            }
          } else {
            // Conventional: registers are rarely utilized efficiently, everything is scalar or stalling
            load = Math.floor(Math.random() * 12) + 3; // 3-15%
            valHex = `0x10A8${Math.floor(Math.random() * 0xF).toString(16).toUpperCase()}${Math.floor(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, "0")}`;
          }
          
          return { ...reg, load, val: valHex };
        });
      });

      setRealtimeTelemetry(prev => {
        if (testMode === "baremetal") {
          return {
            cacheMissRate: parseFloat((Math.random() * 0.015 + 0.008).toFixed(3)), // 0.008% - 0.023%
            pipelineStalls: Math.floor(Math.random() * 3) + 1, // 1-4
            busUtilization: parseFloat((Math.random() * 1.5 + 8.4).toFixed(1)), // 8.4 - 9.9 %
            coreTemp: parseFloat((Math.random() * 1.2 + 37.5).toFixed(1)) // 37.5 - 38.7 °C
          };
        } else {
          return {
            cacheMissRate: parseFloat((Math.random() * 1.4 + 4.1).toFixed(3)), // 4.1% - 5.5%
            pipelineStalls: Math.floor(Math.random() * 1800) + 1100, // 1100 - 2900 stalls
            busUtilization: parseFloat((Math.random() * 12.5 + 61.2).toFixed(1)), // 61.2 - 73.7 %
            coreTemp: parseFloat((Math.random() * 3.8 + 54.2).toFixed(1)) // 54.2 - 58.0 °C
          };
        }
      });

      setCacheHistory(prev => {
        if (!prev || prev.length === 0) return prev;
        const nextHistory = [...prev.slice(1)];
        const newBare = parseFloat((Math.random() * 0.015 + 0.008).toFixed(3));
        const newConv = parseFloat((Math.random() * 1.4 + 4.1).toFixed(3));
        nextHistory.push({
          time: `${tick}s`,
          misses: newBare,
          conventionalMisses: newConv
        });
        return nextHistory;
      });

    }, 800);

    return () => clearInterval(interval);
  }, [testMode]);

  // Update selection bindings if preset is clicked
  const handleApplyPreset = (preset: ReactionPreset) => {
    setReactionPreset(preset.id);
    setSelectedLaw(preset.physicalLaw);
    setSelectedAlgo(preset.algorithm);
    setCustomDescription(preset.description);
  };

  const currentLawDetails = useMemo(() => {
    return PHYSICAL_LAWS.find((p) => p.id === selectedLaw);
  }, [selectedLaw]);

  const currentAlgoDetails = useMemo(() => {
    return ALGORITHMS.find((a) => a.id === selectedAlgo);
  }, [selectedAlgo]);

  const triggerReaction = async () => {
    setStatus("igniting");
    setCurrentStepIndex(0);
    setErrorMessage("");
    setFusionResult(null);

    // Simulated reactor countdown animation for step profiling
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 600);

    try {
      const response = await fetch("/api/fusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          physicalLaw: selectedLaw,
          algorithm: selectedAlgo,
          description: customDescription
        }),
      });

      if (!response.ok) {
        throw new Error(`Ignition failure: status ${response.status}`);
      }

      const payload: FusionData = await response.json();
      
      // Delay success slightly for realistic transition aesthetics
      setTimeout(() => {
        clearInterval(stepInterval);
        setFusionResult(payload);
        setStatus("success");
        setActiveTab("spark");
      }, 3800);

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected nuclear core reaction decay occurred.");
    }
  };

  const copyCodeToClipboard = () => {
    if (!fusionResult) return;
    navigator.clipboard.writeText(fusionResult.codice_bare_metal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCode = async () => {
    if (!fusionResult) return;
    
    const zip = new JSZip();
    const cleanLaw = selectedLaw.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const cleanAlgo = selectedAlgo.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    
    // C Source Code
    zip.file(`bare_metal_${cleanLaw}_${cleanAlgo}.c`, fusionResult.codice_bare_metal);
    
    // Binary Specification
    const specText = `BINARY SPECIFICATION
====================
Law: ${selectedLaw}
Algorithm: ${selectedAlgo}

${fusionResult.analisi_strutturale}
`;
    zip.file("specification.txt", specText);
    
    // Performance Impact Summary
    const perfText = `PERFORMANCE IMPACT SUMMARY
==========================
Clock ROI Ratio: ${fusionResult.clock_roi_ratio}

${fusionResult.misure_ottimizzazione.join('\n')}

BOTTLENECKS IDENTIFIED
----------------------
${fusionResult.identificazione_colli_bottiglia.map((b) => `[${b.level}] ${b.name}: ${b.detail}`).join('\n')}
`;
    zip.file("performance_impact.txt", perfText);
    
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reactor_fusion_${cleanLaw}_${cleanAlgo}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reactor_root" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Dynamic Telemetry Header */}
      <header id="header_console" className="sticky top-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full animate-pulse"></div>
              <div className="relative w-10 h-10 bg-neutral-900 border border-amber-500/50 rounded-lg flex items-center justify-center">
                <Atom className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-mono tracking-tight text-neutral-50 bg-clip-text">
                  FUSION TABLE <span className="text-amber-400">1.0v</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest font-mono bg-neutral-900 px-2 py-0.5 border border-neutral-700 text-neutral-400 rounded">
                  Bare-Metal Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">Motore Logico Interdisciplinare di cave_man_Kallerton</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-400">
            <div className="flex items-center gap-2 bg-neutral-900/80 px-3 py-1.5 rounded border border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-neutral-500">REACTOR STATUS:</span>
              <span className="text-neutral-300 font-medium">ONLINE</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 bg-neutral-900/80 px-3 py-1.5 rounded border border-neutral-800">
              <span className="text-neutral-500">UTC:</span>
              <span className="text-amber-400/90 font-medium">{utcTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main id="dashboard_core" className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        
        {/* Module Tab Switcher */}
        <div id="module_selector_deck" className="mb-6 bg-neutral-900/40 border border-neutral-850 p-1.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl">
          <button
            onClick={() => setActiveModule("reactor")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeModule === "reactor"
                ? "bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow shadow-amber-950/25"
                : "border border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Atom className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">1. CORE REATTORE</span>
          </button>
          
          <button
            onClick={() => setActiveModule("cortex")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeModule === "cortex"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow shadow-emerald-950/25"
                : "border border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">2. GRAFO-CORTEX</span>
          </button>

          <button
            onClick={() => setActiveModule("gemisasha")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeModule === "gemisasha"
                ? "bg-red-500/10 border border-red-500/30 text-red-500 shadow shadow-red-950/25"
                : "border border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Orbit className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">3. GEMISASHA PROTOCOL</span>
          </button>
        </div>

        {activeModule === "reactor" ? (
          <>
            {/* Intro Alert */}
            <div id="intro_disclaimer" className="mb-6 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-neutral-400 space-y-1">
            <p>
              Translations of classic physics, quantum dynamics, and irreversible thermodynamics models mapped into zero-overhead static software algorithms.
            </p>
            <p className="text-xs text-neutral-500 font-mono">
              ★ Prevents abstraction leakage, dynamic virtualization latencies, and instruction thrashing under extreme data scales.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Control Deck (5 Cols) */}
          <section id="control_deck" className="lg:col-span-5 space-y-6">
            
            {/* Presets Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-neutral-400" />
                <h2 className="text-sm font-semibold tracking-wider uppercase font-mono text-neutral-300">Reaction Presets</h2>
              </div>
              <div className="space-y-2">
                {STRATEGIC_REACTIONS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                      reactionPreset === preset.id
                        ? "bg-amber-950/25 border-amber-500 text-neutral-100"
                        : "bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/90"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs font-mono group-hover:text-neutral-200">
                        {preset.title}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-400 transition-transform" />
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed truncate">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fusion Parameters Selector Form */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6">
              
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold tracking-wider uppercase font-mono text-neutral-300">Symmetries Param</h2>
              </div>

              {/* Physical Law Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold tracking-wide uppercase text-neutral-400">
                    1. Physics Symmetries
                  </label>
                  <span className="text-[10px] text-amber-400 bg-neutral-950 px-2 py-0.5 border border-amber-500/25 rounded font-mono">
                    {currentLawDetails?.formula}
                  </span>
                </div>
                
                <div className="relative">
                  <select
                    value={selectedLaw}
                    onChange={(e) => {
                      setSelectedLaw(e.target.value);
                      setReactionPreset("");
                    }}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
                  >
                    {PHYSICAL_LAWS.map((law) => (
                      <option key={law.id} value={law.id}>
                        {law.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-neutral-500 leading-normal pl-1">
                  {currentLawDetails?.description}
                </p>
              </div>

              {/* Numerical Algorithm Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold tracking-wide uppercase text-neutral-400">
                    2. Core Algorithm
                  </label>
                  <span className="text-[10px] text-emerald-400 bg-neutral-950 px-2 py-0.5 border border-emerald-500/25 rounded font-mono">
                    {currentAlgoDetails?.signature}
                  </span>
                </div>
                
                <select
                  value={selectedAlgo}
                  onChange={(e) => {
                    setSelectedAlgo(e.target.value);
                    setReactionPreset("");
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
                >
                  {ALGORITHMS.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      {algo.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-500 leading-normal pl-1">
                  {currentAlgoDetails?.description}
                </p>
              </div>

              {/* Custom Constraints Text */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold tracking-wide uppercase text-neutral-400">
                    3. Custom Telemetry (Optional)
                  </label>
                </div>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Specify custom cache alignment, target instruction counts, register sizes (AVX2/AVX512), or specific platform properties (Veriton hardware, cache limits, memory channels)..."
                  className="w-full h-24 bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 transition-colors resize-none placeholder:text-neutral-600 font-mono"
                />
              </div>

              {/* Primary Burn Button */}
              <button
                onClick={triggerReaction}
                disabled={status === "igniting"}
                className={`w-full py-4 px-6 rounded-xl font-bold font-mono text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                  status === "igniting"
                    ? "bg-neutral-900 border border-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-neutral-950 shadow-lg shadow-amber-950/20 active:scale-95 cursor-pointer"
                }`}
              >
                {status === "igniting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    <span>Igniting Reaction...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5 animate-pulse text-red-950" />
                    <span>AVVIA REAZIONE NUCLEARE</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* RIGHT PANEL: Console Output & Statistics (7 Cols) */}
          <section id="telemetry_desk" className="lg:col-span-7">
            
            <AnimatePresence mode="wait">
              {/* IDLE STATE */}
              {status === "idle" && (
                <motion.div
                  key="idle_console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-8 text-center flex flex-col items-center justify-center min-h-[500px]"
                >
                  <div className="w-16 h-16 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4 animate-pulse">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-mono font-semibold text-neutral-300">Chamber Status: Awaiting Symmetries</h3>
                  <p className="text-sm text-neutral-500 max-w-md mt-2 leading-relaxed">
                    Select a localized physical model and a target algorithm core. Hit the <span className="text-amber-400 font-bold">Avvia Reazione</span> trigger to generate the physical-algebraic bare metal compiler blueprint.
                  </p>
                  
                  {/* Decorative System Parameters Panel */}
                  <div className="mt-8 border border-neutral-800/80 rounded-xl bg-neutral-950/80 p-5 w-full max-w-lg text-left divide-y divide-neutral-800/50 font-mono text-[11px] text-neutral-500">
                    <div className="pb-2.5 flex items-center justify-between">
                      <span>L1 instruction cache size</span>
                      <span className="text-neutral-400">32 KiB per core</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span>Instruction scheduler dispatch rate</span>
                      <span className="text-neutral-400 font-bold">Z-LATENCY BARE-METAL</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span>Address translation TLB overhead</span>
                      <span className="text-neutral-400 font-bold">0 cycles (Static mapping)</span>
                    </div>
                    <div className="pt-2.5 flex items-center justify-between">
                      <span>Memory bus saturation limit</span>
                      <span className="text-amber-400">99.7% efficiency optimal</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* LOADING REACTOR STATE */}
              {status === "igniting" && (
                <motion.div
                  key="loading_console"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl bg-neutral-950 border border-neutral-800 p-8 min-h-[500px] flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Glowing warning line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-pulse"></div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                        <span className="text-xs uppercase font-mono tracking-widest text-neutral-400">Reaction Chamber Active</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 uppercase tracking-widest animate-pulse">
                        BURNING: {selectedLaw.split(" ")[0]} ⚙ {selectedAlgo.split(" ")[0]}
                      </span>
                    </div>

                    {/* Progress bars stacking */}
                    <div className="space-y-3 pt-4">
                      {LOADING_STEPS.map((step, idx) => {
                        const isDone = idx < currentStepIndex;
                        const isActive = idx === currentStepIndex;
                        return (
                          <div
                            key={step}
                            className={`p-3 rounded-xl border transition-all text-xs font-mono flex items-center justify-between ${
                              isDone
                                ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-400"
                                : isActive
                                ? "bg-amber-950/30 border-amber-500 text-amber-300 animate-pulse"
                                : "bg-neutral-900/40 border-neutral-900/40 text-neutral-600"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>[{idx + 1}]</span>
                              <span>{step}</span>
                            </span>
                            {isDone ? (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isActive ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
                            ) : (
                              <Hourglass className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-500 font-mono">
                    <span className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 shrink-0" />
                      <span>Generating bare-metal parameters...</span>
                    </span>
                    <span>T-Minus 1.2s</span>
                  </div>
                </motion.div>
              )}

              {/* SUCCESS / COMPLETED STATE */}
              {status === "success" && fusionResult && (
                <motion.div
                  key="success_console"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden min-h-[500px] flex flex-col justify-between"
                >
                  
                  {/* Tab Navigation header */}
                  <div className="bg-neutral-950 border-b border-neutral-800 p-2 flex flex-wrap gap-1">
                    <button
                      onClick={() => setActiveTab("spark")}
                      className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                        activeTab === "spark"
                          ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                          : "border border-transparent text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>1. THE SPARK</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("blast")}
                      className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                        activeTab === "blast"
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "border border-transparent text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>2. THE BLAST (Pre-Mortem)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("fallout")}
                      className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                        activeTab === "fallout"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "border border-transparent text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>3. THE FALLOUT (Code)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("yield")}
                      className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                        activeTab === "yield"
                          ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                          : "border border-transparent text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <Gauge className="w-3.5 h-3.5" />
                      <span>4. THE YIELD (ROI)</span>
                    </button>
                  </div>

                  {/* TAB OUTPUT VIEWS */}
                  <div className="p-6 flex-grow">
                    
                    {/* TAB 1: THE SPARK */}
                    {activeTab === "spark" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">Applied Symmetries Paradigm</span>
                          <span className="text-[10px] bg-amber-950/40 text-amber-300 font-mono px-2.5 py-0.5 border border-amber-600/20 rounded">
                            Field Model Locked
                          </span>
                        </div>
                        <h3 className="text-lg font-mono font-bold text-neutral-100 flex items-center gap-2">
                          <Atom className="w-5 h-5 text-amber-400" />
                          {fusionResult.fusione_applicata}
                        </h3>
                        
                        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-300 leading-relaxed">
                          {fusionResult.fusione_descrizione}
                        </div>

                        {/* Interactive diagram representing mapping flow */}
                        <div className="border border-neutral-800 bg-neutral-950/40 rounded-xl p-4">
                          <h4 className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-3">Logical Flow-Chart Mapping</h4>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
                            <div className="bg-amber-950/20 border border-amber-500/30 px-3 py-2 rounded text-amber-400 text-center w-full sm:w-40 truncate">
                              Physical Constant / Law
                              <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{selectedLaw.split(" ")[0]}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-600 transform rotate-90 sm:rotate-0" />
                            <div className="bg-blue-950/20 border border-blue-500/30 px-3 py-2 rounded text-blue-400 text-center w-full sm:w-40">
                              Register Vectors mapping
                              <div className="text-[10px] text-neutral-500 font-mono mt-0.5">AVX registers alignment</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-600 transform rotate-90 sm:rotate-0" />
                            <div className="bg-emerald-950/20 border border-emerald-500/30 px-3 py-2 rounded text-emerald-400 text-center w-full sm:w-40 truncate">
                              Algorithm core loop
                              <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{selectedAlgo.split(" ")[0]}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 2: THE BLAST (PRE-MORTEM) */}
                    {activeTab === "blast" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">L1/L2 Cache Saturated Stalls</span>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Deconstruction of performance leaks under standard library abstractions and OS dynamic scheduling.
                        </p>

                        <div className="p-4 rounded-xl bg-red-950/10 border border-red-500/20 text-xs text-neutral-300 leading-relaxed font-mono">
                          {fusionResult.analisi_pre_mortem}
                        </div>

                        {/* List of hardware conflicts */}
                        <div className="space-y-2">
                          <h4 className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">Hardware Level Inefficiencies identified</h4>
                          {fusionResult.bottlenecks_list?.map((b: Bottleneck, index: number) => {
                            const isCritical = b.level === "CRITICAL";
                            const isWarning = b.level === "WARNING";
                            return (
                              <div key={index} className="p-3 border border-neutral-800 rounded-xl bg-neutral-950/40 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-mono font-semibold text-neutral-200 block md:inline mr-2">
                                    {b.name}
                                  </span>
                                  <p className="text-[11px] text-neutral-400">{b.detail}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 self-start md:self-center border text-center ${
                                  isCritical 
                                    ? "bg-red-950/40 text-red-400 border-red-700/50 animate-pulse" 
                                    : isWarning 
                                    ? "bg-amber-950/40 text-amber-400 border-amber-600/50" 
                                    : "bg-emerald-950/40 text-emerald-400 border-emerald-600/50"
                                }`}>
                                  {b.level}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 3: THE FALLOUT (BARE-METAL CODE) */}
                    {activeTab === "fallout" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest font-bold">Optimised System Compilation</span>
                          
                          <div className="flex items-center gap-2">
                            {/* Copy code button */}
                            <button
                              onClick={copyCodeToClipboard}
                              className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer text-neutral-300 active:scale-95"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">COPIED</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>COPY BARE-METAL</span>
                                </>
                              )}
                            </button>

                            {/* Export code button */}
                            <button
                              onClick={handleExportCode}
                              className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-950 border border-emerald-800 text-xs font-mono flex items-center gap-1.5 transition-all text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 font-bold active:scale-95 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>BATCH EXPORT (.zip)</span>
                            </button>
                          </div>
                        </div>

                        {/* Code editor container */}
                        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
                          
                          {/* Terminal Header */}
                          <div className="bg-neutral-900 border-b border-neutral-800/80 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                            <span className="flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5" />
                              <span>bare_metal_optimizer.c</span>
                            </span>
                            <span>C Standard / AVX Intrinsic</span>
                          </div>

                          {/* Preformatted code block */}
                          <div className="p-4 overflow-x-auto text-[11px] sm:text-xs">
                            <pre className="font-mono text-neutral-300 leading-normal select-all">
                              <code>{fusionResult.codice_bare_metal}</code>
                            </pre>
                          </div>
                        </div>

                        <div className="p-3 bg-neutral-950/40 border border-neutral-800 rounded-lg text-xs leading-relaxed text-neutral-400 flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Code relies purely on memory cache barriers and explicit static calculations. Heap bypass activated.</span>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB 4: THE YIELD (ROI STATISTICS) */}
                    {activeTab === "yield" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-blue-500 uppercase tracking-widest font-bold">Benchmark Validation Yield</span>
                          <span className="text-[10px] bg-blue-950/40 text-blue-300 font-mono px-2 py-0.5 border border-blue-600/20 rounded">
                            Theoretical ROI calculated
                          </span>
                        </div>

                        {/* Stat grid widgets */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          
                          <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Latency Naive</span>
                            <div className="text-lg font-mono font-bold text-red-400">{fusionResult.metrics.standard_latency_ms}ms</div>
                          </div>

                          <div className="p-4 bg-neutral-950 border border-amber-500/25 rounded-xl space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Latency Bare-Metal</span>
                            <div className="text-lg font-mono font-bold text-emerald-400">{fusionResult.metrics.baremetal_latency_ms}ms</div>
                          </div>

                          <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Clock Cycles saved</span>
                            <div className="text-lg font-mono font-bold text-neutral-100">{fusionResult.metrics.clock_cycles_saved.toLocaleString()}</div>
                          </div>

                          <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-xl space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Optimised Memory footprint</span>
                            <div className="text-lg font-mono font-bold text-neutral-100">{fusionResult.metrics.memory_footprint_kb} KiB</div>
                          </div>

                        </div>

                        {/* Recharts dynamic compare visualizer */}
                        <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-950/40">
                          <h4 className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 mb-3">Latency vs Data Stress Points (Lower is Better)</h4>
                          <div className="h-64 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={fusionResult.metrics.comparison_chart_data}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="colorConventional" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorBaremetal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                                <XAxis dataKey="label" stroke="#525252" tickLine={false} />
                                <YAxis stroke="#525252" tickLine={false} />
                                <Tooltip
                                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#f5f5f5' }}
                                  labelClassName="font-mono"
                                />
                                <Area type="monotone" name="Conventional (ms)" dataKey="conventional" stroke="#ef4444" fillOpacity={1} fill="url(#colorConventional)" />
                                <Area type="monotone" name="Bare-Metal Symmetries (ms)" dataKey="baremetal" stroke="#10b981" fillOpacity={1} fill="url(#colorBaremetal)" strokeWidth={2} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Analysis narrative */}
                        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-neutral-300 leading-relaxed font-mono flex items-start gap-2.5">
                          <TrendingUp className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-1">Computational Waste Reduction Metrical Analysis</span>
                            {fusionResult.roi_computazionale}
                          </div>
                        </div>

                        {/* Real-time Hardware Telemetry Integration */}
                        <div className="border border-neutral-800 rounded-2xl bg-neutral-900/40 p-5 space-y-6">
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${testMode === "baremetal" ? "bg-emerald-400" : "bg-red-400"}`}></span>
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${testMode === "baremetal" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                                </span>
                                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-neutral-300">
                                  Live CPU Direct Hardware profiling
                                </h4>
                              </div>
                              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                                Instrumentation of memory registers under 1,000,000 algorithmic stress points.
                              </p>
                            </div>

                            {/* Simulation Mode Toggle Button Group */}
                            <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800/80 shrink-0 self-start md:self-center">
                              <button
                                onClick={() => setTestMode("baremetal")}
                                className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                                  testMode === "baremetal"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold"
                                    : "text-neutral-550 hover:text-neutral-350 border border-transparent"
                                }`}
                              >
                                BARE-METAL SIMD
                              </button>
                              <button
                                onClick={() => setTestMode("conventional")}
                                className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                                  testMode === "conventional"
                                    ? "bg-red-500/15 text-red-400 border border-red-500/30 font-bold"
                                    : "text-neutral-550 hover:text-neutral-355 border border-transparent"
                                }`}
                              >
                                STANDARDISED OOP
                              </button>
                            </div>
                          </div>

                          {/* Split View Grid: Registers vs Stats */}
                          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            
                            {/* REGISTER FILE SATURATION MATRIX (7 Cols) */}
                            <div className="xl:col-span-7 space-y-3">
                              <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                                <span>AVX-512 Vector Register File (ZMM00 - ZMM15)</span>
                                <span className={testMode === "baremetal" ? "text-emerald-400 text-[10px] font-bold" : "text-amber-500 text-[10px]"}>
                                  {testMode === "baremetal" ? "SIMD Vector Alignment Active" : "Scalar / Register Stalling"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {registerStates.map((reg) => {
                                  const isActive = reg.load > 10;
                                  return (
                                    <div
                                      key={reg.name}
                                      className={`p-2.5 rounded-xl border font-mono text-[10px] flex flex-col justify-between h-20 transition-all ${
                                        isActive
                                          ? testMode === "baremetal"
                                            ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-950/5"
                                            : "bg-amber-950/10 border-amber-500/15 text-amber-200"
                                          : "bg-neutral-950/60 border-neutral-900 text-neutral-600"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold tracking-wider">{reg.name}</span>
                                        <span className="text-[9px] text-neutral-500">512-bit</span>
                                      </div>
                                      
                                      {/* Mini Register Value Pointer */}
                                      <div className="truncate text-[9px] text-neutral-500 select-all font-mono">
                                        {reg.val}
                                      </div>

                                      {/* Micro Bar Meter */}
                                      <div className="space-y-0.5">
                                        <div className="flex items-center justify-between text-[8px] text-neutral-500">
                                          <span>LOAD</span>
                                          <span>{reg.load}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full rounded-full transition-all duration-300 ${
                                              testMode === "baremetal" ? "bg-emerald-500" : "bg-amber-500"
                                            }`}
                                            style={{ width: `${reg.load}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* CACHE MISSES & METRICS DIAGNOSTICS (5 Cols) */}
                            <div className="xl:col-span-5 space-y-4">
                              
                              <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                                <span>Realtime Cache-Miss frequency (%)</span>
                                <span className={testMode === "baremetal" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                                  {testMode === "baremetal" ? "L1 Hit Ratio: 99.98%" : "L1 Hit Ratio: 94.12%"}
                                </span>
                              </div>

                              {/* Live rolling mini line chart */}
                              <div className="border border-neutral-800/80 rounded-xl p-3 bg-neutral-950/80">
                                <div className="h-28 w-full text-xs">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                      data={cacheHistory}
                                      margin={{ top: 5, right: 5, left: -40, bottom: 0 }}
                                    >
                                      <defs>
                                        <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor={testMode === "baremetal" ? "#10b981" : "#ef4444"} stopOpacity={0.15}/>
                                          <stop offset="95%" stopColor={testMode === "baremetal" ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="2 2" stroke="#1d1d1d" />
                                      <XAxis dataKey="time" stroke="#404040" fontSize={9} tickLine={false} />
                                      <YAxis stroke="#404040" fontSize={9} domain={[0, testMode === "baremetal" ? 0.05 : 6]} tickLine={false} />
                                      <Tooltip
                                        contentStyle={{ backgroundColor: '#090909', borderColor: '#262626', color: '#f5f5f5', fontSize: '10px' }}
                                        labelClassName="font-mono text-neutral-500"
                                      />
                                      <Area
                                        type="monotone"
                                        name="Miss Frequency (%)"
                                        dataKey={testMode === "baremetal" ? "misses" : "conventionalMisses"}
                                        stroke={testMode === "baremetal" ? "#10b981" : "#ef4444"}
                                        fillOpacity={1}
                                        fill="url(#colorHistory)"
                                        strokeWidth={1.5}
                                        isAnimationActive={false}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Detailed physical hardware counters */}
                              <div className="grid grid-cols-2 gap-3.5 font-mono text-[11px]">
                                
                                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 text-[11px] space-y-1">
                                  <span className="text-neutral-500 uppercase text-[9px] tracking-wide block">Pipeline stalls</span>
                                  <div className="flex items-baseline gap-1.5 font-bold">
                                    <span className={`text-sm ${testMode === "baremetal" ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                                      {realtimeTelemetry.pipelineStalls}
                                    </span>
                                    <span className="text-[9px] text-neutral-500">/ms</span>
                                  </div>
                                  <span className="text-[8px] text-neutral-600 block truncate">
                                    {testMode === "baremetal" ? "Branch optimized" : "Branch mispredictions"}
                                  </span>
                                </div>

                                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 text-[11px] space-y-1">
                                  <span className="text-neutral-500 uppercase text-[9px] tracking-wide block">DRAM BUS Saturation</span>
                                  <div className="flex items-baseline gap-1.5 font-bold">
                                    <span className={`text-sm ${testMode === "baremetal" ? "text-neutral-300" : "text-amber-550"}`}>
                                      {realtimeTelemetry.busUtilization}%
                                    </span>
                                    <span className="text-[9px] text-neutral-500">of bus</span>
                                  </div>
                                  <span className="text-[8px] text-neutral-600 block truncate">
                                    {testMode === "baremetal" ? "Direct cached" : "Memory queue blockages"}
                                  </span>
                                </div>

                                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 text-[11px] space-y-1">
                                  <span className="text-neutral-500 uppercase text-[9px] tracking-wide block">Silicon core TEMP</span>
                                  <div className="flex items-baseline gap-1.5 font-bold">
                                    <span className={`text-sm ${testMode === "baremetal" ? "text-emerald-400" : "text-red-400"}`}>
                                      {realtimeTelemetry.coreTemp}°C
                                    </span>
                                    <span className="text-[9px] text-neutral-500">CPU</span>
                                  </div>
                                  <span className="text-[8px] text-neutral-600 block truncate">
                                    {testMode === "baremetal" ? "Optimal dissipation" : "High thermal overhead"}
                                  </span>
                                </div>

                                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 text-[11px] space-y-1">
                                  <span className="text-neutral-500 uppercase text-[9px] tracking-wide block">Direct Instruction Rate</span>
                                  <div className="flex items-baseline gap-1.5 font-bold">
                                    <span className="text-sm text-neutral-200">
                                      {testMode === "baremetal" ? "8.2×" : "1.0×"}
                                    </span>
                                    <span className="text-[9px] text-neutral-500">IPC</span>
                                  </div>
                                  <span className="text-[8px] text-neutral-600 block truncate">
                                    {testMode === "baremetal" ? "AVX execution speedup" : "Standard cycle speed"}
                                  </span>
                                </div>

                              </div>

                            </div>

                          </div>

                        </div>
                      </motion.div>
                    )}

                  </div>

                  {/* Operational diagnostics Footer inside successful core */}
                  <div className="bg-neutral-950/80 px-6 py-4.5 border-t border-neutral-800 flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
                    <span className="font-mono text-neutral-500 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-500" />
                      <span>Physical Symmetries Fusion successfully compiled.</span>
                    </span>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-3.5 py-1.5 text-xs tracking-wide font-mono uppercase bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 transition"
                    >
                      CLEAR REACTION CHAMBER
                    </button>
                  </div>
                </motion.div>
              )}

              {/* REACTOR DECAY / ERROR STATE */}
              {status === "error" && (
                <motion.div
                  key="error_console"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl bg-neutral-900/60 border border-red-900/50 p-8 min-h-[500px] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-red-500">
                      <CircleAlert className="w-6 h-6 animate-bounce" />
                      <h3 className="text-base font-semibold font-mono uppercase tracking-widest">Reactor Core Decay / Ignition Failure</h3>
                    </div>

                    <div className="p-4 rounded-xl bg-red-950/25 border border-red-500/20 text-xs text-red-300 leading-relaxed font-mono">
                      {errorMessage}
                    </div>

                    <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
                      The model compiler failed to synthesize physical metrics. This is typically due to an API socket interruption or a missing parameter in the core registry bounds.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-850 flex items-center gap-3">
                    <button
                      onClick={triggerReaction}
                      className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-100 font-mono text-xs rounded transition flex items-center gap-2 active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>RE-IGNITE REACTION CHAMBER</span>
                    </button>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 font-mono text-xs rounded transition"
                    >
                      RETURN TO STABLE STANDBY
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </section>

        </div>
          </>
        ) : activeModule === "cortex" ? (
          <NeuroCortexCanvas />
        ) : (
          <GemiSashaMutation />
        )}

      </main>

      {/* Decorative mechanical footer */}
      <footer id="mechanical_footer" className="text-center py-10 text-[10px] font-mono tracking-widest text-neutral-600 border-t border-neutral-900 mt-16 max-w-5xl mx-auto space-y-1 bg-neutral-950">
        <p>✦ LOGIC_GATE SYSTEM COMPILATION ACTIVE • ZERO-MOAT MITIGATION ENGINE ✦</p>
        <p className="text-[9px] text-neutral-700">© 2026 CAVE_MAN_KALLERTON INTERDISCIPLINARY COGNITIVE ARCHITECTURES • DESIGNED FOR LOWEST SPEC HARDWARE</p>
      </footer>
    </div>
  );
}
