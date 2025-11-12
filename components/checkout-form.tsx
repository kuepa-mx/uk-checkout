"use client";
import {
  useForm,
  SubmitHandler,
  useWatch,
  useFormContext,
  UseFormReturn,
  useFormState,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ArrowLeftIcon,
  Calendar,
  CheckCheckIcon,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import {
  generatePaymentLink,
  getGroupsByCareerCode,
  handleCheckoutSubmission,
  updateCheckout,
  updateLead,
} from "@/lib/api";
import { Card, CardContent, CardFooter } from "./ui/card";
import { format } from "date-fns";
import PaymentPills, { PaymentPill } from "./payment-pills";
import CareerSummaryCard from "./career-summary-card";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryClient } from "./providers/query-client-provider";

const APERTURE_DATES = [
  "2025-11-24",
  "2026-01-19",
  "2026-02-09",
  "2026-03-02",
  "2026-04-06",
  "2026-04-27",
  "2026-05-18",
  "2026-06-08",
  "2026-06-29",
  "2026-07-20",
  "2026-08-17",
  "2026-09-07",
  "2026-09-28",
  "2026-10-19",
  "2026-11-09",
  "2026-11-30",
] as const;

function getApertureDateOptions() {
  // Return the 2 closest dates after the current date
  const currentDate = new Date();
  const dates = APERTURE_DATES.map((date) => new Date(`${date}T00:00:00`));
  const closestDates = dates
    .filter((date) => date >= currentDate)
    .sort((a, b) => a.getTime() - b.getTime());

  return closestDates.slice(0, 2).map((date) => ({
    label: format(date, "dd/MM/yyyy"),
    value: date.toISOString().split("T")[0],
  }));
}

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("El nombre es requerido")
    .matches(/^[a-zA-Z]+$/, "El nombre solo puede contener letras"),
  lastName: yup
    .string()
    .required("El apellido es requerido")
    .matches(/^[a-zA-Z]+$/, "El apellido solo puede contener letras"),
  career: yup.string().required("La carrera es requerida"),
  startingDate: yup.string().required("La fecha de inicio es requerida"),
  discountType: yup
    .string()
    .required("El plan de pago es requerido")
    .min(1, "El plan de pago es requerido"),
  totalAmount: yup.number().required("El monto total es requerido"),
});

export type TCheckoutForm = yup.InferType<typeof schema>;

export default function CheckoutForm({
  careers,
  discounts,
  checkout,
}: {
  careers: TCareer[];
  discounts: TDiscount[];
  checkout: TCheckout;
}) {
  const router = useRouter();
  const [firstName = "", lastName = ""] =
    checkout.lead?.nombre?.split(" ").filter(Boolean) || [];
  const form = useForm<TCheckoutForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      career: checkout.lead?.carrera?.carrera_id || "",
      startingDate: checkout.selected_fecha_inicio || "",
      discountType: checkout.selected_plan_type || "",
      totalAmount: 0,
    },
    resolver: yupResolver(schema),
  });

  const selectedCareerId = useWatch({ name: "career", control: form.control });
  const formState = useFormState({ control: form.control });
  const [confirmationStep, setConfirmationStep] = useState(false);

  const { mutate: updateLeadMutation, isPending: isUpdatingLead } = useMutation(
    {
      mutationFn: (body: DeepPartial<TLead>) =>
        updateLead(checkout.lead.lead_id, body),
      onSuccess: () => {
        // Invalidate discount price query to recompute the price for the career
        queryClient.invalidateQueries({
          queryKey: ["discountPrice"],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const {
    mutate: updateCheckoutMutation,
    isPending: isUpdatingCheckoutStartingDate,
  } = useMutation({
    mutationFn: (body: TUpdateCheckoutDTO) =>
      updateCheckout(checkout.checkout_id, {
        ...body,
      }),
    onSuccess: (data) => {
      console.log("Checkout actualizado", data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const unsubscribeFromCareer = form.subscribe({
      name: "career",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        updateLeadMutation({
          carrera: {
            carrera_id: values.career,
          },
        });
      },
    });

    const unsubscribeFromStartingDate = form.subscribe({
      name: "startingDate",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        console.log("Actualizando fecha de inicio", values.startingDate);
        updateCheckoutMutation({
          fecha_inicio: values.startingDate,
          checkout_status: "in_progress",
        });
      },
    });

    const unsubscribeFromDiscountType = form.subscribe({
      name: "discountType",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        updateCheckoutMutation({
          selected_plan_type: values.discountType,
          checkout_status: "in_progress",
        });
      },
    });

    return () => {
      unsubscribeFromCareer();
      unsubscribeFromStartingDate();
      unsubscribeFromDiscountType();
    };
  }, [form, updateCheckoutMutation, updateLeadMutation]);

  const onSubmit = useCallback<SubmitHandler<TCheckoutForm>>(
    async (data) => {
      const discount = discounts.find(
        (discount) => discount.descuento_id === data.discountType
      );
      const career = careers.find(
        (career) => career.carrera_id === data.career
      );
      if (!career) {
        throw new Error(`Carrera no encontrada para el ID: ${data.career}`);
      }
      if (!discount) {
        throw new Error(
          `Descuento no encontrado para el ID: ${data.discountType}`
        );
      }

      const paymentLink = await handleCheckoutSubmission(
        data,
        checkout,
        discount,
        career
      );
      console.log("Payment link", paymentLink);
      if (paymentLink.paymentUrl) {
        window.open(paymentLink.paymentUrl, "_blank");
      }
      router.refresh();
    },
    [careers, discounts, checkout, router]
  );

  const isLoading =
    formState.isSubmitting || isUpdatingCheckoutStartingDate || isUpdatingLead;

  if (formState.isSubmitting) {
    return (
      <div className="flex flex-col items-center gap-2 justify-center h-full grow text-center max-w-[80%]">
        <Spinner className="size-10" />
        Procesando
        <br />
        <span className="text-xs mt-2 whitespace-pre-wrap">
          Serás redirigido a la página de pago en unos segundos.
        </span>
      </div>
    );
  }

  if (confirmationStep)
    return (
      <InscriptionDataReviewStep
        checkout={checkout}
        form={form}
        onPrevClick={() => setConfirmationStep(false)}
        onConfirmClick={form.handleSubmit(onSubmit)}
        discounts={discounts}
        careers={careers}
      />
    );

  return (
    <Form {...form}>
      <form
        className={cn(
          "space-y-2 h-full grow flex flex-col",
          isLoading && "pointer-events-none"
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card>
          <CardContent className="space-y-2">
            <div className="flex flex-col md:flex-row gap-1 md:items-start items-stretch justify-stretch *:flex-1">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="firstName">Nombre</FieldLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel htmlFor="lastName">Apellido(s)</FieldLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="career"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel htmlFor="career">
                    <GraduationCap className="size-4" />
                    Carrera
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id="career"
                      className="w-full text-ellipsis overflow-hidden"
                    >
                      <SelectValue placeholder="Selecciona una carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      {careers
                        .sort((a, b) =>
                          a.carrera_nombre.localeCompare(b.carrera_nombre)
                        )
                        .map((career) => (
                          <SelectItem
                            key={career.carrera_id}
                            value={career.carrera_id}
                          >
                            {career.carrera_nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startingDate"
              render={({ field }) => (
                <FormItem>
                  <FieldLabel htmlFor="starting-date">
                    <Calendar className="size-4" />
                    Fecha de inicio
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="starting-date" className="w-full">
                      <SelectValue placeholder="Selecciona una fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      {getApertureDateOptions().map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CareerSummaryCard
              career={careers.find(
                (career) => career.carrera_id === selectedCareerId
              )}
            />
          </CardContent>
        </Card>

        <PaymentPills
          discounts={discounts}
          checkoutId={checkout.checkout_id}
          career={careers.find(
            (career) => career.carrera_id === selectedCareerId
          )}
        />
        <div className="flex flex-col items-center justify-center gap-2 mt-auto">
          <Button
            type="button"
            className="w-full"
            disabled={isLoading}
            onClick={() => {
              form
                .trigger()
                .then((isValid) => isValid && setConfirmationStep(true));
            }}
          >
            {isLoading ? (
              <Spinner className="size-4 animate-spin" />
            ) : (
              "Siguiente"
            )}
          </Button>
          <p className="text-[10px] text-uk-blue-text/70 text-center">
            Al continuar aceptas los términos y el aviso de privacidad.
          </p>
        </div>
      </form>
    </Form>
  );
}

function InscriptionDataReviewStep({
  checkout,
  form,
  onPrevClick,
  onConfirmClick,
  discounts,
  careers,
}: {
  checkout: TCheckout;
  form: UseFormReturn<TCheckoutForm>;
  onPrevClick: () => void;
  onConfirmClick: () => void;
  discounts: TDiscount[];
  careers: TCareer[];
}) {
  const firstName = useWatch({ name: "firstName", control: form.control });
  const lastName = useWatch({ name: "lastName", control: form.control });
  const career = useWatch({ name: "career", control: form.control });
  const startingDate = useWatch({
    name: "startingDate",
    control: form.control,
  });
  const discountType = useWatch({
    name: "discountType",
    control: form.control,
  });
  const formState = useFormState({ control: form.control });

  const careerData = careers.find(({ carrera_id }) => carrera_id === career);

  return (
    <div className="flex flex-col gap-4 h-full grow">
      <div className="flex gap-1 items-start justify-stretch *:flex-1">
        <Field label="Nombre" value={firstName} />
        <Field label="Apellido" value={lastName} />
      </div>
      <div className="flex gap-1 items-start justify-stretch *:flex-1">
        <Field label="Carrera" value={careerData?.carrera_nombre} />
        <Field
          label="Grupo"
          value={`${careerData?.carrera_codigo}_${startingDate}`}
        />
      </div>
      <div className="flex gap-1 items-start justify-stretch *:flex-1">
        <Field
          label="Fecha de inicio"
          value={format(new Date(`${startingDate}T00:00:00`), "dd/MM/yyyy")}
        />
        <Field
          label="Correo universitario"
          value={`${firstName.toLowerCase()}.${lastName.toLowerCase()}@ukuepa.com`}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <h2 className="text-sm font-semibold text-uk-blue-text">
          Plan de pago
        </h2>
        <PaymentPill
          key={discountType}
          discount={
            discounts.find(
              (discount) => discount.descuento_id === discountType
            )!
          }
          checkoutId={checkout.checkout_id}
          career={careerData!}
          control={form.control}
        />
      </div>

      <div className="flex flex-col gap-2 mt-auto">
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
  <div className="flex flex-col gap-0.5">
    <p className="text-xs text-uk-blue-text/90">{label}</p>
    <p className="text-sm font-medium text-uk-blue-text">{value ?? "-"}</p>
  </div>
);
