"use client";

import { useSearchParams } from "next/navigation";
import WhatsappBtn from "./whatsapp-btn";

export default function WhatsappBtnWrapper() {
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("fromLanding");

  // Hide the button if fromLanding=true
  if (fromLanding === "true") {
    return null;
  }

  return <WhatsappBtn />;
}
