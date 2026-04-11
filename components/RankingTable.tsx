"use client";

import { useEffect, useState } from "react";

interface RankingEntry {
  id: string;
  repoUrl: string;
  repoName: string;
  scoreIdeia: number;
  scoreReadme: number;
  scoreStack: number;
  scoreFinal: number;
  analyzedAt: string;
}

interface RankingTableProps {
  currentRepoUrl?: string;
}

export default function RankingTable({ currentRepoUrl }: RankingTableProps) {
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ranking")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div
          className="animate-blink text-2xl"
          style={{ color: "var(--color-primary)" }}
        >
          ■
        </div>
        <p
          className="mt-4 text-sm font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          Carregando ranking...
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <p
          className="text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Nenhum projeto avaliado ainda.
        </p>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Seja o primeiro! Volte para a página inicial e analise um repositório.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table header */}
      <div
        className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-mono uppercase tracking-widest"
        style={{
          color: "var(--color-text-muted)",
          borderBottom: "1px solid var(--color-border-strong)",
        }}
      >
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-7">Projeto</div>
        <div className="col-span-4 text-right">Score</div>
      </div>

      {/* Table rows */}
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {entries.map((entry, index) => {
          const isCurrent = currentRepoUrl && entry.repoUrl === currentRepoUrl;
          const position = index + 1;

          return (
            <div
              key={entry.id}
              className="animate-fade-in grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors duration-150"
              style={{
                animationDelay: `${index * 80}ms`,
                opacity: 0,
                background: isCurrent
                  ? "var(--color-surface-active)"
                  : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isCurrent)
                  e.currentTarget.style.background = "var(--color-surface-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isCurrent)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Position */}
              <div className="col-span-1 text-center">
                <span
                  className="font-mono font-bold text-lg"
                  style={{
                    color: isCurrent
                      ? "var(--color-primary)"
                      : position <= 3
                        ? "var(--color-primary)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {position}
                </span>
              </div>

              {/* Project info */}
              <div className="col-span-7">
                <a
                  href={entry.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline inline-flex items-center gap-2"
                  style={{
                    color: isCurrent
                      ? "var(--color-primary)"
                      : "var(--color-text-primary)",
                  }}
                >
                  {entry.repoName}
                  {isCurrent && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "var(--color-primary-dim)",
                        color: "var(--color-primary)",
                      }}
                    >
                      SEU
                    </span>
                  )}
                </a>
                <div
                  className="text-xs font-mono mt-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {new Date(entry.analyzedAt).toLocaleDateString("pt-BR")}
                </div>
              </div>

              {/* Score */}
              <div className="col-span-4 text-right">
                <span
                  className={`font-mono font-bold text-xl ${
                    !isCurrent ? "blur-md select-none" : ""
                  }`}
                  style={{
                    color: isCurrent
                      ? "var(--color-primary)"
                      : "var(--color-text-primary)",
                    transition: "filter 0.3s ease",
                  }}
                >
                  {entry.scoreFinal.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        className="text-center py-6 text-xs font-mono"
        style={{ color: "var(--color-text-muted)" }}
      >
        🔒 As notas dos outros projetos são secretas —{" "}
        <span style={{ filter: "blur(4px)", userSelect: "none" }}>
          apenas o seu projeto
        </span>{" "}
        é revelado
      </div>
    </div>
  );
}
