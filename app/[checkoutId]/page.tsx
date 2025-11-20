import CheckoutForm from "@/components/checkout-form";
import { getAll, getById } from "@/lib/api/features/entity";
import { Entity } from "@/lib/enum/entity";
import CheckoutDetails from "@/components/checkout-details";
import { capitalize } from "@/lib/utils";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = await params;

  const [careers, checkout, discounts] = await Promise.all([
    getAll<TCareer>(Entity.CAREER, {
      limit: "1000",
    }).then(
      ({ data }) =>
        data?.sort((a, b) =>
          a.carrera_nombre.localeCompare(b.carrera_nombre)
        ) || ([] as TCareer[])
    ),
    getById<TCheckout>(Entity.CHECKOUT, checkoutId),
    getAll<TDiscount>(Entity.DISCOUNT, {
      where: JSON.stringify({
        checkout: true,
      }),
    }),
  ]);

  if (!checkout) {
    return <div>No se encontró el checkout</div>;
  }

  if (!checkout.lead?.carrera?.carrera_id || !checkout.lead?.pais?.pais_id) {
    return <div>No se encontró la carrera o el país</div>;
  }

  const career = careers.find(
    (career) => career.carrera_id === checkout.lead?.carrera?.carrera_id
  );

  const cost = await getAll<TCost>(Entity.COST, {
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

  console.log("career", career?.carrera_nombre);
  console.log("cost", cost?.costo_carrera);
  console.log("installmentCost", installmentCost);

  const paymentOptions = discounts.data
    .map((discount) => ({
      id: discount.descuento_id,
      label: capitalize(discount.descuento_nombre),
      subtitle:
        Number(discount.descuento_porcentaje) > 0
          ? `${Number(discount.descuento_porcentaje) * 100}% de descuento`
          : "Inscripción inmediata",
      original_price:
        installmentCost *
        Number(
          discount.descuento_cuotas ??
            career?.cuenta?.cuenta_cantidad_cuotas ??
            1
        ),
      final_price:
        installmentCost *
        Number(
          discount.descuento_cuotas ??
            career?.cuenta?.cuenta_cantidad_cuotas ??
            1
        ) *
        (1 - Number(discount.descuento_porcentaje ?? 0)),
    }))
    .sort((a, b) => a.final_price - b.final_price);

  if (
    checkout.checkout_status === "payment_generated" ||
    checkout.checkout_status === "paid"
  ) {
    return (
      <CheckoutDetails
        checkout={checkout}
        selectedPaymentOption={paymentOptions.find(
          (option) => option.id === checkout.selected_plan_type
        )}
      />
    );
  }

  return (
    <CheckoutForm
      careers={careers}
      discounts={discounts.data}
      checkout={checkout}
      paymentOptions={paymentOptions}
    />
  );
}
