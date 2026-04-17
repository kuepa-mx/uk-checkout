import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

export default function CheckoutCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Card className={cn("relative overflow-hidden w-full", className)}>
      <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#FF7A00] via-[#FF9F40] to-[#FF7A00]" />
      <CardContent className="flex flex-col items-center h-full grow text-card-foreground">
        {children}
      </CardContent>
    </Card>
  );
}