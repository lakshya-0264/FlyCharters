import LandingCapability from "../LandingCapability.jsx";
const LandingCapabilites = () => {
  return (
    <div className="page">
      <h1>update the schedule</h1>
      <p style={{textAlign:'center',textTransform:'capitalize',letterSpacing:"1px",padding:'10px 0'}}>Configure landing and departure capabilities for your aircraft at different airports.</p>
      <LandingCapability/>
    </div>
  );
};

export default LandingCapabilites;