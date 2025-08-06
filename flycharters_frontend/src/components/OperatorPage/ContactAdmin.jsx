import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const ContactUs = () => {
    return (
    <section className="contact-us" id="ContactUs">
        <div className="container">

            <div className="contactTitile">
                    <h1 style={{marginTop:"3rem"}}>Contact Admin</h1>
                    <p>
                        Please write in a proper format 
                    </p>
                </div>

            <div className="operatorChat">
                
                <form>
                    <div className="form-row">
                        <input type="text" placeholder="Subject" />
                    </div>
                    <textarea
                    placeholder="Write more about your Query"
                    rows="4"
                    ></textarea>
                    <button type="submit">SUBMIT</button>
                </form>

            </div>

            
        </div>
        </section>
    );
};

export default ContactUs;