"use server";

import { TCheckout } from "../types/checkout";

const API_URL = "https://lead.universidaduk.com";

export async function getCareers(): Promise<TCareer[]> {
  const response = await fetch(`${API_URL}/records/all/carrera?limit=100`, {
    method: "GET",
  });
  const { data } = (await response.json()) as Page<TCareer>;
  return data;
}

export async function getDiscounts(): Promise<TDiscount[]> {
  const discount_whitelist = [
    "5596f3c7-f73f-43db-a130-c018be03e7f7", // Pago Mensual
    "cf4cacc4-ca5a-458c-8ebf-31253abb8cc8", // Pago Cuatrimestral
    "05f470ed-eb9d-44f3-82c7-0b8e989f394c", // Pago Completo
  ];
  const response = await fetch(`${API_URL}/records/all/descuento?limit=100`, {
    method: "GET",
  });
  const { data } = (await response.json()) as Page<TDiscount>;
  return data.filter((discount) =>
    discount_whitelist.includes(discount.descuento_id)
  );
}

export async function getLead(id: string) {
  const response = await fetch(`${API_URL}/records/byid/lead/${id}`, {
    method: "GET",
  });
  const data = (await response.json()) as TLead;
  return data;
}

export async function updateLead(id: string, body: DeepPartial<TLead>) {
  const response = await fetch(`${API_URL}/records/lead/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as TLead;
  return data;
}

export async function getCheckout(checkoutId: string): Promise<TCheckout> {
  return {
    checkout_id: "1d2087cc-febb-4d9f-b975-5499ff18943b",
    checkout_url: "/checkout/1d2087cc-febb-4d9f-b975-5499ff18943b",
    checkout_status: "created",
    expires_at: "2025-12-05T18:42:02.808Z",
    lead_id: "01d72748-2a64-45e1-a092-40ab4dae6950",
    lead: {
      lead_id: "01d72748-2a64-45e1-a092-40ab4dae6950",
      nombre: "John Doe",
      email: "john.doe@example.com",
      telefono: "1234567890",
      telefono_lada: "123",
      fecha_creacion: "2025-01-01T00:00:00.000Z",
      hora_creacion: "00:00:00",
      contactado_sin_exito: false,
      carrera: {
        carrera_nombre: "Computer Science",
        carrera_activo: true,
        carrera_codigo: "CS",
        carrera_id: "1234567890",
      },
    },
  } as TCheckout;

  const response = await fetch(`${API_URL}/checkout/${checkoutId}`);
  const data = (await response.json()) as TCheckout;
  return data;
}

type TCreateCheckout = {
  lead_id: string;
  owner_email: string;
};

export async function createCheckout({
  lead_id,
  owner_email,
}: TCreateCheckout) {
  const response = await fetch(`${API_URL}/checkout/session/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lead_id,
      generated_by_type: "operator",
      owner_email,
    }),
  });
  const data = (await response.json()) as TCheckout;
  return data;
}

export async function computeTotalAmount(
  checkoutId: string,
  discountId: string,
  options: {
    signal?: AbortSignal;
  } = {}
) {
  throw new Error("Not implemented");

  const response = await fetch(
    `${API_URL}/checkout/${checkoutId}/calculate-payment?descuento_id=${discountId}`,
    {
      method: "POST",
      signal: options.signal,
    }
  );

  const data = (await response.json()) as { monto_final: number };
  return data.monto_final;
}
