import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export default function CareerSummaryCard({ career }: { career: TCareer | undefined }) {
  if (!career || !career.url_pdf) {
    return null;
  }

  return (
    <Card className="bg-uk-blue-text">
      <CardHeader>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-white">
            Resumen del programa
          </p>
          <span className="text-[10px] bg-white/10 rounded-md px-2 py-0.5 text-white">
            2 min
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[11px] leading-snug text-white/90 line-clamp-3">
          Programa orientado a resultados, con módulos prácticos, mentoría
          semanal y proyectos aplicados. Duración flexible y evaluaciones
          continuas para impulsar tu empleabilidad.
        </p>
      </CardContent>
      <CardFooter>
        <Link href={career.url_pdf} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button
            type="button"
            className="text-xs text-uk-blue-text bg-white hover:bg-white/90 w-full"
          >
            Ver temario rápido
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
