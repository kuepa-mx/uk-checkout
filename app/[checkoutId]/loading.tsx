import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full grow min-h-[40vh] w-[400px]">
      <Spinner className="size-6" />
    </div>
  );
}
