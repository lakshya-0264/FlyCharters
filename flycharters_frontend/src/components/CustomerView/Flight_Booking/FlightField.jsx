import Select from "react-select";

const customStyles = {
  control: (base) => ({
    ...base,
    paddingLeft: "36px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxShadow: "none",
    height: "42px",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

const FlightField = ({ label, icon: Icon, value, onChange, options, placeholder }) => {
  return (
    <div style={{ position: "relative" }}>
      <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
        {label}
      </label>
      <Icon
        size={20}
        style={{
          position: "absolute",
          top: "58%",
          left: "12px",
          transform: "translateY(-15%)",
          color: "#777",
          zIndex: 10,
        }}
      />
      <Select
        value={options.find((o) => o.value === value)}
        onChange={(selected) => onChange(selected?.value)}
        options={options}
        placeholder={placeholder}
        isClearable
        styles={customStyles}
      />
    </div>
  );
};

export default FlightField;
