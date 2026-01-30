"use client";

import {
  ArrowRight,
  ArrowUpRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react";
import { PaymentPill, TPaymentPillProps } from "./payment-pill";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "./ui/button";

// Component when the checkout is "payment_generated" or "paid"
export default function CheckoutDetails({
  checkout,
  selectedPaymentOption,
}: {
  checkout: TCheckout;
  selectedPaymentOption?: TPaymentPillProps | undefined;
}) {
  if (
    checkout.checkout_status !== "payment_generated" &&
    checkout.checkout_status !== "paid"
  ) {
    return null;
  }

  const universityEmail = checkout.lead.correo_universitario.endsWith(
    "@ukuepa.com"
  )
    ? checkout.lead.correo_universitario
    : `${checkout.lead.correo_universitario}@ukuepa.com`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-h-full">
      <div className="flex items-center gap-2 justify-center p-4 col-span-2 text-2xl text-uk-blue-text">
        {checkout.checkout_status === "payment_generated" ? (
          <>
            <ClockIcon />
            <p>Pago pendiente</p>
          </>
        ) : (
          <>
            <CheckCircleIcon />
            <p>Pago realizado</p>
          </>
        )}
      </div>

      <Field
        label="Nombre"
        value={checkout.lead.nombre}
        className="col-span-2"
      />
      <Field
        label="Correo universitario"
        value={universityEmail}
        className="col-span-2"
      />

      <Field
        label="Carrera"
        value={checkout.lead.carrera.carrera_nombre}
        className="col-span-2"
      />
      <Field label="Grupo" value={checkout.lead.grupo.grupo_nombre} />

      <Field
        label="Fecha de inicio"
        value={
          checkout.selected_fecha_inicio
            ? format(
                new Date(`${checkout.selected_fecha_inicio}T00:00:00`),
                "dd/MM/yyyy"
              )
            : "-"
        }
      />
      {selectedPaymentOption && (
        <div className="col-span-2 grid grid-cols-1 gap-2">
          <span className="text-sm text-uk-blue-text/80">Opción de pago</span>
          <PaymentPill
            id={selectedPaymentOption.id}
            label={selectedPaymentOption.label}
            subtitle={selectedPaymentOption.subtitle}
            isSelected
            original_price={selectedPaymentOption?.original_price}
            final_price={selectedPaymentOption?.final_price}
            installment_price={selectedPaymentOption?.installment_price}
          />
        </div>
      )}
      {checkout.checkout_status === "payment_generated" && (
        <Link
          href={checkout.payment_link!}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2"
        >
          <Button className="px-12 w-full md:col-span-2">
            Ir al pago
            <ArrowRight className="size-4 mt-0" />
          </Button>
        </Link>
      )}
      {checkout.checkout_status === "paid" && (
        <Field
          label="Fecha de pago"
          value={format(checkout.paid_at!, "dd/MM/yyyy")}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-sm text-uk-blue-text/80">{label}</p>
      <p className="text-base font-medium text-uk-blue-text">{value ?? "-"}</p>
    </div>
  );
}
