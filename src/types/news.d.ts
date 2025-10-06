// interface NewsType {
//     id: number;
//     title: string;
//     description?: string;
//     img?: string;
//     category?: string;
//     type?: string;
//     // created_at: string;
//     // published_at: string;
// }

// export type { NewsType };

export type NewsType = {
  id: string;
  title: string;
  description?: string;
  img?: string;
  category?: string;
  type: "hero" | "headline" | "medium";
  fact?: number;
  opinion?: number;
  hoax?: number;
};
