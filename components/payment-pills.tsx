import { useFormContext } from "react-hook-form";
import { TCheckoutForm } from "./checkout-form";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { PaymentPill, TPaymentPillProps } from "./payment-pill";

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
        <FormItem className="space-y-1">
          <h2 className="text-sm font-semibold text-uk-blue-text ml-2">
            Opciones de pago
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {paymentOptions.map((plan, idx) => (
              <PaymentPill
                id={plan.id}
                label={plan.label}
                subtitle={plan.subtitle}
                original_price={plan.original_price}
                final_price={plan.final_price}
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
