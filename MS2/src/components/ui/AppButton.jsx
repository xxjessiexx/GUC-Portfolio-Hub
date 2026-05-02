import { Button } from "@/components/ui/button";

export function AppButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}
