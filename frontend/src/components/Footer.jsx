import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="Parvaz Logo" />
          <p className='w-full md:w-2/3 text-gray-600'>
            <b>Parvaz</b> is a bold, future-forward fashion brand that blends elegance with edge. We craft unique, trendsetting styles for those who dare to rise above ordinary. From timeless classics to avant-garde drops, Parvaz empowers confidence, creativity, and individuality—one outfit at a time. Your wings to fashion freedom start here.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li><a href="/" className="hover:underline">HOME</a></li>
            <li><a href="/about" className="hover:underline">ABOUT US</a></li>
            <li><a href="#" className="hover:underline">DELIVERY</a></li>
            <li>
                <a href="/#our-policy" className="hover:underline">
                PRIVACY POLICY
                </a>
            </li>

          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>
              <a href="tel:+919510882766" className="hover:underline">+91 9510882766</a>
            </li>
            <li>
              <a href="mailto:samyakgandhiasia@gmail.com" className="hover:underline">
                samyakgandhiasia@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright 2025@parvaz.vercel.app - ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
};

export default Footer;
