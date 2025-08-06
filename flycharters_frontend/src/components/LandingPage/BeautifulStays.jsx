import React from "react";
import { 
  FaPlane,           // Airlines
  FaUserAlt,         // Travelers
  FaUserTie,         // Agents
  FaCogs,            // Operators
  FaArrowRight,
  FaPlaneDeparture   // Back side icon
} from "react-icons/fa";

const ThirdSection = () => {
  return (
    <>
      <h1 style={{
        backgroundColor: 'white', 
        fontSize: '2.3rem', 
        textAlign: 'center', 
        paddingTop: '3rem', 
        textTransform: 'uppercase',
        color: '#333', 
        position:'relative' ,
      }}>
        Our Target Audience
      </h1>
      <section className="thirdSection">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                {item === 1 ? (
                  <FaUserAlt  />
                ) : item === 2 ? (
                  <FaPlane  />
                ) : item === 3 ? (
                  <FaUserTie />
                ) : (
                  <FaCogs />
                )}
                <h3>{item === 1 ? "Travelers" : item === 2 ? "Airlines" : item === 3 ? "Agents" : "Operators"}</h3>
                <p>
                  {item === 1 
                    ? "Find the best flight deals and plan your perfect trip." 
                    : item === 2 
                    ? "Connect with potential customers and manage your routes." 
                    : item === 3 
                    ? "Access exclusive rates and manage client bookings." 
                    : "Optimize your operations and reach new markets."}
                </p>
              </div>
              <div className="flip-card-back">
                <h3>Why Choose Us?</h3>
                <p>
                  {item === 1 
                    ? "Get personalized recommendations and save up to 40% on flights." 
                    : item === 2 
                    ? "Our platform helps you fill more seats and reduce empty flights." 
                    : item === 3 
                    ? "Special tools and commissions for travel professionals." 
                    : "Comprehensive solutions for aviation service providers."}
                </p>
                <button>Learn More</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ThirdSection;