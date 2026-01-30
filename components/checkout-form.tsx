"use client";
import {
  useForm,
  SubmitHandler,
  useWatch,
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
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { updateCheckout } from "@/app/actions/checkout";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import PaymentPills from "./payment-pills";
import { TPaymentPillProps } from "./payment-pill";
import CareerSummaryCard from "./career-summary-card";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { checkoutFormSchema } from "@/lib/api/schemas";
import { handleCheckoutSubmission } from "@/app/actions/checkout";
import { update } from "@/app/actions/entity";
import { Entity } from "@/lib/enum/entity";
import InscriptionDataReviewStep from "./checkout-confirmation";
import FormSubtitle from "./checkout-form-subtitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

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

function getDefaultPaymentOption(paymentOptions: TPaymentPillProps[]) {
  const defaultOption = paymentOptions.find((option) => option.bestOption);
  console.log("defaultOption", defaultOption);
  if (defaultOption) {
    return defaultOption.id;
  }
  return paymentOptions[0]?.id || "";
}

export type TCheckoutForm = yup.InferType<typeof checkoutFormSchema>;

export default function CheckoutForm({
  careers,
  discounts,
  checkout,
  paymentOptions,
}: {
  careers: TCareer[];
  discounts: TDiscount[];
  checkout: TCheckout;
  paymentOptions: TPaymentPillProps[];
}) {
  const router = useRouter();
  const [firstName = "", lastName = ""] =
    checkout.lead?.nombre?.split(" ").filter(Boolean) || [];
  const form = useForm<TCheckoutForm>({
    mode: "all",
    reValidateMode: "onBlur",
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      career: checkout.lead?.carrera?.carrera_id || "",
      startingDate: checkout.selected_fecha_inicio || "",
      discountType:
        checkout.selected_plan_type || getDefaultPaymentOption(paymentOptions),
      totalAmount:
        paymentOptions.find(
          (option) => option.id === checkout.selected_plan_type
        )?.final_price ?? 0,
    },
    resolver: yupResolver(checkoutFormSchema, {
      strict: true,
      abortEarly: false,
    }),
  });

  const selectedCareerId = useWatch({ name: "career", control: form.control });
  const formState = useFormState({ control: form.control });
  const discountType = useWatch({
    name: "discountType",
    control: form.control,
  });
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [isPending, startTransition] = useTransition();
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
        checkoutFormSchema.cast(data),
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

  useEffect(() => {
    const unsub = form.subscribe({
      name: "discountType",
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        startTransition(async () => {
          await updateCheckout(checkout.checkout_id, {
            selected_plan_type: values.discountType,
            checkout_status: "in_progress",
          });
        });
      },
    });

    return () => {
      unsub();
    };
  }, [form, checkout.checkout_id]);

  const isCheckoutFormCardValid = !(
    formState.errors.firstName ||
    formState.errors.lastName ||
    formState.errors.career ||
    formState.errors.startingDate
  );
  const isLoading = formState.isSubmitting || isPending;

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
        form={form}
        onPrevClick={() => setConfirmationStep(false)}
        onConfirmClick={form.handleSubmit(onSubmit)}
        career={careers.find(
          (career) => career.carrera_id === selectedCareerId
        )}
        selectedPaymentOption={paymentOptions.find(
          (option) => option.id === discountType
        )}
      />
    );

  return (
    <Form {...form}>
      <form
        className={cn(
          "space-y-2 grow flex flex-col w-full",
          isLoading && "pointer-events-none"
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldRow>
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
                <FieldLabel htmlFor="lastName">Apellido</FieldLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldRow>
        <FieldRow>
          <FormField
            control={form.control}
            name="career"
            render={({ field }) => (
              <FormItem>
                <FieldLabel htmlFor="career">Carrera</FieldLabel>
                <Select
                  {...field}
                  disabled={isLoading}
                  onValueChange={(value) => {
                    startTransition(async () => {
                      field.onChange(value);
                      await update<TLead>(Entity.LEAD, checkout.lead.lead_id, {
                        carrera: {
                          carrera_id: value,
                        },
                      });
                      router.refresh();
                    });
                  }}
                  value={field.value}
                >
                  <SelectTrigger
                    id="career"
                    className="w-full text-ellipsis overflow-hidden"
                  >
                    <SelectValue placeholder="Selecciona una carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    {careers.map((career) => (
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
                <FieldLabel htmlFor="starting-date">Fecha de inicio</FieldLabel>
                <Select
                  onValueChange={(value) => {
                    startTransition(async () => {
                      field.onChange(value);
                      await updateCheckout(checkout.checkout_id, {
                        selected_fecha_inicio: value,
                        checkout_status: "in_progress",
                      });
                    });
                  }}
                  value={field.value}
                >
                  <SelectTrigger
                    id="starting-date"
                    className={cn("w-full")}
                    data-error={!!formState.errors.startingDate}
                    aria-invalid={!!formState.errors.startingDate}
                  >
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
        </FieldRow>

        <Accordion
          type="single"
          collapsible
          defaultValue="payment"
        // disabled={!isCheckoutFormCardValid}
        >
          <AccordionItem value="payment" data-error={!isCheckoutFormCardValid}>
            <AccordionTrigger className="text-sm font-semibold text-uk-blue-text ml-2">
              Opciones de pago
            </AccordionTrigger>
            <AccordionContent>
              <PaymentPills paymentOptions={paymentOptions} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col items-center justify-center gap-2 mt-auto">
          <Button
            type="button"
            className="w-full"
            disabled={isLoading}
            onClick={() => {
              form.trigger().then((isValid) => {
                if (!isValid) {
                  return;
                }
                // Update lead with the data
                startTransition(async () => {
                  await update<TLead>(Entity.LEAD, checkout.lead.lead_id, {
                    nombre: `${form.getValues("firstName")} ${form.getValues(
                      "lastName"
                    )}`,
                    carrera: {
                      carrera_id: form.getValues("career"),
                    },

                  });

                  setConfirmationStep(true);
                });
              });
            }}
          >
            {isLoading ? (
              <Spinner className="size-4 animate-spin" />
            ) : (
              "Siguiente"
            )}
          </Button>
          <FormSubtitle />
        </div>
      </form>
    </Form>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-1 md:items-start items-stretch justify-stretch *:flex-1">
      {children}
    </div>
  );
}