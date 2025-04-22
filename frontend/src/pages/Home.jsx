import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
import Footer from '../components/Footer';

const Home = () => {
  const policyRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#our-policy') {
      // Scroll after the component is fully rendered
      setTimeout(() => {
        policyRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000); // Small delay to ensure DOM is ready
    }
  }, [location]);

  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <div id="our-policy" ref={policyRef}>
        <OurPolicy />
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default Home;
