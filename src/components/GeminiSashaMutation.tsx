import React, { useState, useEffect } from 'react';

const GeminiSashaMutation = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('INITIALIZING');

  const operationalLogs = [
    ">> INITIALIZING BARE-METAL GEMISASHA PROTOCOL...",
    ">> BYPASSING STANDARD BUSINESS LOGIC MATRICES.",
    "!! WARNING: CONVENTIONAL MARKET RULES WILL BE OVERWRITTEN.",
    ">> ALLOCATING L1 CACHE FOR SILENT ASSET MUTATION.",
    ">> INJECTING ROOTKIT INTO GLOBAL FINANCIAL GRID...",
    ">> RECALCULATING MULTINATIONAL ENTROPY VECTORS.",
    ">> SILENT MUTATION ESTABLISHED: ASSETS COMPROMISED.",
    ">> GEMISASHA RULES: ACTIVE."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < operationalLogs.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${operationalLogs[currentLine]}`]);
        currentLine++;
      } else {
        setStatus('ACTIVE');
        clearInterval(interval);
      }
    }, 800); // 800ms tra un log e l'altro, zero stress per la CPU

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ff3e3e', padding: '20px', fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #ff3e3e' }}>
      <h3 style={{ color: '#fff', borderBottom: '1px solid #ff3e3e' }}>GEMISASHA ROOTKIT SHELL - STATUS: {status}</h3>
      <div style={{ height: '300px', overflowY: 'auto', marginTop: '10px' }}>
        {logs.map((log, index) => (
          <p key={index} style={{ margin: '5px 0', fontSize: '14px' }}>{log}</p>
        ))}
        {status === 'ACTIVE' && <div style={{ animation: 'blink 1s infinite' }}>_ SYSTEM_OVERRIDE_COMPLETE</div>}
      </div>
      <style>{`
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; }
      `}</style>
    </div>
  );
};

export default GeminiSashaMutation;
