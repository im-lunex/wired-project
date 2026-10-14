import Portfolio, { type Pr } from "./portfolio"

async function fetchPrs(): Promise<Pr[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "one-pce-portfolio",
    }
    const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(
      "https://api.github.com/search/issues?q=author:im-lunex+type:pr&sort=updated&order=desc&per_page=100",
      { headers, next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const data = await res.json()

    return (data.items ?? [])
      .filter(
        (it: Record<string, unknown>) =>
          it.state === "open" ||
          ((it.pull_request as Record<string, unknown>)?.merged_at ?? null) !== null,
      )
      .map((it: Record<string, unknown>) => ({
        number: it.number as number,
        title: it.title as string,
        repo: (it.repository_url as string).replace("https://api.github.com/repos/", ""),
        state: (it.state === "open" ? "open" : "merged") as Pr["state"],
        url: it.html_url as string,
        createdAt: it.created_at as string,
        mergedAt:
          ((it.pull_request as Record<string, unknown>)?.merged_at as string | null) ?? null,
        comments: (it.comments as number) ?? 0,
      }))
      .slice(0, 40)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const prs = await fetchPrs()
  return <Portfolio prs={prs} />
}
