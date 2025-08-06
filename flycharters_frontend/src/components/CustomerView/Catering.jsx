import { Utensils, Star, Calendar, Clock, Shield, Check, Phone, Mail, Users, ChefHat } from 'lucide-react';

const OnboardCatering = () => {
  const cateringOptions = [
    {
      id: 'continental',
      title: 'Continental Selection',
      description: 'Fresh breakfast and light meals for short flights',
      price: '$85',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop&auto=format',
      features: ['Fresh pastries & bagels', 'Premium coffee & tea', 'Seasonal fruit selection', 'Yogurt & granola']
    },
    {
      id: 'gourmet',
      title: 'Gourmet Menu',
      description: 'Chef-prepared meals with premium ingredients',
      price: '$185',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop&auto=format',
      features: ['Multi-course dining', 'Wine & beverage pairing', 'Custom dietary options', 'Fine dining presentation']
    },
    {
      id: 'executive',
      title: 'Executive Banquet',
      description: 'Full-service dining experience for groups',
      price: '$285',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=250&fit=crop&auto=format',
      features: ['Dedicated chef service', 'Premium wine selection', 'Custom menu design', 'White-glove service']
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
        backgroundImage: 'linear-gradient(rgba(6, 25, 83, 0.7), rgba(0, 64, 255, 0.7)), url(https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&h=400&fit=crop&auto=format)',
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
            <Utensils size={48} />
            Onboard Catering Services
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: '0.95',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Elevate your private charter experience with exquisite cuisine crafted by world-class chefs and served at altitude.
          </p>
        </div>
      </div>

      <div style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Catering Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '80px'
        }}>
          {cateringOptions.map((option) => (
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
              <ChefHat size={32} color="#061953" />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#061953',
              margin: '0 0 12px 0'
            }}>
              Expert Chefs
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              margin: '0'
            }}>
              Michelin-trained chefs creating extraordinary culinary experiences at 40,000 feet.
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
              Premium Ingredients
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              margin: '0'
            }}>
              Sourced from the finest suppliers worldwide, ensuring exceptional quality and taste.
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
              Safety & Quality
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              margin: '0'
            }}>
              HACCP certified kitchen facilities with rigorous food safety standards and quality control.
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
          {/* Menu Options */}
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
              <Utensils size={24} />
              Menu Options
            </h2>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0'
            }}>
              {[
                'Custom dietary menus',
                'International cuisine',
                'Seasonal specialties',
                'Wine & champagne service',
                'Fresh sushi & sashimi',
                'Artisanal desserts'
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
                <strong>Advance Notice:</strong> 48 hours for custom menus
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Dietary Needs:</strong> Kosher, halal, vegan, allergies
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Service Style:</strong> Plated, buffet, or family style
              </p>
              <p style={{ marginBottom: '16px' }}>
                <strong>Equipment:</strong> Fine china, crystal, silverware
              </p>
              <p style={{ marginBottom: '0' }}>
                <strong>Flight Attendant:</strong> Trained service professional
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=400&fit=crop&auto=format)',
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
              Elevate Your Flight Experience
            </h2>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '40px',
              opacity: '0.9',
              maxWidth: '700px',
              margin: '0 auto 40px auto',
              lineHeight: '1.6'
            }}>
              Transform your private charter into a memorable culinary journey. 
              Our catering team is ready to create the perfect dining experience for your flight.
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
                  1-800-CHEF-SKY
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
                  catering@charter.com
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
              Serving luxury flights worldwide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardCatering;