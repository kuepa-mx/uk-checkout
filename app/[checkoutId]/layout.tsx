import Image from "next/image";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-full my-4 mb-14 overflow-y-auto max-w-md mx-2 sm:mx-auto">
      <Image
        src="/logo.png"
        alt="UK Logo"
        width={200}
        height={80}
        className="mb-1"
      />
      {children}
    </div>
  );
}
