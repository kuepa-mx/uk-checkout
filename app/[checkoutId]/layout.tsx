import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center my-2">
      <Image
        src="/logo.png"
        alt="UK Logo"
        width={200}
        height={80}
        className="mb-1"
      />
      <Card className="max-w-md min-w-xs min-h-[450px] relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#FF7A00] via-[#FF9F40] to-[#FF7A00]" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-uk-orange" />
            <h1 className="text-uk-blue-text">Inscripción Express</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
