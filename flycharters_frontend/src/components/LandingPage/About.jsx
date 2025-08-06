import React, { useEffect, useRef } from "react";

const About = () => {
    const boxesRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
            });
        },
        { threshold: 0.2 }
        );

        boxesRef.current.forEach(box => {
        if (box) observer.observe(box);
        });

        // Cleanup
        return () => {
        boxesRef.current.forEach(box => {
            if (box) observer.unobserve(box);
        });
        };
    }, []);

    return (
        <section className="about" id="about">
        <h1 style={{position:'relative'}}>About us</h1>
        <div className="aboutBox" ref={el => (boxesRef.current[0] = el)}>
            <img src="/services2.webp"></img>
            
            <div className="vertical-line"></div>
            <div className="about-info"><h2>Who We Are?</h2>
            <p>
           At Fly Charters, we are a passionate team of aviation and technology professionals united by one mission: to revolutionize the private air charter experience. With deep roots in both aerospace and digital platforms, we simplify the process of booking, managing, and flying private jets.
We bridge the gap between flyers, operators, and brokers by offering a transparent, efficient, and secure platform — whether you're flying for business, leisure, or an emergency.

            </p></div>
            
        </div>
        <div className="aboutBox" ref={el => (boxesRef.current[1] = el)}>
            <div className="about-info"><h2>What We Do?</h2>
            <p>
            We empower users to search, request, and book flights directly from trusted operators — no hidden fees, no uncertainty. Operators can showcase their fleets, manage schedules, and receive direct bookings. And brokers can streamline their operations through our modern tools and dashboards.
Whether you're a traveler seeking convenience or an operator scaling your reach, Fly Charters is your co-pilot.
            </p>
            </div>
            
            <div className="vertical-line"></div>
            
            <img src="/services2.webp"></img>
        </div>
        <div className="aboutBox" ref={el => (boxesRef.current[2] = el)}>
            <img src="/services2.webp"></img>
            <div className="vertical-line"></div>
            <div className="about-info">
            <h2>Our Vision & Mission</h2>
            <p>
            Our mission: To make private air travel accessible, reliable, and streamlined by connecting flyers, operators, and brokers on one intelligent platform.
            vision: To become India’s most trusted private air charter aggregator, setting new benchmarks for efficiency, safety, and customer experience — while expanding globally with integrity and innovation.
            </p>
            </div>
        </div>
        </section>
    );
};

export default About;
