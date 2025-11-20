"use server";

import { api } from "@/lib/http";
import { createPaymentDTO, TCreatePaymentDTO } from "@/lib/dto/payment";

export async function generatePaymentLink(body: TCreatePaymentDTO) {
  console.log("Generating payment link", body);
  if (body.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  const { data } = await api.post<{ paymentUrl: string; paymentId: string }>(
    `/payments/create`,
    createPaymentDTO.validateSync(body)
  );
  console.log("Payment link generated", data);
  return data;
}
