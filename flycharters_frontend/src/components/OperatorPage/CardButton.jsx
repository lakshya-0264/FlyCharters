import { FaPlaneDeparture, FaPlusSquare, FaUpload, FaEdit } from "react-icons/fa";
const CardButton = ({ title, subtitle, onClick }) => {
  // Icon mapping based on title
  const getIcon = (title) => {
    switch (title) {
      case "Add New Fleet":
        return <FaPlusSquare />;
      case "Add New Flight":
        return <FaPlaneDeparture />;
      case "Upload New Legs":
        return <FaUpload />;
      case "Update Schedule":
        return <FaEdit />;
      default:
        return <FaPlusSquare />; // Fallback icon
    }
  };

  return (
    <div className="card-button" onClick={onClick}>
      <div className="card-icon">
        {getIcon(title)}
      </div>
      <div className="card-text">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="card-chevron">
        <svg width="40" height="40" viewBox="0 0 24 24">
          <path fill="#ccc" d="M10 17l5-5-5-5v10z" />
        </svg>
      </div>
    </div>
  );
};

export default CardButton;
