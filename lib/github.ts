export interface RepoData {
  name: string;
  fullName: string;
  description: string | null;
  readme: string;
  languages: Record<string, number>;
  size: number;
  stars: number;
  forks: number;
  commits: number;
  url: string;
}

/**
 * Parse a GitHub URL and extract owner/repo.
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^/]+)\/([^/]+)/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.replace(/\.git$/, "").trim().match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  return null;
}

/**
 * Fetch comprehensive repository data from GitHub API.
 */
export async function fetchRepoData(owner: string, repo: string): Promise<RepoData> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RepoScore-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  // Fetch repo info, README, languages, and commits in parallel
  const [repoRes, readmeRes, languagesRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers }),
  ]);

  if (!repoRes.ok) {
    throw new Error(
      repoRes.status === 404
        ? "Repositório não encontrado. Verifique a URL."
        : `Erro da API do GitHub: ${repoRes.status}`
    );
  }

  const repoInfo = await repoRes.json();

  // Get README content
  let readme = "";
  if (readmeRes.ok) {
    readme = await readmeRes.text();
  }

  // Get languages
  let languages: Record<string, number> = {};
  if (languagesRes.ok) {
    languages = await languagesRes.json();
  }

  // Get approximate commit count from Link header
  let commits = 1;
  if (commitsRes.ok) {
    const linkHeader = commitsRes.headers.get("Link");
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        commits = parseInt(lastPageMatch[1], 10);
      }
    }
  }

  return {
    name: repoInfo.name,
    fullName: repoInfo.full_name,
    description: repoInfo.description,
    readme: readme.substring(0, 4000), // Limit README size for the LLM
    languages,
    size: repoInfo.size,
    stars: repoInfo.stargazers_count,
    forks: repoInfo.forks_count,
    commits,
    url: repoInfo.html_url,
  };
}
