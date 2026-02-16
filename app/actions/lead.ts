"use server";

import { getById, update } from "./entity";
import { Entity } from "@/lib/enum/entity";

export async function getLead(id: string) {
  return await getById(Entity.LEAD, id);
}

export async function updateLead(id: string, body: DeepPartial<TLead>) {
  return await update(Entity.LEAD, id, body);
}
