export default function EditableTable({ columns }) {
  return (
    <table className="min-w-full mt-4 border text-sm">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.field} className="border px-2 py-1 text-left">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {columns.map(col => (
            <td key={col.field} className="border px-2 py-1">
              {col.type === 'text' && <input type="text" className="w-full border rounded px-2 py-1" />}
              {col.type === 'date' && <input type="date" className="w-full border rounded px-2 py-1" />}
              {col.type === 'checkbox' && <input type="checkbox" />}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}