export default function AnimatedInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  required,
  options,
  placeholder,
}) {
  if (type === "select") {
    return (
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label className="absolute left-4 top-2 text-xs text-gray-400">
          {label}
        </label>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={3}
          placeholder=" "
          className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer resize-none"
        />
        <label
          className={`absolute left-4 transition-all pointer-events-none ${
            value
              ? "top-2 text-xs text-purple-400"
              : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
          }`}
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className="w-full p-4 pt-6 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all peer"
      />
      <label
        className={`absolute left-4 transition-all pointer-events-none ${
          value
            ? "top-2 text-xs text-purple-400"
            : "top-4 text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
