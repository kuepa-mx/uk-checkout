import { TCheckoutForm } from "@/components/checkout-form";
import { getGroupsByCareerCodeAndOpeningDate } from "@/lib/api";
import { getCareerCost } from "@/lib/api/features/career";
import { generatePaymentLink } from "@/lib/api";
import { update } from "@/lib/api/features/entity";
import { Entity } from "@/lib/api/enum/entity";
import { updateCheckout } from "@/app/actions/checkout";

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
  await updateCheckout(checkout.checkout_id, {
    pago: {
      pago_id: paymentId,
    },
    payment_link: paymentUrl,
    payment_link_generated_at: new Date().toISOString(),
    payment_method: paymentMethod,
    checkout_status: "payment_generated",
  });

  return { paymentUrl, paymentId };
}
