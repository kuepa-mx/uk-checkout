import WhatsappIcon from "@/components/icons/WhatsappIcon";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";
import Link from "next/link";

const SUPPORT_NUMBER = "+1 (551) 249-9500";

const serializePhoneNumber = (phoneNumber: string) =>
  phoneNumber
    .replace("+", "")
    .replaceAll(" ", "")
    .replace("-", "")
    .replace("(", "")
    .replace(")", "");

export default function CheckoutExpired({ expiresAt }: { expiresAt?: string }) {
  const params = new URLSearchParams();
  params.set(
    "text",
    "Hola, mi link de pago expiró. ¿Me pueden ayudar a reactivarlo?"
  );

  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="flex flex-col gap-2 items-start h-full grow">
      <span className="flex items-center gap-2 text-foreground">
        <ClockIcon />
        <h1 className="text-lg font-medium">Link expirado</h1>
      </span>
      <p className="text-sm text-foreground font-medium mt-2">
        Este link de pago ya no está disponible.
        {formattedExpiry ? (
          <>
            {" "}
            Venció el <span className="font-semibold">{formattedExpiry}</span>.
          </>
        ) : null}{" "}
        Escribinos por WhatsApp para solicitar uno nuevo.
      </p>
      <div className="flex gap-2 mt-auto">
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
