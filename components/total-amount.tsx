import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { computeTotalAmount } from "@/lib/api";
import { Field, FieldError } from "./ui/field";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function TotalAmount({ checkoutId }: { checkoutId: string }) {
  const { setValue, setError } = useFormContext();
  const { errors } = useFormState();
  const discountId = useWatch({ name: "discountType" });
  const totalAmount = useWatch({ name: "totalAmount" });

  const [loading, setLoading] = useState(!totalAmount);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTotalAmount() {
      setLoading(true);
      try {
        const total = await computeTotalAmount(checkoutId, discountId, {
          signal: controller.signal,
        });
        setValue("totalAmount", total);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(err);
          setError("totalAmount", {
            message: "Error al calcular el monto total",
          });
        }
      }
      setLoading(false);
    }

    fetchTotalAmount();
    return () => controller.abort();
  }, [checkoutId, discountId, setValue, setError]);

  return (
    <Field>
      <div className="flex flex-col bg-zinc-800 p-2 rounded-md mt-4 shadow-sm h-20">
        {loading ? (
          <div className="flex items-center gap-2 justify-center my-auto">
            <Spinner />
            <span>Calculando...</span>
          </div>
        ) : !!errors.totalAmount ? (
          <FieldError>
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errors.totalAmount?.message?.toString()}
              </AlertDescription>
            </Alert>
          </FieldError>
        ) : (
          <div className="flex flex-col my-auto mx-2">
            <span className="text-sm">Monto total:</span>{" "}
            <span className="text-2xl font-medium">${totalAmount}</span>
          </div>
        )}
      </div>
    </Field>
  );
}
