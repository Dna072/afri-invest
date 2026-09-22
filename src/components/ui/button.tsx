import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition duration-200 focus-ring disabled:pointer-events-none disabled:opacity-50 min-h-11 px-5",
  {
    variants: {
      variant: {
        primary:
          "btn-shine bg-primary text-primary-foreground hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_8px_22px_color-mix(in_srgb,var(--primary)_32%,transparent)]",
        gold: "btn-shine bg-accent text-accent-foreground hover:-translate-y-0.5 hover:scale-[1.02]",
        outline:
          "border border-primary/25 bg-transparent text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5",
        ghost: "text-foreground hover:bg-muted",
        destructive: "bg-destructive text-white hover:opacity-90",
      },
      size: {
        default: "min-h-11 px-5",
        sm: "min-h-9 px-4 text-sm",
        lg: "min-h-12 px-6 text-base",
        icon: "h-10 w-10 min-h-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
