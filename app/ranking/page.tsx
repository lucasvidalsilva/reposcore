import Link from "next/link";
import RankingTable from "@/components/RankingTable";

export const metadata = {
  title: "Ranking — RepoScore",
  description: "Veja o ranking dos repositórios GitHub avaliados pela IA do RepoScore.",
};

export default function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ repo?: string }>;
}) {
  return (
    <main className="relative z-10 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-mono transition-colors duration-150 inline-flex items-center gap-2"
              style={{ color: "var(--color-text-muted)" }}
              id="back-to-home-link"
            >
              ← Voltar
            </Link>
            <h1
              className="text-3xl md:text-4xl font-bold mt-4 tracking-tight"
              style={{ letterSpacing: "-0.03em" }}
            >
              Ranking{" "}
              <span style={{ color: "var(--color-primary)" }}>Global</span>
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Os melhores repositórios avaliados pela comunidade
            </p>
          </div>

          <Link href="/" className="btn-primary text-sm" id="analyze-new-btn">
            + Analisar
          </Link>
        </div>

        {/* Ranking Table */}
        <div className="launcher-window overflow-hidden">
          <RankingTableWrapper />
        </div>
      </div>
    </main>
  );
}

async function RankingTableWrapper() {
  return <RankingTable />;
}
