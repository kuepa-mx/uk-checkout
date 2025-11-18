import CheckoutForm from "@/components/checkout-form";
import { getAll, getById } from "@/lib/api/features/entity";
import { Entity } from "@/lib/api/enum/entity";
import CheckoutDetails from "@/components/checkout-details";

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

  if (
    checkout.checkout_status === "payment_generated" ||
    checkout.checkout_status === "paid"
  ) {
    return <CheckoutDetails checkout={checkout} />;
  }

  return (
    <CheckoutForm
      careers={careers}
      discounts={discounts.data}
      checkout={checkout}
    />
  );
}
