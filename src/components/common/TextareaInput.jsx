import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaInput({ key, label, name, value, onChange, required, placeholder, error, disabled = false }) {
  return (
    <div key={key}>
      <Label className="block text-xs font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          error ? "border-red-500" : ""
        }`}
        placeholder={placeholder || label}
        disabled={disabled}
        rows={4}
      />
      <div>{error && <p className="text-xs text-red-500">{error}</p>}</div>
    </div>
  );
}
