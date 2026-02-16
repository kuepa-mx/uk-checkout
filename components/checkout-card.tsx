import { Card, CardContent } from "./ui/card";

export default function CheckoutCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="relative overflow-hidden w-full">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#FF7A00] via-[#FF9F40] to-[#FF7A00]" />
      <CardContent className="flex flex-col items-center h-full grow">
        {children}
      </CardContent>
    </Card>
  );
}