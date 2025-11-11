"use server";

import { TCheckout } from "../types/checkout";

const API_URL = "https://qa.universidaduk.com";

export async function getCareers(): Promise<TCareer[]> {
  const response = await fetch(`${API_URL}/records/all/carrera?limit=100`, {
    method: "GET",
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch careers");
  }
  const { data } = (await response.json()) as Page<TCareer>;
  return data;
}

export async function getCareerCost(accountId: string, countryId: string) {
  const params = new URLSearchParams();
  params.set(
    "where",
    JSON.stringify({
      pais: {
        pais_id: countryId,
      },
      cuenta: {
        cuenta_id: accountId,
      },
    })
  );

  // {
  //   "data": [
  //     {
  //       "costo_id": "00335597-f129-46ea-a88c-4336c27bdb51",
  //       "costo_carrera": 14364,
  //       "costo_activo": true,
  //       "cuenta": {
  //         "cuenta_id": "0c8879e9-0d77-4af3-bc0d-80bdb3230814",
  //         "cuenta_tipo": "Ingenieria en Inteligencia Artificial",
  //         "cuenta_cantidad_cuotas": 36,
  //         "cuenta_activo": true
  //       },
  //       "pais": {
  //         "pais_id": "cf30e37d-e17e-4c2e-a2f3-aa1f95945303",
  //         "pais_nombre": "Peru",
  //         "pais_moneda": "Soles Peruanos",
  //         "pais_activo": true
  //       }
  //     }
  //   ],
  //   "total": 1,
  //   "page": 1,
  //   "limit": 10
  // }
  const response = await fetch(
    `${API_URL}/records/all/costo?${params.toString()}`,
    {
      method: "GET",
    }
  );
  const { data } = (await response.json()) as Page<TCost>;

  if (!data || data.length === 0) {
    throw new Error("Cost not found");
  }
  return data[0];
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
  if (response.status !== 200) {
    throw new Error("Failed to fetch discounts");
  }
  const { data } = (await response.json()) as Page<TDiscount>;
  return data.filter((discount) =>
    discount_whitelist.includes(discount.descuento_id)
  );
}

export async function getGroupsByCareerCode(careerCode: string) {
  const params = new URLSearchParams();
  params.set(
    "where",
    JSON.stringify({
      grupo_codigo: careerCode,
    })
  );
  params.set("limit", "1000");

  console.log("Getting groups by career code", careerCode);
  const response = await fetch(
    `${API_URL}/records/all/grupo?${params.toString()}`,
    {
      method: "GET",
    }
  );
  if (response.status !== 200) {
    console.error(await response.text(), response.status);
    throw new Error("Failed to fetch groups");
  }
  const { data, total } = (await response.json()) as Page<TGrupo>;

  // if (total === 0) {
  //   throw new Error("No groups found for career code " + careerCode);
  // }

  return data;
}

export async function getLead(id: string) {
  const response = await fetch(`${API_URL}/records/byid/lead/${id}`, {
    method: "GET",
  });
  const data = (await response.json()) as TLead;
  return data;
}

export async function updateLead(id: string, body: DeepPartial<TLead>) {
  console.log("Updating lead", id, body);
  const response = await fetch(`${API_URL}/records/lead/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as TLead;
  return data;
}

export async function getCheckout(checkoutId: string): Promise<TCheckout> {
  const response = await fetch(`${API_URL}/checkout/${checkoutId}`);
  if (response.status !== 200) {
    console.error(await response.text(), response.status);
    throw new Error("Failed to fetch checkout");
  }
  const data = (await response.json()) as TCheckout;
  return data;
}

export async function updateCheckoutStartingDate(
  checkoutId: string,
  fecha_inicio: string
) {
  console.log("Updating checkout starting date", checkoutId, fecha_inicio);
  const response = await fetch(
    `${API_URL}/checkout/${checkoutId}/fecha-inicio`,
    {
      method: "PATCH",
      body: JSON.stringify({ fecha_inicio }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    console.error(await response.text(), response.status);
    throw new Error("Failed to update checkout");
  }
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

  if (response.status !== 200) {
    console.error(await response.text(), response.status);
    throw new Error("Failed to create checkout");
  }

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
  // throw new Error("Not implemented");

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
