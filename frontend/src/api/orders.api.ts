import { http } from "./http";

export type OrderStatus = "RECEIVED" | "PACKING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface Order {
  id: number;
  book: number;
  book_title?: string;
  book_isbn?: string;
  customer_name: string;
  status: OrderStatus;
  order_time: string;
  created_at: string;
}

export async function listOrdersApi() {
  const res = await http.get("/api/orders/");
  return res.data;
}

export async function createOrderApi(data: Partial<Order>) {
  const res = await http.post("/api/orders/", data);
  return res.data;
}
