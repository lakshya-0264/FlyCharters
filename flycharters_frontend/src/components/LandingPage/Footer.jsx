 // Optional for styling
import { Link, NavLink } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                
                <div className='Three-FooterBox'>
                    <div className='footer-bottom'>
                        <a href="#contact" className="">Contact us</a>
                        <Link to="/faq">faq's</Link>
                        <Link to="/team">meet the team</Link>
                        <Link to="/terms">Terms & Conditions</Link>
                        <Link to="/privacy">Privacy Policy</Link>
                        
                    </div>
                    <div className="footer-social">
                        <h3>Fly Charters</h3>
                        <div><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a></div>
                        <div className='vertical-line'></div>
                    </div>
                    <div className='footer-bottom'>
                        <Link to="/blog">our blogs</Link>
                        <Link to="/membership">membership</Link>
                        <Link to="/newsletter">newsletter</Link>
                        <Link to="/referFriend">refer a friend</Link>
                        <Link to="/career">careers</Link>
                    </div>
                </div>
            </div>
        <p>© {new Date().getFullYear()} Fly charters. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
