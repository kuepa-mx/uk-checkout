import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCheckoutDTO } from "@/lib/dto/checkout";

import { redirect } from "next/navigation";
import { api } from "@/lib/http";
import { getById } from "./actions/entity";
import { Entity } from "@/lib/enum/entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="grid gap-2">
      <h1>UK Checkout</h1>

      <Card className="max-w-min mx-auto">
        <CardHeader>
          <CardTitle>UK Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-2 p-2 bg-background min-w-sm mx-auto"
            action={async (fd: FormData) => {
              "use server";

              const lead_id = fd.get("lead_id") as string;
              const lead = await getById<TLead>(Entity.LEAD, lead_id);
              if (!lead) {
                throw new Error("Lead not found");
              }

              const validatedBody = await createCheckoutDTO.validate({
                lead_id,
                owner_email: lead.owner.owner_email,
                generated_by_type: "operator",
              });
              const response = await api.post<TCheckout>(
                "/checkout/session/create",
                validatedBody
              );
              console.log("response", response.data);
              redirect(`/${response.data.checkout_id}`);
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
            {/* <div className="space-y-1">
          <Label htmlFor="owner_email">Owner Email</Label>
          <Input
            type="text"
            name="owner_email"
            placeholder="Owner Email"
            defaultValue="simon.basilio@ukuepa.com"
          />
        </div> */}
            <Button type="submit">Simular Checkout</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
