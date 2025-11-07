import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCheckout } from "@/lib/api";
import { redirect } from "next/navigation";

const isDev = process.env.NODE_ENV === "development";

export default function Home() {
  if (!isDev) {
    return (
      <div>
        <h1>UK Checkout</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>UK Checkout</h1>

      <form
        className="flex flex-col gap-2 max-w-sm p-2 bg-background"
        action={async (fd: FormData) => {
          "use server";
          const body = {
            lead_id: fd.get("lead_id") as string,
            owner_email: fd.get("owner_email") as string,
          };
          const checkout = await createCheckout(body);
          redirect(`/checkout/${checkout.checkout_id}`);
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="lead_id">Lead ID</Label>
          <Input
            type="text"
            name="lead_id"
            placeholder="Lead ID"
            defaultValue="cd520317-2001-4da2-ac72-5ee19e7d1ef3"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="owner_email">Owner Email</Label>
          <Input
            type="text"
            name="owner_email"
            placeholder="Owner Email"
            defaultValue="simon.basilio@ukuepa.com"
          />
        </div>
        <Button type="submit">Simular Checkout</Button>
      </form>
    </div>
  );
}
