import React, { useEffect, useRef } from 'react';

interface CanvasProps {
  voltage: number;
  resistance: number;
  plasticity: number;
  frequency: number;
}

export const NeuroCortexCanvas: React.FC<CanvasProps> = ({
  voltage,
  resistance,
  plasticity,
  frequency
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 1.5;

      // Onde corticali estetiche fisse (Simulazione)
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.sin(x * 0.02 + angle) * (voltage * 0.5) * Math.cos(x * 0.005);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Nodi sinaptici di puro contorno estetico
      ctx.fillStyle = '#ff3366';
      for (let i = 1; i < 5; i++) {
        const nodeX = (canvas.width / 5) * i;
        const nodeY = canvas.height / 2 + Math.sin(nodeX * 0.02 + angle) * (voltage * 0.5);
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 4 + plasticity, 0, Math.PI * 2);
        ctx.fill();
      }

      angle += (frequency * 0.005) / (resistance * 0.01 || 1);
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [voltage, resistance, plasticity, frequency]);

  return (
    <div className="border border-zinc-800 bg-black/50 rounded p-4 flex flex-col items-center">
      <canvas ref={canvasRef} width={600} height={300} className="w-full bg-zinc-950/80 rounded border border-zinc-900" />
    </div>
  );
};