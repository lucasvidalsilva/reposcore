import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl, fetchRepoData } from "@/lib/github";
import { analyzeWithAI, calculateFinalScore } from "@/lib/ai";
import { rankingStore } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { error: "URL do repositório é obrigatória." },
        { status: 400 }
      );
    }

    // Parse the GitHub URL
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "URL do GitHub inválida. Use o formato: https://github.com/usuario/repositorio" },
        { status: 400 }
      );
    }

    // Fetch repository data from GitHub
    const repoData = await fetchRepoData(parsed.owner, parsed.repo);

    // Analyze with AI
    const scores = await analyzeWithAI(repoData);

    // Calculate final score
    const scoreFinal = calculateFinalScore(scores);

    // Save to ranking
    const entry = rankingStore.addEntry({
      repoUrl: repoData.url,
      repoName: repoData.fullName,
      scoreIdeia: scores.ideia,
      scoreReadme: scores.readme,
      scoreStack: scores.stack,
      scoreFinal,
    });

    // Get position
    const position = rankingStore.getPosition(repoData.url);

    return NextResponse.json({
      id: entry.id,
      repoName: repoData.fullName,
      repoUrl: repoData.url,
      description: repoData.description,
      scores: {
        ideia: scores.ideia,
        readme: scores.readme,
        stack: scores.stack,
      },
      scoreFinal,
      position,
      totalEntries: rankingStore.getAll().length,
    });
  } catch (error) {
    console.error("Erro na análise:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
