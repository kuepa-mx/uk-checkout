"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 items-start justify-center h-full grow p-4">
      <span className="flex items-center gap-2">
        <AlertCircleIcon />
        <h1 className="text-lg">Error</h1>
      </span>
      <p className="text-sm mt-2">
        Ha ocurrido un error al cargar la página. Por favor, intenta nuevamente.
        Si el error persiste, contacta a nuestros operadores en{" "}
        <a href="mailto:operadores@ukuepa.com">operadores@ukuepa.com</a>o llama
        al +57 317 890 0000.
      </p>
      <p className="text-xs text-muted-foreground font-mono">{error.message}</p>
      <Button onClick={() => reset()} className="mt-auto self-end">
        <RefreshCcwIcon />
        Try again
      </Button>
    </div>
  );
}
