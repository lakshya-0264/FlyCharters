import React, { useState } from 'react';

const PrivacyRightsPage = () => {
  const [activeAccordion, setActiveAccordion] = useState('c9b5');

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const privacyItems = [
    {
      id: 'c9b5',
      question: "Question",
      answer: "Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet."
    },
    {
      id: 'a469',
      question: "Question",
      answer: "Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet."
    },
    {
      id: '37d0',
      question: "Question",
      answer: "Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet."
    },
    {
      id: '9527',
      question: "Question",
      answer: "Answer. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur id suscipit ex. Suspendisse rhoncus laoreet purus quis elementum. Phasellus sed efficitur dolor, et ultricies sapien. Quisque fringilla sit amet dolor commodo efficitur. Aliquam et sem odio. In ullamcorper nisi nunc, et molestie ipsum iaculis sit amet."
    }
  ];

  const policyCards = [
    {
      title: "Data Protection",
      description: "Your information is securely stored and only accessed by authorized personnel for specified purposes.",
      icon: (
        <svg viewBox="0 0 128 128" className="h-full w-full">
          <polygon points="128 3 17 3 17 24 25 24 25 11 120 11 120 24 111 24 111 32 120 32 120 95 111 95 111 103 128 103"></polygon>
          <path d="m25 24h-25v100h111v-100h-86zm78 92h-95v-63h95v63zm0-71h-95v-13h95v13z"></path>
          <path d="m46 74v21h-21v-21h21m8-8h-37v37h37v-37z"></path>
          <rect x="62" y="66" width="32" height="8"></rect>
          <rect x="62" y="81" width="32" height="8"></rect>
          <rect x="62" y="95" width="32" height="8"></rect>
        </svg>
      )
    },
    {
      title: "Privacy Rights",
      description: "Your information is securely stored and only accessed by authorized personnel for specified purposes.",
      icon: (
        <svg viewBox="0 0 128 128" className="h-full w-full">
          <path d="m78.9 15.9c2.1 0 3.7 1.7 3.7 3.7v3.7h-37.2v-3.7c0-2 1.7-3.7 3.7-3.7h29.8m39.7 14.8-11.6 34.5c-0.5 1.5-1.9 2.5-3.5 2.5h-20.9v-3.7c0-2-1.7-3.7-3.7-3.7h-29.8c-2.1 0-3.7 1.7-3.7 3.7v3.7h-20.9c-1.6 0-3-1-3.5-2.5l-11.6-34.5h109.2m1.5 19.1v58.6c0 2-1.7 3.7-3.7 3.7h-104.7c-2.1 0-3.7-1.7-3.7-3.7v-58.6l5.9 17.7c1.5 4.5 5.8 7.6 10.6 7.6h20.9v3.7c0 2 1.7 3.7 3.7 3.7h29.8c2.1 0 3.7-1.7 3.7-3.7v-3.7h20.9c4.8 0 9.1-3 10.6-7.6l6-17.7m-44.9 17.9v7.4h-22.4v-7.4h22.4m15.3-44.9v-3.2c0-6.4-5.2-11.6-11.6-11.6h-29.8c-6.4 0-11.7 5.2-11.7 11.6v3.2h-29.5c-4.4 0-7.9 3.5-7.9 7.9v77.7c0 6.4 5.2 11.6 11.7 11.6h104.7c6.4 0 11.7-5.2 11.7-11.6v-77.7c0-4.4-3.6-7.9-7.9-7.9h-29.7z"></path>
        </svg>
      )
    },
    {
      title: "Confidentiality Agreement",
      description: "Your information is securely stored and only accessed by authorized personnel for specified purposes.",
      icon: (
        <svg viewBox="0 0 128 128" className="h-full w-full">
          <path d="m44.1 63.9h39.8c4.6 0 8.4-3.9 8.4-8.8v-1.8c0-5.6-2.8-10.7-7.3-13.3-2.4-1.4-5.4-2.9-8.8-4.1 2.8-3 4.6-6.9 4.6-11.3-0.1-9.2-7.6-16.6-16.8-16.6s-16.7 7.4-16.7 16.5c0 4.4 1.7 8.4 4.6 11.3-3.4 1.2-6.5 2.7-8.8 4.1-4.5 2.7-7.3 7.7-7.3 13.3v1.8c-0.1 4.9 3.7 8.9 8.3 8.9zm19.9-48c4.8 0 8.7 3.9 8.7 8.6 0 4.8-3.9 8.6-8.7 8.6s-8.7-3.9-8.7-8.6 3.9-8.6 8.7-8.6zm-20.3 37.3c0-2.7 1.3-5.3 3.4-6.5 4-2.3 10.2-5.1 16.9-5.1s12.9 2.8 16.9 5.1c2.1 1.2 3.4 3.8 3.4 6.5v1.8c0 0.6-0.3 0.9-0.4 0.9h-39.8c-0.1 0-0.4-0.3-0.4-0.9v-1.8zm5.5 40.9c-2.4-1.4-5.4-2.9-8.8-4.1 2.8-3 4.6-7 4.6-11.3 0-9.1-7.5-16.5-16.7-16.5s-16.7 7.4-16.7 16.5c0 4.4 1.7 8.4 4.6 11.3-3.4 1.2-6.5 2.7-8.8 4.1-4.6 2.6-7.4 7.7-7.4 13.3v1.8c0 4.9 3.8 8.8 8.4 8.8h39.8c4.6 0 8.4-3.9 8.4-8.8v-1.8c0-5.6-2.8-10.7-7.4-13.3zm-20.9-24.1c4.8 0 8.7 3.9 8.7 8.6 0 4.8-3.9 8.6-8.7 8.6s-8.7-3.9-8.7-8.6 3.9-8.6 8.7-8.6zm20.3 39.2c0 0.6-0.3 0.9-0.4 0.9h-39.8c-0.1 0-0.4-0.3-0.4-0.9v-1.8c0-2.7 1.3-5.3 3.4-6.5 4-2.3 10.2-5.1 16.9-5.1s12.9 2.8 16.9 5.1c2.1 1.2 3.4 3.8 3.4 6.5v1.8zm72.1-15.1c-2.4-1.4-5.4-2.9-8.8-4.1 2.8-3 4.6-6.9 4.6-11.3 0-9.1-7.5-16.5-16.7-16.5s-16.7 7.4-16.7 16.5c-0.1 4.3 1.7 8.3 4.5 11.3-3.4 1.2-6.5 2.7-8.8 4.1-4.5 2.7-7.3 7.7-7.3 13.3v1.8c0 4.9 3.8 8.8 8.4 8.8h39.8c4.6 0 8.4-3.9 8.4-8.8v-1.8c-0.1-5.6-2.9-10.7-7.4-13.3zm-21-24.1c4.8 0 8.7 3.9 8.7 8.6 0 4.8-3.9 8.6-8.7 8.6s-8.7-3.9-8.7-8.6 3.9-8.6 8.7-8.6zm20.3 39.2c0 0.6-0.3 0.9-0.4 0.9h-39.8c-0.1 0-0.4-0.3-0.4-0.9v-1.8c0-2.7 1.3-5.3 3.4-6.5 4-2.3 10.2-5.1 16.9-5.1s12.9 2.8 16.9 5.1c2.1 1.2 3.4 3.8 3.4 6.5v1.8z"></path>
        </svg>
      )
    },
    {
      title: "Information Security",
      description: "Your information is securely stored and only accessed by authorized personnel for specified purposes.",
      icon: (
        <svg viewBox="0 0 128 128" className="h-full w-full">
          <path d="m93.8 13.5 18.4 25.2h-5.7c-2 0-3.6 1.6-3.6 3.6v77.7h-18.3v-77.7c0-2-1.6-3.6-3.6-3.6h-5.7l18.5-25.2m-22.4 55.6c3.3 0 6 2.7 6 6.1v44.8h-18.4v-44.8c0-3.3 2.7-6.1 6-6.1h6.4m-25.5 19.4c3.3 0 6 2.7 6 6.1v25.4h-18.4v-25.5c0-3.3 2.7-6.1 6-6.1h6.4m-25.6 19.4c3.3 0 6 2.7 6 6.1v6.1h-18.4v-6.1c0-3.3 2.7-6.1 6-6.1h6.4m73.5-107.8-6.4 8.7-18.4 25.2-9.4 12.8h17.1v15.4c-1.6-0.7-3.4-1-5.2-1h-6.5c-7.7 0-13.9 6.3-13.9 14.1v6.3c-1.6-0.7-3.4-1-5.2-1h-6.4c-7.7 0-13.9 6.3-13.9 14.1v6.3c-1.6-0.7-3.4-1-5.2-1h-6.4c-7.7-0.1-14 6.2-14 14v14.1h110.9v-81.3h17.1l-9.4-12.8-18.4-25.2-6.4-8.7z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="u-body u-xl-mode" style={{ fontSize: "16px" }}>
      {/* Hero Section */}
      <section 
        className="u-clearfix u-container-align-center u-grey-5 u-valign-top-lg u-valign-top-sm u-valign-top-xs u-section-1 relative min-h-[963px] md:min-h-[933px] lg:min-h-[811px] sm:min-h-[764px] xs:min-h-[636px] bg-gray-100"
        id="sec-6c33"
      >
        <div className="u-expanded-width u-shape u-shape-rectangle u-white u-shape-1 absolute h-[385px] md:h-[305px] sm:h-[188px] w-full"></div>
        <img 
          className="custom-expanded u-image u-image-default u-image-1 absolute h-[550px] md:h-[520px] lg:h-[398px] sm:h-[299px] xs:h-[188px] w-[995px] md:w-[940px] lg:w-[720px] sm:w-[540px] xs:w-[340px] mx-auto mt-[-294px] md:mt-[-214px] sm:mt-[-216px] xs:mt-[-119px] left-0 right-0"
          src="images/5c1fd13e8edc53cfe0e11f2ceaf7dd496bd027961725dcce5519b70363f2577fe69fbb40d09bae65522e949a4fd34fb5b8b0b4c6606586649964ac_1280.jpg"
          alt="Privacy rights"
        />
        <div className="u-align-center u-container-align-center u-container-style u-group u-shape-rectangle u-group-1 w-[966px] md:w-[940px] lg:w-[720px] sm:w-[540px] xs:w-[340px] min-h-[249px] mx-auto mt-[37px] sm:mt-[39px] xs:mt-[30px] mb-[36px] sm:mb-[38px] xs:mb-[49px] relative bg-white rounded-lg shadow-lg">
          <div className="u-container-layout u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-container-layout-1 p-6">
            <h2 className="u-align-center u-text u-text-default u-text-1 text-4xl lg:text-3xl sm:text-2xl xs:text-xl font-bold text-center mt-6 sm:mt-5 xs:mt-1 mx-auto">
              User Privacy Rights Information
            </h2>
            <p className="u-align-center u-text u-text-2 text-xl sm:text-base text-center mt-10 sm:mt-6 mx-auto">
              Our Private Policy ensures your data remains secure and confidential. We prioritize protecting your personal information and adhere to strict privacy guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Cards Section */}
      <section className="u-align-center u-clearfix u-grey-15 u-section-2 py-[60px]" id="sec-4b8f">
        <div className="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-sheet-1 min-h-[790px]">
          <h2 className="u-align-center u-text u-text-default u-text-1 text-3xl font-bold text-center mt-[60px] mx-auto">
            Policy Overview
          </h2>
          <p className="u-align-center u-text u-text-default u-text-2 text-lg text-center mt-5 mx-auto">
            Your information is securely stored and only accessed by authorized personnel for specified purposes.
          </p>
          
          <div className="u-expanded-width u-list u-list-1 mt-[47px] mb-[57px]">
            <div className="u-repeater u-repeater-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[524px] md:min-h-[312px]">
              {policyCards.map((card, index) => (
                <div 
                  key={index} 
                  className="u-align-center u-container-style u-list-item u-repeater-item u-video-cover u-white u-list-item-1 bg-white rounded-lg shadow-md p-[30px] sm:p-[15px]"
                >
                  <div className="u-container-layout u-similar-container u-container-layout-1 flex flex-col items-center">
                    <span className="u-align-center u-icon u-icon-1 flex items-center justify-center bg-blue-200 text-white rounded-full h-16 w-16 mb-7">
                      {card.icon}
                    </span>
                    <h4 className="u-align-center u-text u-text-3 text-xl font-semibold text-center mt-7 mb-0">
                      {card.title}
                    </h4>
                    <p className="u-align-center u-text u-text-4 text-base text-center mt-7 mb-0">
                      {card.description}
                    </p>
                    <a 
                      href="#" 
                      className="u-align-center u-btn u-button-style u-hover-palette-1-dark-1 u-palette-2-base u-btn-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded mt-10 mb-0 uppercase text-sm tracking-wider"
                    >
                      learn more
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="u-align-left u-clearfix u-container-align-left u-grey-5 u-section-3 py-[60px]" id="sec-b895">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 min-h-[492px]">
          <h2 className="u-custom-font u-font-montserrat u-text u-text-default u-text-1 text-3xl sm:text-2xl font-bold mb-0">
            Related Questions
          </h2>
          <p className="u-text u-text-2 text-lg mt-5 mb-0">
            Our privacy policy outlines how we collect, use, and protect your personal information.
          </p>
          
          <div className="u-accordion u-expanded-width u-faq u-spacing-10 u-accordion-1 mt-8">
            {privacyItems.map((item) => (
              <div key={item.id} className="u-accordion-item mb-4">
                <button
                  className={`u-accordion-link u-active-white u-button-style u-custom-font u-font-montserrat u-text-active-palette-2-base u-text-grey-50 u-text-hover-black u-accordion-link-1 flex justify-between items-center w-full p-6 text-left bg-gray-100 hover:bg-gray-200 ${activeAccordion === item.id ? 'active bg-blue-500 text-white' : ''}`}
                  onClick={() => toggleAccordion(item.id)}
                >
                  <span className="u-accordion-link-text font-bold">{item.question}</span>
                  <span className="u-accordion-link-icon u-active-palette-2-base u-grey-25 u-hover-palette-2-base u-icon u-icon-circle u-text-white flex items-center justify-center bg-gray-300 hover:bg-blue-500 text-white rounded-full h-10 w-10">
                    <svg 
                      className="u-svg-content" 
                      viewBox="0 0 448 448" 
                      style={{ transform: activeAccordion === item.id ? 'rotate(45deg)' : 'none' }}
                    >
                      <path d="m272 184c-4.417969 0-8-3.582031-8-8v-176h-80v176c0 4.417969-3.582031 8-8 8h-176v80h176c4.417969 0 8 3.582031 8 8v176h80v-176c0-4.417969 3.582031-8 8-8h176v-80zm0 0"></path>
                    </svg>
                  </span>
                </button>
                <div 
                  className={`u-accordion-pane u-container-style u-shape-rectangle overflow-hidden transition-all duration-300 ${activeAccordion === item.id ? 'u-accordion-active max-h-[500px]' : 'max-h-0'}`}
                >
                  <div className="u-container-layout u-container-layout-1 p-6 bg-white">
                    <div className="u-clearfix u-rich-text u-text">
                      <p>{item.answer}</p>
                    </div>
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

export default PrivacyRightsPage;