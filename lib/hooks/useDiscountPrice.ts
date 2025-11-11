import { useQuery } from "@tanstack/react-query";
import { computeTotalAmount } from "../api";

export default function useDiscountPrice(
  checkoutId: string,
  discountId: string
) {
  const { data: price, ...rest } = useQuery({
    queryKey: ["discountPrice", checkoutId, discountId],
    queryFn: () => computeTotalAmount(checkoutId, discountId),
    enabled: !!checkoutId && !!discountId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  return { price: price || null, ...rest };
}
