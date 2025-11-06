// {
//   "checkout_id": "1d2087cc-febb-4d9f-b975-5499ff18943b",
//   "checkout_url": "/checkout/1d2087cc-febb-4d9f-b975-5499ff18943b",
//   "checkout_status": "created",
//   "expires_at": "2025-12-05T18:42:02.808Z",
//   "lead_id": "01d72748-2a64-45e1-a092-40ab4dae6950"
// }

export type TCheckout = {
  checkout_id: string;
  checkout_url: string;
  checkout_status:
    | "created"
    | "in_progress"
    | "payment_generated"
    | "paid"
    | "expired"
    | "canceled";
  expires_at: string;
  lead_id: string;
  lead: TLead;
};
