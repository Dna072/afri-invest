import { AfricaSpinner } from "@/components/motion/africa-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[40dvh] items-center justify-center">
      <AfricaSpinner size="md" />
    </div>
  );
}
