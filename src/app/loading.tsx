import { AfricaSpinner } from "@/components/motion/africa-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[50dvh] items-center justify-center">
      <AfricaSpinner size="md" />
    </div>
  );
}
