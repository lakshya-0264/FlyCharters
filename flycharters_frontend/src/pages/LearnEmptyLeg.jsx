const LearnEmptyLeg = () => {
  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 50px",
          borderRadius: "16px",
          maxWidth: "800px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ color: "#061953", fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>
          What is an Empty Leg Flight?
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.7 }}>
          An <strong>Empty Leg Flight</strong> is a discounted one-way private jet flight that's scheduled to fly without passengers — often because it’s returning to base or repositioning.
          These flights offer a luxurious experience at a fraction of the normal cost.
        </p>
        <ul style={{ marginTop: "20px", paddingLeft: "20px", color: "#333" }}>
          <li style={{ marginBottom: "10px" }}>⚡ Significantly cheaper than standard private charters</li>
          <li style={{ marginBottom: "10px" }}>🛩️ Same aircraft quality, comfort, and service</li>
          <li style={{ marginBottom: "10px" }}>📍 Fixed route and schedule (non-flexible)</li>
        </ul>
        <p style={{ marginTop: "30px", color: "#555" }}>
          Check the available routes and book quickly — empty legs are limited and in high demand.
        </p>
      </div>
    </div>
  );
};

export default LearnEmptyLeg;
