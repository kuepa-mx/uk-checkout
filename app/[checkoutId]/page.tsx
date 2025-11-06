import CheckoutForm from "@/components/checkout-form";
import { getCareers, getCheckout, getDiscounts } from "@/lib/api";

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

  return (
    <CheckoutForm careers={careers} discounts={discounts} checkout={checkout} />
  );
}
