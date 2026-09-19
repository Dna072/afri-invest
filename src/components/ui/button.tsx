import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition focus-ring disabled:pointer-events-none disabled:opacity-50 min-h-12 px-5",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        gold: "bg-accent text-accent-foreground hover:opacity-90",
        outline: "border border-border bg-transparent hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-white",
      },
      size: {
        default: "min-h-12 px-5",
        sm: "min-h-10 px-4 text-sm",
        lg: "min-h-14 px-6 text-base",
        icon: "h-12 w-12 p-0",
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
