"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ScoreCardProps {
  repoName: string;
  repoUrl: string;
  scores: {
    ideia: number;
    readme: number;
    stack: number;
  };
  scoreFinal: number;
  position: number;
  totalEntries: number;
}

function AnimatedScore({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setHasStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let current = 0;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, hasStarted]);

  return <span>{display}</span>;
}

function ScoreBar({
  label,
  score,
  delay,
}: {
  label: string;
  score: number;
  delay: number;
}) {
  const getBarColor = (score: number) => {
    if (score >= 80) return "#28c840";
    if (score >= 60) return "#FFC531";
    if (score >= 40) return "#ff9500";
    return "#ff5f57";
  };

  return (
    <div className="space-y-2" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </span>
        <span className="text-sm font-mono font-bold" style={{ color: getBarColor(score) }}>
          <AnimatedScore value={score} delay={delay} />
          <span style={{ color: "var(--color-text-muted)" }}>/100</span>
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-surface-hover)" }}
      >
        <div
          className="score-bar-fill h-full rounded-full"
          style={{
            "--score-width": `${score}%`,
            background: getBarColor(score),
            animationDelay: `${delay}ms`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({
  repoName,
  scores,
  scoreFinal,
  position,
  totalEntries,
}: ScoreCardProps) {
  return (
    <div className="animate-slide-up w-full max-w-2xl mx-auto px-6">
      <div className="launcher-window p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            Resultado da Análise
          </p>
          <h2
            className="text-lg font-medium font-mono"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {repoName}
          </h2>
        </div>

        {/* Big Score */}
        <div className="text-center py-6">
          <div
            className="animate-count-up inline-block"
            style={{
              animationDelay: "200ms",
              opacity: 0,
            }}
          >
            <div
              className="text-7xl md:text-8xl font-bold tracking-tighter"
              style={{ color: "var(--color-primary)" }}
            >
              <AnimatedScore value={Math.round(scoreFinal)} delay={200} />
            </div>
            <div
              className="text-sm font-mono uppercase tracking-widest mt-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Score Final
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-5">
          <ScoreBar label="💡 Criatividade & Utilidade" score={scores.ideia} delay={400} />
          <ScoreBar label="📖 Qualidade do README" score={scores.readme} delay={600} />
          <ScoreBar label="⚙️ Esforço Técnico" score={scores.stack} delay={800} />
        </div>

        {/* Position badge */}
        <div
          className="text-center py-4 rounded-lg"
          style={{ background: "var(--color-primary-dim)" }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            🏆 Posição #{position} de {totalEntries} projetos avaliados
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/ranking" className="btn-primary" id="view-ranking-btn">
            Ver Ranking
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
            style={{
              background: "var(--color-surface-hover)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
            id="analyze-another-btn"
          >
            Analisar outro
          </button>
        </div>
      </div>
    </div>
  );
}
