import React from "react";

function DropdownControl({ label, options, onSelect }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span>{label}</span>
      <select
        onChange={(e) => onSelect(e.target.value)}
        style={{
          padding: "5px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownControl;
