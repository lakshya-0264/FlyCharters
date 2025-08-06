import { useEffect, useState } from "react";
import { getOperatorByOptId } from "../../api/authAPI"; // <-- correct path

const useOperatorStatus = (operatorId) => {
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!operatorId) {
      console.error("No operator ID passed to useOperatorStatus");
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await getOperatorByOptId(operatorId);
        const operatorData = res.data?.data?.[0];
        // console.log("Fetched operator data:", operatorData);
        setIsVerified(operatorData?.verified_documents === true);
      } catch (err) {
        console.error("Error fetching operator status:", err);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [operatorId]);

  return { isVerified, loading };
};

export default useOperatorStatus;
