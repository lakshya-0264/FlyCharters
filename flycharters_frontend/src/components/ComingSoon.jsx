import React, { useState, useEffect } from 'react';
import { Plane, Instagram, Facebook, Twitter, Linkedin, Mail, Bell, Sparkles, MapPin, Users, Clock } from 'lucide-react';
import logo from '../assets/LogoOnly.png';

const ComingSoonPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Set launch date (30 days from now for demo)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  const socialLinks = [
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,rgb(149, 205, 243) 0%, #e0f2fe 50%, #f0f9ff 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements matching app theme */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "400px",
          height: "400px",
          background: "linear-gradient(135deg, #061953, #1e40af)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "cloudFloat 8s infinite"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "linear-gradient(135deg, #1e40af, #60a5fa)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "cloudFloat 6s infinite reverse"
        }}></div>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          background: "linear-gradient(135deg, #60a5fa, #bae6fd)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "cloudFloat 10s infinite"
        }}></div>
      </div>

      {/* Subtle grid pattern */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(6, 25, 83, 0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}></div>

      <div style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center"
      }}>
        {/* Logo and Brand */}
        <div style={{ marginBottom: "4rem", animation: "fadeSlideUp 1s ease-out" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #061953, #1e40af)",
              padding: "2rem",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(6, 25, 83, 0.3)",
              transform: "rotate(0deg)",
              transition: "all 0.3s ease"
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = "rotate(0deg) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(6, 25, 83, 0.4)";
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = "rotate(0deg) scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(6, 25, 83, 0.3)";
            }}>
              <img src={logo} alt="FlyCharters Logo" style={{ width: "100px", height: "auto" }} />
            </div>
          </div>
          <h1 style={{
            fontSize: "4rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #061953, #1e40af)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
            letterSpacing: "-2px"
          }}>
            FlyCharters
          </h1>
          <p style={{
            fontSize: "1.25rem",
            color: "#475569",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
            fontWeight: "500"
          }}>
            The premier platform connecting charter operators with discerning travelers
          </p>
        </div>

        {/* Countdown Timer */}
        <div style={{ marginBottom: "4rem", animation: "fadeSlideUp 1s ease-out 0.3s both" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "2rem"
          }}>
            <Sparkles style={{ width: "24px", height: "24px", color: "#1e40af" }} />
            <h2 style={{
              fontSize: "2rem",
              color: "#061953",
              fontWeight: "600",
              margin: 0
            }}>
              Launching Soon
            </h2>
            <Sparkles style={{ width: "24px", height: "24px", color: "#1e40af" }} />
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "1.5rem",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  transform: "translateY(0)"
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                }}>
                  <div style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    color: "#061953",
                    marginBottom: "0.5rem",
                    fontFamily: "monospace"
                  }}>
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    fontWeight: "600",
                    letterSpacing: "1px"
                  }}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Signup */}
        <div style={{
          marginBottom: "4rem",
          width: "100%",
          maxWidth: "500px",
          animation: "fadeSlideUp 1s ease-out 0.6s both"
        }}>
          {!isSubmitted ? (
            <div style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "1.5rem"
              }}>
                <Bell style={{ width: "20px", height: "20px", color: "#1e40af" }} />
                <h3 style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#061953",
                  margin: 0
                }}>
                  Get Early Access
                </h3>
              </div>
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <Mail style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  width: "20px",
                  height: "20px"
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  style={{
                    width: "100%",
                    paddingLeft: "3rem",
                    paddingRight: "1rem",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    fontSize: "1rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1e40af";
                    e.target.style.boxShadow = "0 0 0 3px rgba(30, 64, 175, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                onClick={handleEmailSubmit}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #061953, #1e40af)",
                  color: "white",
                  padding: "1rem 2rem",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(30, 64, 175, 0.3)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 64, 175, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 64, 175, 0.3)";
                }}
              >
                Notify Me at Launch
              </button>
            </div>
          ) : (
            <div style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid #bae6fd",
              borderRadius: "20px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
            }}>
              <div style={{
                fontSize: "2rem",
                marginBottom: "1rem"
              }}>
                🎉
              </div>
              <div style={{
                color: "#0369a1",
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem"
              }}>
                Thank you for your interest!
              </div>
              <div style={{
                color: "#64748b",
                fontSize: "1rem"
              }}>
                We'll notify you as soon as we launch
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div style={{
          marginBottom: "4rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          maxWidth: "900px",
          width: "100%",
          animation: "fadeSlideUp 1s ease-out 0.9s both"
        }}>
          {[
            { 
              icon: Users, 
              title: 'Verified Operators', 
              desc: 'Only premium, certified charter operators with proven track records'
            },
            { 
              icon: Clock, 
              title: 'Instant Booking', 
              desc: 'Book your perfect charter in minutes with real-time availability'
            },
            { 
              icon: MapPin, 
              title: 'Best Prices', 
              desc: 'Competitive rates with transparent pricing and no hidden fees'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              textAlign: "center",
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              transform: "translateY(0)"
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.15)";
            }} onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
            }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem"
              }}>
                <div style={{
                  background: "linear-gradient(135deg, #061953, #1e40af)",
                  padding: "1rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(6, 25, 83, 0.3)"
                }}>
                  <feature.icon style={{ width: "24px", height: "24px", color: "white" }} />
                </div>
              </div>
              <h3 style={{
                color: "#061953",
                fontWeight: "600",
                fontSize: "1.25rem",
                marginBottom: "1rem"
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: "#64748b",
                fontSize: "0.875rem",
                lineHeight: "1.6",
                margin: 0
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Social Media Links */}
        <div style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "3rem",
          animation: "fadeSlideUp 1s ease-out 1.2s both"
        }}>
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transform: "translateY(0)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
              }}
            >
              <Icon style={{ width: "24px", height: "24px", color: "#475569" }} />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          color: "#64748b",
          fontSize: "0.875rem",
          animation: "fadeSlideUp 1s ease-out 1.5s both"
        }}>
          <p style={{ margin: 0 }}>© 2025 FlyCharters. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cloudFloat {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(20px) translateY(-10px); }
        }
        @keyframes dashFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -24; }
        }
        @keyframes dashFlowReverse {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 24; }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;