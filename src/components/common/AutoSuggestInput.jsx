import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AutoSuggestInput({
  label,
  name,
  placeholder = "Search...",
  suggestions,
}) {
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState([]);

  const onChange = (e) => {
    const val = e.target.value;
    setValue(val);
    setFiltered(
      suggestions.filter((s) => s.toLowerCase().includes(val.toLowerCase()))
    );
  };

  return (
    <div className="relative">
      <Label className="block text-xs font-medium">{label}</Label>
      <Input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {filtered.length > 0 && (
        <ul className="absolute bg-white dark:bg-slate-950 border mt-1 rounded w-full z-10">
          {filtered.map((s, i) => (
            <li
              key={i}
              className="px-3 py-1 text-sm cursor-pointer"
              onClick={() => {
                setValue(s);
                setFiltered([]);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}