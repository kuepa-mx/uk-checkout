"use server";

import { getById, update } from "./entity";
import { Entity } from "../enum/entity";

export async function getLead(id: string) {
  return await getById<TLead>(Entity.LEAD, id);
}

export async function updateLead(id: string, body: DeepPartial<TLead>) {
  return await update<TLead>(Entity.LEAD, id, body);
}
