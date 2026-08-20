import { http } from "./http";

export interface ShippingLabel {
  id: string;
  order_id: number;
  carrier: string;
  tracking_number: string;
  address: string;
  estimated_delivery?: string;
  created_at?: string;
}

export async function getShippingLabelsApi(order_id?: number): Promise<ShippingLabel[]> {
  const params = order_id ? { order_id } : {};
  const res = await http.get("/api/shipping-labels/", { params });
  return res.data;
}
