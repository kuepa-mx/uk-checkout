// {
//   "checkout_id": "1d2087cc-febb-4d9f-b975-5499ff18943b",
//   "checkout_url": "/checkout/1d2087cc-febb-4d9f-b975-5499ff18943b",
//   "checkout_status": "created",
//   "expires_at": "2025-12-05T18:42:02.808Z",
//   "lead_id": "01d72748-2a64-45e1-a092-40ab4dae6950"
// }

declare type TCheckout = {
  checkout_status:
    | "created"
    | "in_progress"
    | "payment_generated"
    | "paid"
    | "expired"
    | "canceled";
  expires_at: string;
  checkout_id: string;
  lead: TLead;
  pago_id: string | null;
  generated_by_type: string;
  owner_email: string;
  agent_name: string | null;
  selected_fecha_inicio: string | null;
  selected_plan_type: string | null;
  payment_link: string | null;
  payment_method: string | null;
  payment_link_generated_at: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
};

declare type TUpdateCheckoutDTO = {
  fecha_inicio?: string;
  selected_plan_type?: string;
  checkout_status?: TCheckout["checkout_status"];
  payment_method?: "mercadopago" | "flywire";
  payment_link?: string;
  owner_email?: string;
  agent_name?: string;
};
