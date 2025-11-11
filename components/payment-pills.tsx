import { capitalize } from "@/lib/utils";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { TCheckoutForm } from "./checkout-form";
import useDiscountPrice from "@/lib/hooks/useDiscountPrice";
import { Spinner } from "./ui/spinner";
import { FormField, FormItem, FormMessage } from "./ui/form";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export default function PaymentPills({
  discounts,
  checkoutId,
  career,
}: {
  discounts: TDiscount[];
  checkoutId: string;
  career?: TCareer;
}) {
  const { control, setValue } = useFormContext<TCheckoutForm>();
  const plans = discounts.sort(
    (a, b) =>
      Number(a.descuento_cuotas ?? Infinity) -
      Number(b.descuento_cuotas ?? Infinity)
  );
  return (
    <FormField
      control={control}
      name="discountType"
      render={({ field }) => (
        <FormItem className="my-2">
          <h2 className="sr-only">Opciones de pago</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {career ? (
              <>
                {plans.map((plan, idx) => (
                  <PaymentPill
                    control={control}
                    key={plan.descuento_id}
                    discount={plan}
                    checkoutId={checkoutId}
                    career={career}
                    spanDoubleColumn={idx % 3 === 0}
                    onClick={(price) => {
                      field.onChange(plan.descuento_id, {
                        shouldDirty: true,
                        shouldValidate: true,
                        shouldTouch: true,
                      });
                      setValue("totalAmount", price, {
                        shouldDirty: true,
                        shouldValidate: true,
                        shouldTouch: true,
                      });
                    }}
                  />
                ))}
              </>
            ) : null}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const PaymentPill = ({
  discount,
  checkoutId,
  career,
  onClick,
  spanDoubleColumn,
  control,
}: {
  discount: TDiscount;
  checkoutId: string;
  career: TCareer;
  spanDoubleColumn?: boolean;
  onClick?: (price: number) => void;
  control: Control<TCheckoutForm>;
}) => {
  const selectedDiscountId = useWatch({ name: "discountType", control });
  const { price, isLoading } = useDiscountPrice(
    checkoutId,
    discount.descuento_id
  );
  const planData = {
    id: discount.descuento_id,
    label: capitalize(discount.descuento_nombre),
    subtitle:
      Number(discount.descuento_porcentaje) > 0
        ? `${Number(discount.descuento_porcentaje) * 100}% de descuento`
        : "Inscripción inmediata",

    net_price:
      (price?.monto_neto ?? 0) *
      Number(discount.descuento_cuotas ?? career.cuenta.cuenta_cantidad_cuotas),
    price:
      (price?.monto_final ?? 0) *
      Number(discount.descuento_cuotas ?? career.cuenta.cuenta_cantidad_cuotas),
    discount: Number(price?.descuento_porcentaje ?? 0),
  };

  return (
    <button
      disabled={isLoading}
      onClick={() => onClick?.(planData.price)}
      key={discount.descuento_id}
      type="button"
      className={
        "flex items-center justify-between gap-2 rounded-2xl border px-3 py-3 text-left transition hover:bg-uk-blue-text/10 hover:text-uk-blue-text" +
        (selectedDiscountId === discount.descuento_id
          ? "border-[#FF7A00]! bg-[#FF7A00]! text-white! shadow-md!"
          : "border-[#0B1F3A]/15 bg-white text-[#0B1F3A]") +
        (spanDoubleColumn ? " sm:col-span-2" : "")
      }
    >
      {isLoading ? (
        <>
          <Spinner className="size-6 animate-spin mx-auto my-auto" />{" "}
        </>
      ) : (
        <>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-semibold">{planData.label}</span>
            <span className="text-[10px] opacity-85">{planData.subtitle}</span>
          </div>
          <div className="flex flex-col">
            {planData.net_price !== planData.price && (
              <span className="text-[10px] leading-2 font-semibold line-through text-center ">
                {currencyFormatter.format(planData.net_price)}
              </span>
            )}
            <span className="text-base leading-4 font-bold">
              {currencyFormatter.format(planData.price)}
            </span>
          </div>
        </>
      )}
    </button>
  );
};
