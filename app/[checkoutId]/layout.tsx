import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-full my-4 mb-14 overflow-y-auto">
      <Image
        src="/logo.png"
        alt="UK Logo"
        width={200}
        height={80}
        className="mb-1"
      />
      <Card className="relative overflow-hidden mx-2">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#FF7A00] via-[#FF9F40] to-[#FF7A00]" />

        <CardContent className="flex flex-col items-center h-full grow">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
