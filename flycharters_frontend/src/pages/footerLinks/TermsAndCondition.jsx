import React from 'react';

const TermsAndConditions = () => {
  const keyPoints = [
    {
      title: "User Rights",
      description: "We reserve the right to update and modify the Terms and Conditions as needed.",
      icon: (
        <svg viewBox="0 0 16 16" className="h-full w-full">
          <path d="M14.5,2.5c-0.2-0.2-0.6-0.2-0.9,0L6.2,9.6L2.4,6C2.2,5.7,1.8,5.7,1.5,6L0.2,7.2c-0.2,0.2-0.2,0.6,0,0.9l5.6,5.4c0.2,0.2,0.6,0.2,0.9,0l9.2-8.8c0.2-0.2,0.2-0.6,0-0.9L14.5,2.5z"></path>
        </svg>
      )
    },
    {
      title: "Policy Guidelines",
      description: "Any violation of the Terms and Conditions may result in termination of service.",
      icon: (
        <svg viewBox="0 0 16 16" className="h-full w-full">
          <path d="M14.5,2.5c-0.2-0.2-0.6-0.2-0.9,0L6.2,9.6L2.4,6C2.2,5.7,1.8,5.7,1.5,6L0.2,7.2c-0.2,0.2-0.2,0.6,0,0.9l5.6,5.4c0.2,0.2,0.6,0.2,0.9,0l9.2-8.8c0.2-0.2,0.2-0.6,0-0.9L14.5,2.5z"></path>
        </svg>
      )
    },
    {
      title: "Usage Terms",
      description: "If you have any questions about the Terms and Conditions, please contact us.",
      icon: (
        <svg viewBox="0 0 16 16" className="h-full w-full">
          <path d="M14.5,2.5c-0.2-0.2-0.6-0.2-0.9,0L6.2,9.6L2.4,6C2.2,5.7,1.8,5.7,1.5,6L0.2,7.2c-0.2,0.2-0.2,0.6,0,0.9l5.6,5.4c0.2,0.2,0.6,0.2,0.9,0l9.2-8.8c0.2-0.2,0.2-0.6,0-0.9L14.5,2.5z"></path>
        </svg>
      )
    },
    {
      title: "Service Rules",
      description: "By using our services, you agree to the Terms and Conditions outlined herein.",
      icon: (
        <svg viewBox="0 0 16 16" className="h-full w-full">
          <path d="M14.5,2.5c-0.2-0.2-0.6-0.2-0.9,0L6.2,9.6L2.4,6C2.2,5.7,1.8,5.7,1.5,6L0.2,7.2c-0.2,0.2-0.2,0.6,0,0.9l5.6,5.4c0.2,0.2,0.6,0.2,0.9,0l9.2-8.8c0.2-0.2,0.2-0.6,0-0.9L14.5,2.5z"></path>
        </svg>
      )
    }
  ];

  const termsSections = [
    {
      title: "Legal Agreement",
      description: "By using our services, you agree to the Terms and Conditions outlined herein.",
      image: "images/1a3e614e2a4619f082e71ba5abf67a4c68835a42a403f5ab55428318d4736dbd4ab6914b9b00180b60fcf670a6d7d407d4ad6123b52ad5b5a93d2b_1280.jpg"
    },
    {
      title: "User Rights",
      description: "Please carefully read and understand the Terms and Conditions before using our services.",
      image: "images/68651aad801885f9680026b39a816d65afc50169a1f4355e1706dafc2352968fcd3a417f5a430acba002d1d53aaf0801b6f9fa4dc44d5e81a0b66c_1280.jpg"
    },
    {
      title: "Policy Guidelines",
      description: "Your access to and use of our services is subject to the Terms and Conditions.",
      image: "images/photo-1650601624491-effe3c99dd4e.jpeg"
    },
    {
      title: "Usage Terms",
      description: "We reserve the right to update and modify the Terms and Conditions as needed.",
      image: "images/a3892122253a1773480e11900b91c23026d3d9927e9b9252c051de5b9abf639791419f7375b19e7a67f56ece68e091907690bd4958e68c88840f46_1280.jpg"
    }
  ];

  return (
    <div className="u-body u-xl-mode" style={{ fontSize: "16px" }}>
      {/* Hero Section */}
      <section 
        className="u-clearfix u-image u-shading u-section-1 relative" 
        id="sec-470d"
        style={{
          backgroundImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('images/0063a120a63882073f136c32dee779aba1b65e5437433b70e8e99698a7688a3c16813b48df161859515ab47e614a41285a3b41c5721f711ea534a7_1280.jpg')",
          backgroundPosition: "50% 50%",
          backgroundSize: "cover"
        }}
      >
        <div className="u-clearfix u-sheet u-valign-top-lg u-valign-top-md u-valign-top-sm u-valign-top-xs u-sheet-1 min-h-[507px] md:min-h-[418px] sm:min-h-[320px] xs:min-h-[240px]">
          <h1 className="u-align-center u-heading-font u-text u-title u-text-1 text-white text-center mt-[199px] md:mt-[60px] mb-[60px] mx-[173px] md:mx-[73px] lg:mx-[208px] md:mr-[108px] sm:mx-0">
            Terms & Conditions
          </h1>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="u-clearfix u-container-align-center u-section-2 py-[60px]" id="sec-3ecb">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 min-h-[873px] md:min-h-[750px] lg:min-h-[1556px] sm:min-h-[3141px] xs:min-h-[2151px]">
          <div className="data-layout-selected u-clearfix u-expanded-width u-gutter-10 u-layout-wrap u-layout-wrap-1 my-[60px] mx-0 sm:mx-0">
            <div className="u-layout w-full">
              <div className="u-layout-row flex flex-wrap w-full">
                {termsSections.map((section, index) => (
                  <div key={index} className="u-size-15 u-size-30-md w-full sm:w-1/2 md:w-1/4">
                    <div className="u-layout-col h-full">
                      {/* Text Content */}
                      <div 
                        className={`u-align-left u-container-align-left u-container-style u-grey-5 u-layout-cell u-size-20 u-layout-cell-${index*2+1} p-[20px] md:p-[30px] sm:p-[10px] xs:p-[20px] bg-gray-100`}
                      >
                        <div className="u-container-layout u-valign-middle u-container-layout-1">
                          <h4 className="u-align-left u-text u-text-1 text-left m-0">
                            {section.title}
                          </h4>
                          <p className="u-align-left u-text u-text-2 text-left mt-[20px] mb-0">
                            {section.description}
                          </p>
                          <a 
                            href="#" 
                            className="u-active-none u-align-left u-border-2 u-border-hover-palette-1-base u-border-no-left u-border-no-right u-border-no-top u-border-palette-1-light-1 u-btn u-button-style u-hover-none u-none u-text-body-color u-btn-1 text-left mt-[30px] mb-0 mx-auto ml-0 text-sm uppercase tracking-wider border-solid border-t-0 border-r-0 border-l-0 border-b-2 border-blue-200 hover:border-blue-500 py-[2px] px-0"
                          >
                            learn more
                          </a>
                        </div>
                      </div>
                      
                      {/* Image Content */}
                      <div 
                        className={`u-align-left u-container-align-left u-container-style u-image u-layout-cell u-size-40 u-image-${index+1} h-[470px] md:h-[388px] lg:h-[594px] sm:h-[891px] xs:h-[561px]`}
                        style={{
                          backgroundImage: `url('${section.image}')`,
                          backgroundPosition: "50% 50%",
                          backgroundSize: "cover"
                        }}
                      >
                        <div className="u-container-layout p-[20px] sm:p-[10px]"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="u-align-left u-clearfix u-container-align-center u-container-align-left u-grey-5 u-section-3 py-[60px]" id="sec-2a6a">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1 min-h-[642px]">
          <h2 className="u-align-center u-text u-text-default u-text-1 text-center mx-auto my-0">
            Key Points in Terms and Conditions
          </h2>
          <p className="u-align-center u-text u-text-2 text-center w-full max-w-[774px] mx-auto mt-[16px] mb-0 lg:w-[720px] sm:w-[540px] xs:w-[340px]">
            If you have any questions about the Terms and Conditions, please contact us.
          </p>
          
          <div className="u-expanded-width u-list u-list-1 my-[57px] mx-0">
            <div className="u-repeater u-repeater-1 grid grid-cols-1 md:grid-cols-2 gap-[10px] min-h-[347px] md:min-h-[286px]">
              {keyPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="u-align-left u-container-align-left u-container-style u-list-item u-repeater-item u-white u-list-item-1 bg-white p-[20px] md:p-[30px] sm:p-[20px]"
                >
                  <div className="u-container-layout u-similar-container u-valign-top-xl u-container-layout-1 flex items-start">
                    <span 
                      className="u-icon u-icon-circle u-palette-2-light-2 u-text-white u-icon-1 flex items-center justify-center bg-blue-200 text-white rounded-full h-[76px] w-[76px] min-w-[76px] mr-[20px]"
                    >
                      {point.icon}
                    </span>
                    <div>
                      <h4 className="u-text u-text-3 m-0">
                        {point.title}
                      </h4>
                      <p className="u-text u-text-4 font-normal mt-[22px] mb-0 md:mt-[25px]">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;