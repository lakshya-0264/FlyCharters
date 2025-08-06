import { Heart, MapPin, Calendar, Plane, Shield, Check, Phone, Mail } from 'lucide-react';

const AddPetTravel = () => {
  const serviceOptions = [
    {
      id: 'cabin',
      title: 'Cabin Travel',
      description: 'Your pet travels with you in the cabin',
      price: '$299',
      features: ['Small pets only (under 20 lbs)', 'In-cabin carrier required', 'Must fit under seat']
    },
    {
      id: 'cargo',
      title: 'Cargo Travel',
      description: 'Secure cargo compartment travel',
      price: '$499',
      features: ['Climate controlled', 'Professional handling', 'Real-time tracking']
    },
    {
      id: 'private',
      title: 'Private Charter',
      description: 'Exclusive charter for you and your pet',
      price: '$1,299',
      features: ['Complete privacy', 'Custom schedule', 'Premium comfort']
    }
  ];

  return (
    <div style={{ 
      fontFamily: 'sans-serif',
      color: '#374151',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#061953',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <Heart size={40} color="#061953" />
            Pet Travel Services
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            marginTop: '16px',
            maxWidth: '600px',
            margin: '16px auto 0'
          }}>
            Safe, comfortable, and stress-free travel for your beloved pets. Professional care every step of the journey.
          </p>
        </div>

        {/* Service Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {serviceOptions.map((service) => (
            <div
              key={service.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#061953',
                  margin: '0'
                }}>
                  {service.title}
                </h3>
                <span style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#061953',
                  backgroundColor: '#eef2ff',
                  padding: '8px 16px',
                  borderRadius: '8px'
                }}>
                  {service.price}
                </span>
              </div>
              <p style={{
                color: '#6b7280',
                marginBottom: '20px',
                fontSize: '1rem',
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
          ))}
        </div>

        {/* Information Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* What's Included */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            borderLeft: '6px solid #061953'
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#061953',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Shield size={24} />
              What's Included
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}>
              {[
                'Pre-flight health check',
                'Professional pet handling',
                'Climate-controlled transport',
                '24/7 customer support',
                'Real-time tracking updates',
                'Pet comfort amenities'
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

          {/* Important Information */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            borderLeft: '6px solid #dc2626'
          }}>
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '600',
              color: '#dc2626',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Plane size={24} />
              Requirements
            </h2>
            <div style={{
              fontSize: '1rem',
              color: '#374151',
              lineHeight: '1.7'
            }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>Health Certificate:</strong> Required within 10 days of travel
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Vaccinations:</strong> Must be up to date
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Carrier Size:</strong> Must meet airline specifications
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Age Requirement:</strong> Pets must be at least 8 weeks old
              </p>
              <p style={{ marginBottom: '0' }}>
                <strong>Booking Notice:</strong> 48 hours advance booking required
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          background: 'linear-gradient(135deg, #061953 0%, #0040ff 100%)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            Ready to Book Pet Travel?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '32px',
            opacity: '0.9',
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            Contact our pet travel specialists to arrange safe and comfortable travel for your beloved companion.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '16px 24px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Phone size={20} />
              <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                1-800-PET-FLY
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '16px 24px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Mail size={20} />
              <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                pets@airline.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPetTravel;