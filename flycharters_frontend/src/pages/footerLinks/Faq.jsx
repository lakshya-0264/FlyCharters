import React, { useState } from 'react';


const Faq = () => {
  const [activeAccordion, setActiveAccordion] = useState('accordion-ae6a');

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const faqItems = [
    {
      id: 'accordion-ae6a',
      question: 'Sample text 1?',
      answer: 'Welcome to our FAQ page where we answer common questions about our products and services. Find helpful information to assist you.'
    },
    {
      id: 'accordion-8339',
      question: 'Sample text 2?',
      answer: 'Browse through our frequently asked questions to get quick answers. If you don\'t find what you\'re looking for, feel free to contact us directly.'
    },
    {
      id: 'accordion-1c17',
      question: 'Sample text 3?',
      answer: 'We strive to provide clear and concise answers to address any queries you may have. Your satisfaction is our priority, and we\'re here to help.'
    },
    {
      id: 'b971',
      question: 'Sample text 4?',
      answer: 'Browse through our frequently asked questions to get quick answers. If you don\'t find what you\'re looking for, feel free to contact us directly.'
    },
    {
      id: '3733',
      question: 'Sample text 5?',
      answer: 'Browse through our frequently asked questions to get quick answers. If you don\'t find what you\'re looking for, feel free to contact us directly.'
    }
  ];

  const testimonials = [
    {
      name: 'Connor Quinn',
      position: 'President, CEO',
      comment: 'I found all the answers I needed in the FAQ section. It was clear, concise, and saved me a lot of time. Highly recommend checking it out!',
      image: ''
    },
    {
      name: 'Frank Kinney',
      position: 'Financial Director',
      comment: 'The FAQ page is a game-changer! It\'s like having a personal guide at your fingertips. I refer to it often and always find the information I need.',
      image: ''
    },
    {
      name: 'Mattie Smith',
      position: 'Chief Accountant',
      comment: 'I love the FAQ section! It\'s so helpful and user-friendly. I appreciate how it covers a wide range of topics and provides solutions in a straightforward manner.',
      image: 'images/d2fed6d9.jpeg'
    },
    {
      name: 'Charlotte Carter',
      position: 'Accountant-auditor',
      comment: 'The FAQ page is fantastic! It\'s so well-organized and informative. I was able to troubleshoot my issue within minutes thanks to the clear explanations.',
      image: ''
    },
    {
      name: 'Steven Patton',
      position: 'Sales Manager',
      comment: 'The FAQ section is a lifesaver! It answered all my questions quickly and efficiently. Such a valuable resource for anyone using the service.',
      image: 'images/e9ba5402.jpeg'
    },
    {
      name: 'Dorothy Wallace',
      position: 'Developer',
      comment: 'I found all the answers I needed in the FAQ section. It was clear, concise, and saved me a lot of time. Highly recommend checking it out!',
      image: ''
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="u-clearfix u-gradient u-valign-middle-xl u-valign-top-lg u-valign-top-md u-valign-top-sm u-valign-top-xs u-section-1" id="sec-62c8">
        <img className="u-expanded-width u-image u-image-1" src="images/photo-1707860259774-79a4a2bc5ee5.jpeg" alt="Hero background" />
      </section>

      {/* Gallery Section */}
      <section className="u-align-center u-clearfix u-container-align-center u-grey-5 u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-section-2" id="sec-f046">
        <h2 className="u-align-center u-text u-text-default u-text-1">FAQ Assistance</h2>
        <div className="u-expanded-width u-gallery u-layout-grid u-lightbox u-show-text-on-hover u-gallery-1">
          <div className="u-gallery-inner u-gallery-inner-1">
            {[
              'images/photo-1517999349371-c43520457b23.jpeg',
              'images/photo-1529074963764-98f45c47344b.jpeg',
              'images/photo-1578262113586-1012da610944.jpeg',
              'images/photo-1666307536243-a9bf2d66c51d.jpeg',
              'images/photo-1542592302-02182e073f78.jpeg'
            ].map((image, index) => (
              <div key={index} className="u-effect-fade u-gallery-item">
                <div className="u-back-slide" data-image-width="853" data-image-height="1280">
                  <img className="u-back-image u-expanded" src={image} alt={`Gallery ${index + 1}`} />
                </div>
                <div className={`u-over-slide u-shading u-over-slide-${index + 1}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="u-align-center u-clearfix u-container-align-center u-section-3" id="sec-4521">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1">
          <h2 className="u-text u-text-default u-text-1">Why should I read FAQ's?</h2>
          <div className="u-border-3 u-border-grey-dark-1 u-line u-line-horizontal u-line-1"></div>
          <div className="u-accordion u-faq u-spacing-10 u-accordion-1" role="tablist">
            {faqItems.map((item, index) => (
              <div key={item.id} className="u-accordion-item">
                <button
                  className={`u-accordion-link ${activeAccordion === item.id ? 'active' : ''} u-active-palette-1-light-1 u-border-1 u-border-active-palette-1-light-2 u-border-grey-15 u-border-hover-palette-1-light-3 u-button-style u-hover-palette-1-light-3 u-text-active-white u-text-black u-white`}
                  id={`link-${item.id}`}
                  aria-controls={item.id}
                  aria-expanded={activeAccordion === item.id}
                  onClick={() => toggleAccordion(item.id)}
                >
                  <span className="u-accordion-link-text">{item.question}</span>
                  <span className="u-accordion-link-icon u-icon u-icon-circle u-text-palette-1-base">
                    <svg className="u-svg-content" viewBox="0 0 490.656 490.656">
                      <path d="M487.536,120.445c-4.16-4.16-10.923-4.16-15.083,0L245.339,347.581L18.203,120.467c-4.16-4.16-10.923-4.16-15.083,0 c-4.16,4.16-4.16,10.923,0,15.083l234.667,234.667c2.091,2.069,4.821,3.115,7.552,3.115s5.461-1.045,7.531-3.136l234.667-234.667 C491.696,131.368,491.696,124.605,487.536,120.445z"></path>
                    </svg>
                  </span>
                </button>
                <div
                  className={`u-accordion-pane u-border-1 u-border-no-top u-border-palette-1-light-2 u-container-style u-palette-1-light-3 ${activeAccordion === item.id ? 'u-accordion-active' : ''}`}
                  id={item.id}
                  aria-labelledby={`link-${item.id}`}
                  hidden={activeAccordion !== item.id}
                >
                  <div className="u-container-layout">
                    <div className="fr-view u-clearfix u-rich-text u-text">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="u-align-center u-clearfix u-container-align-center u-grey-5 u-section-4" id="sec-d872">
        <div className="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-sheet-1">
          <h2 className="u-text u-text-default u-text-1">What our customers say</h2>
          <div className="u-expanded-width u-layout-horizontal u-list u-list-1">
            <div className="u-repeater u-repeater-1">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="u-align-center u-container-align-center u-container-style u-list-item u-repeater-item u-video-cover u-white">
                  <div className="u-container-layout u-similar-container u-valign-top">
                    {testimonial.image ? (
                      <img alt="" className="u-image u-image-circle" src={testimonial.image} />
                    ) : (
                      <div className="u-image u-image-circle"></div>
                    )}
                    <p className="u-align-center u-text">{testimonial.comment}</p>
                    <h5 className="u-align-center u-text u-text-default">{testimonial.name}</h5>
                    <h6 className="u-align-center u-text u-text-default">{testimonial.position}</h6>
                  </div>
                </div>
              ))}
            </div>
            <button className="u-absolute-vcenter u-gallery-nav u-gallery-nav-prev u-hover-grey-25 u-icon-circle u-opacity u-opacity-70 u-palette-1-light-1 u-spacing-10 u-text-hover-white u-text-white">
              <svg viewBox="0 0 451.847 451.847">
                <path d="M97.141,225.92c0-8.095,3.091-16.192,9.259-22.366L300.689,9.27c12.359-12.359,32.397-12.359,44.751,0
                c12.354,12.354,12.354,32.388,0,44.748L173.525,225.92l171.903,171.909c12.354,12.354,12.354,32.391,0,44.744
                c-12.354,12.365-32.386,12.365-44.745,0l-194.29-194.281C100.226,242.115,97.141,234.018,97.141,225.92z"></path>
              </svg>
            </button>
            <button className="u-absolute-vcenter u-gallery-nav u-gallery-nav-next u-hover-grey-25 u-icon-circle u-opacity u-opacity-70 u-palette-1-light-1 u-spacing-10 u-text-hover-white u-text-white">
              <svg viewBox="0 0 451.846 451.847">
                <path d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744
                L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284
                c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;