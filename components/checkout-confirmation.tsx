import { UseFormReturn, useFormState, useWatch } from "react-hook-form";
import { TCheckoutForm } from "./checkout-form";
import { PaymentPill, TPaymentPillProps } from "./payment-pill";
import { format } from "date-fns";
import { Button } from "./ui/button";
import FormSubtitle from "./checkout-form-subtitle";

export default function InscriptionDataReviewStep({
  form,
  onPrevClick,
  onConfirmClick,
  selectedPaymentOption,
  career,
}: {
  form: UseFormReturn<TCheckoutForm>;
  onPrevClick: () => void;
  onConfirmClick: () => void;
  selectedPaymentOption?: TPaymentPillProps | undefined;
  career?: TCareer | undefined;
}) {
  const firstName = useWatch({ name: "firstName", control: form.control });
  const lastName = useWatch({ name: "lastName", control: form.control });
  const startingDate = useWatch({
    name: "startingDate",
    control: form.control,
  });

  const formState = useFormState({ control: form.control });

  return (
    <div className="flex flex-col gap-2 h-full flex-1 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
        <Field label="Nombre" value={firstName} />
        <Field label="Apellido" value={lastName} />
        <Field label="Carrera" value={career?.carrera_nombre} />
        <Field
          label="Fecha de inicio"
          value={format(new Date(`${startingDate}T00:00:00`), "dd/MM/yyyy")}
        />
      </div>

      <div className="flex flex-col gap-1 my-4">
        <p>Opcion de pago</p>

        {selectedPaymentOption && <PaymentPill {...selectedPaymentOption} isSelected={true} />}
      </div>
      {/* <CareerSummaryCard career={career} /> */}

      <div className="flex flex-col gap-2">
        <Button type="button" onClick={onPrevClick} variant="outline">
          Volver
        </Button>
        <Button
          type="submit"
          onClick={onConfirmClick}
          disabled={formState.isSubmitting}
        >
          Confirmar y pagar
        </Button>
      </div>
      <FormSubtitle />
    </div>
  );
}

const Field = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="flex flex-col">
    <p className="text-xs text-uk-blue-text/90">{label}</p>
    <p className="text-sm font-medium text-uk-blue-text">{value ?? "-"}</p>
  </div>
);
