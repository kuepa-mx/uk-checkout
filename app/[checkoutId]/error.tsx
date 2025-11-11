"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTransition } from "react";

const SUPPORT_NUMBER = "+1 (551) 249-9500";
const serializePhoneNumber = (phoneNumber: string) =>
  phoneNumber
    .replace("+", "")
    .replaceAll(" ", "")
    .replace("-", "")
    .replace("(", "")
    .replace(")", "");

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { checkoutId } = useParams();
  const params = new URLSearchParams();
  params.set(
    "text",
    "Hola, tengo un problema con mi pago de inscripción. Mi checkout ID es: " +
      checkoutId +
      ". El error es: " +
      error.message
  );
  return (
    <div className="flex flex-col gap-2 items-start h-full grow">
      <span className="flex items-center gap-2">
        <AlertCircleIcon />
        <h1 className="text-lg font-medium">Error</h1>
      </span>
      <p className="text-sm font-medium mt-2">
        Ha ocurrido un error al cargar la página. Por favor, intenta nuevamente.
        Si el error persiste, contacta a nuestros operadores al{" "}
        <a href={`tel:${SUPPORT_NUMBER}`}>{SUPPORT_NUMBER}</a>
      </p>

      <p className="text-xs text-muted-foreground font-mono mt-4">
        {error.message}
      </p>
      <div className="flex gap-2 mt-auto justify-between">
        <Button
          onClick={() => startTransition(() => reset())}
          variant="outline"
        >
          <RefreshCcwIcon
            className={"size-5" + (isPending ? " animate-spin" : "")}
          />
        </Button>
        <Link
          href={`https://wa.me/${serializePhoneNumber(
            SUPPORT_NUMBER
          )}?${params.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Button
            variant="link"
            className="shadow group-hover:shadow-uk-orange"
          >
            <WhatsappIcon className="size-5 " />
            {SUPPORT_NUMBER}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/whatsapp-icon.svg"
      alt="Whatsapp"
      width={24}
      height={24}
      className={className}
    />
  );
}
