import React from 'react';

const CareerDevelopmentPage = () => {
  return (
    <div className="font-sans text-base">
      {/* Section 1 - Hero with Split Layout */}
      <section className="min-h-[922px] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-16">
            {/* Left Column - Text Content */}
            <div className="bg-gray-100 rounded-[50px] p-12 flex flex-col justify-center">
              <h5 className="text-lg font-medium mb-4">Tips for Successful Career Development</h5>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Growth</h1>
              <p className="text-lg">
                Embark on a rewarding career journey filled with growth opportunities and exciting challenges. 
                Discover your passion and unleash your potential in a dynamic and supportive work environment.
              </p>
            </div>
            
            {/* Right Column - Image */}
            <div 
              className="rounded-[50px] bg-cover bg-center min-h-[398px]"
              style={{ backgroundImage: "url('images/photo-1508243771214-6e95d137426b.jpeg')" }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left Column - Text Content */}
            <div className="p-8 flex flex-col justify-end">
              <p className="text-lg mb-4">
                Embark on a rewarding journey towards your dream career with our innovative opportunities.
              </p>
              <p className="text-lg font-medium">Exciting career opportunities await.</p>
              <img 
                src="images/20959.png" 
                alt="Career icon"
                className="w-16 h-16 ml-auto mt-8"
              />
            </div>
            
            {/* Right Column - Image */}
            <div 
              className="rounded-[50px] bg-cover bg-center min-h-[416px]"
              style={{ backgroundImage: "url('images/photo-1517466787929-bc90951d0974.jpeg')" }}
            ></div>
          </div>
        </div>
      </section>

      {/* Section 2 - Feature Cards */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <FeatureCard 
              icon="images/8637218.png"
              title="Future Paths"
              description="Embark on a rewarding journey towards your dream career with our innovative opportunities."
            />
            
            {/* Card 2 */}
            <FeatureCard 
              icon="images/1304170.png"
              title="Dream Careers"
              description="Explore diverse career paths that cater to your skills, passions, and professional aspirations."
            />
            
            {/* Card 3 */}
            <FeatureCard 
              icon="images/4944569.png"
              title="Job Goals"
              description="Join our dynamic team and experience a collaborative environment that nurtures growth and success."
            />
          </div>
        </div>
      </section>

      {/* Section 3 - Full Width Image */}
      <section 
        className="min-h-[477px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('images/photo-1574966390692-5140d4310743.jpeg')" }}
      ></section>

      {/* Section 4 - Career Tips */}
      <section className="min-h-[856px] bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Discovering Your Passion and Career Goals
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Tip 1 */}
            <CareerTip 
              icon="images/3483127-d1c058cb.png"
              title="Exploring Various Career Paths Available"
              description="Unlock your full potential through challenging projects and continuous learning and development programs."
            />
            
            {/* Tip 2 */}
            <CareerTip 
              icon="images/8593364-08248f1e.png"
              title="Career Choices"
              description="Shape your future with us as we support your career advancement and personal fulfillment."
            />
            
            {/* Tip 3 */}
            <CareerTip 
              icon="images/2591945-7b224637.png"
              title="Work Aspirations"
              description="Discover a fulfilling career with us where your talents are valued and opportunities abound."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-[50px] p-8 shadow-lg text-center">
      <img src={icon} alt={title} className="w-16 h-16 mx-auto mb-4" />
      <h5 className="text-xl font-bold mb-4">{title}</h5>
      <p>{description}</p>
    </div>
  );
};

// Reusable Career Tip Component
const CareerTip = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-[50px] p-8 shadow-lg relative pl-28">
      <div className="absolute left-8 top-8 w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
        <img src={icon} alt={title} className="w-10 h-10" />
      </div>
      <h5 className="text-xl font-bold mb-4">{title}</h5>
      <p>{description}</p>
    </div>
  );
};

export default CareerDevelopmentPage;