import { TCheckout } from "@/lib/types/checkout";

// Component when the checkout is "payment_generated" or "paid"
export default function CheckoutDetails({ checkout }: { checkout: TCheckout }) {
  if (
    checkout.checkout_status !== "payment_generated" &&
    checkout.checkout_status !== "paid"
  ) {
    return null;
  }
  return (
    <div className="flex flex-col gap-4 h-full grow">
      <h2>Detalles del checkout</h2>
      <div className="flex gap-1 items-start justify-stretch *:flex-1">
        <Field label="Nombre" value={checkout.lead.nombre} />
        <Field
          label="Correo universitario"
          value={checkout.lead.correo_universitario}
        />
      </div>
      <div className="flex gap-1 items-start justify-stretch *:flex-1">
        <Field label="Carrera" value={checkout.lead.carrera.carrera_nombre} />
        <Field label="Grupo" value={checkout.lead.grupo.grupo_nombre} />
      </div>
      <Field label="Fecha de inicio" value={checkout.selected_fecha_inicio} />
      <Field label="Método de pago" value={checkout.payment_method} />
      <Field label="Link de pago" value={checkout.payment_link} />
      <Field label="ID de pago" value={checkout.pago_id} />
      <Field label="Fecha de pago" value={checkout.paid_at} />
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-sm text-uk-blue-text/80">{label}</p>
      <p className="text-base font-medium text-uk-blue-text">{value ?? "-"}</p>
    </div>
  );
}
