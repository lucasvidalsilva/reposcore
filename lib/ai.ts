import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RepoData } from "./github";

export interface AIScores {
  ideia: number;
  readme: number;
  stack: number;
}

const SYSTEM_PROMPT = `Você é um avaliador profissional de projetos de software. Sua tarefa é analisar repositórios GitHub e avaliar o esforço, criatividade e organização.

Analise os dados fornecidos e retorne APENAS um JSON válido (sem markdown, sem código, apenas o JSON puro) com notas de 0 a 100 para:

- "ideia": criatividade e utilidade do projeto (originalidade da proposta, potencial de uso real, diferenciação de projetos existentes)
- "readme": clareza, formatação e completude da documentação (tem introdução? instalação? exemplos? badges? screenshots?)
- "stack": peso e esforço técnico da stack (complexidade das linguagens, diversidade tecnológica, uso de frameworks, volume de código)

Seja justo mas exigente. Projetos "hello world" devem receber notas baixas. Projetos bem estruturados e criativos devem ser recompensados.

Formato de resposta OBRIGATÓRIO:
{"ideia": <número>, "readme": <número>, "stack": <número>}`;

/**
 * Analyze repository data using Google Gemini to produce scores.
 */
export async function analyzeWithAI(repoData: RepoData): Promise<AIScores> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback: generate heuristic-based scores when no API key is available
    return generateFallbackScores(repoData);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const languagesSummary = Object.entries(repoData.languages)
    .map(([lang, bytes]) => `${lang}: ${bytes} bytes`)
    .join(", ");

  const userPrompt = `Analise este repositório GitHub:

**Nome:** ${repoData.fullName}
**Descrição:** ${repoData.description || "Sem descrição"}
**Tamanho:** ${repoData.size} KB
**Estrelas:** ${repoData.stars}
**Forks:** ${repoData.forks}
**Commits (aprox):** ${repoData.commits}
**Linguagens:** ${languagesSummary || "Nenhuma detectada"}

**README.md:**
${repoData.readme || "Sem README"}

Retorne o JSON com as notas.`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    const responseText = result.response.text().trim();

    // Extract JSON from the response (handle markdown code blocks if present)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("IA não retornou JSON válido");
    }

    const scores = JSON.parse(jsonMatch[0]) as AIScores;

    // Validate scores are in range
    return {
      ideia: clamp(Math.round(scores.ideia), 0, 100),
      readme: clamp(Math.round(scores.readme), 0, 100),
      stack: clamp(Math.round(scores.stack), 0, 100),
    };
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    return generateFallbackScores(repoData);
  }
}

/**
 * Heuristic-based fallback when no AI API key is available.
 */
function generateFallbackScores(repoData: RepoData): AIScores {
  // README score: based on length and presence
  let readmeScore = 10;
  if (repoData.readme.length > 100) readmeScore = 30;
  if (repoData.readme.length > 500) readmeScore = 50;
  if (repoData.readme.length > 1500) readmeScore = 70;
  if (repoData.readme.length > 3000) readmeScore = 85;

  // Stack score: based on number of languages and size
  const langCount = Object.keys(repoData.languages).length;
  let stackScore = Math.min(langCount * 15, 60);
  if (repoData.size > 100) stackScore += 10;
  if (repoData.size > 1000) stackScore += 15;
  if (repoData.commits > 10) stackScore += 10;
  stackScore = Math.min(stackScore, 95);

  // Idea score: based on description, readme quality, and overall effort
  let ideaScore = 20;
  if (repoData.description) ideaScore += 15;
  if (repoData.readme.length > 500) ideaScore += 20;
  if (repoData.stars > 0) ideaScore += 10;
  if (repoData.commits > 20) ideaScore += 15;
  ideaScore = Math.min(ideaScore, 90);

  return {
    ideia: ideaScore,
    readme: readmeScore,
    stack: stackScore,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate the final weighted score.
 * Weights: ideia 40%, readme 30%, stack 30%
 */
export function calculateFinalScore(scores: AIScores): number {
  const final = scores.ideia * 0.4 + scores.readme * 0.3 + scores.stack * 0.3;
  return Math.round(final * 100) / 100;
}
