export interface RankingEntry {
  id: string;
  repoUrl: string;
  repoName: string;
  scoreIdeia: number;
  scoreReadme: number;
  scoreStack: number;
  scoreFinal: number;
  analyzedAt: string;
}

/**
 * In-memory store for ranking data.
 * This will be replaced by Supabase integration later.
 *
 * Note: Data is lost on server restart. This is intentional for the MVP.
 */
class RankingStore {
  private entries: RankingEntry[] = [];

  addEntry(entry: Omit<RankingEntry, "id" | "analyzedAt">): RankingEntry {
    const newEntry: RankingEntry = {
      ...entry,
      id: crypto.randomUUID(),
      analyzedAt: new Date().toISOString(),
    };

    // Replace existing entry for same repo
    this.entries = this.entries.filter((e) => e.repoUrl !== entry.repoUrl);
    this.entries.push(newEntry);

    // Sort by score descending
    this.entries.sort((a, b) => b.scoreFinal - a.scoreFinal);

    return newEntry;
  }

  getAll(): RankingEntry[] {
    return [...this.entries].sort((a, b) => b.scoreFinal - a.scoreFinal);
  }

  getByRepoUrl(repoUrl: string): RankingEntry | undefined {
    return this.entries.find((e) => e.repoUrl === repoUrl);
  }

  getPosition(repoUrl: string): number {
    const sorted = this.getAll();
    return sorted.findIndex((e) => e.repoUrl === repoUrl) + 1;
  }
}

// Singleton instance
const globalStore = globalThis as unknown as { rankingStore: RankingStore };

if (!globalStore.rankingStore) {
  globalStore.rankingStore = new RankingStore();
}

export const rankingStore = globalStore.rankingStore;
