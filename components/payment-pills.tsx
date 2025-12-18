import { useFormContext } from "react-hook-form";
import { TCheckoutForm } from "./checkout-form";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { PaymentPill, TPaymentPillProps } from "./payment-pill";
import { cn } from "@/lib/utils";

export default function PaymentPills({
  paymentOptions,
  loading,
}: {
  paymentOptions: TPaymentPillProps[];
  loading?: boolean;
}) {
  const { control, setValue } = useFormContext<TCheckoutForm>();
  return (
    <FormField
      control={control}
      name="discountType"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-1 gap-2 rounded-2xl overflow-hidden">
            {paymentOptions.map((plan, idx) => (
              <PaymentPill
                {...plan}
                key={plan.id}
                spanDoubleColumn={idx % 3 === 0}
                isSelected={field.value === plan.id}
                onClick={() => {
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
                }}
              />
            ))}
          </div>
          <div className="h-6">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
