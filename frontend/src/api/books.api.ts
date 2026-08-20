import { http } from "./http";

export interface Book {
  id: number;
  isbn: string;
  title: string;
  stock: number;
  is_available: boolean;
  created_at: string;
}

export async function listBooksApi() {
  const res = await http.get("/api/books/");
  return res.data;
}

export async function createBookApi(data: Partial<Book>) {
  const res = await http.post("/api/books/", data);
  return res.data;
}
