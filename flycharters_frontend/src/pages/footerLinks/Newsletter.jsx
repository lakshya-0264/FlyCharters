import React from 'react';

const NewsletterPage = () => {
  return (
    <div className="font-sans text-base">
      {/* Section 1 - Hero Banner */}
      <section 
        className="bg-cover bg-center py-16"
        style={{ backgroundImage: "url('images/photo-1454129170132-347ea87dc9dd.jpeg')" }}
      >
        <div className="container mx-auto px-4 min-h-[693px] flex items-center">
          <div className="bg-white max-w-4xl mx-auto my-16 p-12 rounded-lg shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
              FlyCharters Weekly Newsletter
            </h1>
            <p className="text-xl md:text-2xl text-center mb-8">
              Be the first to know about new product launches, promotions, and upcoming events. Subscribe now!
            </p>
            <div className="text-center">
              <button className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Card Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16 max-w-6xl mx-auto">
            {/* Card 1 */}
            <NewsletterCard
              image="images/67e5132a2c1820e267398a6ec1150a6fff2566cbe619c6a516660e037109992be0f0849777a2ae14aba631ae0b8312d6b8015927ede6bc89cdfa39_1280.jpg"
              title="Latest Updates"
              description="Stay informed with our exclusive newsletter. Get the latest updates delivered directly to you."
            />
            
            {/* Card 2 */}
            <NewsletterCard
              image="images/c7a73d3fb4acb9412781f6929af49b3d37608c01831a82982f243776cef280c4540a31fed4d62eae9894b95b4d246044e41d2863140a51b79c5764_1280.jpg"
              title="Weekly News"
              description="Subscribe today to receive special offers, news, and exciting announcements in your inbox."
            />
            
            {/* Card 3 */}
            <NewsletterCard
              image="images/32c371088239e17ee2738f6aacfc431bab4999222d71f112f51a2c49adc33080517302479c721ae075fb3d65d16048a5aa9128be35781e04c90d65_1280.jpg"
              title="Monthly Digest"
              description="Join our newsletter community for valuable insights, tips, and trends in your preferred language."
            />
          </div>
        </div>
      </section>

      {/* Section 3 - Two Column Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Stay Updated with Our Newsletter
          </h2>
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Column 1 */}
            <div className="text-right">
              <h2 className="text-6xl font-black text-gray-300 mb-4">01</h2>
              <h4 className="text-xl font-bold mb-4">Get Exclusive Offers via Newsletter</h4>
              <p>
                Stay up-to-date with our latest news and updates by subscribing to our newsletter. 
                Get exclusive offers, product launches, and exciting promotions delivered directly to your inbox.
              </p>
            </div>
            
            {/* Column 2 */}
            <div className="text-left">
              <h2 className="text-6xl font-black text-gray-300 mb-4">02</h2>
              <h4 className="text-xl font-bold mb-4">Subscribe for Latest News Updates</h4>
              <p>
                Join our newsletter community today and be the first to know about upcoming events 
                and special promotions. Don't miss out on the latest trends, tips, and insights in your inbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - Image Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Large Image */}
              <ImageCard 
                image="images/36d1a9f711b08339e78efe7e821b45e8759625edc9a74c22e16b48a43957aa04ffffc25ba2caf76f01ab9bf5cf1cd443a856ff8c54634eec964d65_1280.jpg"
                height="h-96"
              />
              
              {/* Small Image + Text */}
              <div className="grid grid-cols-2 gap-8">
                <ImageCard 
                  image="images/photo-1584987567308-c1d81837be02.jpeg"
                  height="h-48"
                />
                <TextCard
                  title="Top Stories"
                  description="Experience a personalized newsletter tailored to your interests. Start your subscription journey now."
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              {/* Small Image + Text */}
              <div className="grid grid-cols-2 gap-8">
                <TextCard
                  title="Breaking News"
                  description="Stay informed with our exclusive newsletter. Get the latest updates delivered directly to you."
                />
                <ImageCard 
                  image="images/photo-1584987567003-1e008b9d48cd.jpeg"
                  height="h-48"
                />
              </div>
              
              {/* Large Image */}
              <ImageCard 
                image="images/photo-1588453251771-cd919b362ed4.jpeg"
                height="h-96"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Newsletter Card Component
const NewsletterCard = ({ image, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 md:w-2/3">
          <h4 className="text-xl font-bold mb-4">{title}</h4>
          <p className="mb-6">{description}</p>
          <a 
            href="#" 
            className="text-black hover:text-blue-400 border-b border-black hover:border-blue-400 pb-1 transition duration-300"
          >
            learn more
          </a>
        </div>
      </div>
    </div>
  );
};

// Reusable Image Card Component
const ImageCard = ({ image, height }) => {
  return (
    <div 
      className={`bg-cover bg-center rounded-lg ${height}`}
      style={{ backgroundImage: `url('${image}')` }}
    ></div>
  );
};

// Reusable Text Card Component
const TextCard = ({ title, description }) => {
  return (
    <div className="flex flex-col justify-center">
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default NewsletterPage;