import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DateInput({
  label,
  name,
}) {
  return (
    <div>
      <Label className="block text-xs font-medium">{label}</Label>
      <Input type="date" name={name} />
    </div>
  );
}