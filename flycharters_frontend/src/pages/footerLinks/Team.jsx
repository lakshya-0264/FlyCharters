import React from 'react';


const TeamMembers = () => {
  const teamMembers = [
    {
      id: 'popup-e09e',
      name: 'Frank Kinney',
      image: 'images/d8e17dd9.jpeg'
    },
    {
      id: 'popup-6f45',
      name: 'Adrian Scold',
      image: 'images/e9ba5402.jpeg'
    },
    {
      id: 'popup-a05e',
      name: 'Mattie Ball',
      image: 'images/7ec7e3cb.jpeg'
    },
    {
      id: 'popup-dfe1',
      name: 'Betty Nilson',
      image: 'images/57faf1e6.jpeg'
    },
    {
      id: 'popup-4f31',
      name: 'Nat Reynolds',
      image: 'images/e610d339.jpeg'
    },
    {
      id: 'popup-4a78',
      name: 'Samuel Schick',
      image: 'images/d2fed6d9.jpeg'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="u-align-left u-clearfix u-image u-section-1" id="sec-c033">
        <div className="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-xs u-sheet-1">
          <h2 className="u-align-center u-text u-text-white u-text-1">OUR TEAM​...</h2>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="u-clearfix u-grey-5 u-section-2" id="sec-a382">
        <div className="u-clearfix u-sheet u-valign-middle-lg u-valign-middle-md u-valign-middle-sm u-valign-middle-xs u-sheet-1">
          <div className="u-expanded-width u-list u-list-1">
            <div className="u-repeater u-repeater-1">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="u-align-center u-container-align-center u-dialog-link u-list-item u-repeater-item u-white"
                  data-href={`#${member.id}`}
                >
                  <div className="u-container-layout u-similar-container">
                    <img 
                      alt={member.name} 
                      className="u-dialog-link u-expanded-width u-image u-image-default" 
                      src={member.image}
                      data-href={`#${member.id}`}
                    />
                    <h5 className="u-align-center u-text">{member.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="u-clearfix u-section-3" id="sec-ade7">
        <div className="u-clearfix u-sheet u-valign-middle u-sheet-1">
          <div className="data-layout-selected u-clearfix u-layout-wrap u-layout-wrap-1">
            <div className="u-layout">
              <div className="u-layout-row">
                <div className="u-align-center u-container-align-center u-container-style u-layout-cell u-left-cell u-size-9 u-layout-cell-1">
                  <div className="u-container-layout u-valign-top u-container-layout-1">
                    <span className="u-icon u-icon-circle u-text-grey-30 u-icon-1">
                      <svg className="u-svg-content" viewBox="0 0 508.044 508.044">
                        <g>
                          <path d="M0.108,352.536c0,66.794,54.144,120.938,120.937,120.938c66.794,0,120.938-54.144,120.938-120.938s-54.144-120.937-120.938-120.937c-13.727,0-26.867,2.393-39.168,6.61C109.093,82.118,230.814-18.543,117.979,64.303C-7.138,156.17-0.026,348.84,0.114,352.371C0.114,352.426,0.108,352.475,0.108,352.536z"></path>
                          <path d="M266.169,352.536c0,66.794,54.144,120.938,120.938,120.938s120.938-54.144,120.938-120.938S453.9,231.599,387.106,231.599c-13.728,0-26.867,2.393-39.168,6.61C375.154,82.118,496.875-18.543,384.04,64.303C258.923,156.17,266.034,348.84,266.175,352.371C266.175,352.426,266.169,352.475,266.169,352.536z"></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="u-container-style u-layout-cell u-right-cell u-size-51 u-layout-cell-2">
                  <div className="u-container-layout u-valign-top-lg u-valign-top-md u-valign-top-sm u-valign-top-xs">
                    <p className="u-text">
                      The team is exceptional in their dedication and expertise. Each member brings a unique skill set that truly complements one another, ensuring top-notch results every time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button 
        className="u-back-to-top u-icon u-icon-circle u-opacity u-opacity-85 u-palette-1-base" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          height: '64px',
          width: '64px',
          marginLeft: '0px',
          marginRight: 'auto',
          marginTop: '0px',
          backgroundImage: 'none',
          right: '20px',
          bottom: '20px',
          padding: '15px',
          position: 'fixed',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <svg 
          className="u-svg-content" 
          enableBackground="new 0 0 551.13 551.13" 
          viewBox="0 0 551.13 551.13"
        >
          <path d="m275.565 189.451 223.897 223.897h51.668l-275.565-275.565-275.565 275.565h51.668z"></path>
        </svg>
      </button>
    </div>
  );
};

export default TeamMembers;