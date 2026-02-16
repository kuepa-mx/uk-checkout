"use server";

import { api } from "@/lib/http";
import { Entity } from "@/lib/enum/entity";
import { EntityTypeMap } from "@/lib/types/entity";

export async function getAll<E extends keyof EntityTypeMap, T = EntityTypeMap[E]>(
  entity: E,
  paramsObj?: Record<string, string>
) {
  const params = new URLSearchParams(paramsObj);
  const { data } = await api.get<Page<T>>(`/records/all/${entity}`, {
    params,
  });
  return data;
}

export async function getById<E extends keyof EntityTypeMap, T = EntityTypeMap[E]>(entity: E, id: string): Promise<T> {
  const { data } = await api.get<T>(`/records/byid/${entity}/${id}`);
  return data;
}

export async function create<E extends keyof EntityTypeMap, DTO = DeepPartial<EntityTypeMap[E]>>(entity: E, body: DTO): Promise<EntityTypeMap[E]> {
  const { data } = await api.post<EntityTypeMap[E]>(`/records/${entity}`, body);
  return data;
}

export async function update<T = EntityTypeMap[Entity]>(
  entity: Entity,
  id: string,
  body: DeepPartial<T>
): Promise<T> {
  const { data } = await api.patch<T>(`/records/${entity}/${id}`, body);
  return data;
}
