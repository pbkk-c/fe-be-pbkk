export interface Content {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  title: string;
  raw_text: string;
  published_at: string;
  collected_at: string;
  creator_name: string;
  topic: string;
  type: string;
  analyses: {
    created_at: string;
    fact_percentage: number;
    hoax_percentage: number;
    opinion_percentage: number;
  }[];
}

// export async function fetchContents(page = 1, limit = 10): Promise<Content[]> {
//   const res = await fetch(`/api/content?page=${page}&limit=${limit}`);
//   if (!res.ok) throw new Error("Failed to fetch contents");
//   return res.json();
// }