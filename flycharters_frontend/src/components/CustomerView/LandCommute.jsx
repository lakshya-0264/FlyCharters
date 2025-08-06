import { Car, MapPin, Calendar, Route, Shield, Check, Phone, Mail, Users, Clock } from 'lucide-react';

const LandCommute = () => {
  const serviceOptions = [
    {
      id: 'economy',
      title: 'Economy Shuttle',
      description: 'Comfortable shared transportation',
      price: '$49',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop&auto=format',
      features: ['Shared ride service', 'Air conditioning', 'WiFi available', 'Professional driver']
    },
    {
      id: 'premium',
      title: 'Premium Car',
      description: 'Private luxury vehicle for up to 4 passengers',
      price: '$149',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop&auto=format',
      features: ['Private vehicle', 'Luxury interior', 'Complimentary refreshments', 'Door-to-door service']
    },
    {
      id: 'executive',
      title: 'Executive SUV',
      description: 'Spacious SUV for groups and extra luggage',
      price: '$249',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop&auto=format',
      features: ['Up to 7 passengers', 'Extra luggage space', 'Premium amenities', 'Meet & greet service']
    }
  ];

  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      color: '#374151',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(6, 25, 83, 0.7), rgba(0, 64, 255, 0.7)), url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=400&fit=crop&auto=format)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}>
            <Car size={48} />
            Land Commute Services
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: '0.95',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Premium ground transportation connecting you to airports, hotels, and destinations with comfort and reliability.
          </p>
        </div>
      </div>

      <div style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Service Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '80px'
        }}>
          {serviceOptions.map((service) => (
            <div
              key={service.id}
              style={{
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                height: '200px',
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(6, 25, 83, 0.9)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  backdropFilter: 'blur(10px)'
                }}>
                  {service.price}
                </div>
              </div>
              
              <div style={{ padding: '32px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#061953',
                  margin: '0 0 12px 0'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px',
                  fontSize: '1.05rem',
                  lineHeight: '1.6'
                }}>
                  {service.description}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {service.features.map((feature, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      fontSize: '0.95rem',
                      color: '#374151'
                    }}>
                      <Check size={18} color="#198754" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            border: '2px solid #eef2ff'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eef2ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Clock size={32} color="#061953" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#061953',
              margin: '0 0 12px 0'
            }}>
              24/7 Availability
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              margin: '0'
            }}>
              Round-the-clock service for early flights, late arrivals, and urgent transportation needs.
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            border: '2px solid #eef2ff'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eef2ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <MapPin size={32} color="#061953" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#061953',
              margin: '0 0 12px 0'
            }}>
              Wide Coverage
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              margin: '0'
            }}>
              Serving airports, hotels, business districts, and residential areas across the region.
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            border: '2px solid #eef2ff'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eef2ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Shield size={32} color="#061953" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#061953',
              margin: '0 0 12px 0'
            }}>
              Safety First
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              margin: '0'
            }}>
              Licensed drivers, insured vehicles, and real-time tracking for your peace of mind.
            </p>
          </div>
        </div>

        {/* Information Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Service Areas */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            borderLeft: '6px solid #198754'
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#198754',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Route size={24} />
              Service Areas
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}>
              {[
                'All major airports',
                'Downtown hotels',
                'Business districts',
                'Conference centers',
                'Cruise terminals',
                'Residential pickup'
              ].map((item, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  fontSize: '1rem',
                  color: '#374151'
                }}>
                  <Check size={18} color="#198754" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Information */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            borderLeft: '6px solid #f59e0b'
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#f59e0b',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Calendar size={24} />
              Booking Info
            </h2>
            <div style={{
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.7'
            }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>Advance Booking:</strong> Reserve up to 30 days ahead
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Last Minute:</strong> 2-hour notice for availability
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Payment:</strong> Card, cash, or corporate accounts
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Cancellation:</strong> Free up to 2 hours before pickup
              </p>
              <p style={{ marginBottom: '0' }}>
                <strong>Wait Time:</strong> 15-minute complimentary wait
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          background: 'linear-gradient(135deg, #061953 0%, #0040ff 100%)',
          borderRadius: '20px',
          padding: '50px 40px',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop&auto=format)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: '0.1'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: '1' }}>
            <h2 style={{
              fontSize: '2.2rem',
              fontWeight: '600',
              marginBottom: '20px',
              margin: '0 0 20px 0'
            }}>
              Book Your Ground Transportation
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '40px',
              opacity: '0.9',
              maxWidth: '700px',
              margin: '0 auto 40px auto',
              lineHeight: '1.6'
            }}>
              Experience reliable, comfortable, and professional ground transportation. 
              Our fleet is ready to serve your travel needs 24/7.
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap',
              marginBottom: '30px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '18px 24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Phone size={22} />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  1-800-RIDE-NOW
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '18px 24px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Mail size={22} />
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                  transport@airline.com
                </span>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 20px',
              borderRadius: '25px',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              <Users size={18} />
              Serving 50+ cities nationwide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandCommute;