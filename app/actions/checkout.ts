"use server";

import { TCheckoutForm } from "@/components/checkout-form";
import { getGroupsByCareerCodeAndOpeningDate } from "@/lib/api";
import { Entity } from "@/lib/enum/entity";
import { api } from "@/lib/http";
import { cacheTag, revalidateTag } from "next/cache";
import { update } from "./entity";
import { getCareerCost } from "./career";
import { generatePaymentLink } from "./payments";

export async function getCheckout(
  checkoutId: string
): Promise<TCheckout | null> {
  "use cache";
  cacheTag(`checkout:${checkoutId}`);
  console.log("Getting checkout", checkoutId);
  const { data } = await api
    .get<TCheckout | null>(`/checkout/${checkoutId}`)
    .catch(() => {
      console.error("No checkout found for checkout ID", checkoutId);
      return { data: null };
    });
  return data;
}

export async function updateCheckout(
  checkoutId: string,
  body: TUpdateCheckoutDTO
) {
  console.log("Updating checkout", checkoutId, body);
  const { data } = await api.patch<TCheckout>(`/checkout/${checkoutId}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("Updated checkout", checkoutId);
  revalidateTag(`checkout:${checkoutId}`, "max");

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
    group: group.grupo_id,
  });

  // Update the checkout
  // await update<TCheckout>(Entity.CHECKOUT, checkout.checkout_id, {
  //   payment_link: paymentLink.paymentUrl,
  //   payment_method: paymentMethod,
  //   checkout_status: "payment_generated",
  // });
  const checkoutAny = checkout as TCheckout & {
    checkout_url?: string;
    email?: string;
    telefono_lada?: string;
  };

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
  if (!checkoutAny.checkout_url) {
    updateData.checkout_url = `https://checkout.universidaduk.com/${checkout.checkout_id}`;
  }

  // Check if email needs to be updated from lead
  if (!checkoutAny.email && checkout.lead?.email) {
    updateData.email = checkout.lead.email;
  }

  // Check if telefono_lada needs to be updated from lead
  if (!checkoutAny.telefono_lada && checkout.lead?.telefono_lada) {
    updateData.telefono_lada = checkout.lead.telefono_lada;
  }

  await updateCheckout(checkout.checkout_id, updateData);

  return { paymentUrl, paymentId };
}
