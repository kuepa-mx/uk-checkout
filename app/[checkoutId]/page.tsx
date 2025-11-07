import CheckoutForm from "@/components/checkout-form";
import {
  getCareerCost,
  getCareers,
  getCheckout,
  getDiscounts,
} from "@/lib/api";

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

  if (!checkout.lead?.carrera?.carrera_id || !checkout.lead?.pais?.pais_id) {
    return <div>No se encontró la carrera o el país</div>;
  }

  const cost = await getCareerCost(
    checkout.lead.carrera.cuenta.cuenta_id,
    checkout.lead.pais.pais_id
  );

  return (
    <CheckoutForm careers={careers} discounts={discounts} checkout={checkout} cost={cost} />
  );
}
