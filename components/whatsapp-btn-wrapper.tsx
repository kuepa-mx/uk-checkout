"use client";

import WhatsappBtn from "./whatsapp-btn";
import useIsFromLanding from "@/lib/hooks/useIsFromLanding";

export default function WhatsappBtnWrapper() {
  const isFromLanding = useIsFromLanding();
  if (isFromLanding) {
    return null;
  }

  return <WhatsappBtn />;
}
