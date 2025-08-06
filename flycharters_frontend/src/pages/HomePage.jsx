import heroImage from '/BackgroundImage.png'
import { useAuthPopup } from '../context/AuthPopupContext.jsx';
import { FaArrowDownLong } from "react-icons/fa6";

const HomePage = () => {
    const { setShowAuthPopup } = useAuthPopup();
    return (
        <div className="hero-section">
            <div className="home-container">
                <div className="home-content">
                    <h1>Exclusive Altitude Awaits</h1>
                    <p>Where Extraordinary Takes Flight.</p>
                </div>
                
                <div className="scroll-text-container">
                    <span style={{paddingBottom:'20px'}}>Scroll to Explore</span>
                    <FaArrowDownLong style={{ transformOrigin: 'center' }} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;