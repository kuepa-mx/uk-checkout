"use server";

import { api } from "@/lib/http";

export async function getCheckout(
  checkoutId: string
): Promise<TCheckout | null> {
  const { data } = await api
    .get<TCheckout | null>(`/checkout/${checkoutId}`)
    .catch(() => {
      console.error("No checkout found for checkout ID", checkoutId);
      return { data: null };
    });
  return data;
}

export async function updateCheckout(
  checkoutId: string,
  body: TUpdateCheckoutDTO
) {
  console.log("Updating checkout", checkoutId, body);
  const { data } = await api.patch<TCheckout>(`/checkout/${checkoutId}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Updated checkout", data);
  return data;
}

export async function computeTotalAmount(
  checkoutId: string,
  discountId: string
) {
  const { data } = await api.post<{
    monto_final: number;
    descuento_porcentaje: number;
    monto_neto: number;
    monto_cuota: number;
  }>(`/checkout/${checkoutId}/calculate-payment?descuento_id=${discountId}`);
  return data;
}
