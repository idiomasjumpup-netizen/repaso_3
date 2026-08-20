import { http } from "./http";

export interface Publisher {
  id: string;
  name: string;
  code: string;
  country: string;
  is_active: boolean;
  created_at: string;
}

export async function getPublishersApi(): Promise<Publisher[]> {
  const res = await http.get("/api/publishers/");
  return res.data;
}
