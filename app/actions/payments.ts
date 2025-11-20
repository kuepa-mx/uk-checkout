"use server";

import { api } from "@/lib/http";
import { createPaymentDTO, TCreatePaymentDTO } from "@/lib/dto/payment";

export async function generatePaymentLink(body: TCreatePaymentDTO) {
  const log = (message: string) => {
    console.log(
      `[${body.checkout_id.slice(0, 8)}] [${body.lead_id.slice(
        0,
        8
      )}] ${message}`
    );
  };

  if (body.amount <= 0) {
    log(`Amount must be greater than 0`);
    throw new Error("Amount must be greater than 0");
  }
  log(`Generating Payment link.\n${JSON.stringify(body, null, 2)}`);
  const { data } = await api.post<{ paymentUrl: string; paymentId: string }>(
    `/payments/create`,
    createPaymentDTO.validateSync(body)
  );
  log(`Payment link generated.\n${JSON.stringify(data, null, 2)}`);
  return data;
}
