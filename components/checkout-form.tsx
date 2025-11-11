"use client";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
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
import { Calendar, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TCheckout } from "@/lib/types/checkout";
import { updateCheckoutStartingDate, updateLead } from "@/lib/api";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import PaymentPills from "./payment-pills";
import CareerSummaryCard from "./career-summary-card";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

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
  discountType: yup.string().required("El plan de pago es requerido"),
  totalAmount: yup.number().required("El monto total es requerido").nullable(),
});

export type TCheckoutForm = yup.InferType<typeof schema>;

export default function CheckoutForm({
  careers,
  discounts,
  checkout,
  cost,
}: {
  careers: TCareer[];
  discounts: TDiscount[];
  checkout: TCheckout;
  cost: TCost;
}) {
  const [firstName = "", lastName = ""] =
    checkout.lead?.nombre?.split(" ").filter(Boolean) || [];
  const form = useForm<TCheckoutForm>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      career: checkout.lead?.carrera?.carrera_id || "",
      startingDate: checkout.selected_fecha_inicio || "",
      discountType: "5596f3c7-f73f-43db-a130-c018be03e7f7", // Pago Mensual
      totalAmount: null,
    },
    resolver: yupResolver(schema),
  });
  const selectedCareerId = useWatch({ name: "career", control: form.control });

  useEffect(() => {
    // const unsubscribe = form.subscribe({
    //   name: ["startingDate", "career"],
    //   formState: {
    //     values: true,
    //   },
    //   callback: ({ values, defaultValues }) => {
    //     if (values.startingDate !== defaultValues?.startingDate) {
    //       updateCheckoutStartingDate(checkout.checkout_id, values.startingDate)
    //         .then((data) => {
    //           console.log("Fecha de inicio actualizada", data);
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //         });
    //     }
    //     if (values.career !== defaultValues?.career) {
    //       updateLead(checkout.lead.lead_id, {
    //         carrera: {
    //           carrera_id: values.career,
    //         },
    //       })
    //         .then((data) => {
    //           console.log("Carrera actualizada", data);
    //         })
    //         .catch((error) => {
    //           console.error(error);
    //         });
    //     }
    //   },
    // });
    // return () => unsubscribe();
  }, [form, checkout.checkout_id, checkout.lead.lead_id]);

  const onSubmit: SubmitHandler<TCheckoutForm> = async (data) => {
    const body = {
      university_email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@ukuepa.com`,
      discount: data.discountType,
      career: data.career,
      lead_id: checkout.lead.lead_id,
      starting_date: data.startingDate,
      total_amount: data.totalAmount,
    };
    alert(JSON.stringify(body, null, 2));
  };

  const isLoading = form.formState.isSubmitting || form.formState.isLoading;

  return (
    <Form {...form}>
      <form
        className={cn(
          "space-y-2 h-full grow flex flex-col",
          isLoading && "opacity-50 pointer-events-none"
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card>
          <CardContent className="space-y-2">
            <div className="flex gap-1 items-start justify-stretch *:flex-1">
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
                    <SelectTrigger id="career" className="w-full">
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

        <PaymentPills discounts={discounts} cost={cost} />
        <div className="flex flex-col items-center justify-center gap-2 mt-auto">
          <Button type="submit" className="w-full">
            Confirmar datos y pagar
          </Button>
          <p className="text-[10px] text-uk-blue-text/70 text-center">
            Al continuar aceptas los términos y el aviso de privacidad.
          </p>
        </div>
      </form>
    </Form>
  );
}
