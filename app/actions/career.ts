"use server";

import { getAll } from "./entity";
import { Entity } from "@/lib/enum/entity";

export async function getCareers(): Promise<TCareer[]> {
  const { data } = await getAll<TCareer>(Entity.CAREER, {
    limit: "1000",
  });
  return data;
}

export async function getCareerCost(accountId: string, countryId: string) {
  const { data } = await getAll<TCost>(Entity.COST, {
    where: JSON.stringify({
      pais: {
        pais_id: countryId,
      },
      cuenta: {
        cuenta_id: accountId,
      },
    }),
    limit: "1",
  });
  return data[0];
}
