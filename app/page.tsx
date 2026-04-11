"use client";

import { useState } from "react";
import HeroInput from "@/components/HeroInput";
import AnalysisTerminal from "@/components/AnalysisTerminal";
import ScoreCard from "@/components/ScoreCard";

type Phase = "input" | "analyzing" | "result" | "error";

interface AnalysisResult {
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

export default function Home() {
  const [phase, setPhase] = useState<Phase>("input");
  const [repoName, setRepoName] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
    // Extract repo name for terminal display
    const parts = url.replace(/\.git$/, "").split("/");
    const name = parts.slice(-2).join("/") || url;
    setRepoName(name);
    setPhase("analyzing");
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro na análise.");
      }

      setResult(data);

      // Wait for terminal animation to finish before showing result
      setTimeout(() => {
        setPhase("result");
      }, 5800);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido.";
      setError(message);

      // Still wait for terminal to show some progress
      setTimeout(() => {
        setPhase("error");
      }, 2000);
    }
  };

  return (
    <main className="relative z-10 flex-1 flex items-center justify-center min-h-screen py-12">
      {/* Hero Input Phase */}
      {phase === "input" && <HeroInput onSubmit={handleAnalyze} />}

      {/* Analysis Terminal Phase */}
      {phase === "analyzing" && (
        <AnalysisTerminal repoName={repoName} />
      )}

      {/* Result Phase */}
      {phase === "result" && result && (
        <ScoreCard
          repoName={result.repoName}
          repoUrl={result.repoUrl}
          scores={result.scores}
          scoreFinal={result.scoreFinal}
          position={result.position}
          totalEntries={result.totalEntries}
        />
      )}

      {/* Error Phase */}
      {phase === "error" && (
        <div className="animate-slide-up w-full max-w-2xl mx-auto px-6">
          <div className="launcher-window p-8 text-center space-y-6">
            <div className="text-4xl">⚠️</div>
            <div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Erro na análise
              </h2>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {error}
              </p>
            </div>
            <button
              onClick={() => {
                setPhase("input");
                setError("");
              }}
              className="btn-primary"
              id="try-again-btn"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
