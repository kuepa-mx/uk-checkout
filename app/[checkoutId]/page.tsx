import CheckoutForm from "@/components/checkout-form";
import { getCareers, getCheckout, getDiscounts } from "@/lib/api";
import CheckoutDetails from "@/components/checkout-details";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ checkoutId: string }>;
}) {
  const { checkoutId } = await params;

  const [careers, checkout, discounts] = await Promise.all([
    getCareers(),
    getCheckout(checkoutId),
    getDiscounts(),
  ]);

  if (!checkout) {
    return <div>No se encontró el checkout</div>;
  }

  if (!checkout.lead?.carrera?.carrera_id || !checkout.lead?.pais?.pais_id) {
    return <div>No se encontró la carrera o el país</div>;
  }

  // if (
  //   checkout.checkout_status === "payment_generated" ||
  //   checkout.checkout_status === "paid"
  // ) {
  //   return <CheckoutDetails checkout={checkout} />;
  // }

  return (
    <CheckoutForm careers={careers} discounts={discounts} checkout={checkout} />
  );
}
