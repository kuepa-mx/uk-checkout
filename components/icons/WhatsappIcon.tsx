import Image from "next/image";

export default function WhatsappIcon({
  className,
  width = 24,
  height = 24,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/whatsapp-icon.svg"
      alt="Whatsapp"
      width={width}
      height={height}
      className={className}
    />
  );
}
