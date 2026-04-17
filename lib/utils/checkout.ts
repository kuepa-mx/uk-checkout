import { isObject } from "./index";

export function isCheckoutValid<T extends TCheckout>(checkout: unknown): T {
  if (!checkout) {
    throw new Error("Checkout not found");
  }
  if (!isObject(checkout)) {
    throw new Error("Checkout is not an object");
  }
  if (
    "lead" in checkout &&
    isObject(checkout.lead) &&
    "carrera" in checkout.lead &&
    isObject(checkout.lead.carrera) &&
    !checkout.lead.carrera?.carrera_id
  ) {
    throw new Error("Career not found");
  }
  if (
    "lead" in checkout &&
    isObject(checkout.lead) &&
    "pais" in checkout.lead &&
    isObject(checkout.lead.pais) &&
    !checkout.lead.pais?.pais_id
  ) {
    throw new Error("Country not found");
  }
  return checkout as T;
}