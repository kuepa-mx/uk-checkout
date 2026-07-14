import CheckoutForm from "@/components/checkout-form";
import { getAll } from "@/app/actions/entity";
import { Entity } from "@/lib/enum/entity";
import CheckoutDetails from "@/components/checkout-details";
import { capitalize, isPsychologyMaster } from "@/lib/utils";
import { createLogger } from "@/lib/logger";
import { TPaymentOption } from "@/components/payment-pill";
import CheckoutCard from "@/components/checkout-card";
import CheckoutExpired from "@/components/checkout-expired";
import {
  getCheckout,
  handlePsychologyMasterCheckout,
} from "@/app/actions/checkout";
import { redirect } from "next/navigation";
import { isCheckoutValid as validated } from "@/lib/utils/checkout";

const isDev = process.env.NODE_ENV === "development";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = await params;

  const checkout = validated(await getCheckout(checkoutId));

  // Create logger with session context
  let logger = createLogger({
    sessionId: checkoutId,
    leadId: checkout?.lead?.lead_id,
  });

  // Update logger with confirmed leadId
  logger = logger.withContext({
    leadId: checkout.lead?.lead_id,
  });

  const [careers, discounts] = await Promise.all([
    getAll(Entity.CAREER, {
      limit: "1000",
      order: "carrera_nombre",
      order_direction: "asc",
      where: JSON.stringify({
        carrera_activo: true,
      }),
    }).then(
      ({ data }) =>
        data
          ?.sort((a, b) => a.carrera_nombre.localeCompare(b.carrera_nombre))
          .filter(
            (career) => career.carrera_activo && career.cuenta?.cuenta_activo
          ) || []
    ),
    getAll(Entity.DISCOUNT, {
      limit: "1000",
      where: JSON.stringify({
        checkout: true,
      }),
    }),
  ]);

  const career = careers.find(
    (career) => career.carrera_id === checkout.lead?.carrera?.carrera_id
  );
  if (!career) {
    logger.error("Career not found for checkout");
    return (
      <CheckoutCard>
        <div>Error: No se encontró la carrera</div>
      </CheckoutCard>
    );
  }

  const cost = await getAll(Entity.COST, {
    where: JSON.stringify({
      pais: {
        pais_id: checkout.lead?.pais?.pais_id,
      },
      cuenta: {
        cuenta_id: checkout.lead?.carrera?.cuenta?.cuenta_id,
      },
    }),
    limit: "1",
  }).then(({ data }) => data?.[0] || null);
  const installmentCost =
    (cost?.costo_carrera ?? 0) / (career?.cuenta?.cuenta_cantidad_cuotas ?? 1);

  // Psychology masters: auto-generate payment link and redirect to show CheckoutDetails
  if (isPsychologyMaster(checkout.lead?.carrera)) {
    if (
      checkout.checkout_status !== "payment_generated" &&
      checkout.checkout_status !== "paid"
    ) {
      if (!career) {
        logger.error("Career not found for psychology master auto-checkout");
        return (
          <CheckoutCard>
            <div>Error: No se encontró la carrera</div>
          </CheckoutCard>
        );
      }
      if (!cost) {
        logger.error("Cost not found for psychology master auto-checkout");
        return (
          <CheckoutCard>
            <div>Error: No se encontró el costo</div>
          </CheckoutCard>
        );
      }

      try {
        logger.info(
          "Psychology master detected, auto-generating payment link..."
        );
        await handlePsychologyMasterCheckout({
          checkout,
          career,
          cost,
        });
      } catch (error) {
        logger.error(
          "Failed to auto-generate psychology master payment:",
          error
        );
        return (
          <CheckoutCard>
            <div>Error al generar el link de pago</div>
          </CheckoutCard>
        );
      }

      redirect(`/${checkoutId}?fromLanding=true`);
    }
  }

  if (!discounts.data?.length) {
    logger.error("No payment options found");
    return (
      <CheckoutCard>
        <p className="text-sm font-medium text-uk-blue-text">
          Error: No se encontraron opciones de pago
        </p>
        {isDev && (
          <div className="flex flex-col gap-1 p-2 bg-uk-border/10 rounded-md m-2 whitespace-pre overflow-x-auto max-w-full text-xs">
            <code>Pais: {JSON.stringify(checkout.lead?.pais, null, 2)}</code>
            <code>Career: {JSON.stringify(career, null, 2)}</code>
          </div>
        )}
      </CheckoutCard>
    );
  }

  const paymentOptions: TPaymentOption[] = discounts.data
    .filter(
      (d) =>
        d?.descuento_id &&
        !!d?.checkout &&
        d.paises?.includes(checkout.lead?.pais?.pais_id) &&
        d.carreras?.includes(career?.carrera_id)
    )
    .map((discount: TDiscount): TPaymentOption => {
      const numberOfInstallments = Number(
        discount?.descuento_cuotas ??
          career?.cuenta?.cuenta_cantidad_cuotas ??
          1
      );
      const originalPrice = installmentCost * numberOfInstallments;
      const finalPrice =
        originalPrice * (1 - Number(discount?.descuento_porcentaje ?? 0));
      const installmentPrice = finalPrice / numberOfInstallments;
      return {
        id: discount?.descuento_id,
        label: capitalize(discount?.descuento_nombre),
        subtitle:
          Number(discount?.descuento_porcentaje) > 0
            ? `${Number(discount?.descuento_porcentaje) * 100}% de descuento`
            : "Inscripción inmediata",
        discount_percentage: Number(discount?.descuento_porcentaje ?? 0),
        original_price: originalPrice,
        // Best option is anual plan
        bestOption: discount?.descuento_nombre?.toLowerCase().includes("anual"),
        final_price: finalPrice,
        installment_price: installmentPrice,
        numberOfInstallments:
          numberOfInstallments ?? career?.cuenta?.cuenta_cantidad_cuotas ?? 1,
        country: checkout.lead?.pais,
      };
    })
    .sort((a, b) => a?.final_price - b?.final_price);

  // El bot puede crear el checkout con un descuento ya negociado con el lead. En ese caso
  // no hay nada que elegir: solo se muestra ese plan. Si el descuento asignado no está
  // entre las opciones válidas para su país/carrera, mostramos todas para no frenar la venta.
  const assignedOption = checkout.descuento_id
    ? paymentOptions.find((option) => option.id === checkout.descuento_id)
    : undefined;
  const availableOptions = assignedOption ? [assignedOption] : paymentOptions;

  if (checkout.descuento_id && !assignedOption) {
    logger.error(
      "Assigned discount is not among the valid payment options; showing all",
      checkout.descuento_id
    );
  }

  logCheckoutInformation(logger, {
    checkout,
    career,
    cost,
    installmentCost,
    paymentOptions,
  });

  if (
    checkout.checkout_status === "payment_generated" ||
    checkout.checkout_status === "paid"
  ) {
    const plan = paymentOptions.find(
      (option) => option.id === checkout.selected_plan_type
    );
    return (
      <CheckoutCard>
        <CheckoutDetails checkout={checkout} plan={plan} />
      </CheckoutCard>
    );
  }

  // is_expired lo calcula el backend en el momento del GET, y getCheckout está cacheado:
  // si el checkout vence por paso del tiempo, el valor cacheado queda mintiendo. expires_at
  // es un instante fijo, así que compararlo contra "ahora" en cada render siempre da bien.
  // Solo aplica a checkouts con descuento asignado (los de bot), que es donde el backend
  // enforza la expiración.
  const expiresAt = checkout.expires_at ? new Date(checkout.expires_at) : null;
  const hasValidExpiry =
    expiresAt !== null && !Number.isNaN(expiresAt.getTime());
  const isExpired =
    Boolean(checkout.descuento_id) &&
    (checkout.is_expired === true ||
      (hasValidExpiry && expiresAt < new Date()));

  if (isExpired) {
    return (
      <CheckoutCard>
        <CheckoutExpired expiresAt={checkout.expires_at} />
      </CheckoutCard>
    );
  }

  return (
    <CheckoutForm
      careers={careers.filter((c) => !isPsychologyMaster(c))}
      discounts={discounts.data}
      checkout={checkout}
      paymentOptions={availableOptions}
    />
  );
}

/* ------------------------------------------------ LOGGING FUNCTIONS ------------------------------------------------ */
type Logger = ReturnType<typeof createLogger>;
type TData = {
  checkout: TCheckout;
  career?: TCareer;
  cost?: TCost;
  installmentCost?: number;
  paymentOptions?: TPaymentOption[];
};

function logCheckoutInformation(logger: Logger, data: TData) {
  const {
    checkout,
    career = undefined,
    cost = undefined,
    installmentCost = undefined,
    paymentOptions = undefined,
  } = data;
  // Log checkout information
  logger.info("=== CHECKOUT INFORMATION ===");
  logger.info("Checkout ID:", checkout.checkout_id);
  logger.info("Status:", checkout.checkout_status);
  logger.info("Created At:", checkout.created_at);
  logger.info("Updated At:", checkout.updated_at);
  logger.info("Expires At:", checkout.expires_at);
  logger.info("Payment Method:", checkout.payment_method);
  logger.info("Payment Link:", checkout.payment_link);
  logger.info("Selected Plan Type:", checkout.selected_plan_type);
  logger.info("Selected Fecha Inicio:", checkout.selected_fecha_inicio);
  logger.info("Owner Email:", checkout.owner_email);
  logger.info("Agent Name:", checkout.agent_name);
  logger.info("Generated By Type:", checkout.generated_by_type);
  logger.info("Paid At:", checkout.paid_at);

  // Log lead information
  logger.info("=== LEAD INFORMATION ===");
  logger.info("Lead ID:", checkout.lead?.lead_id);
  logger.info("Name:", checkout.lead?.nombre);
  logger.info("Email:", checkout.lead?.email);
  logger.info("Phone:", checkout.lead?.telefono);
  logger.info("Phone LADA:", checkout.lead?.telefono_lada);
  logger.info("University Email:", checkout.lead?.correo_universitario);
  logger.info("Country:", checkout.lead?.pais?.pais_nombre);
  logger.info("Country ID:", checkout.lead?.pais?.pais_id);
  logger.info("Country Currency:", checkout.lead?.pais?.pais_moneda);
  logger.info("Status:", checkout.lead?.status?.status_nombre);
  logger.info("Source:", checkout.lead?.source?.source_nombre);
  logger.info("Fecha Promesa Pago:", checkout.lead?.fecha_promesa_pago);
  logger.info("Created At:", checkout.lead?.timestamp_creation);

  // Log career information
  logger.info("=== CAREER INFORMATION ===");
  if (career) {
    logger.info("Career ID:", career.carrera_id);
    logger.info("Career Name:", career.carrera_nombre);
    logger.info("Career Code:", career.carrera_codigo);
    logger.info("Career Active:", career.carrera_activo);
    logger.info("Account ID:", career.cuenta?.cuenta_id);
    logger.info(
      "Number of Installments:",
      career.cuenta?.cuenta_cantidad_cuotas
    );
    logger.info("Account Active:", career.cuenta?.cuenta_activo);
  } else {
    logger.error("Career not found");
  }

  // Log cost information
  logger.info("=== COST INFORMATION ===");
  if (cost) {
    logger.info("Cost ID:", cost.costo_id);
    logger.info("Cost Active:", cost.costo_activo);
    logger.info("Installment Cost:", installmentCost);
    logger.info(
      "Number of Installments:",
      career?.cuenta?.cuenta_cantidad_cuotas ?? "N/A"
    );
    logger.info("Total Career Cost:", cost.costo_carrera);
  } else {
    logger.error("Cost not found");
  }
  logger.info("================================\n");

  // Log payment options information
  logger.info("=== PAYMENT OPTIONS INFORMATION ===");
  if (paymentOptions) {
    paymentOptions.forEach((paymentOption) => {
      logger.info("Payment Option ID:", paymentOption.id);
      logger.info("Payment Option Label:", paymentOption.label);
      logger.info("Payment Option Subtitle:", paymentOption.subtitle);
    });
    logger.info("================================\n");
  } else {
    logger.error("Payment options not found");
  }
}
