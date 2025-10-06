export type Content = {
  id: string;
  title: string;
  platform: string;
  url: string;
  collected_at: string;
  analyses: {
    fact_percentage: number;
    opinion_percentage: number;
    hoax_percentage: number;
    created_at: string;
  }[];
};

export async function fetchContents(page = 1, limit = 10): Promise<Content[]> {
  const res = await fetch(`/api/content?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch contents");
  return res.json();
}
