"use server";

import { api } from "../http";
import { createPaymentDTO, TCreatePaymentDTO } from "./dto/payment";

export async function getDiscounts(): Promise<TDiscount[]> {
  const params = new URLSearchParams();
  params.set("limit", "100");
  params.set(
    "where",
    JSON.stringify({
      checkout: true,
    })
  );
  const { data } = await api.get<Page<TDiscount>>(
    `/records/all/descuento?${params.toString()}`
  );
  if (data.data?.length === 0) {
    console.error("No discounts found for checkout");
    return [];
  }
  return data.data;
}

export async function getGroupsByCareerCodeAndOpeningDate(
  careerCode: string,
  openingDate: string
) {
  const params = new URLSearchParams();
  params.set(
    "where",
    JSON.stringify({
      grupo_nombre: `${careerCode}_${openingDate}`,
    })
  );
  params.set("limit", "1000");

  const { data } = await api.get<Page<TGrupo>>(
    `/records/all/grupo?${params.toString()}`
  );
  return data.data;
}

export async function generatePaymentLink(body: TCreatePaymentDTO) {
  console.log("Generating payment link", body);
  if (body.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  // {
  //   "paymentUrl": "https://payment.flywire.com/orders/8b9dce15-5bf9-47d3-9450-72741ffa1a62?token=32eed206-58fe-4606-9ce6-6a515c0c03cb&platform=json_gateway",
  //   "paymentId": "f87b2801-e4c8-42a0-8cb2-ede50c56772d"
  // }
  const { data } = await api.post<{ paymentUrl: string; paymentId: string }>(
    `/payments/create`,
    createPaymentDTO.validateSync(body)
  );
  console.log("Payment link generated", data);
  return data;
}
