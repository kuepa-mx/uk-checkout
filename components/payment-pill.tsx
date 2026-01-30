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
  onClick?: () => void;
  isSelected?: boolean;
  loading?: boolean;
} & TPaymentOption;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const installmentsSubtitle: Record<number, string> = {
  4: "Hasta 4 cuotas de",
  12: "Hasta 12 cuotas de",
};

export const PaymentPill = ({
  id,
  label,
  original_price,
  installment_price,
  discount_percentage,
  onClick,
  isSelected,
  loading,
  final_price,
  numberOfInstallments,
  bestOption,
}: TPaymentPillProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      key={id}
      disabled={!!loading}
      className={
        "rounded-2xl border px-3 py-3 text-left transition hover:border-uk-blue-text relative shadow-sm " +
        (bestOption ? "" : "") +
        (isSelected
          ? "outline outline-uk-orange -outline-offset-1"
          : "border-[#0B1F3A]/15") +
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
          <div className="flex items-center gap-1">
            <span className="md:text-base text-sm font-semibold">{label}</span>
            {/* Discount Percentage Badge */}
            {discount_percentage && discount_percentage > 0 ? (
              <span className="text-xs font-medium border text-uk-orange border-uk-orange px-1 rounded-lg">
                -{discount_percentage * 100}%
              </span>
            ) : null}
            {/* Best Option Badge */}
            {bestOption && <p>✨</p>}
          </div>
          <span className="flex items-center gap-1 mt-1 scale-90 md:scale-100 origin-left">
            <p className="text-xs font-light">Total:</p>
            {final_price !== installment_price && (
              <p className="text-xs opacity-85 font-light line-through">
                {currencyFormatter.format(original_price ?? 0)}
              </p>
            )}
            <p className="text-xs font-semibold">
              {currencyFormatter.format(final_price ?? 0)}
            </p>
          </span>
        </div>
        <div className="text-end space-y-1">
          {numberOfInstallments &&
            installmentsSubtitle[numberOfInstallments] && (
              <p className="text-[10px] font-light text-nowrap">
                {installmentsSubtitle[numberOfInstallments]}
              </p>
            )}
          <p className="md:text-xl text-base font-bold">
            {currencyFormatter.format(installment_price ?? 0)}
          </p>
        </div>
      </div>
    </button>
  );
};
