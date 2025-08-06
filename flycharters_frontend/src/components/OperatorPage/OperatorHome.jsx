import { useNavigate, Outlet } from "react-router-dom";
import CardButton from "./CardButton";
import { toast } from "react-toastify";
import { CiNoWaitingSign } from "react-icons/ci";
import useOperatorStatus from "./useOperatorStatus.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const operatorId = localStorage.getItem("id");
  const { isVerified, loading } = useOperatorStatus(operatorId);

  const handleClick = (route) => {
    if (loading) return;
    if (!isVerified) {
      toast.error("Your Profile is under review please contact admin", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      navigate(route);
    }
  };

  return (
    <div className="dashboard-container">
      <div>
        <div className="card-button-grid">
          <CardButton
            title="Add Aircraft"
            subtitle="Manage aircraft"
            onClick={() => handleClick("addFleet")}
            icon={!isVerified && <CiNoWaitingSign size={24} />}
            disabled={!isVerified}
          />
          <CardButton
            title="Update Schedule"
            subtitle="Edit timetable"
            onClick={() => handleClick("updateSchedule")}
            icon={!isVerified && <CiNoWaitingSign size={24} />}
            disabled={!isVerified}
          />
        </div>
      </div>
      <Outlet />     
    </div>
  );
};

export default Dashboard;
