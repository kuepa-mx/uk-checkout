"use server";

import { api } from "@/lib/http";
import { Entity } from "@/lib/enum/entity";

export async function getAll<T>(
  entity: Entity,
  paramsObj?: Record<string, string>
): Promise<Page<T>> {
  const params = new URLSearchParams(paramsObj);
  const { data } = await api.get<Page<T>>(`/records/all/${entity}`, {
    params,
  });
  return data;
}

export async function getById<T>(entity: Entity, id: string): Promise<T> {
  const { data } = await api.get<T>(`/records/byid/${entity}/${id}`);
  return data;
}

export async function create<T, DTO>(entity: Entity, body: DTO): Promise<T> {
  const { data } = await api.post<T>(`/records/${entity}`, body);
  return data;
}

export async function update<T>(
  entity: Entity,
  id: string,
  body: DeepPartial<T>
): Promise<T> {
  const { data } = await api.patch<T>(`/records/${entity}/${id}`, body);
  return data;
}
