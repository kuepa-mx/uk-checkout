"use client";
import WhatsappIcon from "@/components/icons/WhatsappIcon";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

const SUPPORT_NUMBER = "+1 (551) 249-9500";

const serializePhoneNumber = (phoneNumber: string) =>
  phoneNumber
    .replace("+", "")
    .replaceAll(" ", "")
    .replace("-", "")
    .replace("(", "")
    .replace(")", "");

export default function CheckoutSubmitError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  const params = new URLSearchParams();
  params.set(
    "text",
    "Hola, tuve un problema al generar mi link de pago. ¿Me pueden ayudar?"
  );

  return (
    <div className="flex flex-col gap-2 items-start h-full grow">
      <span className="flex items-center gap-2 text-foreground">
        <AlertCircleIcon />
        <h1 className="text-lg font-medium">No pudimos generar tu link de pago</h1>
      </span>
      <p className="text-sm text-foreground font-medium mt-2">
        Volvé a intentarlo en unos minutos. Si sigue fallando, escribinos por WhatsApp y lo
        resolvemos con vos.
      </p>
      <div className="flex gap-2 mt-auto">
        <Button variant="outline" className="font-semibold" onClick={onRetry}>
          Reintentar
        </Button>
        <Link
          href={`https://wa.me/${serializePhoneNumber(
            SUPPORT_NUMBER
          )}?${params.toString()}`}
          target="_blank"
          rel="noopener noreferrer">
          <Button
            variant="outline"
            className="border-green-600/80 font-semibold shadow-sm shadow-green-500/20">
            <WhatsappIcon className="text-green-500" />
            {SUPPORT_NUMBER}
          </Button>
        </Link>
      </div>
    </div>
  );
}
