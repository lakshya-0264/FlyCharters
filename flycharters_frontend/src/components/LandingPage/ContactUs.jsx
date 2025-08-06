import { useEffect, useRef } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const ContactUs = () => {
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When entering viewport
            formRef.current?.classList.add('active');
            infoRef.current?.classList.add('active');
            formRef.current?.classList.remove('inactive');
            infoRef.current?.classList.remove('inactive');
          } else {
            // When exiting viewport
            formRef.current?.classList.add('inactive');
            infoRef.current?.classList.add('inactive');
            formRef.current?.classList.remove('active');
            infoRef.current?.classList.remove('active');
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="contact-us" id="ContactUs" ref={sectionRef}>
      <div className="container">
        <div className="contactTitile">
          <h1 style={{position:'relative'}}>Contact us</h1>
          <p>
            Cursus eget nunc scelerisque viverra mauris in aliquam sem. Tempor
            nec feugiat nisl pretium fusce id velit.
          </p>
        </div>

        <div className="form-section" ref={formRef}>
          <form>
            <div className="form-row">
              <input type="text" placeholder="Full name" />
              <input type="email" placeholder="Email ID" />
            </div>
            <textarea placeholder="Write more about your project" rows="4"></textarea>
            <button type="submit">SUBMIT</button>
          </form>
        </div>

        <div className="info-section" ref={infoRef}>
          <div className="info-box">
            <h3>Address</h3>
            <p>
              Cursus eget nunc, consiegn blake scelerisque, viverra metusolo,
              Marcus 345654
            </p>
          </div>
          <div className="info-box">
            <h3>Support</h3>
            <p>Ph: +98 987654321</p>
            <p>Email: hello@xyz.in</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;