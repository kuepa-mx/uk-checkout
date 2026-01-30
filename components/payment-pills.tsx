import { useFormContext } from "react-hook-form";
import { TCheckoutForm } from "./checkout-form";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { PaymentPill, TPaymentPillProps } from "./payment-pill";
import { useTransition } from "react";

export default function PaymentPills({
  paymentOptions,
}: {
  paymentOptions: TPaymentPillProps[];
}) {
  const [isPending, startTransition] = useTransition();
  const { control, setValue } = useFormContext<TCheckoutForm>();
  return (
    <FormField
      control={control}
      name="discountType"
      disabled={isPending}
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-1 gap-2">
            {paymentOptions.map((plan) => (
              <PaymentPill
                {...plan}
                key={plan.id}
                isSelected={field.value === plan.id}
                onClick={() => {
                  console.log("onClick", plan.id);
                  startTransition(async () => {
                    field.onChange(plan.id, {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    });
                    setValue("totalAmount", plan.final_price, {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    });
                  });
                }}
              />
            ))}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
