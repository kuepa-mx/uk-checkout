"use server";

import { getAll } from "./entity";
import { Entity } from "@/lib/enum/entity";

export async function getCareers() {
  const { data } = await getAll(Entity.CAREER, {
    limit: "1000",
  });
  return data;
}

export async function getCareerCost(accountId: string, countryId: string) {
  const { data } = await getAll(Entity.COST, {
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
