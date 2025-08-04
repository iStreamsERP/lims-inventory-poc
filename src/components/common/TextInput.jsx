import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TextInput({ key, label, name, value, onChange, required, placeholder, error }) {
  return (
    <div key={key}>
      <Label className="block text-xs font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`border ${error ? "border-red-500" : ""}`}
        placeholder={placeholder || label}
      />
      <div>{error && <p className="text-xs text-red-500">{error}</p>}</div>
    </div>
  );
}
