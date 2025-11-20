"use server";

import { api } from "../http";

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
