"use client";
import { useForm, SubmitHandler } from "react-hook-form";
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
import TotalAmount from "@/components/total-amount";
import { Calendar, CreditCard, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TCheckout } from "@/lib/types/checkout";
import { capitalize } from "@/lib/utils";
import { updateLead } from "@/lib/api";

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
  const dates = APERTURE_DATES.map((date) => new Date(date));
  const closestDates = dates
    .filter((date) => date >= currentDate)
    .sort((a, b) => a.getTime() - b.getTime());

  return closestDates.slice(0, 2).map((date) => ({
    label: date.toISOString().split("T")[0],
    value: date.toISOString().split("T")[0],
  }));
}

const schema = yup.object().shape({
  firstName: yup.string().required("El nombre es requerido"),
  lastName: yup.string().required("El apellido es requerido"),
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
}: {
  careers: TCareer[];
  discounts: TDiscount[];
  checkout: TCheckout;
}) {
  const [firstName = "", lastName = ""] =
    checkout.lead?.nombre?.split(" ").filter(Boolean) || [];
  const form = useForm<TCheckoutForm>({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      career: checkout.lead?.carrera?.carrera_id || "",
      startingDate: "",
      discountType: "5596f3c7-f73f-43db-a130-c018be03e7f7", // Pago Mensual
      totalAmount: null,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<TCheckoutForm> = async (data) => {
    const body = {
      university_email: `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@ukuepa.com`,
      discount: data.discountType,
      career: data.career,
      lead_id: checkout.lead_id,
      starting_date: data.startingDate,
      total_amount: data.totalAmount,
    };

    // If the career is diferent from the initial career, update the lead before submitting the form
    if (data.career !== checkout.lead?.carrera?.carrera_id) {
      console.log("Career changed, updating lead");
      await updateLead(checkout.lead_id, {
        carrera: {
          carrera_id: data.career,
        },
      });
    }

    // Update the fecha_inicio before submitting the form

    alert(JSON.stringify(body, null, 2));
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-1 items-start">
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

        <FormField
          control={form.control}
          name="discountType"
          render={({ field }) => (
            <FormItem>
              <FieldLabel htmlFor="discount-type">
                <CreditCard className="size-4" />
                Plan de pago
              </FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="discount-type" className="w-full">
                  <SelectValue placeholder="Selecciona un plan de pago" />
                </SelectTrigger>
                <SelectContent>
                  {discounts
                    .sort((a, b) =>
                      a.descuento_nombre.localeCompare(b.descuento_nombre)
                    )
                    .map((discount) => (
                      <SelectItem
                        key={discount.descuento_id}
                        value={discount.descuento_id}
                      >
                        {capitalize(discount.descuento_nombre)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <TotalAmount checkoutId={checkout.checkout_id} />
        <Button type="submit" className="float-end">
          Ir al pago
        </Button>
      </form>
    </Form>
  );
}
