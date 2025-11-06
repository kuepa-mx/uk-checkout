import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src="/logo.png"
        alt="UK Logo"
        width={300}
        height={100}
        className="mb-4"
      />
      <Card className="max-w-xs min-w-xs min-h-[450px]">
        <CardContent className="flex flex-col items-center justify-center h-full">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
