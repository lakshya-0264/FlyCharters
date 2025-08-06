import React from 'react';

const DailyBlogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top Articles",
      description: "Readers can interact with blog posts through comments, likes, and social media sharing buttons.",
      image: "images/photo-1678636575312-808a712828bf.jpeg",
    },
    {
      id: 2,
      title: "Featured Blogs",
      description: "Blogging allows individuals to express themselves, connect with others, and build a community.",
      image: "images/photo-1679376563424-83a9396f532f.jpeg",
    },
    {
      id: 3,
      title: "Popular Posts",
      description: "Starting a blog requires choosing a platform, creating content, promoting posts, and engaging readers.",
      image: "images/photo-1605459468681-0a82694890da.jpeg",
    }
  ];

  const weeklyRoundup = [
    {
      title: "Tips for Starting Your Own Blog",
      description: "A blog is a platform for sharing insights, experiences, and knowledge with a wide audience."
    },
    {
      title: "Latest Posts",
      description: "Bloggers can write about various topics, such as travel, food, fashion, technology, or lifestyle."
    },
    {
      title: "How to Write Engaging Blog Posts",
      description: "Blogs often include text, images, videos, and links to provide engaging and informative content."
    }
  ];

  const galleryImages = [
    "images/photo-1677257347236-195e900e4fd0.jpeg",
    "images/photo-1676208973096-026201d7f0b2.jpeg",
    "images/photo-1679933947333-0439aad43e9c.jpeg",
    "images/photo-1679599673055-62de1177335d.jpeg",
    "https://pixabay.com/get/g14a43c303fb17faab4aa78b78774f7d52d7765cf5c900a2bb95db54bcc5fa8812bf51309bf7780f1a0d973d1073f6b7b7a299056d5ee580487782bf7de8919a7_1280.jpg",
    "https://pixabay.com/get/geaac579df0e60c8eb7c0467bf18f1c3f7a35b4f82ca79a6a93d228b5d1848282a7718704ebe99aab08964a937813f1ee86d6026079847bceee73c1463c4c3d9b_1280.jpg"
  ];

  return (
    <div className="u-body u-xl-mode" style={{ fontSize: "16px" }}>
      {/* Hero Section */}
      <section 
        className="u-align-center u-clearfix u-container-align-center u-image u-shading u-section-1 min-h-[800px] md:min-h-[660px] lg:min-h-[506px] sm:min-h-[380px] xs:min-h-[239px] relative"
        style={{
          backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('images/photo-1676208972443-f6ac603af62c.jpeg')",
          backgroundPosition: "50% 50%",
          backgroundSize: "cover"
        }}
        id="sec-5609"
      >
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 h-full flex flex-col justify-center">
          <h1 className="u-align-center u-text u-text-default u-title u-text-1 text-white text-5xl font-bold mb-8 mx-auto">
            Daily Blogs
          </h1>
          <p className="u-align-center u-large-text u-text u-text-variant u-text-2 text-white text-xl md:text-lg sm:text-base xs:text-sm w-full max-w-[826px] lg:max-w-[720px] sm:max-w-[540px] xs:max-w-[340px] mx-auto mb-16">
            Blogging allows individuals to express themselves, connect with others, and build a community.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="u-align-center u-clearfix u-container-align-center u-white u-section-2 py-[60px]" id="sec-ec1d">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 min-h-[743px]">
          <h2 className="u-align-center u-text u-text-default u-text-1 text-3xl font-bold mb-8 mx-auto">
            Latest Posts
          </h2>
          
          <div className="u-expanded-width u-gallery u-layout-horizontal u-lightbox u-no-transition u-show-text-on-hover u-width-fixed u-gallery-1 relative">
            <div className="u-gallery-inner u-gallery-inner-1 flex overflow-x-auto snap-x snap-mandatory gap-4 h-[540px]">
              {galleryImages.map((image, index) => (
                <div key={index} className="u-effect-fade u-gallery-item flex-shrink-0 snap-center w-[375px] h-full relative">
                  <div className="u-back-slide h-full">
                    <img 
                      className="u-back-image u-back-image-1 w-full h-full object-cover" 
                      src={image} 
                      alt={`Blog post ${index + 1}`}
                    />
                  </div>
                  <div className="u-over-slide u-shading absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg">View Post</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button className="u-absolute-vcenter u-gallery-nav u-gallery-nav-prev u-grey-70 u-icon-circle u-opacity u-opacity-70 u-spacing-10 u-text-white u-gallery-nav-1 absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center z-10">
              <svg viewBox="0 0 451.847 451.847" className="w-6 h-6">
                <path 
                  fill="currentColor" 
                  d="M97.141,225.92c0-8.095,3.091-16.192,9.259-22.366L300.689,9.27c12.359-12.359,32.397-12.359,44.751,0c12.354,12.354,12.354,32.388,0,44.748L173.525,225.92l171.903,171.909c12.354,12.354,12.354,32.391,0,44.744c-12.354,12.365-32.386,12.365-44.745,0l-194.29-194.281C100.226,242.115,97.141,234.018,97.141,225.92z"
                ></path>
              </svg>
            </button>
            <button className="u-absolute-vcenter u-gallery-nav u-gallery-nav-next u-grey-70 u-icon-circle u-opacity u-opacity-70 u-spacing-10 u-text-white u-gallery-nav-2 absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center z-10">
              <svg viewBox="0 0 451.846 451.847" className="w-6 h-6">
                <path 
                  fill="currentColor" 
                  d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Weekly Roundup Section */}
      <section className="u-clearfix u-container-align-center u-grey-5 u-section-3 py-[60px]" id="sec-a097">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 min-h-[515px]">
          <div className="u-container-style u-expanded-width u-group u-white u-group-1 rounded-lg shadow-lg">
            <div className="u-container-layout u-container-layout-1 p-10 md:p-8 sm:p-6">
              <h2 className="u-align-left u-text u-text-default u-text-1 text-3xl font-bold mb-10">
                Weekly Roundup
              </h2>
              
              <div className="u-expanded-width u-layout-grid u-list u-list-1 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {weeklyRoundup.map((item, index) => (
                  <div key={index} className="u-container-align-left u-list-item u-repeater-item p-6 bg-gray-50 rounded-lg">
                    <div className="u-container-layout u-similar-container u-container-layout-2">
                      <h4 className="u-align-left u-text u-text-default u-text-2 text-xl font-bold mb-4">
                        {item.title}
                      </h4>
                      <p className="u-align-left u-text u-text-default u-text-3 text-gray-700">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="u-clearfix u-container-align-center u-section-4 py-[60px]" id="sec-e604">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 min-h-[610px]">
          <div className="u-expanded-width u-list u-list-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="u-container-align-left u-container-style u-list-item u-repeater-item bg-white rounded-lg overflow-hidden shadow-md">
                <div className="u-container-layout u-similar-container u-valign-top u-container-layout-1">
                  <img 
                    alt={post.title} 
                    className="u-expanded-width u-image u-image-default u-image-1 w-full h-[300px] object-cover"
                    src={post.image}
                  />
                  <div className="p-6">
                    <h4 className="u-align-left u-text u-text-default u-text-1 text-xl font-bold mb-4">
                      {post.title}
                    </h4>
                    <p className="u-align-left u-text u-text-2 text-gray-700 mb-6">
                      {post.description}
                    </p>
                    <a 
                      href="#" 
                      className="u-active-none u-align-left u-border-2 u-border-active-palette-1-base u-border-grey-75 u-border-hover-palette-1-base u-border-no-left u-border-no-right u-border-no-top u-btn u-button-style u-hover-none u-none u-text-active-palette-1-base u-text-body-color u-text-hover-palette-1-base u-btn-1 text-blue-600 hover:text-blue-800 font-medium border-b-2 border-gray-300 hover:border-blue-500 transition-colors duration-300"
                    >
                      learn more
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DailyBlogs;