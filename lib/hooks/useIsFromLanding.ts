import { useSearchParams } from "next/navigation";

export default function useIsFromLanding() {
  const searchParams = useSearchParams();
  return searchParams.get("fromLanding") === "true";
}