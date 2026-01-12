export default function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="input">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
