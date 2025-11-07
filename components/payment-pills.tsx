import { capitalize } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { TCheckoutForm } from "./checkout-form";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const computePrice = (cost: TCost, discount: TDiscount) => {
  const installmentCost =
    cost.costo_carrera / cost.cuenta.cuenta_cantidad_cuotas;
  const total = discount.descuento_cuotas
    ? installmentCost * Number(discount.descuento_cuotas)
    : cost.costo_carrera;

  console.log(
    total,
    discount.descuento_porcentaje,
    discount.descuento_cuotas,
    cost.cuenta.cuenta_cantidad_cuotas
  );

  return Math.ceil(total * (1 - Number(discount.descuento_porcentaje ?? 0)));
};

export default function PaymentPills({
  discounts,
  cost,
}: {
  discounts: TDiscount[];
  cost: TCost;
}) {
  const { setValue } = useFormContext<TCheckoutForm>();
  const selectedDiscountId = useWatch({ name: "discountType" });

  const installmentCost =
    cost.costo_carrera / cost.cuenta.cuenta_cantidad_cuotas;

  const plans = discounts
    .sort(
      (a, b) =>
        Number(a.descuento_cuotas ?? Infinity) -
        Number(b.descuento_cuotas ?? Infinity)
    )
    .map((discount) => ({
      id: discount.descuento_id,
      label: capitalize(discount.descuento_nombre),
      subtitle:
        Number(discount.descuento_porcentaje) > 0
          ? `${Number(discount.descuento_porcentaje) * 100}% de descuento`
          : "Inscripción inmediata",
      price: `${currencyFormatter.format(computePrice(cost, discount))}`,
      discount:
        installmentCost *
        (discount.descuento_cuotas
          ? Number(discount.descuento_cuotas)
          : cost.cuenta.cuenta_cantidad_cuotas) *
        Number(discount.descuento_porcentaje),
      total: currencyFormatter.format(
        discount.descuento_cuotas
          ? installmentCost * Number(discount.descuento_cuotas)
          : cost.costo_carrera
      ),
    }));

  return (
    <section className="mt-3">
      <h2 className="sr-only">Opciones de pago</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {plans.map((plan, idx, arr) => (
          <button
            onClick={() => setValue("discountType", plan.id)}
            key={plan.id}
            type="button"
            className={
              "flex items-center justify-between rounded-2xl border px-3 py-3 text-left transition hover:bg-uk-blue-text/10 hover:text-uk-blue-text" +
              (selectedDiscountId === plan.id
                ? "border-[#FF7A00]! bg-[#FF7A00]! text-white! shadow-md!"
                : "border-[#0B1F3A]/15 bg-white text-[#0B1F3A]") +
              (idx === arr.length - 1 && arr.length % 2 !== 0
                ? " sm:col-span-2"
                : "")
            }
          >
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-semibold">{plan.label}</span>
              <span className="text-[10px] opacity-70">{plan.subtitle}</span>
            </div>
            <div className="flex flex-col">
              {plan.total !== plan.price && (
                <span className="text-[9px] font-semibold line-through text-center ">
                  {plan.total}
                </span>
              )}
              <span className="text-[14px] font-bold">{plan.price}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
