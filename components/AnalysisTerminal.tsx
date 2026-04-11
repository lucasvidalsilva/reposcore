"use client";

import { useState, useEffect, useRef } from "react";

interface AnalysisTerminalProps {
  repoName: string;
  onComplete?: () => void;
}

const LOG_LINES = [
  { text: "Conectando ao GitHub...", delay: 0 },
  { text: "Repositório encontrado ✓", delay: 600 },
  { text: "Lendo README.md...", delay: 1000 },
  { text: "Extraindo metadados do repositório...", delay: 1500 },
  { text: "Mapeando linguagens e stack técnica...", delay: 2100 },
  { text: "Calculando complexidade do código...", delay: 2700 },
  { text: "IA analisando Fator Criatividade...", delay: 3200 },
  { text: "IA analisando Qualidade de Documentação...", delay: 3800 },
  { text: "IA analisando Esforço Técnico...", delay: 4400 },
  { text: "Calibrando Score Final...", delay: 5000 },
];

export default function AnalysisTerminal({ repoName, onComplete }: AnalysisTerminalProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    LOG_LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto px-6">
      <div className="launcher-window overflow-hidden">
        {/* Terminal header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span
            className="text-xs font-mono"
            style={{ color: "var(--color-text-muted)" }}
          >
            reposcore — análise de {repoName}
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={containerRef}
          className="p-5 font-mono text-sm space-y-2 max-h-80 overflow-y-auto"
          style={{ minHeight: "200px" }}
        >
          {LOG_LINES.slice(0, visibleLines).map((line, index) => (
            <div
              key={index}
              className="animate-type-in flex items-start gap-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span style={{ color: "var(--color-primary)" }}>[+]</span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                {line.text}
              </span>
              {index === visibleLines - 1 && visibleLines < LOG_LINES.length && (
                <span
                  className="animate-blink ml-1"
                  style={{ color: "var(--color-primary)" }}
                >
                  █
                </span>
              )}
            </div>
          ))}

          {visibleLines >= LOG_LINES.length && (
            <div className="animate-type-in mt-4 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
              <span style={{ color: "var(--color-primary)" }}>
                [✓] Análise completa!
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="h-0.5"
          style={{ background: "var(--color-surface-hover)" }}
        >
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${(visibleLines / LOG_LINES.length) * 100}%`,
              background: "var(--color-primary)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
