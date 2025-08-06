import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/SuccessLottie.json";
import axios from "axios";
import { useParams } from "react-router-dom";

const BookingSuccessOneWay = () => {
    const navigate = useNavigate();
    const bookingId = useParams();
    console.log(bookingId);

    const generateInvoice = async () => {
        try {
            const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/fleet/invoice/${bookingId}`,
            {
                withCredentials: true,
                responseType: 'blob', // This is crucial to handle binary data
            }
            );

            // Create a blob URL
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const downloadUrl = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = downloadUrl;

            // Optional: set the filename
            const disposition = response.headers['content-disposition'];
            const fileName = disposition && disposition.includes('filename=')
            ? disposition.split('filename=')[1].replace(/"/g, '')
            : `invoice-${bookingId}.pdf`;

            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

        } catch (err) {
            console.error('Download error:', err.message);
        }
        };

        useEffect(() => {
            window.scrollTo(0, 0);
        }, []);

    return (
        <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif"
        }}>
        <Lottie
            animationData={successAnimation}
            autoplay
            style={{ width: "100px", marginBottom: "20px" }}
        />
        <h1 style={{ color: "#061953", fontSize: "2rem", marginBottom: "12px" }}>Thank You!</h1>
        <p style={{ maxWidth: "500px", textAlign: "center", color: "#555", fontSize: "1rem", marginBottom: "30px" }}>
            Your booking has been successfully confirmed. We wish you a safe and pleasant journey ahead. 
            Our team is preparing everything for your departure!
        </p>
        <div className="flex justify-center gap-10">
            <button
            onClick={() => navigate("/user")}
            style={{
            backgroundColor: "#061953",
            color: "white",
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)"
            }}
        >
            Back to Home
        </button>
        <button
            onClick={generateInvoice}
            style={{
            backgroundColor: "#061953",
            color: "white",
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)"
            }}
        >
            Download Invoice
        </button>
        </div>
        </div>
    );
    };

    export default BookingSuccessOneWay;