import { Spinner } from "./ui/spinner";

export type TPaymentOption = {
  id: string;
  label: string;
  subtitle: string;
  original_price: number;
  discount_percentage?: number;
  final_price: number;
  installment_price: number;
  numberOfInstallments?: number;
  bestOption?: boolean;
};

export type TPaymentPillProps = {
  id: string;
  label: string;
  subtitle: string;
  original_price: number;
  discount_percentage?: number;
  final_price: number;
  installment_price: number;
  spanDoubleColumn?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  loading?: boolean;
};

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const installmentsSubtitle: Record<number, string> = {
  1: "Inscripción inmediata",
  4: "Hasta 3 cuotas de",
  12: "Hasta 12 cuotas de",
};

export const PaymentPill = ({
  id,
  label,
  subtitle,
  original_price,
  installment_price,
  discount_percentage,
  onClick,
  isSelected,
  loading,
  final_price,
  numberOfInstallments,
  bestOption,
}: TPaymentPillProps & TPaymentOption) => {
  return (
    <button
      onClick={() => onClick?.()}
      key={id}
      type="button"
      disabled={loading}
      className={
        "rounded-2xl border px-3 py-3 text-left transition hover:border-uk-blue-text relative " +
        (bestOption ? "shadow-sm shadow-orange-500 outline-orange-500" : "") +
        (isSelected ? "border-orange-500!" : "border-[#0B1F3A]/15") +
        (loading ? " pointer-events-none" : "")
      }
    >
      {!!loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="animate-out fade-out duration-300" />
        </div>
      )}
      <div
        className={
          "animate-in slide-in-from-bottom-2 duration-300 fade-in flex items-center justify-between gap-4 " +
          (loading ? "opacity-50" : "")
        }
      >
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className="md:text-base text-sm font-semibold">{label}</span>
            {/* Discount Percentage Badge */}
            {discount_percentage && discount_percentage > 0 ? (
              <span className="text-xs font-medium border border-orange-600 text-orange-600 px-1 rounded-lg">
                -{discount_percentage * 100}%
              </span>
            ) : null}
          </div>
          {/* <span className="md:text-sm text-[11px]">{subtitle}</span> */}
          <span className="flex items-center gap-1 mt-1 scale-90 md:scale-100 origin-left">
            <p className="text-xs font-light">Total:</p>
            {final_price !== installment_price && (
              <p className="text-xs opacity-85 font-light line-through">
                {currencyFormatter.format(original_price)}
              </p>
            )}
            <p className="text-xs font-semibold">
              {currencyFormatter.format(final_price)}
            </p>
          </span>
        </div>
        <div className="text-end space-y-1">
          {/* {original_price !== final_price && (
            <span className="text-xs leading-2 font-semibold line-through text-center opacity-85 scale-90">
              {currencyFormatter.format(original_price)}
            </span>
          )} */}
          {/* <p className="text-sm">Paga ahora</p> */}
          {numberOfInstallments && (
            <p className="text-[10px] font-light text-nowrap">
              {installmentsSubtitle[numberOfInstallments ?? 1]}
            </p>
          )}
          <p className="md:text-xl text-base font-bold">
            {currencyFormatter.format(installment_price)}
          </p>
        </div>
      </div>
    </button>
  );
};
