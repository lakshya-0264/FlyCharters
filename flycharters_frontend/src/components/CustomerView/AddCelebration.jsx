import { PartyPopper, Star, Calendar, Clock, Shield, Check, Phone, Mail, Users, Cake, Heart, Gift } from 'lucide-react';

const Celebration = () => {
  const celebrationOptions = [
    {
      id: 'romantic',
      title: 'Romantic Getaway',
      description: 'Intimate celebrations for couples and special moments',
      price: '$295',
      image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=400&h=250&fit=crop&auto=format',
      features: ['Rose petal decorations', 'Champagne service', 'Romantic lighting', 'Custom playlist']
    },
    {
      id: 'birthday',
      title: 'Birthday Celebration',
      description: 'Make birthdays unforgettable at 40,000 feet',
      price: '$395',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=250&fit=crop&auto=format',
      features: ['Custom cake & desserts', 'Balloon arrangements', 'Personalized banners', 'Party favors & gifts']
    },
    {
      id: 'anniversary',
      title: 'Anniversary Package',
      description: 'Celebrate milestones with elegance and style',
      price: '$445',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=250&fit=crop&auto=format',
      features: ['Premium floral arrangements', 'Gourmet celebration meal', 'Memory photo album', 'Luxury gift presentation']
    },
    {
      id: 'corporate',
      title: 'Corporate Celebration',
      description: 'Professional celebrations for business achievements',
      price: '$545',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop&auto=format',
      features: ['Executive presentation setup', 'Award ceremony materials', 'Corporate branding', 'Team celebration amenities']
    },
    {
      id: 'engagement',
      title: 'Engagement Special',
      description: 'Perfect setting for proposals and engagements',
      price: '$695',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=250&fit=crop&auto=format',
      features: ['Proposal coordination', 'Ring presentation setup', 'Professional photography', 'Celebration dinner service']
    },
    {
      id: 'graduation',
      title: 'Graduation Celebration',
      description: 'Honor academic achievements in style',
      price: '$345',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=250&fit=crop&auto=format',
      features: ['Academic themed decor', 'Achievement certificates', 'Celebration feast', 'Memory keepsake box']
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
        backgroundImage: 'linear-gradient(rgba(6, 25, 83, 0.7), rgba(0, 64, 255, 0.7)), url(https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=400&fit=crop&auto=format)',
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
            <PartyPopper size={48} />
            Add a Celebration
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: '0.95',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Transform your private charter into an unforgettable celebration. From intimate moments to grand occasions, we create magical experiences in the sky.
          </p>
        </div>
      </div>

      <div style={{
        padding: '60px 0',
        width: '100%'
      }}>
        {/* Celebration Options */}
        <div style={{
          padding: '0 20px',
          marginBottom: '80px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            maxWidth: 'none'
          }}>
            {celebrationOptions.map((option) => (
              <div
                key={option.id}
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
                  backgroundImage: `url(${option.image})`,
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
                    {option.price}
                  </div>
                </div>
                
                <div style={{ padding: '32px' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#061953',
                    margin: '0 0 12px 0'
                  }}>
                    {option.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '24px',
                    fontSize: '1.05rem',
                    lineHeight: '1.6'
                  }}>
                    {option.description}
                  </p>
                  <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0'
                  }}>
                    {option.features.map((feature, index) => (
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
        </div>

        {/* Features Grid */}
        <div style={{ padding: '0 20px', marginBottom: '60px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
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
                <Cake size={32} color="#061953" />
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#061953',
                margin: '0 0 12px 0'
              }}>
                Custom Celebrations
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Tailored experiences designed specifically for your special occasion and personal preferences.
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
                <Heart size={32} color="#061953" />
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#061953',
                margin: '0 0 12px 0'
              }}>
                Memorable Moments
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Creating unforgettable memories that will be treasured for a lifetime, high above the clouds.
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
                <Gift size={32} color="#061953" />
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#061953',
                margin: '0 0 12px 0'
              }}>
                Luxury Amenities
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Premium decorations, gifts, and amenities to make your celebration truly extraordinary.
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
                <Star size={32} color="#061953" />
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#061953',
                margin: '0 0 12px 0'
              }}>
              Professional Service
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '0'
              }}>
                Expert event coordinators ensuring every detail is perfect for your special celebration.
              </p>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div style={{ padding: '0 20px', marginBottom: '60px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px'
          }}>
            {/* Celebration Options */}
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
                <PartyPopper size={24} />
                Celebration Options
              </h2>
              <ul style={{
                listStyle: 'none',
                padding: '0',
                margin: '0'
              }}>
                {[
                  'Birthday & milestone celebrations',
                  'Romantic proposals & engagements',
                  'Anniversary commemorations',
                  'Corporate achievement events',
                  'Graduation celebrations',
                  'Holiday & seasonal parties'
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

            {/* Service Information */}
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
                Service Details
              </h2>
              <div style={{
                fontSize: '1rem',
                color: '#374151',
                lineHeight: '1.7'
              }}>
                <p style={{ marginBottom: '16px' }}>
                  <strong>Planning Time:</strong> 72 hours for custom celebrations
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>Customization:</strong> Themes, colors, personal touches
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>Photography:</strong> Professional capture available
                </p>
                <p style={{ marginBottom: '16px' }}>
                  <strong>Coordination:</strong> Dedicated event specialist
                </p>
                <p style={{ marginBottom: '0' }}>
                  <strong>Surprises:</strong> Coordinated surprise elements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ padding: '0 20px' }}>
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
              backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop&auto=format)',
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
                Celebrate Life's Special Moments
              </h2>
              <p style={{
                fontSize: '1.2rem',
                marginBottom: '40px',
                opacity: '0.9',
                maxWidth: '700px',
                margin: '0 auto 40px auto',
                lineHeight: '1.6'
              }}>
                Every celebration deserves to be extraordinary. Let us transform your private charter into a magical venue where memories are made and dreams take flight.
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
                    1-800-CELEBRATE
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
                    celebrate@charter.com
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
                Creating magical moments worldwide
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Celebration;