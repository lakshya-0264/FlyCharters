import services1 from '../../assets/services1.png';
import services2 from '../../assets/services2.jpg';
import services3 from '../../assets/services3.png';

const Services = () => {
    return (
        <section className="services" id="services">
            <h1 style={{position:'relative'}}>OUR SERVICES</h1> 
            <div className="serviceContainer">
                <div className='serviceBox'>
                    <img src={services1} alt="Book a Charter" />
                    <h3>Book a Charter</h3>
                    <p>Browse, compare, and instantly book private jets with real-time availability across India and beyond — no middlemen, no delays.</p>
                    <button>LEARN MORE</button>
                </div>
                <div className='serviceBox'>
                    <img src={services2} alt="Book empty legs" />
                    <h3>Book empty legs</h3>
                    <p>Have a unique route or timing in mind? Submit your custom itinerary, and receive quotes from verified operators within minutes.</p>
                    <button>LEARN MORE</button>
                </div>
                <div className='serviceBox'>
                    <img src={services3} alt="Add Your charter" />
                    <h3>Add Your charter</h3>
                    <p>Track bookings, request invoices, manage loyalty points, and receive instant notifications — all from one sleek, powerful dashboard.</p>
                    <button>LEARN MORE</button>
                </div>
            </div>
        </section>
    );
};

export default Services;