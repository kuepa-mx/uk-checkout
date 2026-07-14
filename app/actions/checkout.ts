"use server";

import { TCheckoutForm } from "@/components/checkout-form";
import { getGroupsByCareerCodeAndOpeningDate } from "@/lib/api";
import { Entity } from "@/lib/enum/entity";
import { api } from "@/lib/http";
import { cacheTag, updateTag } from "next/cache";
import { getById, update } from "./entity";
import { getCareerCost } from "./career";
import { generatePaymentLink } from "./payments";
import { removeAccents } from "@/lib/utils";

export async function getCheckout(
  checkoutId: string
): Promise<TCheckout | null> {
  "use cache";
  cacheTag(`checkout:${checkoutId}`);
  const { data } = await api.get<TCheckout | null>(`/checkout/${checkoutId}`);

  return data;
}

async function patchCheckout(checkoutId: string, body: TUpdateCheckoutDTO) {
  const { data } = await api.patch<TCheckout>(`/checkout/${checkoutId}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function updateCheckout(
  checkoutId: string,
  body: TUpdateCheckoutDTO
) {
  const data = await patchCheckout(checkoutId, body);
  // El checkout está cacheado ("use cache" + cacheTag en getCheckout). Sin esto, el front
  // sigue sirviendo el estado previo: plan viejo, o un checkout ya vencido como vigente.
  // updateTag y no revalidateTag: este último es stale-while-revalidate y, por diseño, los
  // Server Actions no leen sus propias escrituras.
  updateTag(`checkout:${checkoutId}`);

  return data;
}

export async function computeTotalAmount(
  checkoutId: string,
  discountId: string
) {
  const { data } = await api.post<{
    monto_final: number;
    descuento_porcentaje: number;
    monto_neto: number;
    monto_cuota: number;
  }>(`/checkout/${checkoutId}/calculate-payment?descuento_id=${discountId}`);
  return data;
}

export type TCalculatePaymentResponse = Awaited<
  ReturnType<typeof computeTotalAmount>
>;

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

  const groups = await getGroupsByCareerCodeAndOpeningDate(
    career.carrera_codigo,
    data.startingDate
  );
  if (groups.length === 0) {
    throw new Error(
      `No se encontro el grupo "${career.carrera_codigo}_${data.startingDate}"`
    );
  }
  const group = groups[0];

  const cost = await getCareerCost(
    career.cuenta.cuenta_id,
    checkout.lead.pais.pais_id
  );

  // Update the lead
  await update<TLead>(Entity.LEAD, checkout.lead.lead_id, {
    grupo: {
      grupo_id: group.grupo_id,
    },
    status: { status_id: "cad8b88f-6c21-4c21-937c-bb9591edc5da" }, // En proceso de pago
    correo_universitario: universityEmail,
    fecha_promesa_pago: new Date().toISOString().split("T")[0],
  });

  const { paymentUrl, paymentId } = await generatePaymentLink({
    lead_id: checkout.lead.lead_id,
    checkout_id: checkout.checkout_id,
    paymentMethod,
    amount: data.totalAmount,
    paymentTypes: "Colegiatura",
    solicited_email: universityEmail,
    pago_cuotas_aplicar_descuento: discount.descuento_cuotas
      ? Number(discount.descuento_cuotas)
      : cost.cuenta.cuenta_cantidad_cuotas,
    fecha_promesa_pago: new Date().toISOString().split("T")[0],
    descuento: discount,
  });

  // Update the checkout
  // await update<TCheckout>(Entity.CHECKOUT, checkout.checkout_id, {
  //   payment_link: paymentLink.paymentUrl,
  //   payment_method: paymentMethod,
  //   checkout_status: "payment_generated",
  // });
  const updateData: TUpdateCheckoutDTO = {
    pago: {
      pago_id: paymentId,
    },
    payment_link: paymentUrl,
    payment_link_generated_at: new Date().toISOString(),
    payment_method: paymentMethod,
    checkout_status: "payment_generated",
  };

  // Check if checkout_url needs to be set
  if (!checkout.checkout_url) {
    updateData.checkout_url = `https://checkout.universidaduk.com/${checkout.checkout_id}`;
  }

  // Check if email needs to be updated from lead
  if (!checkout.email && checkout.lead?.email) {
    updateData.email = checkout.lead.email;
  }

  // Check if telefono_lada needs to be updated from lead
  if (!checkout.telefono_lada && checkout.lead?.telefono_lada) {
    updateData.telefono_lada = checkout.lead.telefono_lada;
  }

  await updateCheckout(checkout.checkout_id, updateData);

  return { paymentUrl, paymentId };
}

export async function handlePsychologyMasterCheckout(params: {
  checkout: TCheckout;
  career: TCareer;
  cost: TCost;
}) {
  const { checkout, career, cost } = params;

  // Fetch the "Pago Completo" discount for ISEB masters;
  const discount = await getById(
    Entity.DISCOUNT,
    "77492cc7-7caf-4a71-ac38-1438b8cdcb3d"
  );
  if (!discount) {
    throw new Error(
      "No se encontró un descuento con 0% para maestría en psicología"
    );
  }

  // Determine payment method based on country
  const paymentMethod =
    checkout.lead.pais.pais_nombre === "Mexico" ? "mercadopago" : "flywire";

  // Derive university email
  let universityEmail = checkout.lead.correo_universitario;
  if (!universityEmail) {
    const nameParts = (checkout.lead.nombre || "").split(/\s+/).filter(Boolean);
    const firstName = removeAccents(nameParts[0] || "");
    const lastName = removeAccents(nameParts[1] || "");
    universityEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ukuepa.com`;
  }

  // Generate payment link with full career cost
  const { paymentUrl, paymentId } = await generatePaymentLink({
    lead_id: checkout.lead.lead_id,
    checkout_id: checkout.checkout_id,
    paymentMethod,
    amount: cost.costo_carrera,
    paymentTypes: "Colegiatura",
    solicited_email: universityEmail,
    pago_cuotas_aplicar_descuento: discount.descuento_cuotas
      ? Number(discount.descuento_cuotas)
      : career.cuenta.cuenta_cantidad_cuotas,
    fecha_promesa_pago: new Date().toISOString().split("T")[0],
    descuento: discount,
  });

  const updateData: TUpdateCheckoutDTO = {
    pago: {
      pago_id: paymentId,
    },
    payment_link: paymentUrl,
    payment_link_generated_at: new Date().toISOString(),
    payment_method: paymentMethod,
    checkout_status: "payment_generated",
    selected_plan_type: discount.descuento_id,
  };

  if (!checkout.checkout_url) {
    updateData.checkout_url = `https://checkout.universidaduk.com/${checkout.checkout_id}`;
  }

  if (!checkout.email && checkout.lead?.email) {
    updateData.email = checkout.lead.email;
  }

  if (!checkout.telefono_lada && checkout.lead?.telefono_lada) {
    updateData.telefono_lada = checkout.lead.telefono_lada;
  }

  // Este flujo corre durante el render del Server Component (page.tsx lo invoca
  // fuera de una Server Action), y Next prohíbe invalidar cache ("use cache") en
  // fase de render. Por eso usamos patchCheckout en vez de updateCheckout: mismo
  // PATCH pero sin updateTag, igual que se comportaba este flujo antes de que
  // updateCheckout empezara a invalidar el tag internamente.
  await patchCheckout(checkout.checkout_id, updateData);

  return { paymentUrl, paymentId };
}
