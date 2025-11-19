"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const bullets = [
  "Titulación automática y sin costo",
  "Mensualidad congelada",
  "Sin costo de matrícula ni reinscripción",
  "RVOE oficial y Apostilla de la Haya",
  "Certificaciones de universidades internacionales",
  "Bolsa de trabajo",
  "Horarios flexibles",
  "Taller de inglés incluido",
  "Clases en vivo 1 vez por semana",
  "Sin gastos ocultos",
];
// - Titulación automática y sin costo
// - Mensualidad congelada
// - Sin costo de matrícula ni reinscripción
// - RVOE oficial y Apostilla de la Haya
// - Certificaciones de universidades internacionales
// - Bolsa de trabajo
// - Horarios flexibles
// - Taller de inglés incluido
// - Clases en vivo 1 vez por semana
// - Sin gastos ocultos

export default function CareerSummaryCard({
  career,
}: {
  career: TCareer | undefined;
}) {
  if (!career || !career.url_pdf) {
    return null;
  }

  return (
    <Card className="bg-uk-blue-text">
      <CardHeader>
        <p className="text-sm font-semibold text-white">
          Beneficios de programa
        </p>
      </CardHeader>
      <CardContent>
        {/* <p className="text-[11px] leading-snug text-white/90 line-clamp-3">
          Programa orientado a resultados, con módulos prácticos, mentoría
          semanal y proyectos aplicados. Duración flexible y evaluaciones
          continuas para impulsar tu empleabilidad.
        </p> */}
        <div>
          <ScrollArea
            className="h-40 rounded-md border border-white/20 bg-white/5 max-"
            scrollHideDelay={0}
          >
            <ul className="text-xs font-medium leading-relaxed text-white ml-6 pr-4 py-2 space-y-1 list-disc list-outside">
              {bullets.map((bullet) => (
                <li key={bullet} className="text-white/95">
                  {bullet}
                </li>
              ))}
            </ul>
            <ScrollBar />
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={career.url_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            type="button"
            className="text-sm text-uk-blue-text bg-white hover:bg-white/90 w-full"
          >
            Ver temario
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
