"use server";

import { TCheckoutForm } from "@/components/checkout-form";

const API_URL = "https://qa.universidaduk.com";

async function apiRequest<T>(
  url: string,
  options: RequestInit,
  { onError }: { onError?: (error: Error) => void } = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, options);
  if (!response.ok) {
    onError?.(new Error(`Failed to fetch data: ${response.statusText}`));
  }
  return (await response.json()) as T;
}

export async function getCareers(): Promise<TCareer[]> {
  const response = await apiRequest<Page<TCareer>>(
    "/records/all/carrera?limit=100",
    {
      method: "GET",
    }
  );
  return response.data;
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

  const response = await apiRequest<Page<TCost>>(
    `/records/all/costo?${params.toString()}`,
    {
      method: "GET",
    }
  );
  return response.data[0];
}

export async function getDiscounts(): Promise<TDiscount[]> {
  const params = new URLSearchParams();
  params.set("limit", "100");
  params.set(
    "where",
    JSON.stringify({
      checkout: true,
    })
  );
  const response = await apiRequest<Page<TDiscount>>(
    `/records/all/descuento?${params.toString()}`,
    {
      method: "GET",
    }
  );
  if (response?.data?.length === 0) {
    console.error("No discounts found for checkout");
    return [];
  }
  return response.data;
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

  const response = await apiRequest<Page<TGrupo>>(
    `/records/all/grupo?${params.toString()}`,
    {
      method: "GET",
    }
  );
  return response.data;
}

export async function getLead(id: string) {
  const response = await apiRequest<TLead>(`/records/byid/lead/${id}`, {
    method: "GET",
  });
  return response;
}

export async function updateLead(id: string, body: DeepPartial<TLead>) {
  console.log("Updating lead", id, body);
  const response = await apiRequest<TLead>(`/records/lead/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export async function getCheckout(
  checkoutId: string
): Promise<TCheckout | null> {
  const response = await apiRequest<TCheckout | null>(
    `/checkout/${checkoutId}`,
    {
      method: "GET",
    }
  ).catch(() => null);
  if (!response) {
    console.error("No checkout found for checkout ID", checkoutId);
    return null;
  }
  return response;
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

export async function updateCheckout(
  checkoutId: string,
  body: TUpdateCheckoutDTO
) {
  console.log("Updating checkout", checkoutId, body);
  const response = await apiRequest<TCheckout>(
    `/checkout/${checkoutId}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    },
    {
      onError: (error) => {
        console.error("Failed to update checkout", error);
      },
    }
  );
  return response;
}

export async function computeTotalAmount(
  checkoutId: string,
  discountId: string
) {
  console.log("Computing total amount", checkoutId, discountId);

  const data = await apiRequest<{
    monto_final: number;
    descuento_porcentaje: number;
    monto_neto: number;
    monto_cuota: number;
  }>(
    `/checkout/${checkoutId}/calculate-payment?descuento_id=${discountId}`,
    {
      method: "POST",
    },
    {
      onError: (error) => {
        console.error("Failed to compute total amount", error);
        throw error;
      },
    }
  );

  return data;
}

export async function generatePaymentLink(body: {
  lead_id: string;
  paymentMethod: "mercadopago" | "flywire";
  amount: number;
  paymentTypes: string;
  solicited_email: string;
  pago_cuotas_aplicar_descuento: number;
  fecha_promesa_pago: string;
  group: string;
  pago_especial_cuatrimestre?: boolean;
}) {
  console.log("Generating payment link", body);
  if (body.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  // {
  //   "paymentUrl": "https://payment.flywire.com/orders/8b9dce15-5bf9-47d3-9450-72741ffa1a62?token=32eed206-58fe-4606-9ce6-6a515c0c03cb&platform=json_gateway",
  //   "paymentId": "f87b2801-e4c8-42a0-8cb2-ede50c56772d"
  // }
  const response = await apiRequest<{ paymentUrl: string; paymentId: string }>(
    `/payments/create`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("Payment link generated", response);
  return response;
}

export async function handleCheckoutSubmission(
  data: TCheckoutForm,
  checkout: TCheckout,
  discount: TDiscount,
  career: TCareer
) {
  const universityEmail = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`;
  // If the lead is from Mexico, use Mercado Pago, otherwise use Flywire
  const paymentMethod =
    checkout.lead.pais.pais_nombre === "Mexico" ? "mercadopago" : "flywire";

  const groups = await getGroupsByCareerCode(career.carrera_codigo);
  const group = groups.find(
    (group) =>
      group.grupo_nombre === `${career.carrera_codigo}_${data.startingDate}`
  );
  if (!group) {
    throw new Error(
      `Group not found for career ${career.carrera_codigo} and starting date ${data.startingDate}`
    );
  }

  const cost = await getCareerCost(
    career.cuenta.cuenta_id,
    checkout.lead.pais.pais_id
  );

  // Update the lead
  await updateLead(checkout.lead.lead_id, {
    grupo: {
      grupo_id: group.grupo_id,
    },
    status: { status_id: "cad8b88f-6c21-4c21-937c-bb9591edc5da" }, // En proceso de pago
    correo_universitario: universityEmail,
    fecha_promesa_pago: new Date().toISOString().split("T")[0],
  });

  const paymentLink = await generatePaymentLink({
    lead_id: checkout.lead.lead_id,
    paymentMethod,
    amount: data.totalAmount,
    paymentTypes: "Colegiatura",
    solicited_email: universityEmail,
    pago_cuotas_aplicar_descuento: discount.descuento_cuotas
      ? Number(discount.descuento_cuotas)
      : cost.cuenta.cuenta_cantidad_cuotas,
    fecha_promesa_pago: new Date().toISOString().split("T")[0],
    group: group.grupo_id,
  });

  // Update the checkout
  await updateCheckout(checkout.checkout_id, {
    payment_link: paymentLink.paymentUrl,
    payment_method: paymentMethod,
    checkout_status: "payment_generated",
  });

  return paymentLink;
}
