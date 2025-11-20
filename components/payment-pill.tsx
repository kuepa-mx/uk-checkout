import { Spinner } from "./ui/spinner";

export type TPaymentPillProps = {
  id: string;
  label: string;
  subtitle: string;
  original_price: number;
  final_price: number;
  spanDoubleColumn?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  loading?: boolean;
};

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const PaymentPill = ({
  id,
  label,
  subtitle,
  original_price,
  final_price,
  spanDoubleColumn,
  onClick,
  isSelected,
  loading,
}: TPaymentPillProps) => {
  return (
    <button
      onClick={() => onClick?.()}
      key={id}
      type="button"
      disabled={loading}
      className={
        "rounded-2xl border px-3 py-3 text-left transition hover:bg-uk-blue-text/10 hover:text-uk-blue-text relative " +
        (isSelected
          ? "border-[#FF7A00]! bg-[#FF7A00]! text-white! shadow-md! "
          : "border-[#0B1F3A]/15 bg-white text-[#0B1F3A] ") +
        (spanDoubleColumn ? " sm:col-span-2" : "") +
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
          "h-8 animate-in slide-in-from-bottom-2 duration-300 fade-in flex items-center justify-between gap-4 " +
          (loading ? "opacity-50" : "")
        }
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-semibold">{label}</span>
          <span className="text-[10px] opacity-85">{subtitle}</span>
        </div>
        <div className="flex flex-col">
          {original_price !== final_price && (
            <span className="text-xs leading-2 font-semibold line-through text-center opacity-85 scale-90">
              {currencyFormatter.format(original_price)}
            </span>
          )}
          <span className="text-base leading-6 font-bold">
            {currencyFormatter.format(final_price)}
          </span>
        </div>
      </div>
    </button>
  );
};
