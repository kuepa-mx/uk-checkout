import Link from "next/link";
import WhatsappIcon from "./icons/WhatsappIcon";
import { Button } from "./ui/button";

const SUPPORT_NUMBER = "15512499500";

export default function WhatsappBtn() {
  return (
    <Link
      href={`https://wa.me/${SUPPORT_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button className="bg-green-600 hover:bg-green-500 rounded-full p-2 size-10">
        <WhatsappIcon className="size-6 invert" />
      </Button>
    </Link>
  );
}
