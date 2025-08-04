import { Button } from "@/components/ui/button";

export default function PrimaryButton({ type, children, onClick, disabled }) {
  return (
    <Button
      size={"sm"}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`disabled:cursor-not-allowed disabled:bg-gray-400`}
    >
      {children}
    </Button>
  );
}
