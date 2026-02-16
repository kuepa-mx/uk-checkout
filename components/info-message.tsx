"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import useIsFromLanding from "@/lib/hooks/useIsFromLanding";

export default function InfoMessage() {
  const isFromLanding = useIsFromLanding();
  const [expanded, setExpanded] = useState(true);

  if (!isFromLanding) {
    return null;
  }

  return (
    <div className={cn("flex flex-col text-white mb-2", expanded ? "space-y-2" : "space-y-0")}>
      <button className="flex items-center gap-2 w-full justify-between" onClick={() => setExpanded(!expanded)} type="button">
        <h2 className="font-semibold text-left">
          Gracias por tu consulta, hemos recibido tu registro exitosamente.
        </h2>
        {/* <ChevronDownIcon className={cn("size-4 shrink-0 transition-transform duration-200", expanded ? "rotate-180" : "")} /> */}
      </button>
      <div className={cn("transition-all duration-500 ease-in-out space-y-2", expanded ? "opacity-100 max-h-[9999px]" : "opacity-0 max-h-0")} onClick={() => setExpanded(!expanded)}>
        <p className="text-sm">
          Puedes completar tu inscripción eligiendo el plan que más se adapte a tus necesidades. Si no completas este paso, un asesor de la Uk se comunicará contigo por teléfono. Además, hemos enviado un mensaje por WhatsApp desde la cuenta oficial de la Universidad. En el caso de que no puedas contestar la llamada, puedes continuar la conversación por WhatsApp.
        </p>
        {/* <ChevronDownIcon className={cn("size-5 shrink-0 transition-transform duration-200 mx-auto", expanded ? "rotate-180" : "")} /> */}
      </div>
    </div>
  )
}